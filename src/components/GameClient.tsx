"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ITEMS, NPCS, QUESTS, REGIONS, STAT_DEFINITIONS, OUTSKIRTS_DISTRICTS, REGION_DISTRICTS, NPC_STORIES, NPC_FUNCTIONS } from "@/lib/content";
import { getEffectiveStats, getItem, getActiveEquipmentSetProgress, groupScore, marketPrice, sellingPrice, XP_FOR_LEVEL } from "@/lib/rules";
import { ITEM_CATEGORY_LABELS, ITEM_LEGAL_LABELS, itemCategory, itemLegalStatus, regionalMarketItems, REGIONAL_MARKET_NAMES, isMarketEligible, getEquipmentSet, getEquipmentSetCollectionProgress, canNpcCraftItem, craftRecipeForItem, dismantleYieldsForItem } from "@/lib/itemSystem";
import { getReputation, useGameStore } from "@/lib/store";
import { buildNarrativeContext, getAvailableDialogueTopics, evaluateSideQuestChoice } from "@/lib/narrative";
import { rewardPreview } from "@/lib/rewardEconomy";
import { chapterCompletedCount, chapterIsMastered, chapterProgress, regionGateStatus } from "@/lib/campaign";
import { getWorldTime, WORLD_CLOCK } from "../lib/worldTime";
import { getCalendarState, mergedCalendarBonuses, CANON_EVENT_CALENDAR, daysUntil } from "../lib/worldCalendar";
import { npcIsPresent as npcRuntimePresent } from "../lib/simulation";
import { getActiveGearSynergies } from "@/lib/synergies";
import { AccountPanel } from "@/components/AccountPanel";
import { EyeEntity, EyeMark } from "@/components/EyeEntity";
import { NPC_PORTRAIT_ART, REGION_ART, districtArtFor, itemArtFor, itemArtKindFor } from "@/lib/visualAssets";
import { API_BASE, apiJson, errorMessage } from "@/lib/clientApi";
import type { GameState } from "@/lib/store";
import type { AvatarId, EquipmentSlot, ItemDefinition, QuestDefinition, RegionId, ViewId } from "@/lib/types";

const navGroups: { id: string; label: string; items: { id: ViewId; icon: string; label: string }[] }[] = [
  { id: "kingdom", label: "A királyság", items: [
    { id: "overview", icon: "◈", label: "Áttekintés" },
    { id: "regions", icon: "⌖", label: "Városrészek" },
    { id: "market", icon: "◫", label: "Piac" },
  ] },
  { id: "hero", label: "A hős", items: [
    { id: "character", icon: "♙", label: "Karakter" },
    { id: "inventory", icon: "▦", label: "Felszerelés és táska" },
  ] },
  { id: "story", label: "Történet és kapcsolatok", items: [
    { id: "quests", icon: "✦", label: "Küldetések" },
    { id: "npcs", icon: "♟", label: "Városi névjegyzék" },
    { id: "messages", icon: "✉", label: "Üzenetek" },
    { id: "chronicle", icon: "☷", label: "Világkrónika" },
  ] },
  { id: "observer", label: "A világ megfigyelője", items: [
    { id: "gm", icon: "eye", label: "A Szem" },
  ] },
  { id: "system", label: "Rendszer", items: [
    { id: "profile", icon: "⚙", label: "Fiók és mentések" },
  ] },
];

const slots: { id: EquipmentSlot; label: string; icon: string }[] = [
  { id: "weapon", label: "Fegyver", icon: "⚔" },
  { id: "shield", label: "Pajzs", icon: "⬡" },
  { id: "armor", label: "Páncél", icon: "◈" },
  { id: "accessory", label: "Kesztyű", icon: "✧" },
  { id: "boots", label: "Lábbeli", icon: "♟" },
];

function npcScheduleLabel(n:{startHour?:number;endHour?:number;nightShift?:boolean}){
  if(n.startHour===undefined||n.endHour===undefined) return "Egész nap elérhető";
  const pad=(v:number)=>String(v).padStart(2,"0");
  return `${pad(n.startHour)}:00–${pad(n.endHour)}:00${n.nightShift?" · éjszakai műszak":""}`;
}

const AVATARS: { id: AvatarId; name: string; role: string; src: string }[] = [
  { id: "vagabond", name: "Vándor Harcos", role: "Közelharc · kitartás", src: "/assets/avatar-vagabond.webp" },
  { id: "ranger", name: "Erdei Íjász", role: "Ügyesség · túlélés", src: "/assets/avatar-ranger.webp" },
];

const REGION_COORDS: Record<string, { left: string; top: string }> = {
  // Percent anchors follow the clean, text-free parchment chart at /assets/world/world-chart.webp.
  outskirts: { left: "24%", top: "66%" },
  market: { left: "51%", top: "59%" },
  arena: { left: "40%", top: "40%" },
  inner: { left: "68%", top: "52%" },
  palace: { left: "52%", top: "24%" },
  harbor: { left: "85%", top: "76%" },
  forest: { left: "22%", top: "24%" },
};

function SafeArtImage({ src, alt = "", fallbackSrc = "/assets/avatar-vagabond.webp", className = "" }: { src: string; alt?: string; fallbackSrc?: string; className?: string }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const failed = failedSource === src;
  const displaySource = failed ? fallbackSrc : src;
  return <img
    src={displaySource}
    alt={alt}
    className={className}
    loading="lazy"
    decoding="async"
    onError={() => { if (!failed) setFailedSource(src); }}
  />;
}

function ItemArtwork({ itemId, fallback, className = "" }: { itemId: string; fallback?: string; className?: string }) {
  const item = ITEMS.find((record) => record.id === itemId);
  const src = itemArtFor(itemId, item?.slot, item?.type, item?.category);
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const imageFailed = Boolean(src && failedSource === src);
  const artKind = imageFailed ? "broken" : itemArtKindFor(itemId, item?.slot, item?.type, item?.category);
  const title = artKind === "slot-fallback"
    ? "Felszerelési szett: a felszerelési hely családillusztrációja látható, nem egyedi szettgrafika."
    : artKind === "family-fallback"
      ? "Csoportillusztráció: a hasonló tárgycsalád képe látható, nem egyedi tárgygrafika."
      : artKind === "category-fallback"
      ? "Kategóriaillusztráció látható; ez nem egyedi tárgygrafika."
      : artKind === "broken"
        ? "A hozzárendelt tárgykép nem tölthető be; szimbólum-tartalék jelenik meg."
      : artKind === "none"
        ? "Ehhez a tárgyhoz még nincs megfelelő képi asset; a szimbólum csak tartalékjelölő."
        : undefined;
  const artClass = artKind === "slot-fallback" ? "item-art--slot-fallback" : artKind === "family-fallback" ? "item-art--family-fallback" : artKind === "category-fallback" ? "item-art--category-fallback" : artKind === "broken" ? "item-art--broken" : artKind === "none" ? "item-art--missing" : "";
  return <span className={`item-art ${className} ${artClass}`} title={title} data-art-kind={artKind}>{src && !imageFailed ? <img src={src} alt="" draggable={false} loading="lazy" decoding="async" onError={() => setFailedSource(src)} /> : <span aria-hidden="true">{fallback ?? item?.icon ?? "✦"}</span>}</span>;
}

function regionName(id: string) { return REGIONS.find((r) => r.id === id)?.name ?? id; }
function npcIsPresent(npc: typeof NPCS[number], hour = getWorldTime().hour, runtime?: GameState["npcStates"][keyof GameState["npcStates"]]) {
  return npcRuntimePresent(npc, hour, runtime);
}
function npcName(id: string) { return NPCS.find((n) => n.id === id)?.name ?? id; }
function npcAvatar(npc: (typeof NPCS)[number]) { return NPC_PORTRAIT_ART[npc.id] ?? npc.avatarSrc ?? "/assets/avatar-vagabond.webp"; }
function relationshipInsightsFromFacets(facets: { trust:number; respect:number; affection:number; fear:number; debt:number; suspicion:number }) {
  const { trust, respect, affection, fear, debt, suspicion } = facets;
  return {
    overall: suspicion >= 65 ? "Ellenséges viszony" : debt >= 60 ? "Tartozás terheli a kapcsolatot" : trust >= 50 && respect >= 35 ? "Bizalmi kapcsolat" : fear >= 60 ? "Tart tőled" : affection >= 35 && trust >= 25 ? "Kedvel téged" : suspicion >= 35 ? "Gyanakvó veled" : respect >= 40 ? "Nagyra tart téged" : trust >= 20 || affection >= 20 || respect >= 20 ? "Alakuló ismeretség" : "Ismeretség",
    trust: trust >= 60 ? "Mélyen megbízik benned" : trust >= 30 ? "Megbízik benned" : trust <= -30 ? "Nem bízik benned" : "Még alig ismer",
    respect: respect >= 60 ? "Nagyra tart téged" : respect >= 30 ? "Tisztel téged" : respect <= -30 ? "Lenéz téged" : "Még nem alakult ki erős véleménye",
    affection: affection >= 60 ? "Erősen kötődik hozzád" : affection >= 30 ? "Kedvel téged" : affection <= -30 ? "Elutasító veled" : "Nincs mély személyes kötődés",
    fear: fear >= 60 ? "Tart tőled" : fear >= 30 ? "Óvatos veled" : fear <= -30 ? "Nem tart tőled" : "Nem fél tőled",
    debt: debt >= 60 ? "Adósa vagy, és számon tartja" : debt >= 30 ? "Adósa vagy" : debt <= -30 ? "Ő tartozik neked" : "Nincs jelentős tartozás köztetek",
    suspicion: suspicion >= 65 ? "Ellenségként tekint rád" : suspicion >= 35 ? "Gyanakvó veled" : suspicion <= -20 ? "Alapvetően hisz neked" : "Nem gyanakszik rád"
  };
}
function trackedMainQuest(game: GameState) {
  const tracked = game.trackedQuestId ? QUESTS.find(x => x.id === game.trackedQuestId) : undefined;
  if (tracked && game.questStatus[tracked.id] !== "completed") return tracked;
  if (!game.mainQuestFollowing) return null;
  return QUESTS.find(q => game.questStatus[q.id] === "active") ?? QUESTS.find(q => questState(game, q) === "open") ?? null;
}
function trackedQuestNpc(game: GameState) {
  const q = trackedMainQuest(game);
  return q ? NPCS.find(n => n.id === q.giver) ?? null : null;
}
function trackedQuestDistrict(game: GameState) {
  return trackedQuestNpc(game)?.district ?? null;
}
function trackedStorySideQuest(game: GameState) { return game.trackedSideQuestId ? game.narrativeState.runtime.sideQuests.records.find(r => r.id === game.trackedSideQuestId && r.status === "active") ?? null : null; }
function trackedStoryNpc(game: GameState) { const side = trackedStorySideQuest(game); if (side) return NPCS.find(n => n.id === side.blueprint.giver) ?? null; return trackedQuestNpc(game); }
function trackedStoryRegion(game: GameState) { return trackedStoryNpc(game)?.region ?? null; }
function trackedStoryDistrict(game: GameState) { return trackedStoryNpc(game)?.district ?? null; }
function isTrackedNpc(game: GameState, npcId: string) { return trackedStoryNpc(game)?.id === npcId; }
function isTrackedDistrict(game: GameState, districtId: string) { return trackedStoryDistrict(game) === districtId; }

function itemStatsText(item: ItemDefinition) {
  if (!item.stats) return "Nincs közvetlen statbónusz";
  return Object.entries(item.stats).map(([key, value]) => `${STAT_DEFINITIONS.find((s) => s.id === key)?.label ?? key} +${value}`).join(" · ");
}
function itemDamage(item: ItemDefinition) { return item.type === "weapon" ? ((item.stats?.strength ?? 0) * 2 + (item.stats?.weaponMastery ?? 0) * 3 + 6) : 0; }
function itemDefense(item: ItemDefinition) { return ["armor", "shield", "boots"].includes(item.type) ? ((item.stats?.defense ?? 0) * 3 + (item.stats?.endurance ?? 0) * 2) : 0; }
function itemSpecial(item: ItemDefinition) {
  const stat = Object.entries(item.stats ?? {}).sort((a, b) => b[1] - a[1])[0];
  return stat ? `${STAT_DEFINITIONS.find((s) => s.id === stat[0])?.label ?? stat[0]} +${stat[1]}` : "Nincs különleges képesség";
}

const INVENTORY_FILTERS = [
  ["all", "Minden tárgy"], ["equipment", "Felszerelés"], ["consumable", "Étel / ital"],
  ["upgrade", "Fejlesztések"], ["material", "Nyersanyagok"], ["tradeGood", "Kereskedelmi áru"],
  ["quest", "Küldetéstárgyak"], ["set", "Szettek"], ["document", "Iratok"], ["key", "Kulcsok"], ["luxury", "Luxus"], ["contraband", "Tiltott"], ["relic", "Relikviák"]
] as const;

function maxHealth(game: GameState) { return 100 + Math.max(0, getEffectiveStats(game.baseStats, game.equipment, game.temporaryStatBuffs, game.temporaryItemBuffs).endurance) * 5; }

function HealthBar({ game, notify }: { game: GameState; notify: (t:string)=>void }) {
  const max = maxHealth(game); const hp = Math.min(max, Math.max(0, game.health));
  return <div className="health-bar-card"><div className="health-bar-head"><span>ÉLETERŐ</span><strong>{hp} / {max}</strong></div><div className="health-bar-track"><b style={{ width: `${max ? (hp / max) * 100 : 0}%` }} /></div><small>Harc közben csökken. Étellel vagy pihenéssel visszatölthető.</small></div>;
}

export function GameClient() {
  const game = useGameStore();
  const [view, setView] = useState<ViewId>("regions");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedNpc, setSelectedNpc] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [questDestination, setQuestDestination] = useState<{ region: RegionId; district: string | null } | null>(null);
  const [lockedRegion, setLockedRegion] = useState<RegionId | null>(null);
  const [npcOverlay, setNpcOverlay] = useState<string | null>(null);
  const [showPrologue, setShowPrologue] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [eyeAiLoading, setEyeAiLoading] = useState(false);
  const [eyeAiResult, setEyeAiResult] = useState<{ title: string; body: string; actionHint: string; tone: "personal" | "world" | "warning"; model?: string } | null>(null);
  const [eyeAiError, setEyeAiError] = useState<string | null>(null);
  const toastTimer = useRef<number | null>(null);
  const reputation = getReputation(game);
  const effectiveStats = useMemo(() => getEffectiveStats(game.baseStats, game.equipment, game.temporaryStatBuffs, game.temporaryItemBuffs), [game.baseStats, game.equipment, game.temporaryStatBuffs, game.temporaryItemBuffs]);
  const unread = game.gmMessages.filter((m) => !m.seen).length;
  const notify = (message: string) => {
    setToast(message);
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => {
      setToast(null);
      toastTimer.current = null;
    }, 3200);
  };
  const go = (id: ViewId) => { setView(id); if (id === "gm" || id === "messages") game.markMessagesSeen(); };
  const gameSnapshot = Object.fromEntries(Object.entries(game).filter(([, value]) => typeof value !== "function")) as Record<string, unknown>;
  const askEyeAI = async () => {
    setEyeAiLoading(true); setEyeAiError(null);
    try {
      const result = await apiJson<{ observation?: { title: string; body: string; actionHint: string; tone: "personal" | "world" | "warning" }; model?: string; message?: string }>("/api/ai/eye", {
        method: "POST",
        body: JSON.stringify({
          playerName: game.name.slice(0, 22), region: game.currentRegion, level: game.level,
          recentEvents: game.journal.slice(0, 5).map((event) => ({ title: event.title.slice(0, 80), text: event.text.slice(0, 240), kind: event.kind })),
          recentObservations: game.gmMessages.slice(0, 3).map((message) => ({ title: message.title.slice(0, 80), body: message.body.slice(0, 200), tone: message.tone })),
        }),
      });
      if (!result.ok) {
        const message = errorMessage(result.data, "Az AI-játékmester válasza nem érkezett meg.");
        if (result.status === 401) { setEyeAiError("Az AI-játékmester használatához jelentkezz be a Fiók és mentések panelen."); go("profile"); }
        else setEyeAiError(message);
        return;
      }
      if (!result.data.observation) throw new Error("A válasz nem tartalmazott érvényes megfigyelést.");
      setEyeAiResult({ ...result.data.observation, model: result.data.model });
    } catch (error) {
      setEyeAiError(error instanceof Error ? error.message : `A játékszerver nem érhető el (${API_BASE}).`);
    } finally { setEyeAiLoading(false); }
  };
  useEffect(() => {
    const key = "aimorpg-prologue-seen-v1";
    if (typeof window !== "undefined" && window.localStorage.getItem(key) !== "1") {
      const timer = window.setTimeout(() => setShowPrologue(true), 350);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, []);
  const closePrologue = () => {
    setShowPrologue(false);
    if (typeof window !== "undefined") window.localStorage.setItem("aimorpg-prologue-seen-v1", "1");
  };

  return <main className="game-shell">
    <header className="topbar">
      <div className="brand"><span className="brand-mark">✦</span><div><strong>AImorpg</strong><small>A Királyság 327. éve · élő város · V2.0 alpha.26</small></div></div>
      <div className="top-avatar"><img src={AVATARS.find((a) => a.id === game.avatarId)?.src ?? AVATARS[0].src} alt="" /></div>
      <div className="top-stats">
        <TopStat label="Arany" value={`${game.gold} 🪙`} /><TopStat label="Gyémánt" value={`${game.diamonds} 💎`} /><TopStat label="Szint" value={game.level} /><TopStat label="Hírnév" value={reputation.toLocaleString("hu-HU")} /><TopStat label="Tartózkodás" value={regionName(game.currentRegion)} wide />
      </div>
      <ServerTowerClock />
    </header>
    <div className="game-layout">
      <aside className="sidebar"><div className="side-ribbon">VÁROS ÉS SORS</div><nav className="nav-list" aria-label="Fő navigáció">{navGroups.map((group) => <section className="nav-group" key={group.id} aria-labelledby={`nav-group-${group.id}`}><h2 className="nav-group-title" id={`nav-group-${group.id}`}>{group.label}</h2>{group.items.map((item) => <button type="button" key={item.id} aria-current={view === item.id ? "page" : undefined} className={`nav-button ${view === item.id ? "active" : ""}`} onClick={() => go(item.id)}><span className={`nav-icon ${item.id === "gm" ? "nav-icon-eye" : ""}`} aria-hidden="true">{item.id === "gm" ? <EyeMark /> : item.icon}</span>{item.label}{item.id === "gm" && unread > 0 && <span className="nav-badge" aria-label={`${unread} olvasatlan megfigyelés`}>{unread}</span>}</button>)}</section>)}</nav></aside>
      <section className="main-panel" data-view={view}>
        {view === "overview" && <Overview game={game} reputation={reputation} setView={go} setShowPrologue={setShowPrologue} onOpenCalendar={() => setShowCalendar(true)} />}
        {view === "character" && <Character game={game} effectiveStats={effectiveStats} notify={notify} />}
        {view === "messages" && <Messages game={game} />}
        {view === "inventory" && <StandaloneInventory game={game} effectiveStats={effectiveStats} notify={notify} />}
        {view === "quests" && <Quests game={game} effectiveStats={effectiveStats} notify={notify} onQuestNavigate={(q) => { const npc = NPCS.find(n => n.id === q.giver); setQuestDestination({ region: q.region, district: npc?.district ?? null }); setSelectedRegion(q.region); setView("regions"); notify(`Célpont megnyitva: ${npc?.name ?? q.title}.`); }} />}
        {view === "regions" && <Regions game={game} notify={notify} setView={go} selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} setLockedRegion={setLockedRegion} setSelectedNpc={setSelectedNpc} setNpcOverlay={setNpcOverlay} questDestination={questDestination} clearQuestDestination={() => setQuestDestination(null)} />}
        {view === "npcs" && <Npcs game={game} selectedNpc={selectedNpc} setSelectedNpc={setSelectedNpc} notify={notify} />}
        {view === "market" && <Market game={game} effectiveStats={effectiveStats} notify={notify} />}
        {view === "chronicle" && <Chronicle game={game} onOpenPrologue={() => setShowPrologue(true)} />}
        {view === "gm" && <GameMaster game={game} reputation={reputation} onOpenCalendar={() => setShowCalendar(true)} onAskAI={askEyeAI} aiLoading={eyeAiLoading} aiResult={eyeAiResult} aiError={eyeAiError} />}
        {view === "profile" && <AccountPanel gameSnapshot={gameSnapshot} />}
      </section>
      <aside className="rightbar">
        <div className="portrait-card"><div className="character-sigil"><img src={AVATARS.find((a) => a.id === game.avatarId)?.src ?? AVATARS[0].src} alt="" /></div><div className="portrait-copy"><small>KALANDOR</small><strong>{game.name}</strong><span>{game.level}. szint · {regionName(game.currentRegion)}</span></div><div className="xp-row"><span>Tapasztalat</span><strong>{game.xp}/{XP_FOR_LEVEL(game.level)}</strong><i><b style={{ width: `${Math.min(100, game.xp / XP_FOR_LEVEL(game.level) * 100)}%` }} /></i></div></div>
        <div className="side-card reputation-card"><div className="card-kicker">HÍRNÉV</div><strong className="big-number">{reputation.toLocaleString("hu-HU")}</strong><span>összhírnév · nincs felső korlát</span><div className="rep-bar"><b style={{ width: `${Math.min(100, Math.log10(reputation + 1) / 5 * 100)}%` }} /></div><p>A tetteid, kapcsolataid, eredményeid és aktivitásod együtt alakítják.</p></div>
        <div className="side-card compact-journal"><div className="card-kicker">UTOLSÓ ESEMÉNYEK</div>{game.journal.slice(0, 5).map((j) => <div className="side-log" key={j.id}><span>{j.kind === "quest" ? "✦" : j.kind === "market" ? "◫" : "◇"}</span><div><strong>{j.title}</strong><p>{j.text}</p></div></div>)}</div>
        <button className="reset-button" onClick={() => { if (window.confirm("Biztosan újraindítod a helyi kalandot?")) { game.reset(); go("overview"); notify("Új kaland indult a Külvárosban."); } }}>Helyi mentés újraindítása</button>
      </aside>
    </div>
    {npcOverlay && <NpcLocalModal game={game} npcId={npcOverlay} notify={notify} onClose={() => setNpcOverlay(null)} />}
    {showCalendar && <KingdomCalendarModal onClose={() => setShowCalendar(false)} />}
    {lockedRegion && <LockedRegionModal game={game} regionId={lockedRegion} onClose={() => setLockedRegion(null)} />}
    {showPrologue && <PrologueModal onClose={closePrologue} />}
    {toast && typeof document !== "undefined" ? createPortal(<div className="toast" role="status" aria-live="polite">{toast}</div>, document.body) : null}
  </main>;
}

function ServerClock() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 15000);
    return () => window.clearInterval(timer);
  }, []);
  const time = getWorldTime(now);
  return <div className="server-clock" title="A királyság hivatalos szerverideje">
    <span className="server-clock-dot" />
    <div><small>SZERVERIDŐ · KIRÁLYSÁG</small><strong>{time.label}</strong></div>
    <em>{time.phase}</em>
  </div>;
}

function ServerTowerClock() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 15000); return () => window.clearInterval(timer); }, []);
  const time = getWorldTime(now);
  const minuteDeg = time.minute * 6;
  const hourDeg = ((time.hour % 12) * 60 + time.minute) * 0.5;
  const lantern = time.phase === "hajnal" || time.phase === "alkonyat" || time.phase === "éjszaka";
  return <div className={`server-tower-clock ${lantern ? "lantern-on" : ""}`} title="A királyság hivatalos szerverideje · 12 valós óra = 1 királysági nap" aria-label={`Szerveridő: ${time.label}`}>
    <div className="clock-tower-cap"><i/><i/><i/></div>
    <div className="clock-tower-body"><div className="clock-face"><span className="clock-12">12</span><span className="clock-3">3</span><span className="clock-6">6</span><span className="clock-9">9</span><b className="clock-hand hour" style={{ transform: `translateX(-50%) rotate(${hourDeg}deg)` }} /><b className="clock-hand minute" style={{ transform: `translateX(-50%) rotate(${minuteDeg}deg)` }} /><em className="clock-center" /></div><div className="clock-tower-lantern"/></div>
    <div className="server-tower-copy"><small>KIRÁLYSÁGI SZERVERIDŐ</small><strong>{time.hour.toString().padStart(2,"0")}:{time.minute.toString().padStart(2,"0")}</strong><span>{time.year}. év · {time.season} · {time.day}. nap · {time.phase}</span></div>
  </div>;
}

