"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { API_BASE, apiJson, errorMessage } from "@/lib/clientApi";

type Account = { id: string; email: string; displayName: string; createdAt: string; profile?: { preferredAvatar?: string; publicProfile?: boolean } | null };
type SaveSummary = { id: string; label: string; schemaVersion: number; createdAt: string; updatedAt: string };
type ApiEnvelope<T> = T & { message?: string };
type Health = { ok?: boolean; database?: "connected" | "disconnected"; aiConfigured?: boolean; model?: string; message?: string };

const LOCAL_SAVE_KEY = "aimorpg-final-demo-v1-29";

export function AccountPanel({ gameSnapshot }: { gameSnapshot: Record<string, unknown> }) {
  const [account, setAccount] = useState<Account | null>(null);
  const [saves, setSaves] = useState<SaveSummary[]>([]);
  const [health, setHealth] = useState<Health | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [problem, setProblem] = useState("");
  const [saveLabel, setSaveLabel] = useState("");

  const loadAccount = useCallback(async () => {
    const status = await apiJson<Health>("/api/system/health", { method: "GET", headers: {} }).catch(() => null);
    if (status?.ok) setHealth(status.data);
    else setHealth({ ok: false, database: "disconnected", aiConfigured: false, message: "A játékszerver nem érhető el." });

    const result = await apiJson<ApiEnvelope<{ user: Account }>>("/api/auth/me", { method: "GET", headers: {} }).catch(() => null);
    if (result?.ok && result.data?.user) {
      setAccount(result.data.user);
      const savesResult = await apiJson<ApiEnvelope<{ saves: SaveSummary[] }>>("/api/game/saves", { method: "GET", headers: {} }).catch(() => null);
      if (savesResult?.ok) setSaves(savesResult.data.saves ?? []);
    } else {
      setAccount(null);
      setSaves([]);
    }
  }, []);

  useEffect(() => { void loadAccount(); }, [loadAccount]);

  async function submitAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setProblem(""); setNotice("");
    if (mode === "register" && password !== passwordAgain) { setProblem("A két jelszó nem egyezik."); return; }
    setBusy(true);
    try {
      const path = mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const body = mode === "register" ? { email, password, displayName } : { email, password };
      const result = await apiJson<ApiEnvelope<{ user: Account }>>(path, { method: "POST", body: JSON.stringify(body) });
      if (!result.ok) throw new Error(errorMessage(result.data, "A hitelesítés nem sikerült."));
      setAccount(result.data.user);
      setPassword(""); setPasswordAgain("");
      setNotice(mode === "register" ? "A fiók elkészült. A játékmentés továbbra is külön művelet." : "Sikeres bejelentkezés.");
      await loadAccount();
    } catch (error) {
      setProblem(error instanceof Error ? error.message : "A játékszerver nem érhető el.");
    } finally { setBusy(false); }
  }

  async function logout() {
    setBusy(true); setProblem(""); setNotice("");
    try { await apiJson("/api/auth/logout", { method: "POST", body: "{}" }); setAccount(null); setSaves([]); setNotice("Kijelentkeztél. A helyi single-player mentés megmaradt."); }
    catch { setProblem("A kijelentkezés nem érte el a szervert."); }
    finally { setBusy(false); }
  }

  async function saveToCloud() {
    setBusy(true); setProblem(""); setNotice("");
    const label = saveLabel.trim() || `${String(gameSnapshot.name || "Kalandor")} · ${String(gameSnapshot.level || 1)}. szint`;
    try {
      const result = await apiJson<ApiEnvelope<{ save: SaveSummary }>>("/api/game/saves", { method: "POST", body: JSON.stringify({ label, schemaVersion: Number(gameSnapshot.saveVersion ?? 6), payload: gameSnapshot }) });
      if (!result.ok) throw new Error(errorMessage(result.data, "A mentés nem sikerült."));
      setNotice("A mentés biztonságosan elmentve a fiókodhoz."); setSaveLabel(""); await loadAccount();
    } catch (error) { setProblem(error instanceof Error ? error.message : "A felhőmentés sikertelen."); }
    finally { setBusy(false); }
  }

  async function restoreCloudSave(id: string) {
    if (!window.confirm("A mentés betöltése felülírja a böngésző jelenlegi helyi játékállapotát. Előbb exportáld a jelenlegi mentést, ha meg akarod őrizni. Folytatod?")) return;
    setBusy(true); setProblem(""); setNotice("");
    try {
      const result = await apiJson<ApiEnvelope<{ save: SaveSummary & { payload: Record<string, unknown> } }>>(`/api/game/saves/${encodeURIComponent(id)}`, { method: "GET", headers: {} });
      if (!result.ok || !result.data.save?.payload) throw new Error(errorMessage(result.data, "A mentés nem olvasható."));
      const payload = result.data.save.payload;
      if (payload.initialized !== true || typeof payload.name !== "string" || !payload.baseStats || !payload.equipment || !payload.inventory) throw new Error("A mentés formátuma nem ismert vagy sérült.");
      localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(payload));
      window.location.reload();
    } catch (error) { setProblem(error instanceof Error ? error.message : "A mentés visszaállítása nem sikerült."); setBusy(false); }
  }

  async function deleteCloudSave(id: string) {
    if (!window.confirm("Biztosan törlöd ezt a felhőmentést? Ez nem törli a böngésző helyi mentését.")) return;
    setBusy(true); setProblem("");
    try { const result = await apiJson(`/api/game/saves/${encodeURIComponent(id)}`, { method: "DELETE" }); if (!result.ok) throw new Error(errorMessage(result.data, "A mentés törlése nem sikerült.")); setNotice("A felhőmentés törölve."); await loadAccount(); }
    catch (error) { setProblem(error instanceof Error ? error.message : "A mentés törlése nem sikerült."); }
    finally { setBusy(false); }
  }

  function exportLocalSave() {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), game: gameSnapshot }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `aimorpg-save-${new Date().toISOString().slice(0, 10)}.json`; anchor.click(); URL.revokeObjectURL(url);
    setNotice("A helyi mentés exportálása elindult.");
  }

  async function importLocalSave(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = ""; if (!file) return;
    if (file.size > 1_000_000) { setProblem("A mentésfájl túl nagy. Legfeljebb 1 MB engedélyezett."); return; }
    try {
      const parsed: unknown = JSON.parse(await file.text());
      const payload = parsed && typeof parsed === "object" && "game" in parsed ? (parsed as { game?: unknown }).game : parsed;
      if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new Error("A fájl nem játékmentés.");
      const snapshot = payload as Record<string, unknown>;
      if (snapshot.initialized !== true || typeof snapshot.name !== "string" || !snapshot.baseStats || !snapshot.equipment || !snapshot.inventory) throw new Error("A fájl nem érvényes AImorpg-mentés.");
      if (!window.confirm("A mentés importálása felülírja a jelenlegi helyi játékállapotot. Biztosan folytatod?")) return;
      localStorage.setItem(LOCAL_SAVE_KEY, JSON.stringify(snapshot)); window.location.reload();
    } catch (error) { setProblem(error instanceof Error ? error.message : "A mentés nem olvasható."); }
  }

  return <div className="account-page">
    <header className="account-hero"><div className="account-hero-mark"><img src="/assets/eye-emblem-v2.webp" alt="A Szem"/></div><div><span>JÁTÉKOSKÖZPONT · V2.0 ALPHA</span><h1>Fiók és krónika</h1><p>Az egyjátékos kaland mostantól előkészíthető fiókhoz kötött, több eszközön elérhető mentésekre — a helyi játék ettől függetlenül megmarad.</p></div><div className={`api-health-pill ${health?.database === "connected" ? "online" : "offline"}`}><i/>{health?.database === "connected" ? "Adatbázis elérhető" : "Szerverállapot"}</div></header>

    {problem && <div className="account-alert error" role="alert">{problem}</div>}{notice && <div className="account-alert success" role="status">{notice}</div>}

    {!account ? <div className="account-grid">
      <section className="account-card auth-card"><div className="account-card-kicker">JÁTÉKOSFIÓK</div><h2>{mode === "register" ? "Új krónikát kezdesz" : "Visszatérés a királyságba"}</h2><p className="account-muted">A jelszó csak a szerveren kerül feldolgozásra és erős, sózott hash-ként tárolódik. A böngésző nem kapja meg a munkamenet titkát JavaScriptből.</p>
        <div className="account-tabs"><button type="button" className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setProblem(""); }}>Bejelentkezés</button><button type="button" className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setProblem(""); }}>Regisztráció</button></div>
        <form onSubmit={submitAuth} className="account-form">
          {mode === "register" && <label>Játékosnév<input required value={displayName} minLength={2} maxLength={22} autoComplete="nickname" onChange={e => setDisplayName(e.target.value)} placeholder="pl. Hamuszürke"/></label>}
          <label>E-mail-cím<input required type="email" maxLength={254} autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nev@pelda.hu"/></label>
          <label>Jelszó<input required type="password" minLength={12} maxLength={128} autoComplete={mode === "register" ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Legalább 12 karakter"/></label>
          {mode === "register" && <><label>Jelszó még egyszer<input required type="password" minLength={12} maxLength={128} autoComplete="new-password" value={passwordAgain} onChange={e => setPasswordAgain(e.target.value)} placeholder="Ismételd meg a jelszót"/></label><small className="account-form-note">Ne használd újra a más szolgáltatásoknál alkalmazott jelszavadat.</small></>}
          <button className="gold-button account-submit" disabled={busy || health?.database !== "connected"}>{busy ? "Feldolgozás…" : mode === "register" ? "Fiók létrehozása" : "Bejelentkezés"}</button>
        </form>
        {health?.database !== "connected" && <div className="account-backend-note"><strong>A fiókszolgáltatás jelenleg nem érhető el.</strong><span>Indítsd el a PostgreSQL-t és a NestJS API-t a csomag README-je alapján. A helyi kaland közben továbbra is játszható.</span><code>{API_BASE}</code></div>}
      </section>
      <section className="account-card account-local-card"><div className="account-card-kicker">HELYI SINGLE-PLAYER</div><h2>A mentés a tiéd</h2><p>A jelenlegi játék automatikusan a böngészőben ment. Ezt a mentést regisztráció nélkül is exportálhatod, később pedig visszaimportálhatod.</p><div className="local-save-summary"><div><span>Karakter</span><strong>{String(gameSnapshot.name ?? "Kalandor")}</strong></div><div><span>Szint</span><strong>{String(gameSnapshot.level ?? 1)}</strong></div><div><span>Mentési séma</span><strong>v{String(gameSnapshot.saveVersion ?? 6)}</strong></div></div><button className="outline-button" onClick={exportLocalSave}>↓ Helyi mentés exportálása</button><label className="import-save-button">↑ Mentés importálása<input type="file" accept="application/json,.json" onChange={importLocalSave} /></label><small>Importálás előtt ellenőrizzük az alapstruktúrát; betöltéskor a játék meglévő mentésnormalizálója további mezőellenőrzést végez.</small></section>
    </div> : <div className="account-grid">
      <section className="account-card account-profile-card"><div className="account-card-kicker">HITelesÍTETT FIÓK</div><div className="account-user-head"><div className="account-user-avatar">{(account.displayName || account.email).slice(0, 1).toUpperCase()}</div><div><h2>{account.displayName}</h2><p>{account.email}</p><small>Csatlakozott: {new Date(account.createdAt).toLocaleDateString("hu-HU")}</small></div></div><div className="account-security-list"><div><span><i className="security-dot good"/>Jelszóhash</span><strong>Szerveroldali scrypt</strong></div><div><span><i className="security-dot good"/>Munkamenet</span><strong>HttpOnly cookie</strong></div><div><span><i className="security-dot good"/>Játékmentés</span><strong>Felhasználóhoz kötve</strong></div><div><span><i className={`security-dot ${health?.aiConfigured ? "good" : "idle"}`}/>AI-játékmester</span><strong>{health?.aiConfigured ? health.model || "Konfigurálva" : "Nincs API-kulcs"}</strong></div></div><button className="outline-button" disabled={busy} onClick={logout}>Kijelentkezés</button></section>
      <section className="account-card account-save-card"><div className="account-card-kicker">FELHŐMENTÉSEK</div><h2>Mentett kalandok</h2><p className="account-muted">A mentés az aktuális egyjátékos állapot szerveroldali pillanatképe. Visszatöltés előtt a helyi játékmentés felülíródik.</p><label>Mentés neve<input value={saveLabel} maxLength={70} onChange={e => setSaveLabel(e.target.value)} placeholder={`${String(gameSnapshot.name ?? "Kalandor")} · ${String(gameSnapshot.level ?? 1)}. szint`}/></label><button className="gold-button account-submit" disabled={busy || saves.length >= 10} onClick={saveToCloud}>{busy ? "Mentés…" : saves.length >= 10 ? "Elérted a 10 mentéses korlátot" : "Jelenlegi kaland mentése"}</button>
        <div className="cloud-save-list">{saves.length === 0 ? <div className="cloud-save-empty">Még nincs felhőmentésed. Készítsd el az elsőt.</div> : saves.map(save => <article className="cloud-save-row" key={save.id}><div><strong>{save.label}</strong><small>{new Date(save.updatedAt).toLocaleString("hu-HU")} · séma v{save.schemaVersion}</small></div><button className="small-button" disabled={busy} onClick={() => void restoreCloudSave(save.id)}>Betöltés</button><button className="danger-text-button" disabled={busy} onClick={() => void deleteCloudSave(save.id)} aria-label={`${save.label} mentés törlése`}>×</button></article>)}</div><button className="outline-button" onClick={exportLocalSave}>Helyi mentés exportálása</button><label className="import-save-button">Mentés importálása<input type="file" accept="application/json,.json" onChange={importLocalSave}/></label>
      </section>
    </div>}
    <footer className="account-footnote"><span>API: {API_BASE}</span><span>Ez fejlesztői alfa. E-mail-megerősítés, jelszó-visszaállítás, 2FA és éles üzemű elosztott rate limit külön telepítési lépés.</span></footer>
  </div>;
}
