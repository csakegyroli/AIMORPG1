#!/usr/bin/env node
"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const ts = require("typescript");
const root = path.resolve(__dirname, "..");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "aimorpg-security-smoke-"));
(async () => {
  try {
    const sourcePath = path.join(root, "server/src/auth/passwords.ts");
    const outPath = path.join(temp, "passwords.cjs");
    const source = fs.readFileSync(sourcePath, "utf8");
    const transpiled = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true }, fileName: sourcePath });
    fs.writeFileSync(outPath, transpiled.outputText);
    const { hashPassword, verifyPassword } = require(outPath);
    const password = "correct-horse-battery-staple-42";
    const firstHash = await hashPassword(password);
    const secondHash = await hashPassword(password);
    assert.match(firstHash, /^scrypt\$32768\$8\$1\$/);
    assert.notEqual(firstHash, secondHash, "Unique random salt should produce distinct hashes for the same password.");
    assert.ok(!firstHash.includes(password), "Encoded hash must not contain the raw password.");
    assert.equal(await verifyPassword(password, firstHash), true, "Correct password should verify.");
    assert.equal(await verifyPassword("incorrect-password", firstHash), false, "Incorrect password must fail verification.");
    assert.equal(await verifyPassword(password, "scrypt$999999999$8$1$bad$bad"), false, "Unsafe stored cost parameters must be rejected.");
    assert.equal(await verifyPassword(password, "not-a-hash"), false, "Malformed hashes must fail closed.");
    process.stdout.write("AImorpg password-hashing runtime test: PASS\n");
  } finally {
    fs.rmSync(temp, { recursive: true, force: true });
  }
})().catch(error => { process.stderr.write(`AImorpg password-hashing runtime test: FAIL\n${error?.stack || error}\n`); process.exitCode = 1; });