function TopStat({ label, value, wide = false }: { label: string; value: string | number; wide?: boolean }) { return <div className={`top-stat ${wide ? "wide" : ""}`}><small>{label}</small><strong>{value}</strong></div>; }
function SectionTitle({ eyebrow, title, text, action }: { eyebrow: string; title: string; text: string; action?: React.ReactNode }) { return <div className="section-title"><div><span>{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>{action}</div>; }

function Overview({ game, reputation, setView, setShowPrologue, onOpenCalendar }: { game: GameState; reputation: number; setView: (v: ViewId) => void; setShowPrologue: (open: boolean) => void; onOpenCalendar: () => void }) {
  const next = QUESTS.find((q) => game.regionAccess[q.region] && game.questStatus[q.id] !== "completed");
  const completed = Object.values(game.questStatus).filter((s) => s === "completed").length;
  return <div className="overview-page">
    <SectionTitle eyebrow={`A KIRÁLYSÁG ${getWorldTime().year}. ÉVE`} title="Áttekintés" text="A város emlékszik. A világ nem csak körülötted történik: a döntéseid lassan átírják a krónikát." />
    {game.narrativeState.runtime.worldEvents.events.filter(e=>e.status==="active").slice(0,2).map(e=><section className="world-event-banner" key={e.id}><div><span>{e.canonical?"◇ VILÁGESEMÉNY":e.scope==="regional"?"◇ REGIONÁLIS ESEMÉNY":"◇ HELYI ESEMÉNY"}</span><h3>{e.title}</h3><p>{e.reason}</p></div><button className="outline-button" onClick={()=>setView("gm")}>A Szem megfigyelései</button></section>)}
    <section className="calendar-strip"><div><span>KIRÁLYSÁGI NAPTÁR · {getWorldTime().year}. ÉV</span><h3>{getCalendarState().active[0]?.title ?? `Következő esemény: ${getCalendarState().upcoming[0]?.title ?? "—"}`}</h3><p>{getCalendarState().active[0]?.description ?? `${getCalendarState().upcoming[0]?.daysUntilStart ?? 0} nap múlva. ${getCalendarState().upcoming[0]?.preparation ?? ""}`}</p></div><button className="outline-button" onClick={onOpenCalendar}>Naptár megnyitása</button></section><section className="overview-hero"><div className="overview-hero-image" style={{backgroundImage:"url('/assets/world/capital-dawn.webp')"}}/><div className="overview-hero-copy"><span>1. FEJEZET · A FEKETE ÉRME</span><h2>A főváros története már elkezdődött.</h2><p>Eltűnt adóládák, tökéletes főkönyvek és megrendezett arénacsaták. Valaki hamis pénzzel írja át a város törvényeit.</p><div className="overview-actions"><button className="gold-button" onClick={() => setShowPrologue(true)}>Előzmények</button><button className="outline-button" onClick={() => setView("regions")}>Belépek a városba</button></div></div></section>
    <div className="overview-grid">
      <section className="overview-card"><span>JELENLEGI HELYZET</span><h3>{regionName(game.currentRegion)}</h3><p>{getWorldTime().label} · A helyed a városban számít.</p><div className="overview-stats"><b>{game.level}<small>szint</small></b><b>{reputation.toLocaleString("hu-HU")}<small>hírnév</small></b><b>{completed}/{QUESTS.length}<small>küldetés</small></b></div></section>
      <section className="overview-card"><span>KÖVETKEZŐ LÉPÉS</span><h3>{next?.title ?? "A nyom továbbvezet"}</h3><p>{next?.summary ?? "A városnak új fejezetre van szüksége."}</p><button className="outline-button" onClick={() => setView("quests")}>Megnézem</button></section>
      <section className="overview-card"><span>VILÁGKRÓNIKA</span><div className="overview-journal">{game.journal.slice(0, 3).map((j) => <div key={j.id}><b>{j.title}</b><small>{j.text}</small></div>)}</div><button className="outline-button" onClick={() => setView("chronicle")}>Krónika megnyitása</button></section>
      <section className="overview-eye"><EyeEntity mode="compact" label="A Szem megfigyelőrelikviája"/><div><span>A JÁTÉKMESTER</span><h3>A Szem mindent lát.</h3><p>Nem kell mindent elmondanom. Elég, ha mindent megjegyzek.</p><button className="gold-button" onClick={() => setView("gm")}>Megfigyelések</button></div></section>
    </div>
  </div>;
}

function Character({ game, effectiveStats, notify }: { game: GameState; effectiveStats: ReturnType<typeof getEffectiveStats>; notify: (t: string) => void }) {
  const [editing, setEditing] = useState(false); const [draft, setDraft] = useState(game.name); const [openGroup, setOpenGroup] = useState<string | null>("combat"); const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const groups = ["combat", "shadow", "social", "trade", "lore"] as const;
  const labels = { combat: "Harc", shadow: "Ügyesség és árnyék", social: "Társas", trade: "Kereskedelem", lore: "Tudás" };
  return <><SectionTitle eyebrow="KARAKTERLAP" title={game.name} text="A karakteredet a döntéseid, képességeid, felszerelésed és kapcsolataid formálják." action={<button className="small-button" onClick={() => setEditing(true)}>Név és avatar</button>} />
    {editing && <div className="character-editor"><div className="editor-head"><div><span>MEGJELENÉS</span><h3>Ki lép be a krónikába?</h3></div><button className="close-button" onClick={() => setEditing(false)}>×</button></div><label>Karakter neve<input value={draft} maxLength={22} onChange={(e) => setDraft(e.target.value)} /></label><div className="avatar-choice-grid">{AVATARS.map((a) => <button key={a.id} className={game.avatarId === a.id ? "selected" : ""} onClick={() => game.setAvatar(a.id)}><img src={a.src} alt={a.name}/><span>{a.name}</span><small>{a.role}</small></button>)}</div><button className="gold-button" onClick={() => { game.setName(draft); setEditing(false); notify("A karakter neve és megjelenése rögzítve lett."); }}>Mentés</button></div>}
    <div className="character-main">
      <section className="character-hero"><div className="character-portrait"><img src={AVATARS.find((a) => a.id === game.avatarId)?.src ?? AVATARS[0].src} alt={game.name}/><div className="portrait-plaque"><b>{game.name}</b><span>{game.level}. szint · {regionName(game.currentRegion)}</span></div></div><div className="character-values"><HealthBar game={game} notify={notify}/><span>HŐS ÉRTÉKEI</span>{[["Erő",effectiveStats.strength],["Ügyesség",effectiveStats.agility],["Állóképesség",effectiveStats.endurance],["Intelligencia",effectiveStats.intelligence],["Bölcsesség",effectiveStats.lore],["Kereskedelem",effectiveStats.trade]].map(([l,v]) => <div className="value-row" key={l as string}><span>{l}</span><i><b style={{width:`${Math.min(100,(v as number)*2)}%`}}/></i><strong>{v}</strong></div>)}<div className="hero-reputation"><span>HÍRNÉV</span><strong>{getReputation(game).toLocaleString("hu-HU")}</strong></div></div></section>
      <section className="character-equipment"><div className="panel-head"><h3>Viselt felszerelés</h3><span>Drag & drop az Inventoryval</span></div><Inventory game={game} effectiveStats={effectiveStats} selectedItem={selectedItem} setSelectedItem={setSelectedItem} notify={notify} equipmentOnly /></section>
      <GearSynergyPanel game={game} />
      <section className="skill-tree-v07"><div className="skill-tree-heading"><div><span>FEJLŐDÉSI RENDSZER</span><h2>Képességfa</h2></div><p>{game.developmentPoints} szabad pont · minden ág külön fejlődik.</p></div>{groups.map((group) => { const total = groupScore(game.baseStats, game.equipment, group); const open = openGroup === group; const defs = STAT_DEFINITIONS.filter((s) => s.group === group); return <section className="skill-branch" key={group}><button className="skill-branch-head" onClick={() => setOpenGroup(open ? null : group)}><span className="skill-chevron">{open ? "▾" : "▸"}</span><div><small>{labels[group]}</small><strong>{total}</strong><em>összérték</em></div><i><b style={{width:`${Math.min(100,total/60*100)}%`}}/></i></button>{open && <div className="skill-nodes">{defs.map((stat) => { const bonus = effectiveStats[stat.id] - game.baseStats[stat.id]; return <div className="skill-node" key={stat.id}><div><strong>{stat.label}</strong><small>{stat.description}</small></div><span>{effectiveStats[stat.id]}{bonus > 0 && <em>+{bonus}</em>}</span><button disabled={game.developmentPoints === 0} onClick={() => {game.improveStat(stat.id);notify(`${stat.label} fejlesztve.`)}}>+</button></div>})}</div>}</section>})}<section className="skill-branch magic-locked"><div className="skill-branch-head"><span className="skill-chevron">◇</span><div><small>Mágia</small><strong>0</strong><em>még ismeretlen</em></div><i><b style={{width:"0%"}}/></i></div><div className="magic-note">A mágikus tudásnak még nincs mestere a fővárosban. A Szem szerint ez a történet a lezárt erdő felől érkezik.</div></section></section>
    </div></>;
}

function StandaloneInventory({ game, effectiveStats, notify }: { game: GameState; effectiveStats: ReturnType<typeof getEffectiveStats>; notify: (t: string) => void }) { const [selectedItem,setSelectedItem]=useState<string|null>(null); return <><SectionTitle eyebrow="KARAKTER TÁRGYAI" title="Inventory" text="A hátizsákod, felszerelésed és tárgyaid egy helyen kezelhetők."/><GearSynergyPanel game={game} /><Inventory game={game} effectiveStats={effectiveStats} selectedItem={selectedItem} setSelectedItem={setSelectedItem} notify={notify}/></>; }

function Messages({ game }: { game: GameState }) { return <><SectionTitle eyebrow="KAPCSOLATOK" title="Üzenetek" text="A Szem, a városlakók és később a játékosok üzenetei egyetlen, tiszta postafiókban jelennek meg."/><div className="messages-page"><div className="message-toolbar"><span>Beérkező</span><small>{game.gmMessages.filter(m=>!m.seen).length} olvasatlan</small></div><div className="message-list-v07">{game.gmMessages.map((m)=><article className={`inbox-message ${m.seen?"seen":"unread"}`} key={m.id}><div className="message-mark">{m.tone==="warning"?"!":m.tone==="personal"?"✦":"◇"}</div><div><small>{m.at}</small><h3>{m.title}</h3><p>{m.body}</p></div>{!m.seen&&<b>ÚJ</b>}</article>)}</div></div></>; }

function ItemHover({ item, className = "" }: { item: ItemDefinition; className?: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ left: 0, top: 0, width: 300 });
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const show = () => {
    const el = anchorRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const width = Math.min(320, window.innerWidth - 24);
    let left = r.right + 14;
    if (left + width > window.innerWidth - 12) left = r.left - width - 14;
    let top = r.top + r.height / 2 - 120;
    if (top < 12) top = 12;
    if (top + 250 > window.innerHeight - 12) top = Math.max(12, window.innerHeight - 262);
    setPos({ left, top, width }); setOpen(true);
  };
  return <span ref={anchorRef} className={`item-hover-anchor ${className}`} tabIndex={0} onMouseEnter={show} onFocus={show} onMouseLeave={() => setOpen(false)} onBlur={() => setOpen(false)}>
    <ItemArtwork itemId={item.id} fallback={item.icon}/>
    {open && typeof document !== "undefined" ? createPortal(<div className="global-item-tooltip" style={{ left: pos.left, top: pos.top, width: pos.width }}><ItemTooltip item={item}/></div>, document.body) : null}
  </span>;
}

function ItemTooltip({ item }: { item: ItemDefinition }) { const damage=itemDamage(item), defense=itemDefense(item); const category=itemCategory(item); const legal=itemLegalStatus(item); const set=getEquipmentSet(item); return <div className={`item-tooltip rarity-${item.rarity.replace(/\W/g,"").toLowerCase()}`}><div className="tooltip-head"><ItemArtwork itemId={item.id} fallback={item.icon}/><div><strong>{item.name}</strong><span>{item.rarity}</span></div></div><p>{item.description}</p><div className="tooltip-stats">{damage>0&&<span>Sebzés <b>{damage}</b></span>}{defense>0&&<span>Védelem <b>{defense}</b></span>}<span>Típus <b>{ITEM_CATEGORY_LABELS[category] ?? category}</b></span><span>Jogi státusz <b>{ITEM_LEGAL_LABELS[legal]}</b></span><span>Alapár <b>{item.basePrice} 🪙{item.diamondPrice?` + ${item.diamondPrice} 💎`:""}</b></span></div><small>{itemStatsText(item)}</small>{set&&<small><strong>Szett:</strong> {set.name} · gyűjthető 5 részes készlet</small>}{item.origin&&<small>Eredet: {item.origin}</small>}{item.sideQuestOnly&&<small>Ritka megszerzés · side quest / történeti érdem</small>}{item.questItem&&<small>Történeti tárgy · nem értékesíthető</small>}</div>; }

function Inventory({ game, effectiveStats, selectedItem, setSelectedItem, notify, equipmentOnly=false }: { game: GameState; effectiveStats: ReturnType<typeof getEffectiveStats>; selectedItem: string|null; setSelectedItem:(id:string|null)=>void; notify:(t:string)=>void; equipmentOnly?:boolean }) {
  const [filter, setFilter] = useState<string>("all");
  const dragItem=(e:React.DragEvent,id:string)=>{e.dataTransfer.effectAllowed="move";e.dataTransfer.setData("text/aimorpg-item",id)};
  const dropOnSlot=(e:React.DragEvent,slot:EquipmentSlot)=>{e.preventDefault();const id=e.dataTransfer.getData("text/aimorpg-item");if(!id)return;const item=game.inventory.find(x=>x.instanceId===id);if(!item||getItem(item.itemId).slot!==slot){notify("Ez a tárgy nem illik ebbe a felszerelési helybe.");return}game.equip(id,slot);setSelectedItem(null);notify(`${getItem(item.itemId).name} felszerelve.`)};
  const dropToBag=(e:React.DragEvent)=>{e.preventDefault();const slot=e.dataTransfer.getData("text/aimorpg-slot") as EquipmentSlot;if(slot&&game.equipment[slot]){game.unequip(slot);notify("A tárgy visszakerült a táskába.")}};
  const selected=game.inventory.find(x=>x.instanceId===selectedItem); const selectedDef=selected?getItem(selected.itemId):null;
  const aggregatedVisible=Array.from(new Map(game.inventory.map(entry=>[entry.itemId, entry])).values()).filter(entry=>{const item=getItem(entry.itemId); return filter==="all" || (filter==="set" && Boolean(item.setId)) || itemCategory(item)===filter || (filter==="quest" && item.questItem);});
  const visibleInventory=aggregatedVisible;
  const stackCount=(itemId:string)=>game.inventory.reduce((sum,e)=>sum+(e.itemId===itemId?1:0),0);
  const consumeSelected = () => { if(!selected) return; const item=selectedDef; const canKnowledge=Boolean(item?.effects?.statBoost); const canHeal=Boolean(item?.effects?.heal || item?.effects?.healPercent); const canTemp=Boolean(item?.effects?.tempStrength || item?.effects?.tempItemStat); if(!item || (!canKnowledge && !canHeal && !canTemp)) { notify("Ezt a tárgyat most nem lehet használni."); return; } const result=game.consumeItem(selected.instanceId); notify(result.message); if(result.success)setSelectedItem(null); };
  return <div className={`inventory-layout ${equipmentOnly?"equipment-only":""}`}>
    {!equipmentOnly&&<div className="bag-panel" onDragOver={e=>e.preventDefault()} onDrop={dropToBag}>
      <div className="panel-head"><h3>Inventory</h3><span>{game.inventory.length} / 80 tárgy</span></div>
      <div className="inventory-filter-row">{INVENTORY_FILTERS.map(([id,label])=><button key={id} className={filter===id?"active":""} onClick={()=>setFilter(id)}>{label}</button>)}</div>
      {filter==="all"&&<div className="inventory-currency-row"><div className="currency-card"><span>🪙</span><div><small>ARANY</small><strong>{game.gold.toLocaleString("hu-HU")}</strong></div></div><div className="currency-card"><span>💎</span><div><small>GYÉMÁNT</small><strong>{game.diamonds.toLocaleString("hu-HU")}</strong></div></div></div>}
      <div className="inventory-status-strip" aria-label="Táska állapota">
        <div className="inventory-status-stat"><span>MEGJELENÍTETT TÍPUSOK</span><strong>{visibleInventory.length}</strong><small>{filter === "all" ? "Minden kategória" : INVENTORY_FILTERS.find(([id]) => id === filter)?.[1] ?? filter}</small></div>
        <div className="inventory-status-stat"><span>FELSZERELVE</span><strong>{slots.filter(slot => Boolean(game.equipment[slot.id])).length}/5</strong><small>aktív felszerelési hely</small></div>
        <div className="inventory-capacity-stat"><div><span>TÁSKA KAPACITÁSA</span><strong>{game.inventory.length} / 80</strong></div><i role="progressbar" aria-label="Táska telítettsége" aria-valuemin={0} aria-valuemax={80} aria-valuenow={Math.min(80, game.inventory.length)}><b style={{ width: `${Math.min(100, (game.inventory.length / 80) * 100)}%` }} /></i><small>{Math.max(0, 80 - game.inventory.length)} szabad hely</small></div>
      </div>
      <div className="item-grid">{visibleInventory.map((entry)=>{const item=getItem(entry.itemId);const count=stackCount(item.id);return <button key={entry.itemId} className={`item-tile rarity-${item.rarity.replace(/\W/g,"").toLowerCase()} ${selectedItem===entry.instanceId?"selected":""}`} draggable onDragStart={e=>dragItem(e,entry.instanceId)} onClick={()=>setSelectedItem(entry.instanceId)} onDoubleClick={()=>{if(item.slot){game.equip(entry.instanceId,item.slot);setSelectedItem(null);notify(`${item.name} felszerelve.`)}}}><ItemHover item={item}/><strong>{item.name}</strong><small>{ITEM_CATEGORY_LABELS[itemCategory(item)] ?? itemCategory(item)} · {item.rarity}</small>{count>1&&<b className="item-stack-count">{count}</b>}</button>})}{Array.from({length:Math.max(0,12-visibleInventory.length)}).map((_,i)=><div className="item-tile empty" key={`empty-${filter}-${i}`}/>)}</div>
      {selectedDef&&<div className="item-detail"><ItemHover item={selectedDef} className="item-detail-icon"/><div><h3>{selectedDef.name}</h3><p>{selectedDef.description}</p><strong>{itemStatsText(selectedDef)}</strong>{(selectedDef.effects?.heal || selectedDef.effects?.healPercent)&&<small className="heal-note">Gyógyítás: {selectedDef.effects?.healPercent ? `+${selectedDef.effects.healPercent}% max életerő` : `+${selectedDef.effects.heal} életerő`}</small>}{selectedDef.effects?.statBoost&&<small className="heal-note">Használat után tartós tudás: {Object.entries(selectedDef.effects.statBoost).map(([k,v])=>`+${v} ${k}`).join(" · ")}</small>}<div className="detail-actions">{(selectedDef.effects?.heal || selectedDef.effects?.healPercent)&&<button className="gold-button" onClick={consumeSelected}>Elfogyasztom</button>}{selectedDef.effects?.statBoost&&<button className="gold-button" onClick={consumeSelected}>Használom</button>}{selectedDef.slot&&<button className="gold-button" onClick={()=>{game.equip(selected!.instanceId,selectedDef.slot!);setSelectedItem(null);notify(`${selectedDef.name} felszerelve.`)}}>Felszerelem</button>}<button className="outline-button" onClick={()=>{const r=game.sell(selected!.instanceId);setSelectedItem(null);notify(r.message)}}>Eladom</button></div></div></div>}
    </div>}
    <div className="paper-doll-panel"><div className="panel-head"><h3>Viselt felszerelés</h3><span>5 hely</span></div><div className="paper-doll">{slots.map(slot=>{const current=game.equipment[slot.id];const item=current?getItem(current.itemId):null;const can=selectedDef?.slot===slot.id;return <button key={slot.id} className={`gear-slot ${can?"ready":""}`} draggable={Boolean(current)} onDragStart={e=>{if(current){e.dataTransfer.setData("text/aimorpg-slot",slot.id)}}} onDragOver={e=>e.preventDefault()} onDrop={e=>dropOnSlot(e,slot.id)} onClick={()=>{if(can&&selected){game.equip(selected.instanceId,slot.id);setSelectedItem(null);notify(`${selectedDef!.name} felszerelve.`)}else if(current){game.unequip(slot.id);notify(`${item!.name} levéve.`)}}}>{item?<ItemHover item={item}/>:<span className="empty-slot-icon">{slot.icon}</span>}<small>{slot.label}</small>{item&&<strong>{item.name}</strong>}</button>})}</div><div className="effective-note">Aktív értékek: Erő {effectiveStats.strength} · Védekezés {effectiveStats.defense} · Ügyesség {effectiveStats.agility} · Kereskedelem {effectiveStats.trade}</div><EquipmentSetPanel equipment={game.equipment}/></div>
  </div>;
}

function EquipmentSetPanel({ equipment }: { equipment: GameState["equipment"] }) {
  const progress = getActiveEquipmentSetProgress(equipment).filter(x => x.count > 0);
  if (!progress.length) return <div className="set-panel empty"><span>RÉGIÓS SZETTEK</span><p>Még nincs viselt szettdarab. Az összeállítások darabonként gyűjthetők.</p></div>;
  return <div className="set-panel"><div className="set-panel-head"><div><span>RÉGIÓS SZETTEK</span><h4>Viselt készletek</h4></div><small>{progress.length} aktív szettkezdemény</small></div>{progress.map(({set,count,activeBonuses})=><div className="set-progress" key={set.id}><div className="set-progress-head"><strong>{set.name}</strong><b>{count}/5</b></div><small>{set.rarity} · {set.region}</small><div className="set-progress-bar"><i style={{width:`${count/5*100}%`}}/></div>{activeBonuses.map(bonus=><div className="set-bonus-active" key={`${set.id}-${bonus.minPieces}`}><span>✓ {bonus.minPieces} darab</span><strong>{bonus.label}</strong></div>)}{activeBonuses.length===0&&<em>{5-count} további darab kell a következő bónuszhoz.</em>}</div>)}</div>;
}

function EquipmentSetCollection({ game }: { game: GameState }) {
  const collection = getEquipmentSetCollectionProgress(game.inventory, game.equipment);
  return <div className="set-collection"><div className="set-panel-head"><div><span>SZETTGYŰJTEMÉNY</span><h4>Régiós készletek</h4></div><small>{collection.filter(x=>x.count===5).length}/{collection.length} teljes készlet</small></div><div className="set-collection-grid">{collection.map(({set,count})=><div className={`set-collection-item ${count===5?"complete":""}`} key={set.id}><div><strong>{set.name}</strong><small>{set.rarity} · {regionName(set.region)}</small></div><b>{count}/5</b><span>{set.rarity==="Közönséges"?"Kereskedői készlet":"Side quest / érdem"}</span></div>)}</div></div>;
}

function questItemCount(game: GameState, itemId?: string){ return itemId ? game.inventory.reduce((sum,x)=>sum+(x.itemId===itemId?1:0),0) : 0; }
function questEffectiveStats(game: GameState){
  return getEffectiveStats(game.baseStats, game.equipment, game.temporaryStatBuffs, game.temporaryItemBuffs);
}
function questRequirementSatisfied(game: GameState, req: any){
  if(req.itemId) return questItemCount(game,req.itemId) >= (req.count ?? 1);
  if(req.gold) return game.gold >= req.gold;
  if(req.reputation) return getReputation(game) >= req.reputation;
  if(req.stat) return (questEffectiveStats(game)[req.stat] ?? 0) >= (req.statMin ?? 0);
  if(req.npcId) return (game.relationships[req.npcId] ?? 0) >= (req.relationMin ?? 0);
  return true;
}
function questRequirementLabel(game: GameState, req: any){
  if(req.itemId){ const item=getItem(req.itemId); const have=questItemCount(game,req.itemId); return `${item.name} ${Math.min(have,req.count??1)}/${req.count??1}`; }
  if(req.gold) return `Arany ${game.gold}/${req.gold}`;
  if(req.reputation) return `Hírnév ${getReputation(game)}/${req.reputation}`;
  if(req.stat){ const effective=questEffectiveStats(game); return `${STAT_DEFINITIONS.find(s=>s.id===req.stat)?.label ?? req.stat} ${effective[req.stat] ?? 0}/${req.statMin ?? 0}`; }
  if(req.npcId) return `${NPCS.find(n=>n.id===req.npcId)?.name ?? req.npcId} ${game.relationships[req.npcId] ?? 0}/${req.relationMin ?? 0}`;
  return req.label;
}

