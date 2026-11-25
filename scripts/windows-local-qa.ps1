[CmdletBinding()]
param(
    [string]$ProjectRoot,
    [switch]$DiagnosticsOnly,
    [switch]$InstallDependencies,
    [switch]$SkipRegistryProbe,
    [switch]$StartDevServer,
    [int]$StartupTimeoutSeconds = 30,
    [string]$LogRoot
)

$ErrorActionPreference = 'Stop'
if ($DiagnosticsOnly -and ($InstallDependencies -or $StartDevServer)) { throw 'A -DiagnosticsOnly nem használható együtt a -InstallDependencies vagy -StartDevServer kapcsolóval.' }
$script:Results = New-Object System.Collections.Generic.List[object]
$script:LogFile = $null

function Write-QALog {
    param([Parameter(Mandatory = $true)][string]$Message)
    $line = '[{0}] {1}' -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Message
    Write-Host $line
    if ($script:LogFile) { Add-Content -LiteralPath $script:LogFile -Value $line -Encoding UTF8 }
}

function Add-QAResult {
    param(
        [Parameter(Mandatory = $true)][string]$Step,
        [Parameter(Mandatory = $true)][ValidateSet('PASS', 'FAIL', 'BLOCKED', 'NOT RUN')][string]$Status,
        [Parameter(Mandatory = $true)][string]$Detail,
        [Nullable[int]]$ExitCode = $null
    )
    $record = [pscustomobject]@{
        timestamp = (Get-Date).ToString('o')
        step = $Step
        status = $Status
        detail = $Detail
        exitCode = $ExitCode
    }
    $script:Results.Add($record)
    Write-QALog ('{0} — {1}: {2}' -f $Status, $Step, $Detail)
}

function Find-ProjectRoot {
    param([string]$RequestedRoot)
    if ($RequestedRoot) {
        if (-not (Test-Path -LiteralPath $RequestedRoot -PathType Container)) {
            throw "A megadott projektmappa nem található: $RequestedRoot"
        }
        $candidate = (Resolve-Path -LiteralPath $RequestedRoot).Path
        if (-not (Test-Path -LiteralPath (Join-Path $candidate 'package.json') -PathType Leaf)) {
            throw "A megadott mappában nincs package.json: $candidate"
        }
        return $candidate
    }

    $candidate = (Resolve-Path -LiteralPath (Join-Path $PSScriptRoot '..')).Path
    for ($i = 0; $i -lt 8; $i++) {
        $package = Join-Path $candidate 'package.json'
        $lock = Join-Path $candidate 'package-lock.json'
        $page = Join-Path $candidate 'src/app/page.tsx'
        if ((Test-Path -LiteralPath $package -PathType Leaf) -and
            (Test-Path -LiteralPath $lock -PathType Leaf) -and
            (Test-Path -LiteralPath $page -PathType Leaf)) {
            return $candidate
        }
        $parent = Split-Path -Parent $candidate
        if (-not $parent -or $parent -eq $candidate) { break }
        $candidate = $parent
    }
    throw 'Nem sikerült automatikusan megtalálni a Next.js projektgyökeret. Használd a -ProjectRoot paramétert.'
}

function Resolve-NpmCommand {
    $command = Get-Command 'npm.cmd' -ErrorAction SilentlyContinue
    if (-not $command) { $command = Get-Command 'npm' -ErrorAction SilentlyContinue }
    if (-not $command) { return $null }
    if ($command.Source) { return $command.Source }
    if ($command.Path) { return $command.Path }
    return $command.Name
}