function questState(game: GameState, q: QuestDefinition): "completed" | "active" | "open" | "locked" {
  if (game.questStatus[q.id] === "completed") return "completed";
  if (game.questStatus[q.id] === "active") return "active";
  if (!game.regionAccess[q.region]) return "locked";
  if (q.requires && game.questStatus[q.requires] !== "completed") return "locked";
  if ((q.minReputation ?? 0) > getReputation(game) || (q.entryCost ?? 0) > game.gold) return "locked";
  return "open";
}
function questLockReason(game: GameState, q: QuestDefinition) {
  if (!game.regionAccess[q.region]) return `${regionName(q.region)} még nincs megnyitva.`;
  if (q.requires) {
    const required = QUESTS.find(x => x.id === q.requires);
    if (required && game.questStatus[q.requires] !== "completed") return `Előbb zárd le: ${required.title}.`;
  }
  if ((q.minReputation ?? 0) > getReputation(game)) return `Szükséges hírnév: ${q.minReputation}.`;
  if ((q.entryCost ?? 0) > game.gold) return `Belépési költség: ${q.entryCost} 🪙.`;
  return "A következő lépés még nincs megnyitva.";
}
function Quests({ game, effectiveStats, notify, onQuestNavigate }: { game: GameState; effectiveStats: ReturnType<typeof getEffectiveStats>; notify:(t:string)=>void; onQuestNavigate:(q: QuestDefinition)=>void }) {
  const [openChapter, setOpenChapter] = useState<number | null>(1);
  const chapters = Array.from(new Set(QUESTS.map(q => q.chapter))).map(chapter => {
    const qs = QUESTS.filter(q => q.chapter === chapter).sort((a,b)=>a.sequence-b.sequence);
    return { chapter, region: qs[0].region, qs };
  }).filter(({region,qs}) => game.regionAccess[region] || qs.some(q => game.questStatus[q.id] === "completed"));
  const openNext = QUESTS.find(q => game.regionAccess[q.region] && (questState(game,q) === "active" || questState(game,q) === "open"));
  const completedMainCount = QUESTS.filter(q => game.questStatus[q.id] === "completed").length;
  const activeMainCount = QUESTS.filter(q => game.questStatus[q.id] === "active").length;
  const readyMainCount = QUESTS.filter(q => game.regionAccess[q.region] && questState(game, q) === "open").length;
  const activeSideCount = game.narrativeState.runtime.sideQuests.records.filter(record => record.status === "active").length;
  return <>
    <SectionTitle eyebrow="FŐ TÖRTÉNET · 60 FEJEZETPONT" title="Küldetésháló" text="A Küldetések menüpont a történeted térképe. Minden régió saját főszála külön követhető; a követés a térképen a megfelelő régióhoz, városrészhez és NPC-hez vezet. A valódi interakciók a térképen, az NPC-knél történnek."/>
    <div className="quest-status-overview" aria-label="Küldetésállapotok">
      <div className="quest-status-card quest-status-completed"><span>LEZÁRT FŐKÜLDETÉSEK</span><strong>{completedMainCount}<small> / {QUESTS.length}</small></strong><i><b style={{ width: `${QUESTS.length ? completedMainCount / QUESTS.length * 100 : 0}%` }} /></i><p>A krónikába került történeti pontok.</p></div>
      <div className="quest-status-card quest-status-active"><span>AKTÍV FŐSZÁL</span><strong>{activeMainCount}</strong><p>{activeSideCount} aktív melléktörténet a Dynamic Layerben.</p></div>
      <div className="quest-status-card quest-status-open"><span>ELÉRHETŐ KÖVETKEZŐ PONTOK</span><strong>{readyMainCount}</strong><p>A már megnyitott régiókban felvehető fő történetek.</p></div>
    </div>
    <div className="quest-main-next"><div><span>KÖVETKEZŐ LÉPÉS</span><strong>{openNext?.title ?? "A fő történet minden régióban lezárult."}</strong><p>{openNext ? `${regionName(openNext.region)} · ${npcName(openNext.giver)} · ${openNext.objective}` : "A világ most várja, melyik történetet építed tovább."}</p></div><div className="quest-main-next-stat"><b>{completedMainCount}/{QUESTS.length}</b><span>LEZÁRT FŐ QUEST</span></div></div>
    <div className="main-quest-chapters">{chapters.map(({chapter,region,qs})=>{
      const done=qs.filter(q=>game.questStatus[q.id]==="completed").length;
      const active=qs.find(q=>questState(game,q)==="active");
      const open=qs.find(q=>questState(game,q)==="open");
      const isOpen=openChapter===chapter;
      const progressPct=Math.round(chapterProgress(game,chapter)*100);
      const mastered=chapterIsMastered(game,chapter);
      const gate=regionGateStatus(game, region);
      return <section className={`main-quest-chapter ${isOpen?"open":""} ${game.followedChapter===chapter?"followed":""}`} key={chapter}>
        <div className="main-quest-chapter-head"><button className="main-quest-chapter-toggle" onClick={()=>setOpenChapter(isOpen?null:chapter)}><div className="chapter-index">0{chapter}</div><div><span>{regionName(region)} · FŐTÖRTÉNET</span><h3>{({1:"A lehetőség ára",2:"A fogadások árnya",3:"A mérleg nyelve",4:"A fény ára",5:"A korona vizsgálata",6:"A Fekete Érme tengeri útja"} as Record<number,string>)[chapter]}</h3><p>{done}/{qs.length} lezárva · {progressPct}% · {mastered?"fejezet mesterszinten lezárható":active?`aktív: ${active.title}`:open?`következő: ${open.title}`:gate.unlocked?"nincs aktív következő pont":"régiós kapu még zárva"}</p></div><em>{isOpen?"⌃":"⌄"}</em></button><button className={`chapter-follow-button ${game.followedChapter===chapter?"active":""}`} onClick={()=>{const following=game.followedChapter===chapter;game.followQuestChapter(following?null:chapter);notify(following?"A főszál követése kikapcsolva.":`Követés aktív: ${regionName(region)} · ${({1:"A lehetőség ára",2:"A fogadások árnya",3:"A mérleg nyelve",4:"A fény ára",5:"A korona vizsgálata",6:"A Fekete Érme tengeri útja"} as Record<number,string>)[chapter]}.`);}}>{game.followedChapter===chapter?"✓ Követés":"Követés"}</button></div>
        {!gate.unlocked && <div className="main-quest-lock chapter-gate-lock">🔒 {gate.reason}</div>}
        {isOpen && <div className="main-quest-road">{qs.map(q=>{const state=questState(game,q); const statLabels=q.choices.map(c=>STAT_DEFINITIONS.find(s=>s.id===c.stat)?.label ?? c.stat).join(" · "); return <article key={q.id} className={`main-quest-node ${state}`}>
          <div className="main-quest-node-index">{String(q.sequence).padStart(2,"0")}</div>
          <div className="main-quest-node-copy"><div className="quest-meta"><span>{npcName(q.giver)}</span><span>{state==="completed"?"Lezárva":state==="active"?"Aktív":state==="open"?"Nyitva":"Lezárva"}</span></div><h4>{q.title}</h4><p>{q.summary}</p><small>{q.objective}</small>{q.requirements&&q.requirements.length>0&&<div className="quest-requirements compact">{q.requirements.map((r,i)=><span key={`${q.id}-req-${i}`} className={questRequirementSatisfied(game,r)?"met":"missing"}>{questRequirementLabel(game,r)}</span>)}</div>}{state==="locked"&&<div className="main-quest-lock">🔒 {questLockReason(game,q)}</div>}{state==="active"&&<div className="main-quest-active-note">A térképen keresd fel <b>{npcName(q.giver)}</b>. A küldetés ott folytatható.</div>}{state==="open"&&<div className="main-quest-open-note">Megnyitva. <b>{npcName(q.giver)}</b> helyi adatlapján veheted fel.</div>}{state==="completed"&&<div className="main-quest-complete-note">✓ {q.consequence}</div>}{(()=>{const preview=rewardPreview(q,game.level,game.rewardPity); const goldText=preview.goldMin===preview.goldMax?`${preview.goldMin} arany`:`${preview.goldMin}–${preview.goldMax} arany`; const xpText=preview.xpMin===preview.xpMax?`${preview.xpMin} XP`:`${preview.xpMin}–${preview.xpMax} XP`; const fixedItems=(q.rewards?.items??[]).map(r=>{const it=ITEMS.find(i=>i.id===r.itemId); return it?`${it.name}${r.count>1?` ×${r.count}`:""}`:r.itemId;}); return <div className="quest-reward-preview"><span>JUTALOM</span><div className="quest-reward-values"><b>{goldText}</b><b>{xpText}</b></div><small>{fixedItems.length?`Tárgy: ${fixedItems.join(" · ")}`:"Bónusz zsákmány is érkezhet."}</small></div>})()}</div>
          <div className="main-quest-node-aside"><span>{q.choices[0]?.gold}–{q.choices[2]?.gold} 🪙</span><small>{statLabels}</small><button type="button" className="quest-npc-jump" onClick={() => onQuestNavigate(q)}>⌖ Megkeresem</button></div>
        </article>})}</div>}
      </section>;
    })}</div>
  </>;
}


function SideQuestPanel({ game, notify, onQuestNavigate }: { game: GameState; notify: (t:string)=>void; onQuestNavigate:(region:RegionId,district:string|null)=>void }) {
  const records = game.narrativeState.runtime.sideQuests.records.filter(r => ["offered","active","completed","failed","declined","expired"].includes(r.status));
  const visible = records.slice().sort((a,b)=>Date.parse(b.updatedAt)-Date.parse(a.updatedAt));
  const tracked = visible.find(r=>r.id===game.trackedSideQuestId);
  return <section className="side-quest-panel">
    <div className="side-quest-head"><div><span>MELLÉKTÖRTÉNETEK</span><h2>A város akkor is él, amikor nem a főszálat követed.</h2><p>Az itt megjelenő történetek az NPC-k, kapcsolatok, idő és a világ emlékei alapján születnek. A végső AI később ugyanebből a keretből alkot majd új helyzeteket.</p></div><div className="side-quest-count"><b>{visible.filter(r=>["offered","active"].includes(r.status)).length}</b><small>élő történet</small></div></div>
    {tracked && <div className="side-quest-follow"><span>KÖVETETT MELLÉKTÖRTÉNET</span><strong>{npcName(tracked.blueprint.giver)} · {tracked.blueprint.hook}</strong><button className="outline-button" onClick={()=>game.trackSideQuest(null)}>Követés kikapcsolása</button></div>}
    {visible.length===0 ? <div className="side-quest-empty"><strong>A város csendes.</strong><p>Figyeld az embereket. Amikor valami megváltozik, A Szem jelezhet.</p></div> : <div className="side-quest-list">{visible.map(r=>{const npc=NPCS.find(n=>n.id===r.blueprint.giver); const present=!!npc && game.currentRegion===r.blueprint.region && npcIsPresent(npc,getWorldTime().hour,game.npcStates[npc.id]); return <article className={`side-quest-card ${r.status} ${r.id===game.trackedSideQuestId?"tracked":""}`} key={r.id}>
      <div className="quest-meta"><span>{r.blueprint.scale.toUpperCase()} · {regionName(r.blueprint.region)}</span><span>{r.status==="offered"?"ÚJ":r.status==="active"?"AKTÍV":r.status==="completed"?"MEGOLDVA":r.status==="failed"?"KUDARC · KÖVETKEZMÉNY":r.status==="declined"?"ELUTASÍTVA":"LEJÁRT"}</span></div>
      <h3>{npcName(r.blueprint.giver)}</h3><p>{r.blueprint.hook}</p><small>{r.blueprint.premise}</small><div className="side-quest-objective"><span>CÉL</span><b>{r.blueprint.objective.summary}</b></div>
      <div className="side-quest-actions">{r.status==="offered" && <><button className="gold-button" disabled={!present} onClick={()=>{const res=game.acceptSideQuest(r.id);notify(res.message);}}>{present?"Elfogadom":"Az NPC nincs itt"}</button><button className="outline-button" onClick={()=>{const res=game.declineSideQuest(r.id);notify(res.message);}}>Figyelmen kívül hagyom</button></>}{r.status==="active" && <><button className={`outline-button ${r.id===game.trackedSideQuestId?"active":""}`} onClick={()=>game.trackSideQuest(r.id===game.trackedSideQuestId?null:r.id)}>{r.id===game.trackedSideQuestId?"✓ Követve":"Követem"}</button><button className="outline-button" onClick={()=>onQuestNavigate(r.blueprint.region,r.blueprint.district??null)}>⌖ Megkeresem</button></>}{r.status==="completed"&&<span className="main-quest-complete-note">✓ Ez a történet bekerült az emlékeid közé.</span>}{r.status==="failed"&&<span className="side-quest-failure-note">A megoldási kísérlet félresiklott, de a világ megőrzi a következményét.</span>}</div>
    </article>})}</div>}
  </section>;
}

function Regions({ game, notify, setView, selectedRegion, setSelectedRegion, setLockedRegion, setSelectedNpc, setNpcOverlay, questDestination, clearQuestDestination }: { game:GameState; notify:(t:string)=>void; setView:(v:ViewId)=>void; selectedRegion:string|null; setSelectedRegion:(id:string|null)=>void; setLockedRegion:(id:RegionId|null)=>void; setSelectedNpc:(id:string|null)=>void; setNpcOverlay:(id:string|null)=>void; questDestination: { region: RegionId; district: string | null } | null; clearQuestDestination: () => void }) {
  const [now,setNow]=useState(() => Date.now());
  const [selectedDistrict,setSelectedDistrict]=useState<string|null>(null);
  useEffect(() => { const timer=window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(timer); }, []);
  const worldTime=getWorldTime(now);
  const night=worldTime.phase === "éjszaka";
  const selected=REGIONS.find(r=>r.id===selectedRegion);
  useEffect(() => {
    if (questDestination && selected?.id === questDestination.region) {
      setSelectedDistrict(questDestination.district);
      clearQuestDestination();
    }
  }, [questDestination, selected?.id, clearQuestDestination]);

  if(selected && selected.id === "outskirts") {
    return <OutskirtsWorld game={game} now={now} notify={notify} setView={setView} setSelectedNpc={setSelectedNpc} setNpcOverlay={setNpcOverlay} selectedDistrict={selectedDistrict} setSelectedDistrict={setSelectedDistrict} onBack={()=>setSelectedRegion(null)} />;
  }

  if(selected && selected.id === "market") {
    return <MarketWorld game={game} now={now} notify={notify} setView={setView} setSelectedNpc={setSelectedNpc} setNpcOverlay={setNpcOverlay} selectedDistrict={selectedDistrict} setSelectedDistrict={setSelectedDistrict} onBack={()=>setSelectedRegion(null)} />;
  }

  if(selected && selected.id === "inner") {
    return <InnerWorld game={game} now={now} notify={notify} setView={setView} setSelectedNpc={setSelectedNpc} setNpcOverlay={setNpcOverlay} selectedDistrict={selectedDistrict} setSelectedDistrict={setSelectedDistrict} onBack={()=>setSelectedRegion(null)} />;
  }

  if(selected && (selected.id === "palace" || selected.id === "harbor")) {
    return <LivingRegionWorld region={selected.id} game={game} now={now} notify={notify} setSelectedNpc={setSelectedNpc} setNpcOverlay={setNpcOverlay} selectedDistrict={selectedDistrict} setSelectedDistrict={setSelectedDistrict} onBack={()=>setSelectedRegion(null)} />;
  }

  if(selected && selected.id === "arena") {
    return <ArenaWorld game={game} now={now} notify={notify} setView={setView} setSelectedNpc={setSelectedNpc} setNpcOverlay={setNpcOverlay} selectedDistrict={selectedDistrict} setSelectedDistrict={setSelectedDistrict} onBack={()=>setSelectedRegion(null)} />;
  }

  if(selected){
    const art=REGION_ART[selected.id]??"/assets/capital-map.webp";
    const npcs=NPCS.filter(n=>n.region===selected.id);
    return <div className="region-place"><div className={`place-hero ${night ? "night-scene" : ""}`} style={{backgroundImage:`url('${art}')`}}><div className="place-overlay"/><button className="back-map" onClick={()=>setSelectedRegion(null)}>← Vissza a várostérképhez</button><div className="place-title"><span>{game.regionAccess[selected.id]?"VÁROSRÉSZ":"ISMERETLEN TERÜLET"}</span><h1>{selected.name}</h1><p>{selected.description}</p></div><div className="place-time"><strong>{worldTime.label}</strong><span>{worldTime.phase} · szerveridő</span></div></div>{game.regionAccess[selected.id]?<div className="place-body"><section className="place-info"><div className="place-facts"><div><span>MEGÉLHETÉS</span><b>{selected.id==="inner"||selected.id==="palace"?"Nagyon drága":"Megfizethető"}</b></div><div><span>LAKÓK</span><b>{npcs.length}</b></div><div><span>HELYZETED</span><b>{game.currentRegion===selected.id?"Itt tartózkodsz":"Elérhető"}</b></div></div><p>{selected.id==="market"?"A főváros pénze itt mozog a leggyorsabban. Aki itt él, a piac szabályait tanulja meg először.":selected.id==="arena"?"A kőfalakon belül a hírnév gyorsabban nő, de a vereségnek is hangja van.":selected.id==="palace"?"A palota folyosóin minden mosoly mögött érdek húzódik.":selected.id==="harbor"?"A kikötőben a város törvényei és a tenger törvényei találkoznak.":"A negyed saját ritmusban él. A Szem szerint itt érdemes elkezdened."}</p><button className="gold-button" disabled={game.currentRegion===selected.id} onClick={()=>{game.travel(selected.id);notify(`Megérkeztél: ${selected.name}.`)}}>{game.currentRegion===selected.id?"Jelenlegi tartózkodási hely":"Ide utazom"}</button></section><aside className="place-people"><h3>Akiket itt megtalálsz</h3>{npcs.length?npcs.map(n=><button key={n.id} onClick={()=>{setSelectedNpc(n.id);setNpcOverlay(n.id);}}><span className="place-person-avatar"><SafeArtImage src={npcAvatar(n)} alt={n.name} /></span><div><b>{n.name}</b><small>{n.role} · {npcScheduleLabel(n)}</small></div></button>):<p>Még nincs ismert kiemelt polgár ezen a helyen.</p>}</aside></div>:<div className="locked-place"><h2>Az út még ködben van.</h2><p>{selected.lockText}</p><div>Ez a hely már szerepel a királyság térképén, de a történet még nem nyitotta meg.</div></div>}</div>}
  const interactiveRegions = ["outskirts", "market", "arena", "inner", "palace", "harbor", "forest"];
  const currentRegion = REGIONS.find(r => r.id === game.currentRegion);
  const visibleNpcs = NPCS.filter(n => n.region === game.currentRegion && npcIsPresent(n, worldTime.hour, game.npcStates[n.id]));
  const activeQuestCount = Object.values(game.questStatus).filter(status => status === "active").length;
  const tracked = trackedStoryNpc(game);
  const heroTrackedQuest = trackedMainQuest(game);
  const heroHealthMax = maxHealth(game);
  const heroHealth = Math.min(heroHealthMax, Math.max(0, game.health));
  const heroHealthPercent = heroHealthMax > 0 ? (heroHealth / heroHealthMax) * 100 : 0;
  const heroAvatar = AVATARS.find((a) => a.id === game.avatarId)?.src ?? AVATARS[0].src;
  return <div className="world-map-page capital-world-map">
    <SectionTitle eyebrow={`A KIRÁLYSÁG TÉRKÉPE · ${worldTime.year}. ÉV`} title="Fekete Érme · Főváros" text="A város nem díszlet: minden út, találkozás és lezárt kapu a világ állapotához kötődik." action={<div className="world-time-badge"><span>{night?"☾":"☀"}</span><b>{worldTime.shortLabel}</b><em>{worldTime.phase}</em></div>}/>
    <section className="capital-world-hero" aria-label="A főváros panorámája" data-region={game.currentRegion}>
      <div className="capital-world-hero-art" aria-hidden="true" />
      <div className="capital-world-hero-shade" aria-hidden="true" />
      <div className="capital-world-hero-copy">
        <span className="capital-world-hero-kicker">A KIRÁLYSÁG LÉLEGZŐ VILÁGA · {worldTime.year}. ÉV</span>
        <h2>A város nem díszlet.</h2>
        <p>{currentRegion ? `${currentRegion.name} az aktuális tartózkodási helyed. ${currentRegion.description}` : "Aranthel útjai, kapui és kapcsolatai a világ pillanatnyi állapotához igazodnak."}</p>
        <div className="capital-world-hero-status" aria-label="Aktuális világállapot">
          <span><small>JELENLEGI HELY</small><b>{currentRegion?.name ?? regionName(game.currentRegion)}</b></span>
          <span><small>VILÁGIDŐ</small><b>{worldTime.shortLabel} · {worldTime.phase}</b></span>
          <span><small>JELEN LÉVŐ NPC-K</small><b>{visibleNpcs.length}</b></span>
        </div>
        <div className="capital-world-hero-actions">
          <button className="gold-button" onClick={() => setSelectedRegion(game.currentRegion)} disabled={!game.regionAccess[game.currentRegion as keyof typeof game.regionAccess]}>Jelenlegi hely részletei</button>
          <button className="outline-button" onClick={() => setView("quests")}>Küldetésnapló megnyitása</button>
        </div>
      </div>
      <aside className="capital-world-player-card" aria-label="Karakter gyorsállapot">
        <div className="capital-world-player-head">
          <SafeArtImage src={heroAvatar} alt={game.name} className="capital-world-player-avatar" />
          <div><strong>{game.name}</strong><span>{game.level}. szint · {currentRegion?.name ?? regionName(game.currentRegion)}</span></div>
          <b className="capital-world-player-level">{game.level}</b>
        </div>
        <div className="capital-world-player-health">
          <div><span>ÉLETERŐ</span><strong>{heroHealth} / {heroHealthMax}</strong></div>
          <i><b style={{ width: `${heroHealthPercent}%` }} /></i>
        </div>
        <div className="capital-world-player-resources">
          <span><i aria-hidden="true">◉</i> {game.gold.toLocaleString("hu-HU")} <small>ARANY</small></span>
          <span><i aria-hidden="true">✧</i> {game.diamonds.toLocaleString("hu-HU")} <small>GYÉMÁNT</small></span>
        </div>
        <button className="capital-world-player-quest" onClick={() => setView("quests")} aria-label="Küldetésnapló megnyitása">
          <small>{heroTrackedQuest ? "KÖVETETT KÜLDETÉS" : "KÜLDETÉSNAPLÓ"}</small>
          <strong>{heroTrackedQuest?.title ?? "Aktív történetek"}</strong>
          <span>{heroTrackedQuest ? regionName(heroTrackedQuest.region) : "Tekintsd át a történet állapotát"} <b aria-hidden="true">›</b></span>
        </button>
      </aside>
      <div className="capital-world-hero-seal"><EyeEntity mode="compact" label="A Szem figyeli a térképet"/><span>A SZEM FIGYEL</span></div>
    </section>
    <nav className="capital-command-rail" aria-label="Gyorselérés a játék moduljaihoz">
      <div className="capital-command-rail-heading"><span>GYORS ELÉRÉS</span><small>A világ ugyanazt az állapotot használja minden modulban</small></div>
      <div className="capital-command-grid">
        {([
          { id: "character", icon: "♙", label: "Karakter", value: `${game.level}. szint`, detail: "Profil és statisztikák" },
          { id: "inventory", icon: "▦", label: "Inventory", value: `${game.inventory.length}/80`, detail: "Tárgyak és felszerelés" },
          { id: "quests", icon: "✦", label: "Küldetések", value: `${activeQuestCount} aktív`, detail: "Követés és előrehaladás" },
          { id: "npcs", icon: "♟", label: "Névjegyzék", value: `${visibleNpcs.length} jelen`, detail: "Elérhető helyi emberek" },
          { id: "market", icon: "◫", label: "Piac", value: `${game.gold.toLocaleString("hu-HU")} arany`, detail: "Helyi készlet és ajánlatok" },
          { id: "chronicle", icon: "☷", label: "Krónika", value: `${game.journal.length} bejegyzés`, detail: "A világ emlékezete" },
          { id: "gm", icon: "✧", label: "A Szem", value: `${game.gmMessages.filter(message => !message.seen).length} új jelzés`, detail: "Megfigyelések és naptár" },
        ] as { id: ViewId; icon: string; label: string; value: string; detail: string }[]).map(item => <button type="button" key={item.id} className="capital-command-card" onClick={() => setView(item.id)} aria-label={`${item.label} megnyitása. ${item.value}`}>
          <span className="capital-command-icon" aria-hidden="true">{item.id === "gm" ? <EyeMark /> : item.icon}</span>
          <span className="capital-command-copy"><strong>{item.label}</strong><small>{item.detail}</small></span>
          <span className="capital-command-value">{item.value}</span>
          <span className="capital-command-arrow" aria-hidden="true">›</span>
        </button>)}
      </div>
    </nav>
    <div className="capital-map-layout"><div className={`map-stage ${night?"map-night":""}`}>
      <img className="map-bg-image" src="/assets/world/world-chart.webp" alt="A királyság illusztrált, szöveg nélküli térképe"/><div className="map-vignette"/>
      <div className="capital-map-stamp"><span>FELTÁRT VILÁG</span><strong>ARANTHEL</strong><small>{worldTime.phase} · {worldTime.shortLabel}</small></div>
      {interactiveRegions.map((id)=>{const r=REGIONS.find(x=>x.id===id)!;const open=!!game.regionAccess[id as keyof typeof game.regionAccess];const isCurrent=game.currentRegion===id;const isTracked=trackedStoryRegion(game)===id;return <button key={id} className={`map-hotspot ${!open?"locked":""} ${isCurrent?"current-location":""} ${isTracked?"quest-target-region":""}`} style={REGION_COORDS[id]} onClick={()=>{if(open)setSelectedRegion(id); else setLockedRegion(id as RegionId)}} title={open?(isCurrent?`${r.name} · jelenlegi helyed`:isTracked?`Követett történet · ${r.name}`:r.name):`${r.name} — ${r.lockText??"Régió még nem elérhető"}`} aria-label={open?`${r.name}${isCurrent?", jelenlegi helyed":""}${isTracked?", követett történet célpontja":""}`:`${r.name} — lezárva`}><img className="map-hotspot-art" src={REGION_ART[id]} alt="" draggable={false} loading="lazy" decoding="async"/><span className="map-hotspot-label"><i>{isCurrent?"●":!open?"⌑":isTracked?"✦":"✧"}</i>{r.name}{isCurrent?<small>ITT VAGY</small>:!open?<small>LEZÁRVA</small>:isTracked?<small>TÖRTÉNETI CÉLPONT</small>:null}</span></button>})}
      {trackedStorySideQuest(game)?.blueprint.region && <div className="quest-map-target-note"><span>MELLÉKTÖRTÉNET · KÖVETKEZŐ ÁLLOMÁS</span><strong>{regionName(trackedStorySideQuest(game)!.blueprint.region)}</strong><small>A követett történet célpontja. Az utazásról te döntesz.</small></div>}
      {!trackedStorySideQuest(game) && trackedMainQuest(game)?.region && <div className="quest-map-target-note"><span>FŐ KÜLDETÉS · KÖVETKEZŐ ÁLLOMÁS</span><strong>{regionName(trackedMainQuest(game)!.region)}</strong><small>{regionGateStatus(game,trackedMainQuest(game)!.region).unlocked?"Válaszd ki a térképen, ha folytatni szeretnéd.":`Lezárva: ${regionGateStatus(game,trackedMainQuest(game)!.region).reason}`}</small></div>}
      <div className="map-eye" title="A Szem figyeli a várost."><EyeEntity mode="compact" label="A Szem figyeli a várost"/></div>
    </div>
    <aside className="capital-map-sidebar"><div className="capital-current-place"><span className="capital-panel-kicker">JELENLEGI TARTÓZKODÁSI HELY</span><h3>{currentRegion?.name??regionName(game.currentRegion)}</h3><p>{currentRegion?.description??"A világ állapota alapján nyilvántartott helyed."}</p><div className="capital-state-line"><span>Világidő</span><strong>{worldTime.shortLabel} · {worldTime.phase}</strong></div><div className="capital-state-line"><span>Jelen lévő ismert NPC-k</span><strong>{visibleNpcs.length}</strong></div>{tracked&&<div className="capital-tracked"><small>KÖVETETT TÖRTÉNET</small><b>{tracked.name}</b><span>{tracked.district??tracked.region}</span></div>}</div>
      <div className="capital-place-list"><div className="capital-list-heading"><span>VÁROSRÉSZEK</span><small>{interactiveRegions.filter(id=>game.regionAccess[id as keyof typeof game.regionAccess]).length} / {interactiveRegions.length} elérhető</small></div>{interactiveRegions.map(id=>{const r=REGIONS.find(x=>x.id===id)!;const open=!!game.regionAccess[id as keyof typeof game.regionAccess];return <button key={`capital-list-${id}`} className={`capital-place-row ${!open?"locked":""} ${game.currentRegion===id?"current":""}`} onClick={()=>{if(open)setSelectedRegion(id);else setLockedRegion(id as RegionId)}}><span className="capital-place-icon"><img src={REGION_ART[id]} alt="" loading="lazy" decoding="async"/><i>{r.icon}</i></span><span className="capital-place-copy"><b>{r.name}</b><small>{game.currentRegion===id?"Jelenlegi helyed":open?"Megtekintés és utazási lehetőségek":"Lezárva · történeti feltétel"}</small></span><span className="capital-place-arrow">{open?"›":"⌑"}</span></button>})}</div>
      <div className="capital-map-legend"><span><i className="legend-current"/> Itt vagy</span><span><i className="legend-quest"/> Követett célpont</span><span><i className="legend-locked"/> Lezárt terület</span></div>
    </aside></div>
    <div className="map-hint">Válassz egy <strong>városrészt</strong> a térképen vagy a listából. A kiválasztás megnyitja a helyszínt; utazás csak a helyszín felületén, külön megerősített művelettel történik.</div>
  </div>;
}

function MarketWorld({ game, now, notify, setView, setSelectedNpc, setNpcOverlay, selectedDistrict, setSelectedDistrict, onBack }: { game: GameState; now:number; notify:(t:string)=>void; setView:(v:ViewId)=>void; setSelectedNpc:(id:string|null)=>void; setNpcOverlay:(id:string|null)=>void; selectedDistrict:string|null; setSelectedDistrict:(id:string|null)=>void; onBack:()=>void }) {
  const time=getWorldTime(now);
  const districts=REGION_DISTRICTS.filter(d=>d.region==="market");
  const district=districts.find(d=>d.id===selectedDistrict)??null;
  const phase:Record<typeof time.phase,string>={éjszaka:"A trezorok zárva, de az üzlet nem alszik",hajnal:"A szállítmányok érkeznek",délelőtt:"Az árak kialakulnak",délután:"A nagy alkuk ideje",alkonyat:"A könyvek záródnak, a titkok nyílnak"};
  const rhythm=time.hour<6?"Éjszakai őrség és késői rakodás":time.hour<10?"Nyitás, érkező árumozgás és első árfolyamok":time.hour<15?"Alkudozás, céhes ügyek és szerződések":time.hour<19?"Nagy tételek, karavánok és elszámolások":"Zárás, késői üzletek és háttéralkuk";
  const marketPlaces:Record<string,string[]>={exchangeSquare:["Központi Mérlegcsarnok","Királyi Letétház","Ezüstablak","Nyílt ajánlati kör"],caravanYard:["Karavánkapu","Indulási tábla","Rakodósor","Állatállások"],guildRow:["Céhesor","Selyemfolyosó","Engedélyhivatal","Mesterjegyek terme"],warehouseRing:["Keleti Raktárkapu","Hetedik kapu","Pecsétkamra","Leltártorony"]};
  const rumors:Record<string,string[]>={exchangeSquare:["Valaki nagy mennyiségben vásárol régi ezüstöt, de nem jelenik meg személyesen.","Cassian egy olyan letétet zárolt, amelynek nincs hivatalos tulajdonosa."],caravanYard:["Egy északi karaván egy ládával kevesebbet jelentett be, mint amennyivel elindult.","Fen szerint egy útvonalon most túl sokan kérnek fegyveres kíséretet."],guildRow:["Egy céhes pecsétet olyan szerződésen találtak, amelyet a céh állítólag sosem látott.","Niven este után olyan árut mutat, amely nappal nem létezik."],warehouseRing:["A Hetedik kapu pecsétje háromszor változott egyetlen héten.","Oris egy hiányzó láda miatt már második napja nem alszik."]};
  if(district){
    const people=district.npcIds.map(id=>NPCS.find(n=>n.id===id)).filter(Boolean) as typeof NPCS;
    return <div className="market-world market-detail" data-region="market"><div className="market-detail-hero" style={{backgroundImage:`url('${districtArtFor(district.id,district.art)}')`}}><div className="market-detail-overlay"/><button className="back-map" onClick={()=>setSelectedDistrict(null)}>← Vissza a Kereskedelmi Központba</button><button className="outskirts-back-city" onClick={onBack}>↩ Fővárostérkép</button><div className="market-detail-copy"><span>KERESKEDELMI KÖZPONT · {district.theme.toUpperCase()}</span><h1>{district.name}</h1><h2>{district.title}</h2><p>{district.description}</p></div><div className="outskirts-clock-chip"><strong>{time.label}</strong><span>{phase[time.phase]}</span></div></div><div className="district-deep-grid"><section className="district-story-card market-card"><span>A PIAC KÉRDÉSE</span><h3>{district.id==="exchangeSquare"?"Mennyit ér valójában, amit kínálsz?":district.id==="caravanYard"?"Mekkora kockázatot vállalsz egy gyorsabb útért?":district.id==="guildRow"?"Ki írja a szabályokat, amikor mindenki fizet értük?":"Ki felel azért, ami papíron sosem létezett?"}</h3><p>{district.description}</p><div className="district-fact-list"><div><small>GAZDASÁGI RITMUS</small><strong>{rhythm}</strong></div><div><small>JÁTÉKELMÉLET</small><strong>{district.id==="exchangeSquare"?"Az információ és a hitel is valuta.":district.id==="caravanYard"?"A logisztika később új világokat nyit meg.":district.id==="guildRow"?"A befolyás engedélyeket és kizárásokat teremt.":"A készlet és a bizonyíték ugyanannak a rendszernek két oldala."}</strong></div></div></section><section className="district-list-card"><span>FONTOS HELYEK</span>{Array.from(new Set([district.landmark,...marketPlaces[district.id]])).filter(Boolean).map((x,i)=><div className="district-list-row" key={`market-place-${district.id}-${i}-${x}`}><b>✦</b><span>{x}</span></div>)}</section><section className="district-list-card"><span>AMIRŐL MOST BESZÉLNEK</span>{rumors[district.id].map(x=><div className="district-list-row rumor" key={x}><b>◇</b><span>{x}</span></div>)}</section><section className="district-people-card"><span>A KÖZPONT EMBEREI · {people.length} KAPCSOLAT</span>{people.map(n=>{const active=n.startHour===undefined||n.endHour===undefined?true:(n.startHour<=n.endHour?time.hour>=n.startHour&&time.hour<n.endHour:time.hour>=n.startHour||time.hour<n.endHour);return <button key={n.id} className={`${active?"npc-present":"npc-away"} ${isTrackedNpc(game,n.id)?"quest-tracked-npc":""}`} onClick={()=>{setSelectedNpc(n.id);setNpcOverlay(n.id)}}><span className="place-person-avatar"><SafeArtImage src={npcAvatar(n)} alt={n.name}/></span><div><strong>{n.name}</strong><small>{n.role} · {npcScheduleLabel(n)} · {n.location??district.name}</small><em>{active?"Most itt van":"Most máshol van"}</em></div><b>{n.service??"Kapcsolat"}</b></button>})}</section></div><div className="district-footer"><div><span>KERESKEDELMI VILÁGIDŐ</span><strong>{time.shortLabel}</strong></div><div><span>JELENLEGI PIACI RITMUS</span><strong>{rhythm}</strong></div><button className="gold-button" disabled={game.currentRegion==="market"} onClick={()=>{game.travel("market");notify("A Kereskedelmi Központ lett a tartózkodási helyed.")}}>{game.currentRegion==="market"?"Itt tartózkodsz":"Ide utazom"}</button></div></div>;
  }
  return <div className="market-world" data-region="market"><div className="market-hero"><div className="market-hero-art"/><div className="market-hero-overlay"/><button className="back-map outskirts-map-back" onClick={onBack}>← Vissza a fővárostérképhez</button><div className="market-hero-copy"><span>KERESKEDELMI KÖZPONT · A VÁROS VÉRKERINGÉSE</span><h1>Négy negyed. Mindennek ára van.</h1><p>Itt nem csak árut cserélnek. Hitel, bizalom, információ, engedély és kockázat is gazdát cserél. Aki itt megtanul kereskedni, később egész útvonalakat mozgathat.</p><div className="outskirts-hero-actions"><button className="gold-button" disabled={game.currentRegion==="market"} onClick={()=>{game.travel("market");notify("Megérkeztél a Kereskedelmi Központba.")}}>{game.currentRegion==="market"?"Jelenleg itt vagy":"Belépek a Központba"}</button><span><b>{time.label}</b><small>{phase[time.phase]} · az áraknak is van napszakuk</small></span></div></div><div className="market-eye-note"><img src="/assets/eye-emblem-v2.webp" alt=""/><div><span>A SZEM</span><strong>Nem azt figyeli, ki mennyit keres. Hanem azt, miből.</strong></div></div></div><section className="outskirts-livebar market-livebar"><div><span>VILÁGIDŐ</span><strong>{time.shortLabel}</strong><small>{phase[time.phase]}</small></div><div><span>PIACI RITMUS</span><strong>{rhythm}</strong><small>Az árak, emberek és szállítmányok másképp mozognak a nap során.</small></div><div><span>FELFEDEZÉS</span><strong>{districts.length} negyed · {NPCS.filter(n=>n.region==="market").length} kapcsolat</strong><small>Bankárok, árusok, céhek és raktári emberek.</small></div><div className="live-pulse"><i/><strong>ÉLŐ GAZDASÁG</strong></div></section><div className="outskirts-heading"><div><span>A KERESKEDELMI KÖZPONT TÉRKÉPE</span><h2>Válassz egy negyedet. Ismerd meg, mi mozgatja.</h2></div><p>A piac csak a felszín. Mögötte útvonalak, hitelek, céhes szabályok, pecsétek és olyan emberek vannak, akik pontosan tudják, hol áll meg a pénz.</p></div><section className="district-grid market-district-grid">{districts.map((d,index)=><button key={d.id} className={`district-card market-district-card ${isTrackedDistrict(game,d.id)?"quest-tracked-district":""}`} style={{["--accent" as string]:["#c59a55","#7f8d70","#8b6b9b","#65798a"][index]}} onClick={()=>setSelectedDistrict(d.id)}><div className="district-card-art" style={{backgroundImage:`url('${districtArtFor(d.id,d.art)}')`}}/><div className="district-card-shade"/><div className="district-card-index">0{index+1}</div><div className="district-card-copy"><span>{d.theme}</span><h3>{d.name}</h3><p>{d.description}</p><strong>{d.npcIds.length} élő kapcsolat · Belépek a negyedbe →</strong></div><div className="district-card-glow"/></button>)}</section><section className="outskirts-pulse market-pulse"><div className="pulse-head"><span>A KÖZPONT MOST</span><h3>{phase[time.phase]}</h3><p>Hajnalban a rakomány érkezik, délelőtt az árak alakulnak, délután a nagy üzletek köttetnek. Éjjel csak azok dolgoznak tovább, akiknek okuk van rá.</p></div></section></div>;
}

function InnerWorld({ game, now, notify, setView, setSelectedNpc, setNpcOverlay, selectedDistrict, setSelectedDistrict, onBack }: { game: GameState; now:number; notify:(t:string)=>void; setView:(v:ViewId)=>void; setSelectedNpc:(id:string|null)=>void; setNpcOverlay:(id:string|null)=>void; selectedDistrict:string|null; setSelectedDistrict:(id:string|null)=>void; onBack:()=>void }) {
  const time=getWorldTime(now);
  const districts=REGION_DISTRICTS.filter(d=>d.region==="inner");
  const district=districts.find(d=>d.id===selectedDistrict)??null;
  const phase:Record<typeof time.phase,string>={éjszaka:"A zárt ajtók ideje",hajnal:"A Belváros elcsendesül",délelőtt:"Üzlet és intézés",délután:"Kapcsolatok és találkozók",alkonyat:"A társasági élet felébred"};
  const rhythm=time.hour<7?"Csend, őrség és távozó vendégek":time.hour<12?"Üzletek, bankok és intézendő ügyek":time.hour<17?"Találkozók, szerződések és meghívások":time.hour<22?"Szalonok, vacsorák és játéktermek":"Privát asztalok, késői alkuk és zárt klubok";
  const places:Record<string,string[]>={goldenPromenade:["Aranyoroszlán Ház","Csendes Kávéház","Mesterek Szabósora","Meghívások Kapuja"],velvetSalon:["Bíbor Szalon","Fekete Lámpás Klub","Téli Terem","Zárt Zeneszalon"],ivoryArcade:["Elefántcsont Játéktermek","Kockaterem","Háromlapos Asztal","Magánszalon"],ledgerCourt:["Kék Könyvház","Fedezeti Kamra","Ügyvédek Folyosója","Aláírások Terme"],patronsQuarter:["Rell Galéria","Zárt Aukciós Ház","Mecénások Kertje","Különleges Megbízások Szalonja"]};
  const rumors:Record<string,string[]>={goldenPromenade:["Valaki hamis meghívóval jutott be egy vacsorára.","Egy új vendég egyetlen este alatt túl sok fontos nevet ismert meg."],velvetSalon:["Selene állítólag két régi ellenséget ültetett ugyanahhoz az asztalhoz.","A Fekete Lámpásban ma este nincs hivatalos vendéglista."],ivoryArcade:["Egy kereskedő tegnap éjjel egy teljes karaván árát hagyta az asztalon.","Marcell szerint valaki túl gyakran nyer ugyanazzal a kockával."],ledgerCourt:["Egy fedezet nélküli hitelhez mégis királyi pecsét került.","Livia egy régi adósságot keres, amelynek papíron már nem szabadna léteznie."],patronsQuarter:["Octavia egy ismeretlen műtárgyra licitál, amelyet senki sem látott nyilvánosan.","Egy mecénás új embert keres egy olyan munkára, amelyről nem beszélhetnek nyíltan."]};
  if(district){
    const people=district.npcIds.map(id=>NPCS.find(n=>n.id===id)).filter(Boolean) as typeof NPCS;
    return <div className="inner-world inner-detail" data-region="inner"><div className="inner-detail-hero" style={{backgroundImage:`url('${districtArtFor(district.id,district.art)}')`}}><div className="inner-detail-overlay"/><button className="back-map" onClick={()=>setSelectedDistrict(null)}>← Vissza a Belváros szívébe</button><button className="outskirts-back-city" onClick={onBack}>↩ Fővárostérkép</button><div className="inner-detail-copy"><span>BELVÁROS · {district.theme.toUpperCase()}</span><h1>{district.name}</h1><h2>{district.title}</h2><p>{district.description}</p></div><div className="outskirts-clock-chip"><strong>{time.label}</strong><span>{phase[time.phase]}</span></div></div><div className="district-deep-grid"><section className="district-story-card inner-card"><span>A BELVÁROS KÉRDÉSE</span><h3>{district.id==="goldenPromenade"?"Ki vagy, amikor már mindenki látja, hogy van mit veszítened?":district.id==="velvetSalon"?"Mennyit ér egy meghívás, ha mögötte egy szívesség vár?":district.id==="ivoryArcade"?"Mennyit mersz kockára tenni azért, hogy többet nyerj?":district.id==="ledgerCourt"?"Kié vagy valójában, ha a vagyonod nagyobb része csak ígéret?":"Lehet-e támogatást elfogadni anélkül, hogy tartoznál érte?"}</h3><p>{district.description}</p><div className="district-fact-list"><div><small>TÁRSADALMI RITMUS</small><strong>{rhythm}</strong></div><div><small>JÁTÉKELMÉLET</small><strong>{district.id==="ivoryArcade"?"A kockázat itt tartalékokat, kapcsolatokat és történeteket emészthet fel.":district.id==="velvetSalon"?"A társasági háló később ugyanannyit érhet, mint a harci erő.":"A vagyon új lehetőségeket nyit, de új függőségeket is teremt."}</strong></div></div></section><section className="district-list-card"><span>FONTOS HELYEK</span>{Array.from(new Set([district.landmark,...places[district.id]])).filter(Boolean).map((x,i)=><div className="district-list-row" key={`inner-place-${district.id}-${i}-${x}`}><b>✦</b><span>{x}</span></div>)}</section><section className="district-list-card"><span>AMIRŐL MOST BESZÉLNEK</span>{rumors[district.id].map((x,i)=><div className="district-list-row rumor" key={`inner-rumor-${district.id}-${i}`}><b>◇</b><span>{x}</span></div>)}</section><section className="district-people-card"><span>A BELVÁROS EMBEREI · {people.length} KAPCSOLAT</span>{people.map(n=>{const active=npcIsPresent(n,time.hour);return <button key={n.id} className={`${active?"npc-present":"npc-away"} ${isTrackedNpc(game,n.id)?"quest-tracked-npc":""}`} onClick={()=>{setSelectedNpc(n.id);setNpcOverlay(n.id)}}><span className="place-person-avatar"><SafeArtImage src={npcAvatar(n)} alt={n.name}/></span><div><strong>{n.name}</strong><small>{n.role} · {npcScheduleLabel(n)} · {n.location??district.name}</small><em>{active?"Most itt van":"Jelenleg máshol van"}</em></div><b>{n.service??"Kapcsolat"}</b></button>})}</section></div><div className="district-footer"><div><span>BELVÁROSI VILÁGIDŐ</span><strong>{time.shortLabel}</strong></div><div><span>JELENLEGI RITMUS</span><strong>{rhythm}</strong></div><button className="gold-button" disabled={game.currentRegion==="inner"} onClick={()=>{game.travel("inner");notify("Megérkeztél a Belvárosba. Itt minden kapcsolatnak ára van.")}}>{game.currentRegion==="inner"?"Itt tartózkodsz":"Ide utazom"}</button></div></div>;
  }
  return <div className="inner-world" data-region="inner"><div className="inner-hero"><div className="inner-hero-art"/><div className="inner-hero-overlay"/><button className="back-map outskirts-map-back" onClick={onBack}>← Vissza a fővárostérképhez</button><div className="inner-hero-copy"><span>BELVÁROS · A LEHETŐSÉGEK ÁRA</span><h1>Öt negyed. Egy magasabb élet — és több, amit elveszíthetsz.</h1><p>Aki a Külvárosban megvetette a lábát, az Arénában bizonyított vagy a piacokon vagyont épített, ide léphet tovább. A Belváros nem adja ingyen a kényelmet: itt meghívások, játéktermek, szalonok, hitelek és olyan kapcsolatok várnak, amelyek a jövődet is átírhatják.</p><div className="outskirts-hero-actions"><button className="gold-button" disabled={game.currentRegion==="inner"} onClick={()=>{game.travel("inner");notify("Beléptél a Belvárosba. Itt a neveddel együtt a vagyonodat is figyelik.")}}>{game.currentRegion==="inner"?"Jelenleg itt vagy":"Belépek a Belvárosba"}</button><span><b>{time.label}</b><small>{phase[time.phase]} · itt az este különösen sok ajtót nyit</small></span></div></div><div className="inner-eye-note"><img src="/assets/eye-emblem-v2.webp" alt=""/><div><span>A SZEM</span><strong>A vagyon megváltoztatja, kik akarnak közel kerülni hozzád.</strong></div></div></div><section className="outskirts-livebar inner-livebar"><div><span>VILÁGIDŐ</span><strong>{time.shortLabel}</strong><small>{phase[time.phase]}</small></div><div><span>BELVÁROSI RITMUS</span><strong>{rhythm}</strong><small>A hivatalos nappal és a privát éjszaka két külön várost mutat.</small></div><div><span>FELFEDEZÉS</span><strong>{districts.length} negyed · {NPCS.filter(n=>n.region==="inner").length} kapcsolat</strong><small>Házigazdák, bankárok, mecénások és a szórakozás emberei.</small></div><div className="live-pulse"><i/><strong>ÉLŐ TÁRSADALOM</strong></div></section><div className="outskirts-heading"><div><span>A BELVÁROS TÉRKÉPE</span><h2>Ahol a felemelkedés után kezdődik a valódi választás.</h2></div><p>Itt már nem az a kérdés, be tudsz-e jutni. Az a kérdés, kivel ülsz egy asztalhoz, mire költöd a vagyonodat, és milyen tartozást vállalsz a következő lehetőségért.</p></div><section className="district-grid inner-district-grid">{districts.map((d,index)=><button key={d.id} className={`district-card inner-district-card ${isTrackedDistrict(game,d.id)?"quest-tracked-district":""}`} style={{["--accent" as string]:["#b79a62","#8d5a74","#a78350","#58758a","#765a8b"][index]}} onClick={()=>setSelectedDistrict(d.id)}><div className="district-card-art" style={{backgroundImage:`url('${districtArtFor(d.id,d.art)}')`}}/><div className="district-card-shade"/><div className="district-card-index">0{index+1}</div><div className="district-card-copy"><span>{d.theme}</span><h3>{d.name}</h3><p>{d.description}</p><strong>{d.npcIds.length} élő kapcsolat · Belépek a negyedbe →</strong></div><div className="district-card-glow"/></button>)}</section></div>;
}