function Invoke-LoggedCommand {
    param(
        [Parameter(Mandatory = $true)][string]$Step,
        [Parameter(Mandatory = $true)][string]$FilePath,
        [Parameter(Mandatory = $true)][string[]]$Arguments,
        [Parameter(Mandatory = $true)][string]$WorkingDirectory,
        [ValidateSet('FAIL', 'BLOCKED')][string]$NonZeroStatus = 'FAIL'
    )
    Write-QALog ('PARANCS: {0} {1}  |  KÖNYVTÁR: {2}' -f $FilePath, ($Arguments -join ' '), $WorkingDirectory)
    try {
        Push-Location -LiteralPath $WorkingDirectory
        $output = @(& $FilePath @Arguments 2>&1)
        $code = $LASTEXITCODE
        if ($null -eq $code) { $code = 0 }
        foreach ($line in $output) {
            $text = [string]$line
            Write-Host $text
            if ($script:LogFile) { Add-Content -LiteralPath $script:LogFile -Value $text -Encoding UTF8 }
        }
        if ($code -eq 0) {
            Add-QAResult -Step $Step -Status 'PASS' -Detail 'A parancs sikeres kilépési kóddal zárult.' -ExitCode $code
        } else {
            $combinedOutput = (($output | ForEach-Object { [string]$_ }) -join "`n")
            $effectiveStatus = $NonZeroStatus
            if ($combinedOutput -match '(?i)EAI_AGAIN|ENOTFOUND|ECONNRESET|ETIMEDOUT|next:\s*not found|Cannot find module.{0,24}(next|react)|Cannot find type definition file|TS2688|react/jsx-runtime') {
                $effectiveStatus = 'BLOCKED'
            }
            Add-QAResult -Step $Step -Status $effectiveStatus -Detail "A parancs hibakóddal zárult: $code. Részletek a naplóban." -ExitCode $code
        }
        return [int]$code
    } catch {
        Add-QAResult -Step $Step -Status 'FAIL' -Detail ("Parancsvégrehajtási hiba: " + $_.Exception.Message)
        return 1
    } finally {
        Pop-Location -ErrorAction SilentlyContinue
    }
}

function Test-TcpPort {
    param([string]$HostName, [int]$Port)
    $client = New-Object System.Net.Sockets.TcpClient
    try {
        $task = $client.ConnectAsync($HostName, $Port)
        if (-not $task.Wait(600)) { return $false }
        return $client.Connected
    } catch { return $false }
    finally { $client.Dispose() }
}

function Test-NextHttpEndpoint {
    param([Parameter(Mandatory = $true)][string]$Uri)
    try {
        # TCP alone can succeed when another application owns the configured port.
        # Require an actual successful HTTP response and recognizable Next.js evidence.
        $response = Invoke-WebRequest -Uri $Uri -UseBasicParsing -TimeoutSec 3 -ErrorAction Stop
        $statusCode = [int]$response.StatusCode
        $poweredBy = [string]$response.Headers['X-Powered-By']
        $body = [string]$response.Content
        $nextEvidence = ($poweredBy -match '(?i)Next\.js') -or ($body -match '(?i)__next_f|/_next/static/')
        if ($statusCode -ge 200 -and $statusCode -lt 400 -and $nextEvidence) {
            return [pscustomobject]@{ isNextApp = $true; statusCode = $statusCode; detail = "Next.js HTTP-válasz ($statusCode), az alkalmazásjelölő megtalálható." }
        }
        return [pscustomobject]@{ isNextApp = $false; statusCode = $statusCode; detail = "HTTP $statusCode válasz érkezett, de nem igazolható egyértelműen a Next.js alkalmazás." }
    } catch {
        $statusCode = $null
        try { if ($_.Exception.Response -and $_.Exception.Response.StatusCode) { $statusCode = [int]$_.Exception.Response.StatusCode } } catch { }
        $detail = $_.Exception.Message
        if ($statusCode) { $detail = "HTTP $statusCode — $detail" }
        return [pscustomobject]@{ isNextApp = $false; statusCode = $statusCode; detail = $detail }
    }
}