function LivingRegionWorld({ region, game, now, notify, setSelectedNpc, setNpcOverlay, selectedDistrict, setSelectedDistrict, onBack }: { region:"palace"|"harbor"; game:GameState; now:number; notify:(t:string)=>void; setSelectedNpc:(id:string|null)=>void; setNpcOverlay:(id:string|null)=>void; selectedDistrict:string|null; setSelectedDistrict:(id:string|null)=>void; onBack:()=>void }) {
  const time=getWorldTime(now);
  const districts=REGION_DISTRICTS.filter(d=>d.region===region);
  const district=districts.find(d=>d.id===selectedDistrict)??null;
  const cfg=region==="palace"?{
    name:"KIRÁLYI PALOTA", eyebrow:"A HATALOM ÁRNYÉKA", title:"Négy udvar. Egy korona. Végtelen érdek.",
    intro:"A Belvárosból idáig már nem elég vagyonnal megérkezni. Meghívás, bizalom és olyan kapcsolatok kellenek, amelyeknek súlya van. A palota minden folyosója döntésekhez vezet — csak nem mindig a tiédhez.",
    question:"Ki irányít valójában, amikor a korona hallgat?", rhythm: time.hour<7?"Őrség és titkos jelentések":time.hour<12?"Audienciák és hivatalos ügyek":time.hour<17?"Tárgyalások és szövetségek":time.hour<22?"Vacsorák, meghívások és háttéralkuk":"Éjszakai futárok és lezárt ajtók",
    art:"/assets/palace.webp", live:"ÉLŐ POLITIKA", note:"A Szem nem azt figyeli, ki beszél. Hanem azt, kihez jut el a szó.",
    places:{crownCourt:["Koronaudvar","Audienciák terme","Főudvarmesteri iroda","Királyi előcsarnok"],glassGallery:["Üveggaléria","Követek Szalonja","Csendes erkély","Nemesi tárgyaló"],royalArchive:["Pecsétarchívum","Régi Krónikák Csarnoka","Zárt ügyek terme","Genealógiai kamra"],guardWing:["Királyi Őrfolyosó","Váltóterem","Fegyveres jelentések","Belső kapu"]},
    rumors:{crownCourt:["Valaki háromszor is hiába várt audienciára ezen a héten.","Egy új név került fel a királyi meghívottak közé."],glassGallery:["Két követ ugyanarról a szerződésről két külön történetet mesél.","Mara egy meghívást az utolsó pillanatban visszavont."],royalArchive:["Egy régi hajónaplóban ugyanaz a jel szerepel, mint a Fekete Érmén.","Orven egy ügyet nyitott újra, amelyet tíz éve lezártnak hittek."],guardWing:["Egy őrségi váltás ideje valakinek túl pontosan ismert volt.","Aster új belépési rendet vezetett be a belső kapunál."]}
  }:{
    name:"KIKÖTŐ", eyebrow:"AHOL A VÁROS VÉGET ÉR — ÉS A VILÁG ELKEZDŐDIK", title:"Öt rakpart. Egy tenger. Döntések, amelyek messzire visznek.",
    intro:"Ide azok is eljutnak, akik felemelkedni akarnak — és azok is, akiknek már nincs hová visszamenniük. Tengerésznek állhatsz, halászhatsz, független fuvarokat vállalhatsz, vagy beléphetsz a bűn sötétebb útjára. A Fekete Érme nyoma itt már sós víz és hajónaplók között él.",
    question:"Ki maradsz, amikor már csak a következő dagály választ el egy új élettől?", rhythm: time.hour<5?"Hajnal előtti kihajózás":time.hour<10?"Halpiac és rakodás":time.hour<16?"Vám, fuvarok és induló hajók":time.hour<21?"Fogadók, legénységek és alkuk":"Csempészutak, titkos rakományok és éjjeli dagály",
    art:"/assets/harbor.webp", live:"ÉLŐ KIKÖTŐ", note:"A Szem a parton is látja, mi érkezik — és azt is, mi távozik nyom nélkül.",
    places:{ironPiers:["Vasrakparti Torony","Vámhivatal","Hajónapló-iroda","Kikötési láncok"],sailorsRow:["Fekete Vitorla Fogadó","Toborzóasztal","Legénységi udvar","Éjszakai kikötőhíd"],fishMarket:["Sós Háló Piac","Halászcsarnok","Hálójavítók sora","Révkalauz kunyhó"],freeDocks:["Szabad Kikötő","Független Hajók Mólója","Távoli utak táblája","Fuvarosok irodája"],nightWarehouses:["Vak Hold Raktár","Lezárt vámkapu","Éjjeli csónakház","Névtelen rakományok sora"]},
    rumors:{ironPiers:["Egy hajó háromszor futott be más néven, ugyanazzal a sérüléssel.","Dain ugyanazt a rakjegyszámot két külön hajón is megtalálta."],sailorsRow:["Valaki teljes legénységet keres egy útra, amelynek nincs hivatalos célállomása.","Tessa ma este egy régi ismerősnek mond nemet."],fishMarket:["Joren hálójában egy idegen város pecsétje akadt fenn.","A halászok szerint éjjelente fény nélkül jár egy csónak a külső öbölben."],freeDocks:["Sable hajója olyan fuvarra készül, amelyet senki sem akar a könyvekben látni.","Egy új útvonal nyílt meg, de csak azoknak, akik vállalják az időjárást."],nightWarehouses:["A Fekete Érme jelét egy láda belsejében találták meg.","Mira szerint valaki a palotából ismeri az éjjeli rakományok egyik útvonalát."]}
  };
  const phase:Record<typeof time.phase,string>={éjszaka:region==="palace"?"A lezárt ajtók ideje":"A sötét rakpartok ideje",hajnal:region==="palace"?"A palota felébred":"A hajók indulnak",délelőtt:region==="palace"?"A hivatalos arcok ideje":"A kikötő dolgozik",délután:region==="palace"?"A tárgyalások órája":"A rakományok cserélnek gazdát",alkonyat:region==="palace"?"A háttéralkuk ideje":"A tengerészek és történetek ideje"};
  if(district){
    const people=district.npcIds.map(id=>NPCS.find(n=>n.id===id)).filter(Boolean) as typeof NPCS;
    const places=cfg.places[district.id]??[]; const rumors=cfg.rumors[district.id]??[];
    return <div className="inner-world inner-detail" data-region={region}><div className="inner-detail-hero" style={{backgroundImage:`url('${districtArtFor(district.id,district.art??cfg.art)}')`}}><div className="inner-detail-overlay"/><button className="back-map" onClick={()=>setSelectedDistrict(null)}>← Vissza a régió központjába</button><button className="outskirts-back-city" onClick={onBack}>↩ Fővárostérkép</button><div className="inner-detail-copy"><span>{cfg.name} · {district.theme.toUpperCase()}</span><h1>{district.name}</h1><h2>{district.title}</h2><p>{district.description}</p></div><div className="outskirts-clock-chip"><strong>{time.label}</strong><span>{phase[time.phase]}</span></div></div><div className="district-deep-grid"><section className="district-story-card inner-card"><span>{region==="palace"?"AZ UDVAR KÉRDÉSE":"A KIKÖTŐ KÉRDÉSE"}</span><h3>{district.id==="royalArchive"?"Mennyi igazság marad igaz, ha egy pecsét lezárja?":district.id==="nightWarehouses"?"Meddig őrizheted meg a becsületedet, ha a bűn gyorsabban fizet?":cfg.question}</h3><p>{district.description}</p><div className="district-fact-list"><div><small>JELENLEGI RITMUS</small><strong>{cfg.rhythm}</strong></div><div><small>JÁTÉKELMÉLET</small><strong>{region==="palace"?"A kapcsolat és az információ itt hatalmi erőforrás.":"A szabadság, becsület és bűn külön utakat nyit — de mindegyiknek ára van."}</strong></div></div></section><section className="district-list-card"><span>FONTOS HELYEK</span>{Array.from(new Set([district.landmark,...places])).filter(Boolean).map((x,i)=><div className="district-list-row" key={`${region}-place-${district.id}-${i}-${x}`}><b>✦</b><span>{x}</span></div>)}</section><section className="district-list-card"><span>AMIRŐL MOST BESZÉLNEK</span>{rumors.map((x,i)=><div className="district-list-row rumor" key={`${region}-rumor-${district.id}-${i}`}><b>◇</b><span>{x}</span></div>)}</section><section className="district-people-card"><span>{region==="palace"?"A PALOTA EMBEREI":"A KIKÖTŐ EMBEREI"} · {people.length} KAPCSOLAT</span>{people.map(n=>{const active=npcIsPresent(n,time.hour);return <button key={n.id} className={`${active?"npc-present":"npc-away"} ${isTrackedNpc(game,n.id)?"quest-tracked-npc":""}`} onClick={()=>{setSelectedNpc(n.id);setNpcOverlay(n.id)}}><span className="place-person-avatar"><SafeArtImage src={npcAvatar(n)} alt={n.name}/></span><div><strong>{n.name}</strong><small>{n.role} · {npcScheduleLabel(n)} · {n.location??district.name}</small><em>{active?"Most itt van":"Jelenleg máshol van"}</em></div><b>{n.service??"Kapcsolat"}</b></button>})}</section></div><div className="district-footer"><div><span>{cfg.name} VILÁGIDŐ</span><strong>{time.shortLabel}</strong></div><div><span>JELENLEGI RITMUS</span><strong>{cfg.rhythm}</strong></div><button className="gold-button" disabled={game.currentRegion===region} onClick={()=>{game.travel(region);notify(`Megérkeztél: ${region==="palace"?"a Királyi Palotába":"a Kikötőbe"}.`)}}>{game.currentRegion===region?"Itt tartózkodsz":"Ide utazom"}</button></div></div>;
  }
  return <div className="inner-world" data-region={region}><div className="inner-hero"><div className="inner-hero-art" style={{backgroundImage:`url('${cfg.art}')`}}/><div className="inner-hero-overlay"/><button className="back-map outskirts-map-back" onClick={onBack}>← Vissza a fővárostérképhez</button><div className="inner-hero-copy"><span>{cfg.name} · {cfg.eyebrow}</span><h1>{cfg.title}</h1><p>{cfg.intro}</p><div className="outskirts-hero-actions"><button className="gold-button" disabled={game.currentRegion===region} onClick={()=>{game.travel(region);notify(`Beléptél: ${region==="palace"?"Királyi Palota":"Kikötő"}.`)}}>{game.currentRegion===region?"Jelenleg itt vagy":"Belépek"}</button><span><b>{time.label}</b><small>{phase[time.phase]} · a szerveridő itt is mozgatja az embereket</small></span></div></div><div className="inner-eye-note"><img src="/assets/eye-emblem-v2.webp" alt=""/><div><span>A SZEM</span><strong>{cfg.note}</strong></div></div></div><section className="outskirts-livebar inner-livebar"><div><span>VILÁGIDŐ</span><strong>{time.shortLabel}</strong><small>{phase[time.phase]}</small></div><div><span>RÉGIÓ RITMUSA</span><strong>{cfg.rhythm}</strong><small>Az emberek ideje, jelenléte és elérhetősége a nap során változik.</small></div><div><span>FELFEDEZÉS</span><strong>{districts.length} negyed · {NPCS.filter(n=>n.region===region).length} kapcsolat</strong><small>{region==="palace"?"Udvari emberek, őrök, diplomaták és vizsgálók.":"Tengerészek, halászok, hivatalnokok és az alvilág kapcsolatai."}</small></div><div className="live-pulse"><i/><strong>{cfg.live}</strong></div></section><div className="outskirts-heading"><div><span>{cfg.name} TÉRKÉPE</span><h2>{region==="palace"?"Itt már a kapcsolatod értéke dönt arról, ki hallgat meg.":"Itt már nem csak a városban, hanem a világban is irányt választhatsz."}</h2></div><p>{region==="palace"?"A politika nem külön játékrendszer: ugyanazok a kapcsolatok, döntések és bizonyítékok érnek ide össze, amelyeket korábban a városban szereztél.":"A Kikötő a fő történet egyik csomópontja. A Fekete Érme útja itt válik hajónév, rakjegy és emberi döntés formájában követhetővé."}</p></div><section className="district-grid inner-district-grid">{districts.map((d,index)=><button key={d.id} className={`district-card inner-district-card ${isTrackedDistrict(game,d.id)?"quest-tracked-district":""}`} style={{["--accent" as string]:region==="palace"?["#b79a62","#8d5a74","#58758a","#6c7660"][index]:["#637f8b","#8b6a4e","#71806b","#657890","#76516d"][index]}} onClick={()=>setSelectedDistrict(d.id)}><div className="district-card-art" style={{backgroundImage:`url('${districtArtFor(d.id,d.art??cfg.art)}')`}}/><div className="district-card-shade"/><div className="district-card-index">0{index+1}</div><div className="district-card-copy"><span>{d.theme}</span><h3>{d.name}</h3><p>{d.description}</p><strong>{d.npcIds.length} élő kapcsolat · Belépek a negyedbe →</strong></div><div className="district-card-glow"/></button>)}</section></div>;
}

function ArenaWorld({ game, now, notify, setView, setSelectedNpc, setNpcOverlay, selectedDistrict, setSelectedDistrict, onBack }: { game: GameState; now: number; notify:(t:string)=>void; setView:(v:ViewId)=>void; setSelectedNpc:(id:string|null)=>void; setNpcOverlay:(id:string|null)=>void; selectedDistrict:string|null; setSelectedDistrict:(id:string|null)=>void; onBack:()=>void }) {
  const time=getWorldTime(now);
  const districts=REGION_DISTRICTS.filter(d=>d.region==="arena");
  const district=districts.find(d=>d.id===selectedDistrict) ?? null;
  const getNpc=(id:string)=>NPCS.find(n=>n.id===id);
  const phaseText:Record<typeof time.phase,string>={éjszaka:"A lelátók suttognak",hajnal:"Az aréna ébred",délelőtt:"A gyakorlás ideje",délután:"A próbatételek ideje",alkonyat:"A kihívások órája"};
  const arenaRhythm=time.hour<7?"Őrség, takarítás és tegnapi sebek":time.hour<11?"Edzés, fegyverhangolás és nevezések":time.hour<16?"Próbák, párbajok és rangmérkőzések":time.hour<21?"Főmérkőzések és kihívások":"Fogadások, történetek és éjszakai párbajok";
  if(district){
    const people=district.npcIds.map(getNpc).filter(Boolean) as typeof NPCS;
    return <div className="arena-world arena-detail" data-region="arena"><div className="arena-detail-hero" style={{backgroundImage:`url('${districtArtFor(district.id,district.art)}')`}}><div className="arena-detail-overlay"/><button className="back-map" onClick={()=>setSelectedDistrict(null)}>← Vissza az Aréna szívébe</button><button className="outskirts-back-city" onClick={onBack}>↩ Fővárostérkép</button><div className="arena-detail-copy"><span>ARÉNA · {district.theme.toUpperCase()}</span><h1>{district.name}</h1><h2>{district.title}</h2><p>{district.description}</p></div><div className="outskirts-clock-chip"><strong>{time.label}</strong><span>{phaseText[time.phase]}</span></div></div><div className="district-deep-grid"><section className="district-story-card arena-card"><span>AZ ARÉNA KÉRDÉSE</span><h3>{district.id==="hallOfTrials"?"Van benned annyi, hogy kiállj magadért?":district.id==="fightersYard"?"Mit tanulsz a vereségedből?":district.id==="crowdQuarter"?"Mit ér a neved, ha mindenki más meséli?":"Mi marad belőled, ha már mindenki elismeri a győzelmedet?"}</h3><p>{district.description}</p><div className="district-fact-list"><div><small>ARÉNAI RITMUS</small><strong>{arenaRhythm}</strong></div><div><small>JÁTÉKELMÉLET</small><strong>{district.id==="crowdQuarter"?"A hírnév önálló erőforrás.":district.id==="championsHall"?"A magas rang új kötelezettségeket teremt.":"A képesség számít, de a döntésed teszi történetté."}</strong></div></div></section><section className="district-list-card"><span>FONTOS HELYEK</span>{Array.from(new Set([district.landmark,...(district.id==="hallOfTrials"?["Nevezési asztal","Próbakapu","Bírói folyosó"]:district.id==="fightersYard"?["Edzőudvar","Gyógyítók terme","Fegyvertár"]:district.id==="crowdQuarter"?["Nézők kapuja","Fogadóház","Eredménytábla"]:["Bajnoki fal","Kihívások terme","Emlékcsarnok"])].filter(Boolean))).map((x,i)=><div className="district-list-row" key={`place-${district.id}-${i}-${x}`}><b>✦</b><span>{x}</span></div>)}</section><section className="district-list-card"><span>AMIRŐL AZ ARÉNA BESZÉL</span>{(district.id==="hallOfTrials"?["A külvárosból érkező új harcosokat ma különösen figyelik.","Serin nem mindenkit enged ugyanabba a kihívásba."] : district.id==="fightersYard"?["Korr szerint két jó edzés többet ér tíz üres győzelemnél.","Valaki túl gyakran sérül meg ugyanazon az oldalon."] : district.id==="crowdQuarter"?["Egy ismeretlen név gyorsan felkerült a fogadási táblára.","Brenka emberei a külvárosi mérkőzésekről kérdeznek."] : ["A Bajnoki falon új üres helyet készítettek.","Talia már tudja, kit akar kihívni a következő körben."]).map(x=><div className="district-list-row rumor" key={x}><b>◇</b><span>{x}</span></div>)}</section><section className="district-people-card"><span>AZ ARÉNA EMBEREI · {people.length} KAPCSOLAT</span>{people.map(n=>{const active=n!.startHour===undefined||n!.endHour===undefined?true:(n!.startHour<=n!.endHour?time.hour>=n!.startHour&&time.hour<n!.endHour:time.hour>=n!.startHour||time.hour<n!.endHour);return <button key={n!.id} className={`${active?"npc-present":"npc-away"} ${isTrackedNpc(game,n!.id)?"quest-tracked-npc":""}`} onClick={()=>{setSelectedNpc(n!.id);setNpcOverlay(n!.id);}}><span className="place-person-avatar"><SafeArtImage src={npcAvatar(n!)} alt={n!.name} /></span><div><strong>{n!.name}</strong><small>{n!.role} · {npcScheduleLabel(n!)} · {n!.location ?? "A negyedben"}</small><em>{active?"Most itt van":"Most máshol van"}</em></div><b>{n!.service ?? "Kapcsolat"}</b></button>})}</section></div><div className="district-footer"><div><span>ARÉNAI VILÁGIDŐ</span><strong>{time.shortLabel}</strong></div><div><span>JELENLEGI RITMUS</span><strong>{arenaRhythm}</strong></div><button className="gold-button" disabled={game.currentRegion==="arena"} onClick={()=>{game.travel("arena");notify("Beléptél az Arénába. Itt a bizonyításnak ára van.")}}>{game.currentRegion==="arena"?"Az Arénában tartózkodsz":"Belépek az Arénába"}</button></div></div>
  }
  return <div className="arena-world" data-region="arena"><div className="arena-hero"><div className="arena-hero-art"/><div className="arena-hero-overlay"/><button className="back-map outskirts-map-back" onClick={onBack}>← Vissza a fővárostérképhez</button><div className="arena-hero-copy"><span>ARÉNA · A BIZONYÍTÁS HELYE</span><h1>Ahol a külvárosi tehetségből bajnok születhet.</h1><p>Az Aréna nem egyszerűen PvP-helyszín. Ez a város azon része, ahol a játékos önként vállalja, hogy mások előtt méreti meg magát. A győzelem hírnevet ad, a vereség történetet, a viselkedés pedig megmutatja, milyen harcossá akarsz válni.</p><div className="outskirts-hero-actions"><button className="gold-button" disabled={game.currentRegion==="arena"} onClick={()=>{game.travel("arena");notify("Beléptél az Arénába. A következő ellenfeled már lehet, hogy figyel.")}}>{game.currentRegion==="arena"?"Jelenleg itt vagy":"Belépek az Arénába"}</button><span><b>{time.label}</b><small>{phaseText[time.phase]} · a szerveridő mozgatja a verseny ritmusát</small></span></div></div><div className="arena-badge"><span>ARÉNAI TÖRVÉNY</span><strong>Aki megméretteti magát, ne csak a győzelméért vállaljon felelősséget.</strong></div></div><section className="outskirts-livebar arena-livebar"><div><span>VILÁGIDŐ</span><strong>{time.shortLabel}</strong><small>{phaseText[time.phase]}</small></div><div><span>ARÉNAI RITMUS</span><strong>{arenaRhythm}</strong><small>A küzdelemnek is van napszaka.</small></div><div><span>FEJLŐDÉSI ÍV</span><strong>4 negyed</strong><small>Próba → edzés → közönség → bajnoki szint.</small></div><div className="live-pulse"><i/><strong>ÉLŐ PVP-KÖZEG</strong></div></section><div className="outskirts-heading"><div><span>AZ ARÉNA NEGYED EI</span><h2>Nem egy pálya. Egy társadalom.</h2><p>Aki itt marad, kapcsolatokat, ellenfeleket és hírnevet gyűjt. A város figyeli, mit kezdesz az erőddel.</p></div></div><div className="district-grid arena-district-grid">{districts.map(d=>{const people=d.npcIds.map(getNpc).filter(Boolean).length;return <button key={d.id} className={`district-card ${isTrackedDistrict(game,d.id)?"quest-tracked-district":""}`} style={{["--accent" as string]: "#9b5c46"}} onClick={()=>setSelectedDistrict(d.id)}><div className="district-card-art" style={{backgroundImage:`url('${districtArtFor(d.id,d.art)}')`}}/><div className="district-card-shade"/><div className="district-card-index">{String(districts.indexOf(d)+1).padStart(2,"0")}</div><div className="district-card-copy"><span>{d.theme}</span><h3>{d.name}</h3><p>{d.description}</p><strong>{people} kapcsolódó arénai ember · Belépek a negyedbe →</strong></div><div className="district-card-glow"/></button>})}</div></div>
}

function OutskirtsWorld({ game, now, notify, setView, setSelectedNpc, setNpcOverlay, selectedDistrict, setSelectedDistrict, onBack }: { game: GameState; now:number; notify:(t:string)=>void; setView:(v:ViewId)=>void; setSelectedNpc:(id:string|null)=>void; setNpcOverlay:(id:string|null)=>void; selectedDistrict:string|null; setSelectedDistrict:(id:string|null)=>void; onBack:()=>void }) {
  const time=getWorldTime(now);
  const district=OUTSKIRTS_DISTRICTS.find(d=>d.id===selectedDistrict) ?? null;
  const getNpc=(id:string) => NPCS.find(n=>n.id===id);
  const phaseText:Record<typeof time.phase,string> = { éjszaka:"A lámpák ideje", hajnal:"A város ébred", délelőtt:"A munka ideje", délután:"A város lüktet", alkonyat:"A váltás órája" };
  const phaseProgress=((time.hour*60)+time.minute)/1440*100;
  if(district){
    const people=district.npcIds.map(getNpc).filter(Boolean) as typeof NPCS;
    return <div className="outskirts-world outskirts-detail" data-region="outskirts"><div className="outskirts-detail-hero" style={{backgroundImage:`url('${districtArtFor(district.id,district.art)}')`}}><div className="outskirts-detail-overlay"/><button className="back-map" onClick={()=>setSelectedDistrict(null)}>← Vissza a Külváros szívébe</button><button className="outskirts-back-city" onClick={onBack}>↩ Fővárostérkép</button><div className="outskirts-detail-copy"><span>KÜLVÁROS · {district.theme.toUpperCase()}</span><h1>{district.name}</h1><h2>{district.title}</h2><p>{district.longDescription}</p></div><div className="outskirts-clock-chip"><strong>{time.label}</strong><span>{phaseText[time.phase]}</span></div></div><div className="district-deep-grid"><section className="district-story-card"><span>AZ UTCA KÉRDÉSE</span><h3>{district.question}</h3><p>{district.description}</p><div className="district-fact-list"><div><small>AKTIVITÁS MOST</small><strong>{district.streetLife[Math.min(district.streetLife.length-1, Math.floor(time.hour/5))] ?? district.streetLife[0]}</strong></div><div><small>NYITOTTSÁG</small><strong>{district.openLabel}</strong></div></div></section><section className="district-list-card"><span>FONTOS HELYEK</span><div>{district.landmarks.map((x)=><div className="district-list-row" key={x}><b>✦</b><span>{x}</span></div>)}</div></section><section className="district-list-card"><span>AMIRŐL AZ UTCA BESZÉL</span><div>{district.whispers.map((x)=><div className="district-list-row rumor" key={x}><b>◇</b><span>{x}</span></div>)}</div></section><section className="district-people-card"><span>AZ UTCA EMBEREI · {people.length} KAPCSOLAT</span>{people.length?people.map(n=>{const active=n!.startHour===undefined||n!.endHour===undefined?true:(n!.startHour<=n!.endHour?time.hour>=n!.startHour&&time.hour<n!.endHour:time.hour>=n!.startHour||time.hour<n!.endHour);return <button key={n!.id} className={`${active?"npc-present":"npc-away"} ${isTrackedNpc(game,n!.id)?"quest-tracked-npc":""}`} onClick={()=>{setSelectedNpc(n!.id);setNpcOverlay(n!.id);}}><span className="place-person-avatar"><SafeArtImage src={npcAvatar(n!)} alt={n!.name} /></span><div><strong>{n!.name}</strong><small>{n!.role} · {npcScheduleLabel(n!)} · {n!.location ?? "A negyedben"}</small><em>{active?"Most itt van":"Most máshol van"}</em></div><b>{n!.service ?? "Kapcsolat"}</b></button>}) : <div className="unmet-person"><b>?</b><p>Itt még nincs olyan ember a nyilvántartásodban, akiről a város hivatalosan is beszélne.</p></div>}</section></div><div className="district-footer"><div><span>AKTÍV VILÁGIDŐ</span><strong>{time.shortLabel}</strong></div><div className="district-timeline"><i><b style={{width:`${phaseProgress}%`}}/></i><span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span></div><button className="gold-button" disabled={game.currentRegion==="outskirts"} onClick={()=>{game.travel("outskirts");notify("A Külváros lett a tartózkodási helyed.")}}>{game.currentRegion==="outskirts"?"A Külvárosban tartózkodsz":"Belépek a Külvárosba"}</button></div></div>
  }
  return <div className="outskirts-world" data-region="outskirts"><div className="outskirts-hero"><div className="outskirts-hero-art"/><div className="outskirts-hero-overlay"/><button className="back-map outskirts-map-back" onClick={onBack}>← Vissza a fővárostérképhez</button><div className="outskirts-hero-copy"><span>KÜLVÁROS · A VÁROS PEREME</span><h1>Hat negyed. Egyetlen lüktető szív.</h1><p>A város itt még nem döntötte el, hogy ki leszel. A kapuknál érkezők, a mesterek, az árusok, az utcák emberei, az őrség és a régi kövek mind ugyanazon a néhány utcán osztoznak.</p><div className="outskirts-hero-actions"><button className="gold-button" disabled={game.currentRegion==="outskirts"} onClick={()=>{game.travel("outskirts");notify("A Külváros lett a tartózkodási helyed.")}}>{game.currentRegion==="outskirts"?"Jelenleg itt vagy":"Belépek a Külvárosba"}</button><span><b>{time.label}</b><small>{phaseText[time.phase]} · a szerver ideje mozgatja a várost</small></span></div></div><div className="outskirts-eye-note"><img src="/assets/eye-emblem-v2.webp" alt=""/><div><span>A SZEM</span><strong>A város előbb is él, hogy te megérkeznél.</strong></div></div></div><section className="outskirts-livebar"><div><span>VILÁGIDŐ</span><strong>{time.shortLabel}</strong><small>{phaseText[time.phase]}</small></div><div><span>VÁROSI RITMUS</span><strong>{time.hour < 5 ? "Őrjáratok és rejtett utak" : time.hour < 10 ? "Piac és műhelyek" : time.hour < 15 ? "Fuvarok és alkuk" : time.hour < 19 ? "Utcai élet" : "Fogadók és árnyékok"}</strong><small>A negyedek nem egyszerre lélegeznek.</small></div><div><span>FELFEDEZÉS</span><strong>6 negyed</strong><small>A Játékmester dönti el, mikor nyílik a következő ajtó.</small></div><div className="live-pulse"><i/><strong>ÉLŐ VILÁG</strong></div></section><div className="outskirts-heading"><div><span>A KÜLVÁROS TÉRKÉPE</span><h2>Válassz egy negyedet. Merülj el benne.</h2></div><p>Nem egy listát látsz. Hat különböző közösséget látsz, amelyek ugyanazon városfal árnyékában élnek.</p></div><section className="district-grid">{OUTSKIRTS_DISTRICTS.map((d,index)=><button key={d.id} className={`district-card ${isTrackedDistrict(game,d.id)?"quest-tracked-district":""}`} style={{["--accent" as string]:d.accent}} onClick={()=>setSelectedDistrict(d.id)}><div className="district-card-art" style={{backgroundImage:`url('${districtArtFor(d.id,d.art)}')`}}/><div className="district-card-shade"/><div className="district-card-index">0{index+1}</div><div className="district-card-copy"><span>{d.theme}</span><h3>{d.name}</h3><p>{d.description}</p><strong>{d.npcIds.length} élő kapcsolat · Belépek a negyedbe →</strong></div><div className="district-card-glow"/></button>)}</section><section className="outskirts-pulse"><div className="pulse-head"><span>A VÁROS MOST</span><h3>{phaseText[time.phase]}</h3><p>Az idő nem csak a fényt változtatja meg. Emberek indulnak haza, műhelyek zárnak, fogadók megtelnek, járőrök váltják egymást.</p></div><div className="pulse-lanes">{OUTSKIRTS_DISTRICTS.map((d)=><div key={d.id} className="pulse-lane" style={{["--accent" as string]:d.accent}}><span>{d.name}</span><i><b style={{width:`${Math.max(18,Math.min(96,30+(time.hour*3+indexOfDistrict(d.id)*9)%65))}%`}}/></i><small>{d.streetLife[Math.min(d.streetLife.length-1,Math.floor(time.hour/5))]}</small></div>)}</div></section></div>;
}

function indexOfDistrict(id:string){ return OUTSKIRTS_DISTRICTS.findIndex(d=>d.id===id); }


function LockedRegionModal({ game, regionId, onClose }: { game: GameState; regionId: RegionId; onClose: () => void }) {
  const region = REGIONS.find(r => r.id === regionId);
  if (!region) return null;
  const status = regionGateStatus(game, regionId);
  const gate = status.gate as any;
  const chapterNames: Record<number,string> = {1:"A lehetőség ára",2:"A fogadások árnya",3:"A mérleg nyelve",4:"A fény ára",5:"A korona vizsgálata",6:"A Fekete Érme tengeri útja"};
  const labels: Record<string,string> = {combat:"harci",shadow:"árnyék",social:"társasági",trade:"kereskedői",lore:"tudásalapú"};
  const conditionText = (c:any) => {
    if (c.kind === "chapterProgress") return `${chapterNames[c.chapter] ?? `Főfejezet ${c.chapter}`} történetében legalább ${Math.round(c.ratio*100)}%-ig juss el.`;
    if (c.kind === "chapterComplete") return `Zárd le a(z) ${chapterNames[c.chapter] ?? `Főfejezet ${c.chapter}`} teljes főívét.`;
    if (c.kind === "relationship") return `Építs ki elég erős kapcsolatot a(z) ${regionName(c.region)} embereivel.`;
    if (c.kind === "affinity") return `Bizonyítsd a(z) ${labels[c.key] ?? c.key} rátermettségedet.`;
    return "Teljesítsd a régióhoz vezető történeti feltételt.";
  };
  const requirements:string[] = [];
  if (gate) {
    if (gate.minGold > 0) requirements.push(`Legyen nálad elegendő vagyon a belépéshez (${gate.minGold.toLocaleString("hu-HU")} arany).`);
    if (gate.minReputation > 0) requirements.push("Érd el a szükséges hírnevet.");
    (gate.allOf ?? []).forEach((c:any) => requirements.push(conditionText(c)));
    if ((gate.anyOf ?? []).length) requirements.push("A régióhoz vezető több út közül legalább egy hiteles utat teljesíts.");
    if ((gate.alternatives ?? []).length) requirements.push("Építsd fel a megfelelő történeti és kapcsolati alapot; több különböző út is nyitva áll.");
  } else if (regionId === "forest") {
    requirements.push("A második szezon történetének el kell jutnia ehhez a területhez.");
  }
  const nextChapter = gate?.allOf?.find((c:any)=>c.kind==="chapterProgress" || c.kind==="chapterComplete");
  return <div className="locked-region-backdrop" role="dialog" aria-modal="true" aria-label={`${region.name} még nem elérhető`} onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}>
    <article className="locked-region-modal">
      <button className="locked-region-close" onClick={onClose} aria-label="Bezárás">×</button>
      <header className="locked-region-head">
        <div className="locked-region-icon">{region.icon}</div>
        <div><span>RÉGIÓS KAPU · ZÁRVA</span><h2>{region.name}</h2><p>{region.description}</p></div>
      </header>
      <section className="locked-region-message">
        <small>AZ ÚT MÉG NEM NYÍLT MEG ELŐTTED</small>
        <strong>{status.reason || region.lockText || "A történet még nem enged tovább."}</strong>
        <p>Ez a régió már létezik a királyság térképén. A történet és a tetteid azonban még nem adták meg a belépéshez szükséges alapot.</p>
      </section>
      <section className="locked-region-goals">
        <div className="locked-region-goals-head"><span>MIT KELL ELÉRNED?</span><small>{nextChapter ? "A fő történet vezet tovább." : "Többféle út is nyitva áll."}</small></div>
        {requirements.map((item,i)=><div className="locked-region-goal" key={`${regionId}-goal-${i}`}><i>{i+1}</i><span>{item}</span></div>)}
      </section>
      <footer className="locked-region-foot"><span>A kapu nem veszi el a lehetőséget. Csak megmutatja, mi hiányzik még.</span><button className="gold-button" onClick={onClose}>Értem, folytatom az utam</button></footer>
    </article>
  </div>;
}

function safeItemSourceLabel(item: ItemDefinition){ return item.origin ?? (item.regions?.length ? item.regions.join(", ") : "Ismeretlen eredet"); }

function NpcFunctionPanel({ game, npc, notify }: { game: GameState; npc: typeof NPCS[number]; notify:(t:string)=>void }) {
  const functions = NPC_FUNCTIONS.filter(fn=>fn.npcId===npc.id);
  if (!functions.length) return null;
  const fn = functions[0];
  const [open, setOpen] = useState(false);
  const [forgeTarget, setForgeTarget] = useState<string>("");
  const [shopItem, setShopItem] = useState<string|null>(null);
  const [restHours, setRestHours] = useState(1);
  const availableTargets = game.inventory.filter(inv=>canNpcCraftItem(npc.id,getItem(inv.itemId)));
  const regionItems = regionalMarketItems(npc.region).filter(item => isMarketEligible(item));
  const shopItems = fn.itemIds?.length ? fn.itemIds.map(id=>getItem(id)).filter(Boolean) : regionItems;
  const forgeCraftables = ITEMS.filter(item => canNpcCraftItem(npc.id,item) && (item.regions?.includes(npc.region) || item.setId?.startsWith(`${npc.region}_`)) && item.rarity === "Közönséges").slice(0,8);
  const activeShop = shopItems.find(item=>item?.id===shopItem) ?? null;
  const activeFood = shopItems.find(item=>item?.id===shopItem && itemCategory(item)==="consumable") ?? null;
  const selectedCraft = forgeTarget.startsWith("craft:") ? ITEMS.find(i=>i.id===forgeTarget.slice(6)) : null;
  const craftMaterials = selectedCraft ? craftRecipeForItem(selectedCraft, npc.region) : [];
  const materialCounts = new Map<string,number>(); game.inventory.forEach(inv=>materialCounts.set(inv.itemId,(materialCounts.get(inv.itemId)??0)+1));
  const linkedQuest = QUESTS.find(q => q.giver === npc.id && q.audit?.functionHooks.some(h => h.npcId === npc.id && h.functionId === fn.id));
  const icon = fn.kind === "inn" ? "⌂" : ["forge","leatherwork"].includes(fn.kind) ? "⚒" : fn.kind === "alchemy" ? "🧪" : ["trade","rareTrade","food","foodTrade","spiceTrade","market","streetMarket"].includes(fn.kind) ? "◫" : "✦";
  const openLabel = fn.kind === "inn" ? "Megszállok / ennék" : ["forge","leatherwork"].includes(fn.kind) ? "Műhely megnyitása" : fn.kind === "alchemy" ? "Alkímiai műhely" : ["trade","rareTrade","food","foodTrade","spiceTrade","market","streetMarket"].includes(fn.kind) ? "Pult megnyitása" : fn.actionLabel;
  return <section className="npc-unique-function-panel">
    <div className="npc-unique-function-head"><div><span>HELYI FUNKCIÓ</span><h3><b className="npc-function-icon">{icon}</b>{fn.title}</h3></div><small>{npc.role}</small></div>
    <p>{fn.description}</p>
    <button className="npc-function-open" onClick={()=>setOpen(v=>!v)}>{open?"Bezárom":"Megnyitom"} · {openLabel}</button>
    {open&&<div className="npc-function-workbench">
      {["forge","leatherwork"].includes(fn.kind)&&<>
        <div className="function-section-head"><div><span>MŰHELY</span><strong>Mit szeretnél készíteni?</strong></div><small>Válassz az ikonok közül.</small></div>
        <div className="function-item-grid">{forgeCraftables.map(item=><button type="button" key={item.id} className={`function-item-card ${forgeTarget===`craft:${item.id}`?"selected":""}`} onClick={()=>setForgeTarget(`craft:${item.id}`)}><span className="function-item-icon"><ItemArtwork itemId={item.id} fallback={item.icon} /></span><b>{item.name}</b><small>{item.rarity} · {item.slot}</small><em>{itemStatsText(item)}</em></button>)}</div>
        {selectedCraft&&<div className="function-item-detail forge-detail"><div className="function-item-icon big"><ItemArtwork itemId={selectedCraft.id} fallback={selectedCraft.icon} /></div><div><span>RECEPT · {selectedCraft.rarity}</span><h4>{selectedCraft.name}</h4><p>{selectedCraft.description}</p><small>Alapanyagok: {craftMaterials.map(req=>`${getItem(req.id).name} ${materialCounts.get(req.id)??0}/${req.count}`).join(" · ")}</small></div><button className="gold-button" disabled={craftMaterials.some(req=>(materialCounts.get(req.id)??0)<req.count)} onClick={()=>{const r=game.useNpcFunction(npc.id,fn.id,forgeTarget);notify(r.message);if(r.success)setForgeTarget("")}}>Elkészítem</button></div>}
        <div className="function-section-head"><div><span>SZÉTSZERELÉS</span><strong>Mit bontsak anyagra?</strong></div><small>A kiválasztott felszerelés eltűnik, az anyag visszakerül a táskába.</small></div>
        <div className="function-item-grid">{availableTargets.slice(0,10).map(inv=>{const item=getItem(inv.itemId);return <button key={inv.instanceId} className={`function-item-card compact ${forgeTarget===inv.instanceId?"selected":""}`} onClick={()=>setForgeTarget(inv.instanceId)}><span className="function-item-icon"><ItemArtwork itemId={item.id} fallback={item.icon} /></span><b>{item.name}</b><small>Szétszerelhető</small><em>{itemStatsText(item)}</em></button>})}</div>
        {forgeTarget && !forgeTarget.startsWith("craft:") && (()=>{const targetInv=game.inventory.find(inv=>inv.instanceId===forgeTarget); const targetItem=targetInv?getItem(targetInv.itemId):null; const yields=targetItem?dismantleYieldsForItem(targetItem):[]; const countLabel=yields.map(r=>`${getItem(r.id).name} × ${r.count}`).join(" · "); return <div className="function-item-detail dismantle-detail"><div className="function-item-icon big">{targetItem ? <ItemArtwork itemId={targetItem.id} fallback={targetItem.icon} /> : <span>◈</span>}</div><div><span>SZÉTSZERELÉS · ANYAGVISSZANYERÉS</span><h4>{targetItem?.name ?? "Kiválasztott felszerelés"}</h4><p>{targetItem?.description ?? ""}</p><small>Visszakapsz: {countLabel || "nincs visszanyerhető anyag"}</small></div><button className="gold-button" onClick={()=>{const r=game.useNpcFunction(npc.id,fn.id,forgeTarget);notify(r.message);if(r.success)setForgeTarget("")}}>Szétszerelem</button></div>})()}
      </>}
      {["trade","rareTrade","food","foodTrade","spiceTrade","market","streetMarket"].includes(fn.kind)&&<>
        <div className="function-section-head"><div><span>HELYI KÉSZLET</span><strong>Válassz tárgyat</strong></div><small>{REGIONAL_MARKET_NAMES[npc.region]}</small></div>
        <div className="function-item-grid">{shopItems.map(item=><button key={item.id} className={`function-item-card ${shopItem===item.id?"selected":""}`} onClick={()=>setShopItem(item.id)}><span className="function-item-icon"><ItemArtwork itemId={item.id} fallback={item.icon} /></span><b>{item.name}</b><small>{ITEM_CATEGORY_LABELS[itemCategory(item)] ?? itemCategory(item)} · {item.rarity}</small><strong>{Math.round(item.basePrice)} arany</strong></button>)}</div>
        {activeShop&&<div className="function-item-detail"><div className="function-item-icon big"><ItemArtwork itemId={activeShop.id} fallback={activeShop.icon} /></div><div><span>{ITEM_CATEGORY_LABELS[itemCategory(activeShop)] ?? itemCategory(activeShop)} · {activeShop.rarity}</span><h4>{activeShop.name}</h4><p>{activeShop.description}</p><small>{safeItemSourceLabel(activeShop)}</small></div><button className="gold-button" onClick={()=>{const r=game.useNpcFunction(npc.id,fn.id,`buy:${activeShop.id}`);notify(r.message)}}>Megveszem · {Math.round(activeShop.basePrice)} arany</button></div>}
      </>}
      {fn.kind==="alchemy"&&<>
        <div className="function-section-head"><div><span>ALKÍMIAI MŰHELY</span><strong>Válassz főzetet vagy alapanyagot</strong></div><small>Az időleges hatások nem halmozhatók.</small></div>
        <div className="function-item-grid">{shopItems.map(item=><button type="button" key={item.id} className={`function-item-card ${shopItem===item.id?"selected":""}`} onClick={()=>setShopItem(item.id)}><span className="function-item-icon"><ItemArtwork itemId={item.id} fallback={item.icon} /></span><b>{item.name}</b><small>{ITEM_CATEGORY_LABELS[itemCategory(item)]??itemCategory(item)} · {item.rarity}</small><strong>{item.basePrice} arany</strong></button>)}</div>
        {activeShop&&<div className="function-item-detail"><div className="function-item-icon big"><ItemArtwork itemId={activeShop.id} fallback={activeShop.icon} /></div><div><span>ALKÍMIA · {activeShop.rarity}</span><h4>{activeShop.name}</h4><p>{activeShop.description}</p><small>{activeShop.effects?.tempStrength?`+${activeShop.effects.tempStrength} Erő · ${activeShop.effects.tempHours??1} óra · nem halmozható`:activeShop.effects?.tempItemStat?"+1 ideiglenes felszerelésbónusz · tárgyanként egyszerre egy aktív":safeItemSourceLabel(activeShop)}</small></div><button className="gold-button" onClick={()=>{const r=game.useNpcFunction(npc.id,fn.id,`buy:${activeShop.id}`);notify(r.message)}}>Megveszem · {activeShop.basePrice} arany</button></div>}
        {activeShop?.id==="runeInfusion"&&<div className="function-section-head"><div><span>FELSZERELT TÁRGY</span><strong>Melyik tárgyat erősítsem?</strong></div><small>Csak felszerelt tárgyra alkalmazható; egy tárgyon nem halmozható.</small></div>}
        {activeShop?.id==="runeInfusion"&&<div className="function-item-grid">{Object.values(game.equipment).filter(Boolean).map(inv=>{const item=getItem(inv!.itemId); const active=game.temporaryItemBuffs.some(b=>b.instanceId===inv!.instanceId&&b.expiresAt>Date.now()); return <button type="button" key={inv!.instanceId} className={`function-item-card compact ${active?"selected":""}`} disabled={active} onClick={()=>{const r=game.useNpcFunction(npc.id,fn.id,`infuse:${inv!.instanceId}`);notify(r.message)}}><span className="function-item-icon"><ItemArtwork itemId={item.id} fallback={item.icon} /></span><b>{item.name}</b><small>{active?"Már erősítve":"+1 Erő · 1 óra"}</small><em>{itemStatsText(item)}</em></button>})}</div>}
      </>}
      {fn.kind==="inn"&&<>
        <div className="function-section-head"><div><span>SZÁLLÁS</span><strong>Mennyi időt pihensz?</strong></div><small>1 óra = +10% maximális HP.</small></div>
        <div className="rest-options">{[1,2,4,8].map(h=><button key={h} className={restHours===h?"selected":""} onClick={()=>setRestHours(h)}><b>{h} óra</b><span>+{h*10}% HP</span><small>{(fn.cost??60)*h} arany</small></button>)}</div>
        <div className="function-action-row"><button className="gold-button" onClick={()=>{const r=game.useNpcFunction(npc.id,fn.id,`hours:${restHours}`);notify(r.message)}}>Szobát foglalok · {String((fn.cost??60)*restHours)} arany</button></div>
        <div className="function-section-head"><div><span>ÉTEL</span><strong>Válassz ételt</strong></div><small>Az étel azonnal gyógyít. A saját készletedben fogyaszthatod el.</small></div>
        <div className="function-item-grid">{shopItems.filter(item=>itemCategory(item)==="consumable").map(item=><button type="button" key={item.id} className={`function-item-card compact ${shopItem===item.id?"selected":""}`} onClick={()=>setShopItem(item.id)}><span className="function-item-icon"><ItemArtwork itemId={item.id} fallback={item.icon} /></span><b>{item.name}</b><small>{item.effects?.healPercent?`+${item.effects.healPercent}% max HP`:item.effects?.heal?`+${item.effects.heal} HP`:"Étkezés"}</small><strong>{item.basePrice} arany</strong></button>)}</div>
        {activeFood&&<div className="function-item-detail food-detail"><div className="function-item-icon big"><ItemArtwork itemId={activeFood.id} fallback={activeFood.icon} /></div><div><span>ÉTEL · {activeFood.rarity}</span><h4>{activeFood.name}</h4><p>{activeFood.description}</p><small>{activeFood.effects?.healPercent?`+${activeFood.effects.healPercent}% maximális életerő`:activeFood.effects?.heal?`+${activeFood.effects.heal} életerő`:"Étkezési tárgy"}</small></div><button className="gold-button" onClick={()=>{const r=game.useNpcFunction(npc.id,fn.id,`buy:${activeFood.id}`);notify(r.message)}}>Megveszem · {activeFood.basePrice} arany</button></div>}
        <div className="inn-rest-note"><span>🍲</span><div><b>Az étel külön, fogyasztható tárgyként működik.</b><small>A fogadó az alvás idejét és a szállást kezeli; az ételt a készletből vagy a kereskedőktől választod.</small></div></div>
      </>}
      {!( ["forge","leatherwork","inn","alchemy","trade","rareTrade","food","foodTrade","spiceTrade","market","streetMarket"].includes(fn.kind))&&<div className={`special-function-card ${linkedQuest?"quest-linked-function":""}`}><div className="special-function-icon">{icon}</div><div><strong>{fn.title}</strong>{linkedQuest&&<span className="quest-function-badge">A fő történet ehhez a funkcióhoz kötődik</span>}<p>{fn.description}</p><small>Ez a funkció a karaktered kapcsolatára, státuszára és a világ állapotára is hathat.</small></div><button className="outline-button" onClick={()=>{const r=game.useNpcFunction(npc.id,fn.id);notify(r.message)}}>{fn.actionLabel}</button></div>}
    </div>}
  </section>;
}