try {
    $root = Find-ProjectRoot -RequestedRoot $ProjectRoot
    if (-not (Test-Path -LiteralPath (Join-Path $root 'package-lock.json') -PathType Leaf)) {
        throw "A frontend package-lock.json nem található a projektgyökérben: $root"
    }

    if (-not $LogRoot) {
        $tempRoot = $env:TEMP
        if (-not $tempRoot) { $tempRoot = [System.IO.Path]::GetTempPath() }
        $LogRoot = Join-Path $tempRoot 'AIMORPG-local-qa'
    }
    if (-not (Test-Path -LiteralPath $LogRoot -PathType Container)) {
        New-Item -ItemType Directory -Path $LogRoot -Force | Out-Null
    }
    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'
    $runDirectory = Join-Path $LogRoot $stamp
    New-Item -ItemType Directory -Path $runDirectory -Force | Out-Null
    $script:LogFile = Join-Path $runDirectory 'qa-run.log'
    Write-QALog 'AIMORPG helyi QA — biztonságos, nem destruktív futás.'
    Write-QALog ("Projektgyökér: " + $root)
    Write-QALog ("Naplókönyvtár: " + $runDirectory)
    Write-QALog ('Mód: ' + $(if ($DiagnosticsOnly) { 'csak diagnosztika' } else { 'diagnosztika és elérhető ellenőrzések' }))

    $packagePath = Join-Path $root 'package.json'
    $lockPath = Join-Path $root 'package-lock.json'
    $package = Get-Content -LiteralPath $packagePath -Raw -Encoding UTF8 | ConvertFrom-Json
    if (Test-Path -LiteralPath $packagePath -PathType Leaf) {
        Add-QAResult -Step 'package.json' -Status 'PASS' -Detail ("Megtalálva: " + $package.name + ' v' + $package.version)
    } else {
        Add-QAResult -Step 'package.json' -Status 'FAIL' -Detail 'A frontend package.json nem található.'
    }
    if (Test-Path -LiteralPath $lockPath -PathType Leaf) {
        Add-QAResult -Step 'package-lock.json' -Status 'PASS' -Detail 'A lockfile megvan; a script nem módosítja automatikusan.'
    } else {
        Add-QAResult -Step 'package-lock.json' -Status 'FAIL' -Detail 'A reproducibilis telepítéshez szükséges lockfile hiányzik.'
    }

    $nodeCommand = Get-Command 'node' -ErrorAction SilentlyContinue
    if ($nodeCommand) {
        $nodeVersionOutput = @(& $nodeCommand.Source --version 2>&1)
        $nodeVersionCode = $LASTEXITCODE
        $nodeVersion = (($nodeVersionOutput | ForEach-Object { [string]$_ }) -join ' ').Trim()
        if ($nodeVersionCode -eq 0 -and $nodeVersion -match '^v?(\d+)') {
            $major = [int]$Matches[1]
            if ($major -ge 22) { Add-QAResult -Step 'Node.js-verzió' -Status 'PASS' -Detail $nodeVersion -ExitCode 0 }
            else { Add-QAResult -Step 'Node.js-verzió' -Status 'BLOCKED' -Detail "$nodeVersion — a csomag Node.js 22 vagy újabb verziót deklarál." }
        } else {
            Add-QAResult -Step 'Node.js-verzió' -Status 'FAIL' -Detail ("Nem sikerült a verzió lekérdezése: " + $nodeVersion)
        }
    } else {
        Add-QAResult -Step 'Node.js-verzió' -Status 'BLOCKED' -Detail 'A node parancs nem található a PATH környezetben.'
    }

    $npmExecutable = Resolve-NpmCommand
    if ($npmExecutable) {
        $npmOutput = @(& $npmExecutable --version 2>&1)
        $npmCode = $LASTEXITCODE
        $npmVersion = (($npmOutput | ForEach-Object { [string]$_ }) -join ' ').Trim()
        if ($npmCode -eq 0) { Add-QAResult -Step 'npm-verzió' -Status 'PASS' -Detail $npmVersion -ExitCode 0 }
        else { Add-QAResult -Step 'npm-verzió' -Status 'FAIL' -Detail $npmVersion -ExitCode $npmCode }
    } else {
        Add-QAResult -Step 'npm-verzió' -Status 'BLOCKED' -Detail 'Az npm/npm.cmd parancs nem található a PATH környezetben.'
    }

    $lockJson = $null
    try { $lockJson = Get-Content -LiteralPath $lockPath -Raw -Encoding UTF8 | ConvertFrom-Json } catch { }
    if ($lockJson -and $package.version -eq $lockJson.version) {
        Add-QAResult -Step 'Lockfile-verzióegyezés' -Status 'PASS' -Detail ("package.json és package-lock.json: " + $package.version)
    } elseif ($lockJson) {
        Add-QAResult -Step 'Lockfile-verzióegyezés' -Status 'FAIL' -Detail ("Eltérő verziók: package.json=" + $package.version + '; lockfile=' + $lockJson.version)
    } else {
        Add-QAResult -Step 'Lockfile olvashatósága' -Status 'FAIL' -Detail 'A package-lock.json nem olvasható érvényes JSON-ként.'
    }

    $nextPackage = Join-Path $root 'node_modules/next/package.json'
    $reactPackage = Join-Path $root 'node_modules/react/package.json'
    $tsPackage = Join-Path $root 'node_modules/typescript/package.json'
    foreach ($dependency in @(
        @{ Name = 'Next.js'; Path = $nextPackage },
        @{ Name = 'React'; Path = $reactPackage },
        @{ Name = 'TypeScript'; Path = $tsPackage }
    )) {
        if (Test-Path -LiteralPath $dependency.Path -PathType Leaf) {
            Add-QAResult -Step ("Függőség: " + $dependency.Name) -Status 'PASS' -Detail 'A csomag package.json fájlja megtalálható.'
        } else {
            Add-QAResult -Step ("Függőség: " + $dependency.Name) -Status 'BLOCKED' -Detail 'A csomag nem található a projekt node_modules könyvtárában.'
        }
    }

    if (-not $SkipRegistryProbe -and $npmExecutable) {
        $registryCode = Invoke-LoggedCommand -Step 'npm-regiszter elérhetősége' -FilePath $npmExecutable -Arguments @('ping', '--fetch-retries=0', '--fetch-timeout=8000') -WorkingDirectory $root -NonZeroStatus 'BLOCKED'
        $registryAvailable = ($registryCode -eq 0)
    } else {
        $registryAvailable = $false
        if ($SkipRegistryProbe) {
            Add-QAResult -Step 'npm-regiszter elérhetősége' -Status 'NOT RUN' -Detail 'A -SkipRegistryProbe kapcsoló miatt nem történt hálózati próba.'
        } else {
            Add-QAResult -Step 'npm-regiszter elérhetősége' -Status 'BLOCKED' -Detail 'Az npm nem érhető el, ezért a regiszter nem vizsgálható.'
        }
    }

    if ($InstallDependencies) {
        if (-not $npmExecutable) {
            Add-QAResult -Step 'Függőségek telepítése (npm ci)' -Status 'BLOCKED' -Detail 'Az npm parancs nem érhető el.'
        } elseif (-not $registryAvailable) {
            Add-QAResult -Step 'Függőségek telepítése (npm ci)' -Status 'BLOCKED' -Detail 'A regiszterteszt nem sikerült; ugyanazon hibás hálózaton nem indul újabb telepítési próbálkozás.'
        } else {
            [void](Invoke-LoggedCommand -Step 'Függőségek telepítése (npm ci)' -FilePath $npmExecutable -Arguments @('ci', '--no-audit', '--no-fund') -WorkingDirectory $root)
        }
    } else {
        Add-QAResult -Step 'Függőségek telepítése (npm ci)' -Status 'NOT RUN' -Detail 'Nem kértél telepítést; a script alapértelmezés szerint nem telepít és nem töröl függőségeket.'
    }

    if (-not $DiagnosticsOnly -and $npmExecutable) {
        foreach ($name in @('test', 'lint', 'build')) {
            $hasScript = $false
            if ($package.scripts) {
                $scriptProperty = $package.scripts.PSObject.Properties[$name]
                $hasScript = ($null -ne $scriptProperty -and -not [string]::IsNullOrWhiteSpace([string]$scriptProperty.Value))
            }
            if ($hasScript) {
                if ($name -eq 'test') {
                    [void](Invoke-LoggedCommand -Step 'npm test' -FilePath $npmExecutable -Arguments @('test') -WorkingDirectory $root)
                } else {
                    [void](Invoke-LoggedCommand -Step ("npm run " + $name) -FilePath $npmExecutable -Arguments @('run', $name) -WorkingDirectory $root)
                }
            } else {
                Add-QAResult -Step ("npm " + $name) -Status 'NOT RUN' -Detail ('A package.json nem deklarál ilyen scriptet: ' + $name)
            }
        }
    } elseif (-not $DiagnosticsOnly) {
        Add-QAResult -Step 'Teszt/lint/build' -Status 'BLOCKED' -Detail 'Az npm nem található; a projekt ellenőrző parancsai nem futtathatók.'
    } else {
        Add-QAResult -Step 'Automatizált tesztek, lint és build' -Status 'NOT RUN' -Detail 'A -DiagnosticsOnly kapcsoló miatt a projektparancsok nem indultak el.'
    }

    if ($StartDevServer) {
        $devScript = $null
        if ($package.scripts) { $devScript = $package.scripts.PSObject.Properties['dev'] }
        $npmCmd = Get-Command 'npm.cmd' -ErrorAction SilentlyContinue
        if (-not $devScript -or -not $npmCmd) {
            Add-QAResult -Step 'Next.js fejlesztői szerver' -Status 'BLOCKED' -Detail 'A dev script vagy az önállóan indítható npm.cmd nem található. Használd a PowerShell-útmutatóban szereplő `npm run dev` parancsot interaktívan.'
        } elseif (-not (Test-Path -LiteralPath (Join-Path $root 'node_modules/next/package.json') -PathType Leaf)) {
            Add-QAResult -Step 'Next.js fejlesztői szerver' -Status 'BLOCKED' -Detail 'A Next.js csomag nem települt; a szerver nem indítható.'
        } else {
            $port = 3000
            if ($env:PORT -match '^\d{1,5}$') { $port = [int]$env:PORT }
            $devText = [string]$devScript.Value
            if ($devText -match '(?:-p|--port)(?:\s+|=)(\d{1,5})') { $port = [int]$Matches[1] }
            # Never assume port 3000 is free. Avoid colliding with an unrelated local process.
            $configuredPort = $port
            $portProbeCount = 0
            while ((Test-TcpPort -HostName '127.0.0.1' -Port $port) -and $portProbeCount -lt 50) {
                $port++
                $portProbeCount++
            }
            if ($portProbeCount -ge 50 -or $port -gt 65535) {
                Add-QAResult -Step 'Next.js fejlesztői szerver' -Status 'BLOCKED' -Detail 'Nem található szabad port a konfigurált port 50 portos tartományán belül.'
                $port = $null
            } elseif ($port -ne $configuredPort) {
                Write-QALog ("A(z) $configuredPort port foglalt; a QA a szabad $port portot választotta. A már futó folyamatot nem állítja le.")
            }
            if ($null -eq $port) { $StartDevServer = $false }
            if ($StartDevServer) {
              $stdout = Join-Path $runDirectory 'dev-server.stdout.log'
              $stderr = Join-Path $runDirectory 'dev-server.stderr.log'
              try {
                # Next.js accepts a CLI port override; it keeps the package script unchanged.
                $process = Start-Process -FilePath $npmCmd.Source -ArgumentList @('run', 'dev', '--', '--port', [string]$port) -WorkingDirectory $root -RedirectStandardOutput $stdout -RedirectStandardError $stderr -PassThru -WindowStyle Hidden
                Write-QALog ("Fejlesztői szerverindítás elindult. PID: " + $process.Id + '; vizsgált port: ' + $port)
                $ready = $false
                $lastHttpProbe = 'A port még nem fogadott kapcsolatot.'
                $deadline = (Get-Date).AddSeconds([Math]::Max(5, $StartupTimeoutSeconds))
                while ((Get-Date) -lt $deadline) {
                    if (Test-TcpPort -HostName '127.0.0.1' -Port $port) {
                        $probe = Test-NextHttpEndpoint -Uri "http://localhost:$port/"
                        $lastHttpProbe = [string]$probe.detail
                        if ($probe.isNextApp) { $ready = $true; break }
                    }
                    Start-Sleep -Milliseconds 500
                    $process.Refresh()
                    if ($process.HasExited) { break }
                }
                if ($ready) {
                    Add-QAResult -Step 'Next.js fejlesztői szerver' -Status 'PASS' -Detail ("Az alkalmazás HTTP-n válaszol: http://localhost:$port/ ; PID: " + $process.Id)
                    Write-QALog ("Nyisd meg a böngészőben: http://localhost:$port/")
                    Write-QALog ("A folyamatfa leállításához PowerShellből: taskkill /PID " + $process.Id + ' /T /F')
                } else {
                    Add-QAResult -Step 'Next.js fejlesztői szerver' -Status 'BLOCKED' -Detail ("A tényleges Next.js HTTP-válasz nem igazolódott a megadott időn belül. Utolsó próba: $lastHttpProbe. Kimenet: $stdout ; hiba: $stderr")
                }
              } catch {
                Add-QAResult -Step 'Next.js fejlesztői szerver' -Status 'FAIL' -Detail ("Indítási hiba: " + $_.Exception.Message)
              }
            }
        }
    } else {
        Add-QAResult -Step 'Next.js fejlesztői szerver' -Status 'NOT RUN' -Detail 'Nem adtad meg a -StartDevServer kapcsolót; a script nem indít háttérfolyamatot.'
    }

    $summary = Join-Path $runDirectory 'qa-summary.json'
    $script:Results | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $summary -Encoding UTF8
    Write-QALog "Összefoglaló JSON: $summary"
    Write-QALog "Teljes futási napló: $script:LogFile"
    $failedCount = @($script:Results | Where-Object { $_.status -eq 'FAIL' }).Count
    $blockedCount = @($script:Results | Where-Object { $_.status -eq 'BLOCKED' }).Count
    Write-QALog ("ÖSSZEGZÉS: FAIL={0}; BLOCKED={1}; ÖSSZES LÉPÉS={2}" -f $failedCount, $blockedCount, $script:Results.Count)
    if ($failedCount -gt 0) { exit 1 }
    if ($blockedCount -gt 0) { exit 2 }
    exit 0
} catch {
    Write-Host ('FATAL: ' + $_.Exception.Message) -ForegroundColor Red
    if ($script:LogFile) { Add-Content -LiteralPath $script:LogFile -Value ('FATAL: ' + $_.Exception.Message) -Encoding UTF8 }
    exit 1
}