function NpcLocalModal({ game, npcId, notify, onClose }: { game: GameState; npcId: string; notify:(t:string)=>void; onClose:()=>void }) {
  const npc = NPCS.find(n => n.id === npcId);
  const [showQuests, setShowQuests] = useState(false);
  const [showDialogue, setShowDialogue] = useState(false);
  if (!npc) return null;
  const relation = game.relationships[npc.id] ?? 0;
  const displayName = npc.id === "garran" ? "Borin Vasmarok" : npc.name;
  const portrait = npcAvatar(npc);
  const district = npc.district ? REGION_DISTRICTS.find(d => d.id === npc.district) : null;
  const profile = NPC_STORIES[npc.id];
  const effectiveNpcStats = questEffectiveStats(game);
  const npcQuests = QUESTS.filter(q => q.giver === npc.id).sort((a,b)=>a.sequence-b.sequence);
  const npcSideQuests = game.narrativeState.runtime.sideQuests.records.filter(r => r.blueprint.giver === npc.id && ["offered","active"].includes(r.status));
  const facets = game.relationshipFacets[npc.id] ?? { trust:0, respect:0, affection:0, fear:0, debt:0, suspicion:0 };
  const relationshipInsights = relationshipInsightsFromFacets(facets);
  const reputationTone = relationshipInsights.overall;
  const items = npc.id === "garran" ? ["militiaBlade","oakShield","paddedArmor","guildRing","arenaBand"] : npc.id === "ilren" ? ["guildRing","ledgerLens"] : npc.id === "arenaKorr" ? ["arenaBand","paddedArmor"] : [];
  const present = npcIsPresent(npc, getWorldTime().hour, game.npcStates[npc.id]);
  const startQuestHere = (q: QuestDefinition) => {
    if (game.currentRegion !== npc.region) { notify(`Jelenleg nem tudsz interakcióba lépni vele, mert nem a(z) ${regionName(npc.region)} helyszínén tartózkodsz.`); return; }
    if (!present) { notify(`${displayName} jelenleg más dolgaival foglalkozik. Most nem tudsz vele interakcióba lépni.`); return; }
    const state=questState(game,q);
    if (state!=="open") { notify(questLockReason(game,q)); return; }
    game.startQuest(q.id); notify(`Felvetted: ${q.title}`);
  };
  const resolveHere = (q: QuestDefinition, choice: QuestDefinition["choices"][number]) => {
    if (game.currentRegion !== npc.region) { notify(`Jelenleg nem tudsz interakcióba lépni vele, mert nem a(z) ${regionName(npc.region)} helyszínén tartózkodsz.`); return; }
    if (!present) { notify(`${displayName} jelenleg más dolgaival foglalkozik. Most nem tudsz vele interakcióba lépni.`); return; }
    const r=game.resolveQuest(q.id,choice); notify(r.message);
  };
  return <div className="npc-local-backdrop" role="dialog" aria-modal="true" aria-label={`${displayName} adatlapja`} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <article className="npc-local-modal">
      <button className="npc-local-close" onClick={onClose} aria-label="Bezárás">×</button>
      <header className="npc-local-head">
        <div className="npc-local-avatar"><SafeArtImage src={portrait} alt={displayName} /></div>
        <div><span>{regionName(npc.region)} · {district?.name ?? "Város"}</span><h2>{displayName}</h2><strong>{npc.role}</strong><p>{npc.short}</p></div>
        <div className="npc-local-relation"><small>KAPCSOLAT</small><b>{relationshipInsights.overall}</b><em>{present ? "Most itt van" : "Most máshol van"}</em></div>
      </header>
      <div className="npc-local-grid">
        <section><span>ITT TALÁLOD</span><h3>{npc.location ?? district?.name ?? regionName(npc.region)}</h3><p>{npc.routine ?? "A város ritmusával együtt változik."}</p><div className="npc-local-meta"><div><small>SZOLGÁLTATÁS</small><b>{npc.service ?? "Történeti kapcsolat"}</b></div><div><small>NEGYED</small><b>{district?.name ?? regionName(npc.region)}</b></div></div></section>
        <section><span>KI EZ AZ EMBER?</span><h3>{profile?.history ?? "A város része, és a város emlékszik rá."}</h3><p>{profile?.motivation ?? "Saját céljai vannak, amelyek a játékos döntéseitől függetlenül is mozgatják."}</p>{profile && <div className="npc-local-events"><small>TITOK</small><div>{profile.secret}</div></div>}</section>
      </div>
      <NpcFunctionPanel game={game} npc={npc} notify={notify}/>
      <footer className="npc-local-actions"><button className="gold-button" onClick={() => { if (game.currentRegion !== npc.region) { notify(`Jelenleg nem tudsz interakcióba lépni vele, mert nem a(z) ${regionName(npc.region)} helyszínén tartózkodsz.`); return; } if (!present) { notify(`${displayName} jelenleg más dolgaival foglalkozik. Most nem tudsz vele interakcióba lépni.`); return; } game.interactNpc(npc.id); setShowDialogue(true); notify(`${displayName} észrevett téged.`); }}>Megszólítom</button><button className={`outline-button ${showQuests?"active":""}`} onClick={()=>setShowQuests(v=>!v)}>Küldetések {npcQuests.length?`· ${npcQuests.length}`:""}</button><button className="outline-button" onClick={onClose}>Vissza a negyedhez</button></footer>
      {showDialogue && <DialogueOverlay game={game} npc={npc} present={present} notify={notify} onClose={()=>setShowDialogue(false)} />}
      {showQuests && <section className="npc-local-quests"><div className="npc-local-quests-head"><div><span>AZ EMBERHEZ TARTOZÓ FŐ QUEST</span><h3>Miért pont ő keres meg?</h3></div><small>{present?"Az interakció itt történik":"Jelenleg nincs itt, a küldetés nem folytatható"}</small></div>{npcQuests.map(q=>{const state=questState(game,q); return <article key={q.id} className={`npc-quest-block ${state}`}><div><div className="quest-meta"><span>FŐTÖRTÉNET · {regionName(q.region)}</span><span>{state==="completed"?"KÉSZ":state==="active"?"AKTÍV":state==="open"?"NYITVA":"ZÁRVA"}</span></div><h4>{q.title}</h4><p>{q.story}</p><small>Cél: {q.objective}</small>{q.audit&&<div className="quest-audit-link"><span>✦ KAPCSOLÓDÓ NPC-FUNKCIÓ</span><strong>{q.audit.functionHooks[0]?.label}</strong><small>{q.audit.playerExperience}</small>{q.audit.itemHooks.length>0&&<em>Tárgyi kapcsolat: {q.audit.itemHooks.map(h=>getItem(h.itemId).name).join(", ")}</em>}</div>}{state==="locked"&&<div className="main-quest-lock">🔒 {questLockReason(game,q)}</div>}{state==="open"&&<button className="gold-button" disabled={!present} onClick={()=>startQuestHere(q)}>{present?"Felveszem ezt a küldetést":"Most nincs itt"}</button>}{state==="active"&&<>{q.requirements&&q.requirements.length>0&&<div className="quest-real-objective"><span>VALÓDI CÉL</span><strong>{q.objective}</strong><div className="quest-requirements">{q.requirements.map((r,i)=><small key={`${q.id}-req-${i}`} className={(!r.itemId || questItemCount(game,r.itemId)>=(r.count??1))?"met":"missing"}>{questRequirementLabel(game,r)}</small>)}</div><p>{q.dramaturgy?.hook}</p></div>}<div className="npc-choice-list">{q.choices.map(c=>{const current=effectiveNpcStats[c.stat];const label=STAT_DEFINITIONS.find(s=>s.id===c.stat)?.label??c.stat;const ready=(q.requirements??[]).every(r=>questRequirementSatisfied(game,r));return <button key={c.id} className={`choice-button ${!ready?"blocked":""}`} onClick={()=>resolveHere(q,c)} disabled={!present || !ready}><span><strong>{c.label}</strong><small>{c.text}</small></span><em className={current>=c.requirement?"pass":"fail"}>{label} {current}/{c.requirement}</em></button>})}</div>{(q.requirements??[]).some(r=>!questRequirementSatisfied(game,r))&&<div className="quest-locked-resolution">A történet következő döntése még nem nyílik meg. Előbb teljesítsd a valódi célt, majd hozd vissza a bizonyítékot vagy anyagot {displayName}-nak.</div>}</>}{state==="completed"&&<div className="main-quest-complete-note">✓ {q.consequence}</div>}</div></article>})}</section>}
      {showQuests && npcSideQuests.length > 0 && <section className="npc-local-quests side-quest-npc-block"><div className="npc-local-quests-head"><div><span>MELLÉKTÖRTÉNETEK</span><h3>A kapcsolatotokból születő ügyek</h3></div><small>{present&&game.currentRegion===npc.region?"Itt tudsz dönteni":"Az NPC jelenleg nincs itt"}</small></div>{npcSideQuests.map(r=>{const missingItems=(r.blueprint.objective.requiredItemIds??[]).filter(itemId=>!game.inventory.some(item=>item.itemId===itemId)&&!Object.values(game.equipment).some(item=>item?.itemId===itemId));return <article key={r.id} className={`npc-quest-block ${r.status}`}><div><div className="quest-meta"><span>MELLÉKKÜLDETÉS · {r.blueprint.scale}</span><span>{r.status==="offered"?"ÚJ":"AKTÍV"}</span></div><h4>{r.blueprint.hook}</h4><p>{r.blueprint.premise}</p><small>Cél: {r.blueprint.objective.summary}</small></div><div className="side-quest-actions">{r.status==="offered"&&<><button className="gold-button" disabled={!present||game.currentRegion!==npc.region} onClick={()=>{const res=game.acceptSideQuest(r.id);notify(res.message);}}>{present&&game.currentRegion===npc.region?"Elfogadom":"Most nincs itt"}</button><button className="outline-button" onClick={()=>{const res=game.declineSideQuest(r.id);notify(res.message);}}>Nem vállalom</button></>}{r.status==="active"&&<><button className={`outline-button ${game.trackedSideQuestId===r.id?"active":""}`} onClick={()=>game.trackSideQuest(game.trackedSideQuestId===r.id?null:r.id)}>{game.trackedSideQuestId===r.id?"✓ Követve":"Követem"}</button><div className="side-quest-resolution"><span>MEGOLDÁSI MÓD · A VÁLASZTÁSOD NYOMOT HAGY</span>{missingItems.length>0&&<small className="quest-locked-resolution">Szükséges tárgy: {missingItems.map(id=>getItem(id).name).join(", ")}</small>}<div className="npc-choice-list">{r.blueprint.choiceSpace.map(choice=>{const bonus=Object.values(game.equipment).reduce((sum,item)=>sum+(item?getItem(item.itemId).effects?.questBonus??0:0),0);const outcome=evaluateSideQuestChoice(r.blueprint.scale,choice.method,effectiveNpcStats,bonus);const statLabel=STAT_DEFINITIONS.find(s=>s.id===outcome.stat)?.label??outcome.stat;return <button type="button" key={choice.id} className="choice-button side-quest-choice" disabled={!present||game.currentRegion!==npc.region||missingItems.length>0} onClick={()=>{const res=game.resolveSideQuest(r.id,choice.id);notify(res.message);}}><span><strong>{choice.label}</strong><small>{choice.method==="conversation"?"Kapcsolat és empátia":choice.method==="service"?"Vezetés és segítség":choice.method==="trade"?"Alku és erőforrások":choice.method==="risk"?"Kockázat és túlélés":"Nyomozás és tudás"}</small></span><em className={outcome.success?"pass":"fail"}>{statLabel} {outcome.score}/{outcome.requirement}</em></button>})}</div><small>A megoldás a tényleges képességeid alapján dől el. Kudarc esetén is marad jutalom, emlék és következmény.</small></div></>}</div></article>})}</section>}
      {items.length > 0 && <section className="npc-local-shop"><span>HELYI KÉSZLET</span>{items.map(id => { const item=getItem(id as any); const price=marketPrice(item.basePrice, game.marketDemand[item.id], game.relationships.ilren, game.equipment); return <div key={id}><ItemHover item={item}/><div><b>{item.name}</b><small>{item.rarity} · {itemSpecial(item)}</small></div><strong>{price} 🪙</strong><button className="small-button" onClick={() => { if (game.currentRegion !== npc.region) { notify(`Jelenleg nem vásárolhatsz itt, mert nem a(z) ${regionName(npc.region)} helyszínén tartózkodsz.`); return; } if (!present) { notify(`${displayName} jelenleg nincs itt. A szolgáltatása most nem elérhető.`); return; } notify(game.buy(item.id).message); }}>Veszek</button></div>})}</section>}
    </article>
  </div>;
}


function DialogueOverlay({ game, npc, present, notify, onClose }: { game: GameState; npc: typeof NPCS[number]; present: boolean; notify:(t:string)=>void; onClose:()=>void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const wt = getWorldTime();
  const context = buildNarrativeContext({ region: game.currentRegion, playerIdentity: game.identity, relationshipFacets: game.relationshipFacets, memories: game.worldMemories, npcStates: game.npcStates, questStatus: game.questStatus, activeQuestId: game.trackedQuestId, worldHour: wt.hour, eyeSignals: game.gmMessages.slice(0,6).map(m=>({title:m.title,body:m.body,tone:m.tone})) });
  const topics = getAvailableDialogueTopics(context, npc.id, Date.now());
  const chosen = topics.find(t=>t.id===selected) ?? topics[0];
  const display = npc.id === "garran" ? "Borin Vasmarok" : npc.name;
  return <div className="dialogue-backdrop" role="dialog" aria-modal="true" onMouseDown={e=>{if(e.target===e.currentTarget)onClose();}}><article className="dialogue-modal"><button className="npc-local-close" onClick={onClose}>×</button><div className="dialogue-head"><SafeArtImage src={npcAvatar(npc)} alt={npc.name} /><div><span>HELYI BESZÉLGETÉS</span><h2>{display}</h2><p>{present?"Most van időtök egymásra.":"Most nincs itt."}</p></div></div><div className="dialogue-topics">{topics.length===0?<div className="side-quest-empty"><strong>Most nincs új téma.</strong><p>A kapcsolatnak és a történetnek még van ideje érni.</p></div>:topics.map(t=><button key={t.id} className={selected===t.id?"selected":""} disabled={!present} onClick={()=>setSelected(t.id)}><span>{t.kind.replaceAll("_"," ")}</span><b>{t.label}</b><small>{t.reason}</small></button>)}</div>{chosen && present && <div className="dialogue-response"><span>{chosen.kind.toUpperCase()}</span><p>{chosen.reason}</p><button className="gold-button" onClick={()=>{const res=game.speakNpc(npc.id,chosen.id);notify(res.message);setSelected(null);}}>Beszélgetek erről</button></div>}<div className="dialogue-footer"><small>A párbeszéd nem chatbot: a világban szerzett emlékeid, a kapcsolatotok és az NPC jelenlegi állapota határozza meg, mi nyílhat meg.</small></div></article></div>;
}

function npcBackstoryKnowledge(facets: { trust:number; respect:number; affection:number; fear:number; debt:number; suspicion:number } | null) {
  if (!facets) return { level:0, label:"Még nem tudsz eleget róla", history:"A múltjáról még nem beszélt veled.", motivation:null, secret:null };
  const trustLike = Math.max(0, facets.trust) + Math.max(0, facets.respect) + Math.max(0, facets.affection);
  const danger = Math.max(0, facets.suspicion) + Math.max(0, facets.fear);
  const score = Math.max(0, trustLike - Math.floor(danger * 0.35));
  if (score >= 70) return { level:3, label:"Beenged a bizalmasabb történetébe", history:"", motivation:"", secret:"" };
  if (score >= 40) return { level:2, label:"Már mesélt a múltjáról", history:"", motivation:"", secret:null };
  if (score >= 18) return { level:1, label:"Egy keveset már tudsz róla", history:"", motivation:null, secret:null };
  return { level:0, label:"A múltja még előtted marad", history:"A múltjáról még nem beszélt veled.", motivation:null, secret:null };
}

function backstoryFragments(text: string, count: number) {
  const parts = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  return parts.slice(0, count).join(" ");
}

function Npcs({ game, selectedNpc, setSelectedNpc, notify }: { game:GameState; selectedNpc:string|null; setSelectedNpc:(id:string|null)=>void; notify:(t:string)=>void }) {
  const [openRegion, setOpenRegion] = useState<string | null>(game.currentRegion);
  const [openDistrict, setOpenDistrict] = useState<string | null>(null);
  const npc = selectedNpc ? NPCS.find(n=>n.id===selectedNpc && game.regionAccess[n.region]) : null;
  const relation = npc ? (game.relationships[npc.id] ?? 0) : 0;
  const reputationTone = relation>=75 ? "Bizalmi ember" : relation>=40 ? "Megbízható ismerős" : relation>=15 ? "Ismerős" : relation>0 ? "Friss ismeretség" : "Még nem ismered";
  const displayName = npc?.id === "garran" ? "Borin Vasmarok" : npc?.name ?? "";
  const portrait = npc ? npcAvatar(npc) : "";
  const accessibleRegions = REGIONS.filter(r=>game.regionAccess[r.id]);
  const regionDistricts=(regionId:string)=>REGION_DISTRICTS.filter(d=>d.region===regionId);
  const regionPeople=(regionId:string)=>NPCS.filter(n=>n.region===regionId);
  const memories = npc ? game.worldMemories.filter(m=>m.npcId===npc.id).slice(0,6) : [];
  const facets = npc ? game.relationshipFacets[npc.id] : null;
  const directoryRelationshipInsights = facets ? relationshipInsightsFromFacets(facets) : null;
  const state = npc ? game.npcStates[npc.id] : null;
  const district = npc?.district ? REGION_DISTRICTS.find(d=>d.id===npc.district) : null;

  const revealNpc=(n:typeof NPCS[number])=>{
    setSelectedNpc(n.id);
    setOpenRegion(n.region);
    setOpenDistrict(n.district ?? null);
  };

  return <>
    <SectionTitle eyebrow="FELFEDEZETT EMBEREK" title="Városi Névjegyzék" text="A névjegyzék nem országos adatbázis. Csak azok a régiók és városrészek jelennek meg benne, amelyeket már elérsz — és azokban csak az ott élő emberekkel kerülhetsz kapcsolatba."/>
    <section className="city-directory">
      <div className="directory-intro"><div><span>ISMERETT VILÁG</span><h3>A város rétegei</h3><p>A régiók fokozatosan nyílnak meg. Amikor egy új régió felszabadul, vele együtt új negyedek és új kapcsolatok kerülnek a névjegyzékedbe.</p></div><strong>{accessibleRegions.reduce((sum,r)=>sum+regionPeople(r.id).length,0)} ismert kapcsolat</strong></div>
      <div className="npc-directory-live-summary" aria-label="Névjegyzék összesítése">
        <div><span>ISMERT NPC-K</span><strong>{accessibleRegions.reduce((sum,r)=>sum+regionPeople(r.id).length,0)} <small>/ {NPCS.length}</small></strong><p>Az elérhető régiók névjegyzéke.</p></div>
        <div><span>JELEN A RÉGIÓDBAN</span><strong>{NPCS.filter(n=>n.region===game.currentRegion && npcIsPresent(n,getWorldTime().hour,game.npcStates[n.id])).length}</strong><p>{regionName(game.currentRegion)} · aktuális világidő szerint.</p></div>
        <div><span>KÖZÖS EMLÉKEK</span><strong>{new Set(game.worldMemories.map(memory=>memory.npcId)).size}</strong><p>NPC, akivel már rögzített emlék kapcsol össze.</p></div>
      </div>
      <div className="directory-regions">
        {accessibleRegions.map(region=>{
          const districts=regionDistricts(region.id);
          const people=regionPeople(region.id);
          const isOpen=openRegion===region.id;
          return <article key={region.id} className={`directory-region ${isOpen?"open":""}`}>
            <button className="directory-region-head" onClick={()=>{setOpenRegion(isOpen?null:region.id);setOpenDistrict(isOpen?null:(districts[0]?.id ?? null));}}>
              <span className="directory-region-icon">{region.icon}</span>
              <div><small>RÉGIÓ</small><h3>{region.name}</h3><p>{region.description}</p></div>
              <em>{people.length} ismert ember <b>{isOpen?"⌃":"⌄"}</b></em>
            </button>
            {isOpen && <div className="directory-region-body">
              {districts.length>0 ? districts.map(d=>{
                const districtPeople=d.npcIds.map(id=>NPCS.find(n=>n.id===id)).filter(Boolean) as typeof NPCS;
                const dOpen=openDistrict===d.id;
                return <section key={d.id} className={`directory-district ${dOpen?"open":""}`}>
                  <button className="directory-district-head" onClick={()=>setOpenDistrict(dOpen?null:d.id)}>
                    <div><span>{d.theme}</span><h4>{d.name}</h4><p>{d.title}</p></div><em>{districtPeople.length} ember {dOpen?"⌃":"⌄"}</em>
                  </button>
                  {dOpen && <div className="directory-district-body"><p className="directory-district-desc">{d.description}</p>{d.landmark&&<span className="directory-landmark">◈ {d.landmark}</span>}<div className="directory-npc-grid">{districtPeople.map(n=><button key={n.id} className={n.id===selectedNpc?"selected":""} onClick={()=>revealNpc(n)}><span className="npc-strip-avatar"><SafeArtImage src={npcAvatar(n)} alt={n.id==="garran"?"Borin Vasmarok":n.name} /></span><div><b>{n.id==="garran"?"Borin Vasmarok":n.name}</b><small>{n.role} · {npcScheduleLabel(n)}</small><em>{n.location ?? "A város utcáin"}</em></div></button>)}</div></div>}
                </section>
              }) : <div className="directory-empty"><strong>A régió részletes térképe még készül.</strong><p>A régió már elérhető, de a Játékmester még nem bontotta ki a saját negyedeit és lakóit.</p></div>}
            </div>}
          </article>;
        })}
      </div>
      <div className="directory-locked-note"><span>◇</span><div><strong>A többi régió még nem a te világod része.</strong><p>Amikor a történet felszabadít egy új városrészt, itt nem egy üres hely jelenik meg, hanem egy teljesen új közösség: saját negyedekkel, lakókkal, kapcsolatokkal és küldetésekkel.</p></div></div>
    </section>

    {npc && <div className="npc-directory-backdrop" role="dialog" aria-modal="true" aria-label={`${displayName} információi`} onMouseDown={e=>{if(e.target===e.currentTarget)setSelectedNpc(null)}}>
      <article className="npc-directory-modal">
        <button className="npc-directory-close" onClick={()=>setSelectedNpc(null)} aria-label="Bezárás">×</button>
        <header className="npc-directory-head-main">
          <div className="npc-directory-avatar"><SafeArtImage src={portrait} alt={displayName} /></div>
          <div><span>{regionName(npc.region)} · {district?.name ?? "Város"}</span><h2>{displayName}</h2><strong>{npc.role}</strong><p>{npc.short}</p></div>
          <div className="npc-directory-relation"><small>KAPCSOLAT</small><b>{directoryRelationshipInsights?.overall ?? "Ismeretség"}</b><em>{directoryRelationshipInsights?.overall ?? "Ismeretség"}</em><i>{state?.status === "friendly" ? "Barátságos" : state?.status === "suspicious" ? "Gyanakvó" : state?.status === "angry" ? "Haragos" : state?.status === "injured" ? "Sérült" : state?.status === "traveling" ? "Utazik" : state?.status === "missing" ? "Eltűnt" : "Nyugodt"}</i></div>
        </header>
        {(() => {
          const profile = NPC_STORIES[npc.id];
          const knowledge = npcBackstoryKnowledge(facets);
          const historyText = profile ? (knowledge.level >= 2 ? profile.history : knowledge.level === 1 ? backstoryFragments(profile.history, 2) : knowledge.history) : `${npc.name} múltjáról még keveset tudsz.`;
          return <div className="npc-directory-identity-grid">
            <div className="npc-directory-relation-grid compact narrative">
              <div><span>BIZALOM</span><b>{directoryRelationshipInsights?.trust ?? "Még alig ismer"}</b></div><div><span>TISZTELET</span><b>{directoryRelationshipInsights?.respect ?? "Még nem alakult ki erős véleménye"}</b></div><div><span>KÖTŐDÉS</span><b>{directoryRelationshipInsights?.affection ?? "Nincs mély személyes kötődés"}</b></div><div><span>FÉLELEM</span><b>{directoryRelationshipInsights?.fear ?? "Nem fél tőled"}</b></div><div><span>TARTOZÁS</span><b>{directoryRelationshipInsights?.debt ?? "Nincs jelentős tartozás köztetek"}</b></div><div><span>GYANÚ</span><b>{directoryRelationshipInsights?.suspicion ?? "Nem gyanakszik rád"}</b></div>
            </div>
            <section className="npc-directory-backstory">
              <div className="npc-backstory-kicker"><span>AMIT MÁR TUDSZ RÓLA</span><em>{knowledge.label}</em></div>
              <h3>A múltja</h3>
              <p>{historyText}</p>
              {profile && knowledge.level >= 2 && <><h3>Motiváció</h3><p>{profile.motivation}</p></>}
              {profile && knowledge.level >= 3 && <div className="npc-secret-note"><span>Amit csak a bizalmába fogadva árul el</span><p>{profile.secret}</p></div>}
              {profile && knowledge.level < 3 && <div className="npc-locked-lore"><span>A titkaihoz még nincs kulcsod.</span><small>A közös élmények, a segítség és a kialakuló bizalom új részleteket fedhet fel.</small></div>}
            </section>
          </div>;
        })()}
        <div className="npc-directory-content-grid">
          <section><span>MIT JEGYZETT MEG RÓLAD?</span><h3>Közös emlékek</h3>{memories.length ? memories.map(m=><div className="memory-line" key={m.id}>◇ {m.text}<small>{m.at}</small></div>) : <div className="memory-line">◇ Még nincs közös, fontos emléketek.</div>}<div className="npc-directory-info-note"><span>HELY ÉS JELENLEGI ÁLLAPOT</span><strong>{npc.location ?? district?.name ?? regionName(npc.region)} · {state?.status === "traveling" ? "utazik" : state?.status === "missing" ? "eltűnt" : npcScheduleLabel(npc)}</strong><small>{npc.routine ?? "A város ritmusával együtt mozog."}</small></div></section>
          <section><span>KAPCSOLAT ÉS SZEREP</span><h3>{reputationTone}</h3><p>{npc.service ?? "Saját céljai vannak a városban, amelyek nem a játékos érkezésével kezdődtek."}</p><div className="npc-directory-info-note"><span>FUNKCIÓ</span><strong>{npc.service ?? npc.role}</strong><small>A térképen elérhető interakciók és küldetések a tényleges helyzetedhez igazodnak.</small></div></section>
        </div>
        <footer className="npc-directory-footer"><span>Ez a névjegyzék információs gyűjtemény. Az interakciók, küldetések és egyedi funkciók a térképen, az NPC helyi adatlapján érhetők el.</span><button className="outline-button" onClick={()=>setSelectedNpc(null)}>Bezárás</button></footer>
      </article>
    </div>}
  </>;
}
function Market({ game, effectiveStats, notify }: { game:GameState; effectiveStats:ReturnType<typeof getEffectiveStats>; notify:(t:string)=>void }) {
  const [filter,setFilter]=useState("all");
  const [sort,setSort]=useState("price");
  const regionItems=regionalMarketItems(game.currentRegion);
  const listings=ITEMS.filter(isMarketEligible).map((item,i)=>({id:`listing-${item.id}`,itemId:item.id,seller:["Kereskedő42","Mirkó","VándorLina","Rothar"][i%4],goldPrice:Math.max(1,Math.round(item.basePrice*[1.12,.94,1.28,.88][i%4])),diamondPrice:i%4===1?1:0}));
  const matches=(item:ItemDefinition)=>filter==="all"||filter===item.type||filter===item.rarity||filter===itemCategory(item)||(filter==="armor"&&["armor","shield","boots"].includes(item.type));
  const filtered=regionItems.filter(matches).sort((a,b)=>sort==="name"?a.name.localeCompare(b.name,"hu"):marketPrice(a.basePrice,game.marketDemand[a.id]??0,game.relationships.ilren,game.equipment,game.currentRegion,a.id)-marketPrice(b.basePrice,game.marketDemand[b.id]??0,game.relationships.ilren,game.equipment,game.currentRegion,b.id));
  return <><SectionTitle eyebrow="A RÉGIÓ PIACA" title="Piac" text={`A helyi piac készlete a ${REGIONAL_MARKET_NAMES[game.currentRegion]} szerint változik. A játékospiac ettől külön, szabadabb kereskedelmi réteg.`}/><div className="market-live-summary" aria-label="Piaci összesítés"><div><span>HELYI KÉSZLET</span><strong>{filtered.length}</strong><small>tárgy a választott szűrő szerint</small></div><div><span>JÁTÉKOSAJÁNLATOK</span><strong>{listings.filter(l=>matches(getItem(l.itemId))).length}</strong><small>megjeleníthető ajánlat</small></div><div><span>VÁSÁRLÓERŐ</span><strong>{game.gold.toLocaleString("hu-HU")} 🪙</strong><small>{game.diamonds.toLocaleString("hu-HU")} 💎 egyenleg</small></div></div><div className="market-controls"><div className="market-tabs">{[["all","Minden"],["equipment","Felszerelés"],["consumable","Fogyóeszköz"],["material","Alapanyag"],["tradeGood","Kereskedelmi áru"],["luxury","Luxus"],["document","Irat"],["Ritka","Ritka"],["Különleges","Különleges"],["Legendás","Legendás"]].map(([id,label])=><button key={id} className={filter===id?"active":""} onClick={()=>setFilter(id)}>{label}</button>)}</div><select value={sort} onChange={e=>setSort(e.target.value)}><option value="price">Ár szerint</option><option value="name">Név szerint</option></select></div><div className="market-summary"><div><span>ARANY</span><strong>{game.gold} 🪙</strong></div><div><span>GYÉMÁNT</span><strong>{game.diamonds} 💎</strong></div><div><span>RÉGIÓ</span><strong>{regionName(game.currentRegion)}</strong></div><div><span>ALKU</span><strong>{effectiveStats.bargaining}</strong></div></div><section className="market-block"><h3>Játékosok ajánlatai · globális</h3>{listings.filter(l=>matches(getItem(l.itemId))).slice(0,18).map(l=>{const item=getItem(l.itemId);return <div className="listing-row" key={l.id}><ItemHover item={item}/><div><strong>{item.name}</strong><small>{l.seller} · {ITEM_CATEGORY_LABELS[itemCategory(item)] ?? itemCategory(item)} · {item.rarity}</small></div><b>{l.goldPrice} 🪙{l.diamondPrice?` + ${l.diamondPrice} 💎`:""}</b><button className="small-button" onClick={()=>{const r=game.buyListing(l.itemId,l.goldPrice,l.diamondPrice);notify(r.message)}}>Megveszem</button></div>})}</section><section className="market-block"><div className="market-block-head"><div><span>HELYI KÉSZLET</span><h3>{REGIONAL_MARKET_NAMES[game.currentRegion]}</h3></div><em>{filtered.length} elérhető tárgy</em></div><div className="market-grid">{filtered.map(item=>{const price=marketPrice(item.basePrice,game.marketDemand[item.id]??0,game.relationships.ilren,game.equipment,game.currentRegion,item.id);const legal=itemLegalStatus(item);return <article className="market-item" key={item.id}><div className="market-icon"><ItemHover item={item}/></div><div><span>{ITEM_CATEGORY_LABELS[itemCategory(item)] ?? itemCategory(item)} · {item.rarity}</span><h3>{item.name}</h3><p>{item.description}</p><small>{legal!=="legal"?ITEM_LEGAL_LABELS[legal]:item.origin}</small><div className="price-line"><b>{price} 🪙{item.diamondPrice?` + ${item.diamondPrice} 💎`:""}</b><button className="gold-button" onClick={()=>{const r=game.buy(item.id);notify(r.message)}}>Megveszem</button></div></div></article>})}</div></section></>; }


function PrologueModal({ onClose }: { onClose: () => void }) {
  return <div className="prologue-backdrop" role="dialog" aria-modal="true" aria-labelledby="prologue-title">
    <article className="prologue-parchment">
      <button className="prologue-close" onClick={onClose} aria-label="Előzmény bezárása">×</button>
      <header className="prologue-header">
        <span>VILÁGKRÓNIKA · 0. FEJEZET</span>
        <h1 id="prologue-title">A Szem, amely emlékezik</h1>
        <p>Az a történet, amely minden játékos előtt ott áll, mielőtt az első lépést megtenné.</p>
      </header>
      <div className="prologue-body">
        <p className="prologue-lead">Mielőtt a királyságnak neve lett volna, csak utak voltak. Erdők, amelyek nem ismerték a térképet. Folyók, amelyek még nem tudták, melyik zászló alatt folynak. És emberek, akik úgy haltak meg, hogy senki sem tudta, mitől féltek, mit szerettek, vagy milyen nevet hagytak volna maguk után, ha lett volna, aki megőrzi.</p>
        <p>Háromszázhuszonhét évvel ezelőtt a világ nem volt fiatalabb. Csak kevesebbet tudott önmagáról.</p>
        <p>A régi időkben hét város állt egymástól napokra. Kereskedők, vándorok és katonák jártak közöttük, de minden út végén egy másik igazság várta az embert. Az egyik város szerint a hegyek áldottak voltak. A másik szerint átkozottak. Az egyik király önmagát nevezte az elsőnek, a szomszéd király pedig esküdött, hogy az ő őse volt előbb. A történelem lassan nem emlékezett, hanem vitatkozott.</p>
        <p>Aztán eljött az az éjszaka, amelyet ma <strong>Az Első Csendnek</strong> nevezünk.</p>
        <p>Nem csata volt. Nem járvány. Nem tűzvész. Egyszerűen csak elnémult minden, ami az emberek emlékezetét hordozta. A régi levéltárak lapjai kifehéredtek. A sírkövekről eltűntek a nevek. A hajónaplók üres oldalakkal tértek vissza. Olyan emberek álltak egymás előtt, akik együtt éltek egy életen át, és hirtelen egyikük sem tudta, hogyan szólítsa a másikat.</p>
        <p>Azután, hajnal előtt, egy elhagyott torony mélyén valami kinyitotta a szemét.</p>
        <p>Nem emberi szem volt. Nem állati. Nem üveg és nem kő, bár üveghez hasonló fekete felületén egyetlen aranyszínű írisz derengett. A falak mögött találták meg, egy olyan szerkezet közepén, amelyet már akkor is régebbinek tartottak a legidősebb királyságoknál.</p>
        <p>Nem beszélt. Nem ítélkezett. Nem parancsolt.</p>
        <p><strong>Emlékezett.</strong></p>
        <p>Aki először meglátta, azt mondta: a Szem megmutatta neki azt, amit minden ember elfelejtett. Nem a teljes múltat. Nem a jövőt. Csak azt az egyetlen igazságot, amelyből a többi következett:</p>
        <blockquote>„Amit nem őriztek meg, az előbb-utóbb úgy tűnik el, mintha soha nem is létezett volna.”</blockquote>
        <p>A hét város ekkor végre ugyanarról a történelemről kezdett beszélni. Megszületett a királyság. Megállapodtak az utakról, az adókról, a pénzről és a határokról. Az első király pedig nem azt mondta, hogy a korona legyen örök.</p>
        <p>Azt mondta:</p>
        <blockquote>„Legyen valaki, aki emlékszik ránk.”</blockquote>
        <p>Ezért ébredt az évszámlálás a Szem első felébredésével. Nem a király születésétől számoljuk az időt. Nem a palota első kövétől. <strong>A 327. év azt jelenti: 327 év telt el azóta, hogy az emberek először megpróbálták közös történetté tenni a saját életüket.</strong></p>
        <p>És most elérkeztünk ehhez a naphoz.</p>
        <p>A főváros él. A műhelyekben kalapácsok felelnek egymásnak. A piacon alkuk születnek. Az Aréna homokja alatt régi vér szárad. A Belváros ablakai mögött új tartozások keletkeznek. A Palota csendesen figyel. A kikötőben pedig olyan hajók érkeznek, amelyek rakományát nem mindig írják be a könyvekbe.</p>
        <p>A történelem már elkezdődött.</p>
        <p>De a krónika első üres lapja még mindig előttünk van.</p>
        <p>Ez a lap te vagy.</p>
        <p>Nem azért érkeztél, mert a Szem kiválasztott. Nem azért, mert egy jóslat várt rád. És nem azért, mert a király tud a nevedről.</p>
        <p>Azért érkeztél, mert <strong>valamit keresel</strong>. Lehet, hogy pénzt. Lehet, hogy rangot. Lehet, hogy bosszút. Lehet, hogy egyszerűen egy helyet, ahol végre nem mások történetének mellékszereplője vagy.</p>
        <p>A Szem még nem tudja, mi lesz belőled.</p>
        <p>És talán éppen ezért figyel rád.</p>
        <div className="prologue-signature"><span>KRÓNIKA 0.</span><strong>A történelem itt nem folytatódik.</strong><em>Most kezdődik.</em></div>
      </div>
      <footer className="prologue-footer"><button className="gold-button" onClick={onClose}>Belépek a királyságba</button><small>A döntéseid kerülnek majd a következő lapokra.</small></footer>
    </article>
  </div>;
}

function Chronicle({ game, onOpenPrologue }: { game: GameState; onOpenPrologue: () => void }) { return <><SectionTitle eyebrow="A VÁROS EMLÉKEZETE" title="Világkrónika" text="A történet minden nap új bejegyzést kap. A játékos nem csak végigjátssza a világot: bekerül a történelmébe."/><div className="chronicle-layout"><div className="chronicle-story"><article className="chronicle-prologue-card"><span>0. FEJEZET · A KRÓNIKA ELŐTT</span><h2>Amikor a Szem kinyitotta a szemét</h2><p>A történelemünk 327. éve nem egy uralkodó születésével kezdődött. Nem egy győztes csatával, és nem egy új korona felemelésével. Az évszám onnan számít, amikor a királyság először kimondta: <em>ami megtörténik, azt nem szabad elfelejteni.</em></p><button className="outline-button" onClick={onOpenPrologue}>A teljes előzmény megnyitása</button></article><article><span>1. FEJEZET</span><h2>A Fekete Érme</h2><p>A korona adója eltűnik, miközben egy ismeretlen ötvözetű érme átjárja a piacot. A csatornafalak, a raktári jegyek és az arénai fogadások ugyanarra a kézre mutatnak.</p></article><article><span>KÖVETKEZŐ FEJEZET</span><h2>A kikötő néma hajói</h2><p>Az aréna mélyén talált hajónév a tenger felé vezet.</p></article></div><div className="timeline"><h3>Jelenlegi eseménynapló</h3>{game.journal.map(j=><div className="timeline-item" key={j.id}><span>{j.at}</span><strong>{j.title}</strong><p>{j.text}</p></div>)}</div></div></>; }

function KingdomCalendarModal({onClose}:{onClose:()=>void}){
  const time=getWorldTime();
  const state=getCalendarState(time.dayOfYear);
  const monthNames=["Január","Február","Március","Április","Május","Június","Július","Augusztus","Szeptember","Október","November","December"];
  const weekNames=["H","K","Sze","Cs","P","Szo","V"];
  const monthStartDay=(month:number)=>{let total=0;for(let i=0;i<month-1;i++) total+=WORLD_CLOCK.monthLengths[i]??30;return total+1;};
  const dayOfWeek=(dayOfYear:number)=>((dayOfYear-1)%7); // Canonical calendar starts on Monday.
  const isEventDay=(day:number)=>CANON_EVENT_CALENDAR.filter(e=>{const end=e.dayOfYear+e.durationDays-1;return end<=365?day>=e.dayOfYear&&day<=end:day>=e.dayOfYear||day<=end-365;});
  const effectText=(e:typeof CANON_EVENT_CALENDAR[number])=>{const b=e.bonuses;const parts=[b.goldPct?`arany ${b.goldPct>0?"+":""}${b.goldPct}%`:"",b.xpPct?`XP ${b.xpPct>0?"+":""}${b.xpPct}%`:"",b.diamondPct?`gyémánt ${b.diamondPct>0?"+":""}${b.diamondPct}%`:"",b.lootLuckPct?`zsákmányszerencse +${b.lootLuckPct}%`:"",b.marketBuyPct?`helyi vásárlás ${b.marketBuyPct>0?"+":""}${b.marketBuyPct}%`:"",b.marketSellPct?`eladási ár ${b.marketSellPct>0?"+":""}${b.marketSellPct}%`:"",b.combatXpPct?`harci XP +${b.combatXpPct}%`:"",b.sideQuestChancePct?`mellékküldetés-esély +${b.sideQuestChancePct}%`:""].filter(Boolean);return parts.join(" · ");};
  const monthCard=(month:number)=>{
    const length=WORLD_CLOCK.monthLengths[month-1]??30;
    const startDow=dayOfWeek(monthStartDay(month));
    const cells=Array.from({length:startDow+length},(_,i)=>i<startDow?null:i-startDow+1);
    while(cells.length%7) cells.push(null);
    return <section key={month} className={`calendar-month-card ${time.month===month?"current-month":""}`}>
      <header><h3>{monthNames[month-1]}</h3><span>{length} nap</span></header>
      <div className="calendar-weekdays">{weekNames.map(d=><span key={d}>{d}</span>)}</div>
      <div className="calendar-days-grid">{cells.map((day,i)=>{if(day===null)return <span key={`empty-${i}`} className="calendar-day-cell empty"/>;const doy=monthStartDay(month)+day-1;const events=isEventDay(doy);const today=doy===time.dayOfYear;const active=events.some(e=>state.active.some(a=>a.id===e.id));return <div key={doy} className={`calendar-day-cell ${today?"today":""} ${events.length?"has-event":""} ${active?"active-event":""}`}><span>{day}</span>{events.length>0&&<i aria-hidden="true"/>}{events.length>0&&<div className="calendar-day-tooltip"><strong>{events.map(e=>e.title).join(" · ")}</strong>{events.map(e=><div key={e.id}><p>{e.description}</p><small>{effectText(e)||"Nincs külön jutalmazási módosító"}</small><em>{e.scope==="server"?"Királysági esemény":"Regionális esemény"}</em></div>)}</div>}</div>})}</div>
    </section>;
  };
  return <div className="prologue-backdrop" role="dialog" aria-modal="true" aria-labelledby="calendar-title"><article className="prologue-parchment calendar-parchment"><button className="prologue-close" onClick={onClose}>×</button>
    <header className="prologue-header"><span>KIRÁLYSÁGI NAPTÁR · {time.year}. ÉV</span><h1 id="calendar-title">Az év, amelyben élünk</h1><p>365 nap. Minden hét hét napból áll, az események pedig évről évre ugyanazon a napon térnek vissza.</p></header>
    <div className="calendar-current"><div><span>MA</span><strong>{time.month}. hónap · {time.day}. nap</strong><small>{time.season} · {String(time.hour).padStart(2,"0")}:{String(time.minute).padStart(2,"0")}</small></div><div><span>{state.active.length?"AKTÍV ESEMÉNY":"KÖVETKEZŐ ESEMÉNY"}</span><strong>{state.active[0]?.title??state.upcoming[0]?.title??"Nincs esemény"}</strong><small>{state.active[0]?.bonuses.note??state.upcoming[0]?.preparation??"A királyság a megszokott ritmusban él."}</small></div></div>
    <div className="calendar-legend"><span><i className="legend-today"/>Ma</span><span><i className="legend-event"/>Kanon esemény</span><span><i className="legend-active"/>Aktív esemény</span><span className="calendar-hint">Vidd az egeret a jelölt napokra az esemény részleteihez.</span></div>
    <div className="calendar-year-grid">{Array.from({length:12},(_,i)=>monthCard(i+1))}</div>
    <section className="calendar-upcoming"><div className="function-section-head"><div><span>ESKEMÉNYEK</span><strong>Közelgő alkalmak</strong></div><small>A dátumok minden évben ugyanott térnek vissza.</small></div>{state.upcoming.slice(0,6).map(e=><article key={e.id} className="calendar-upcoming-row"><div className="calendar-upcoming-day"><b>{e.dayOfYear}</b><small>{daysUntil(time.dayOfYear,e.dayOfYear)===0?"MA":`${daysUntil(time.dayOfYear,e.dayOfYear)} nap`}</small></div><div><strong>{e.title}</strong><p>{e.description}</p><small>{effectText(e)||"Nincs külön jutalmazási módosító"}</small></div></article>)}</section>
    <footer className="prologue-footer"><button className="gold-button" onClick={onClose}>Vissza a királyságba</button><small>A naptár a jelenlegi királysági évet mutatja. Az események kanonikus időpontjai nem változnak.</small></footer>
  </article></div>;
}
function GearSynergyPanel({ game }: { game: GameState }) {
  const synergies = getActiveGearSynergies(game.equipment);
  return <section className="gear-synergy-panel"><div className="gear-synergy-heading"><div><span>FELSZERELÉSI SZINERGIA</span><h3>Nem csak a ritkaság számít</h3></div><p>Bizonyos tárgyak együtt új bónuszokat adnak. A szinergia beleszámít a küldetések és próbák tényleges képességértékeibe.</p></div>{synergies.length === 0 ? <div className="synergy-empty">Még nincs összehangolt felszerelésed. Keress egymáshoz illő tárgyakat a piacon és a történetekben.</div> : <div className="synergy-grid">{synergies.map(synergy => <article className="synergy-card" key={synergy.id}><div className="synergy-card-head"><span className="synergy-rune">✦</span><div><h4>{synergy.name}</h4><small>{synergy.count}/3 illeszkedő tárgy</small></div><b>{synergy.activeThresholds.length ? "AKTÍV" : "ÉPÜL"}</b></div><p>{synergy.lore}</p><div className="synergy-thresholds">{synergy.thresholds.map(t => { const active = synergy.count >= t.pieces; return <div className={active ? "threshold active" : "threshold"} key={t.pieces}><span>{active ? "✓" : `${t.pieces}×`}</span><div><strong>{t.label}</strong><small>{t.description}</small><em>{t.pieces} tárgy</em></div></div>; })}</div></article>)}</div>}<small className="gear-synergy-note">A szinergiabónuszok nem helyettesítik a régiós szetteket: a két rendszer együtt működik.</small></section>;
}

type EyeViewId = "world" | "memories" | "visions" | "events";

function GameMaster({ game, reputation, onOpenCalendar, onAskAI, aiLoading, aiResult, aiError }: { game: GameState; reputation: number; onOpenCalendar: () => void; onAskAI: () => void; aiLoading: boolean; aiResult: { title: string; body: string; actionHint: string; tone: "personal" | "world" | "warning"; model?: string } | null; aiError: string | null }) {
  const [eyeView, setEyeView] = useState<EyeViewId>("world");
  const worldTime = getWorldTime();
  const memories = game.worldMemories;
  const runtimeEvents = game.narrativeState.runtime.worldEvents.events;
  const activeEvents = runtimeEvents.filter(event => event.status === "active");
  const visionSignals = game.narrativeState.dynamic.events.filter(event => event.tags.includes("vision") || event.tags.includes("látomás"));
  const eyeTabs: { id: EyeViewId; label: string; description: string }[] = [
    { id: "world", label: "Világállapot", description: "A jelenlegi játékállapot élő adatai." },
    { id: "memories", label: "Emlékek", description: "A játék mentett emlékei, időrendben." },
    { id: "visions", label: "Látomások", description: "Kifejezetten látomásként megjelölt dinamikus események." },
    { id: "events", label: "Események", description: "A dinamikus világ eseményei és a királysági naptár." },
  ];
  return <><SectionTitle eyebrow="HÁTTÉRBEN MŰKÖDŐ RENDSZER" title="A Szem" text="A Szem a meglévő világállapotot olvassa és értelmezi. Ez a felület nem írja át a Canon vagy a Dynamic Layer adatait."/><div className="gm-hero gm-hero-illustrated"><div className="gm-hero-copy"><span>VILÁGMEGFIGYELŐ · VAROTH</span><h2>A Szem figyel.</h2><p>Az ősi megfigyelőrelikvia a világ jelenét, a mentett emlékeket, a ténylegesen rögzített látomásjelzéseket és az eseményeket követi. A Szem nem avatkozik be a világ állapotába.</p></div><div className="gm-hero-art-wrap"><EyeEntity mode="scene" label="A Szem élő megfigyelőrelikviája" /></div></div><nav className="eye-view-tabs" aria-label="A Szem nézetei" role="tablist">{eyeTabs.map((tab, index) => <button key={tab.id} type="button" role="tab" id={`eye-tab-${tab.id}`} tabIndex={eyeView === tab.id ? 0 : -1} aria-selected={eyeView === tab.id} aria-controls="eye-view-panel" className={eyeView === tab.id ? "selected" : ""} onClick={() => setEyeView(tab.id)} onKeyDown={event => { if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return; event.preventDefault(); const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? eyeTabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + eyeTabs.length) % eyeTabs.length; const nextTab = eyeTabs[nextIndex]; setEyeView(nextTab.id); document.getElementById(`eye-tab-${nextTab.id}`)?.focus(); }}>{tab.label}</button>)}</nav><section className="eye-view-panel" id="eye-view-panel" role="tabpanel" aria-labelledby={`eye-tab-${eyeView}`}>
    {eyeView === "world" && <><div className="eye-view-heading"><span>AKTUÁLIS ADATOK</span><h3>Világállapot</h3><p>{worldTime.label} · {worldTime.phase} · a játék jelenlegi mentéséből</p></div><div className="eye-fact-grid"><article><small>Világidő</small><strong>{worldTime.shortLabel}</strong><span>{worldTime.year}. év · {worldTime.dayOfYear}. nap</span></article><article><small>Aktív régió</small><strong>{regionName(game.currentRegion)}</strong><span>A játékos jelenlegi tartózkodási helye</span></article><article><small>Hírnév</small><strong>{reputation.toLocaleString("hu-HU")}</strong><span>Meglévő hírnévpontszám</span></article><article><small>Küldetések</small><strong>{Object.values(game.questStatus).filter(status => status === "completed").length} teljesített</strong><span>{Object.values(game.questStatus).filter(status => status === "active").length} aktív küldetés</span></article><article><small>Világesemények</small><strong>{activeEvents.length} aktív</strong><span>A Dynamic Layer eseménynaplója alapján</span></article><article><small>Mentett emlékek</small><strong>{memories.length}</strong><span>A játékmentésben szereplő emlékek</span></article></div><div className="eye-view-actions"><button className="outline-button" onClick={onOpenCalendar}>Királysági naptár megnyitása</button></div></>}
    {eyeView === "memories" && <><div className="eye-view-heading"><span>MENTETT JÁTÉKADAT</span><h3>Emlékek</h3><p>Forrás: game.worldMemories · legújabb bejegyzés elöl.</p></div>{memories.length ? <div className="eye-record-list">{memories.map(memory => <article key={memory.id}><div className="eye-record-meta"><span>{memory.kind}</span><time>{memory.at}</time></div><h4>{memory.title}</h4><p>{memory.text}</p><div className="eye-record-tags">{memory.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article>)}</div> : <div className="eye-empty-state"><strong>Még nincs mentett emlék.</strong><p>Amint a játékban történik emléket rögzítő esemény, itt a mentés tényleges adata jelenik meg.</p></div>}</>}
    {eyeView === "visions" && <><div className="eye-view-heading"><span>ADATFORRÁS-ELLENŐRZÉS</span><h3>Látomások</h3><p>Csak a Dynamic Layerben kifejezetten „vision” vagy „látomás” címkével rögzített eseményeket mutatjuk.</p></div>{visionSignals.length ? <div className="eye-record-list">{visionSignals.map(signal => <article key={signal.id}><div className="eye-record-meta"><span>{signal.type}</span><time>{new Date(signal.at).toLocaleString("hu-HU")}</time></div><h4>{signal.summary}</h4><p>{signal.tags.join(" · ")}</p></article>)}</div> : <div className="eye-empty-state"><strong>Nincs rögzített látomás.</strong><p>A jelenlegi mentésben nincs látomásként megjelölt dinamikus esemény. A Szem nem helyettesíti ezt kitalált tartalommal.</p></div>}</>}
    {eyeView === "events" && <><div className="eye-view-heading"><span>DINAMIKUS ÉS NAPTÁRI ADATOK</span><h3>Események</h3><p>Az aktív dinamikus események és a meglévő királysági naptár adatai.</p></div><div className="eye-event-columns"><section><h4>Aktív világ-események ({activeEvents.length})</h4>{activeEvents.length ? activeEvents.map(event => <article className="eye-event-row" key={event.id}><span>{event.canonical ? "KÁNONI" : event.scope.toUpperCase()}</span><strong>{event.title}</strong><p>{event.reason}</p><small>{regionName(event.region)}</small></article>) : <div className="eye-empty-state compact"><strong>Nincs aktív dinamikus esemény.</strong><p>A világ-eseménynapló jelenleg nem tartalmaz aktív eseményt.</p></div>}</section><section><h4>Királysági naptár</h4>{[...getCalendarState().active.map(event => ({ ...event, eyeStatus: "Aktív" })), ...getCalendarState().upcoming.slice(0, 4).map(event => ({ ...event, eyeStatus: `${event.daysUntilStart} nap múlva` }))].map(event => <article className="eye-event-row" key={event.id}><span>{event.eyeStatus}</span><strong>{event.title}</strong><p>{event.description}</p><small>{event.preparation}</small></article>)}</section></div></>}
    </section>{eyeView === "world" && <><section className="eye-ai-card"><div className="eye-ai-copy"><span>GENERATÍV JÁTÉKMESTER · SZERVEROLDALI</span><h3>Mit vesz észre a Szem a történetedben?</h3><p>Az AI a legutóbbi naplóbejegyzésekből értelmező megfigyelést készít. Nem módosíthat tárgyat, statisztikát, küldetést vagy a világ kánonját.</p><button className="gold-button" onClick={onAskAI} disabled={aiLoading}>{aiLoading ? "A Szem gondolkodik…" : "A Szem értelmezze a történteket"}</button></div><div className="eye-ai-result">{aiError ? <div className="eye-ai-error">{aiError}</div> : aiResult ? <><span>{aiResult.model ? `MODELL · ${aiResult.model}` : "AI-MEGFIGYELÉS"}</span><h4>{aiResult.title}</h4><p>{aiResult.body}</p>{aiResult.actionHint && <blockquote>Lehetséges irány: {aiResult.actionHint}</blockquote>}</> : <><span>VÁRHATÓ KIMENET</span><h4>Észrevétel, nem parancs</h4><p>A Szem összekapcsolhat egy korábbi döntést egy mostani következménnyel, de a további lépést mindig te választod.</p></>}</div></section><div className="gm-grid"><div className="gm-inbox"><h3>Megfigyelések</h3>{game.gmMessages.map(m=><article className="gm-message" key={m.id}><span>{m.tone==="warning"?"!":"✦"}</span><div><small>{m.at}</small><strong>{m.title}</strong><p>{m.body}</p></div></article>)}</div><div className="gm-rules"><h3>Jelenlegi világállapot</h3><div><span>Hírnév</span><strong>{reputation}</strong></div><div><span>Aktív régió</span><strong>{regionName(game.currentRegion)}</strong></div><div><span>Aktivitás</span><strong>{game.reputationParts.activity}</strong></div><div><span>Teljesített küldetések</span><strong>{Object.values(game.questStatus).filter(s=>s==="completed").length}</strong></div><div><span>Aktív esemény</span><strong>{getCalendarState().active[0]?.title ?? "Nincs"}</strong></div><button className="outline-button" onClick={onOpenCalendar}>Királysági naptár</button></div></div></>}</>; }
