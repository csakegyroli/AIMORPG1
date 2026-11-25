"use client";

import { useCallback, useEffect, useState } from "react";
import { INITIAL_STATS, ITEMS, NPCS, NPC_FUNCTIONS, QUESTS } from "./content";
import { getEffectiveStats, getItem, makeInventoryItem, marketPrice, reputationScore, sellingPrice, XP_FOR_LEVEL } from "./rules";
import { rollReward, explainRewardRoll, nextRewardPity, type RewardPityState, type RewardRoll } from "./rewardEconomy";
import { getWorldTime } from "./worldTime";
import { craftRecipeForItem, dismantleYieldsForItem } from "./itemSystem";
import { isMarketEligible, isSellable, itemAvailableInRegion, itemLegalStatus, itemSourceLabel, itemCategory } from "./itemSystem";
import type { AvatarId, EquipmentSlot, GmMessage, InventoryItem, ItemId, JournalEntry, NpcId, QuestChoice, QuestDefinition, QuestId, QuestStatus, RegionId, ReputationBreakdown, Stats, TemporaryItemBuff, TemporaryStatBuff, StatId } from "./types";
import { addMemory, applyFacetDelta, createFacetDelta, createInitialNpcRuntime, createInitialPlayerIdentity, createInitialRelationshipFacets, identityDeltaForChoice, mergeIdentity, relationshipAggregate, stateForRelationship, npcIsPresent as npcRuntimePresent, type NpcRuntimeMap, type PlayerIdentityState, type RelationshipFacetMap, type WorldMemory } from "./simulation";
import { deriveRegionAccess } from "./campaign";
import { eyeIdentityObservation, eyeQuestObservation, eyeRelationshipObservation, eyeTravelObservation } from "./eye";
import { createInitialNarrativeState, recordDynamicEvent, sanitizeNarrativeState, syncNarrativeDirector, buildNarrativeContext, tickNarrativeRuntime, buildDialogueContext, getAvailableDialogueTopics, markDialogueTopicSeen, activateSideQuest, resolveSideQuestRuntime, evaluateSideQuestChoice, type NarrativeState } from "./narrative";

const SAVE_KEY = "aimorpg-final-demo-v1-29";
const LEGACY_SAVE_KEYS: string[] = ["aimorpg-final-demo-v1-28","aimorpg-final-demo-v1-25-2","aimorpg-final-demo-v1-26","aimorpg-final-demo-v1-27"];
const slots: EquipmentSlot[] = ["weapon", "shield", "armor", "accessory", "boots"];
const initialQuestStatus = Object.fromEntries(QUESTS.map((q) => [q.id, "available"])) as Record<QuestId, QuestStatus>;
const initialDemand = Object.fromEntries(ITEMS.map((i) => [i.id, 0])) as Record<ItemId, number>;
const initialRelationships = Object.fromEntries(NPCS.map((n) => [n.id, 0])) as Record<NpcId, number>;

function stamp() { return new Intl.DateTimeFormat("hu-HU", { dateStyle: "medium", timeStyle: "short" }).format(new Date()); }
function entry(kind: JournalEntry["kind"], title: string, text: string): JournalEntry { return { id: `${Date.now()}-${Math.random()}`, kind, title, text, at: stamp() }; }
function gm(title: string, body: string, tone: GmMessage["tone"]): GmMessage { return { id: `${Date.now()}-${Math.random()}`, title, body, tone, seen: false, at: stamp() }; }
function applyXpGain(state: GameData, amount: number) {
  let xp = state.xp + Math.max(0, Math.floor(amount));
  let level = state.level;
  let developmentPoints = state.developmentPoints;
  while (xp >= XP_FOR_LEVEL(level)) {
    xp -= XP_FOR_LEVEL(level);
    level += 1;
    developmentPoints += 3;
  }
  return { level, xp, developmentPoints };
}

function hasActivityXpMemory(state: GameData, tag: string) {
  return state.worldMemories.some(m => m.tags.includes(`activity-xp:${tag}`));
}

function addActivityMemory(state: GameData, title: string, text: string, tag: string, xp: number) {
  if (hasActivityXpMemory(state, tag)) return state;
  const gained = applyXpGain(state, xp);
  const memory = addMemory({ kind: "world", title, text, tags: ["activity", `activity-xp:${tag}`], importance: 1, at: stamp() });
  return { ...state, ...gained, worldMemories: [memory, ...state.worldMemories].slice(0, 160), reputationParts: { ...state.reputationParts, growth: state.reputationParts.growth + 1, activity: state.reputationParts.activity + 1 }, journal: [entry("system", title, `${text} +${xp} XP`), ...state.journal].slice(0, 80) };
}

function freshState() {
  const equipment = { weapon: makeInventoryItem("militiaBlade"), shield: null, armor: makeInventoryItem("paddedArmor"), accessory: null, boots: makeInventoryItem("travelerBoots") } as Record<EquipmentSlot, InventoryItem | null>;
  return {
    initialized: true, saveVersion: 6, name: "Kalandor", avatarId: "vagabond" as AvatarId, level: 12, xp: 280, gold: 12540, diamonds: 87, developmentPoints: 6,
    currentRegion: "outskirts" as RegionId, mainQuestFollowing: false, followedChapter: null as number | null, trackedQuestId: null as QuestId | null, trackedSideQuestId: null as string | null, baseStats: { ...INITIAL_STATS },
    identity: createInitialPlayerIdentity(),
    narrativeState: createInitialNarrativeState(),
    relationshipFacets: createInitialRelationshipFacets(NPCS.map((n) => n.id)),
    worldMemories: [] as WorldMemory[],
    npcStates: createInitialNpcRuntime(NPCS.map((n) => n.id), "kezdés"),
    health: 100, inventory: [makeInventoryItem("oakShield"), makeInventoryItem("guildRing"), makeInventoryItem("lurkerGloves"), makeInventoryItem("smokePhial")],
    equipment, questStatus: { ...initialQuestStatus },
    regionAccess: { outskirts: true, market: false, arena: false, harbor: false, inner: false, palace: false, forest: false } as Record<RegionId, boolean>,
    relationships: { ...initialRelationships }, marketDemand: { ...initialDemand }, temporaryStatBuffs: [] as TemporaryStatBuff[], temporaryItemBuffs: [] as TemporaryItemBuff[],
    reputationParts: { achievements: 0, decisions: 0, relationships: 0, economic: 0, growth: 0, activity: 0 },
    rewardRolls: {} as Record<QuestId, RewardRoll>,
    rewardPity: { rareMisses: 0, legendaryMisses: 0 } as RewardPityState,
    journal: [entry("world", "A Kereskedelmi Központ", "A Királyság 327. évében a piacok, műhelyek és karavánok egyetlen lüktető szívvé állnak össze.")],
    gmMessages: [gm("A Szem figyel", "A város már tudja, ki vagy. De azt még nem, mire használod a lehetőségeidet.", "world")],
  };
}

export type GameData = ReturnType<typeof freshState>;
export type GameState = GameData & {
  consumeItem: (instanceId: string) => { success: boolean; message: string }; rest: () => { success: boolean; message: string }; takeDamage: (amount: number, reason?: string) => { success: boolean; message: string }; useNpcFunction: (npcId: NpcId, functionId: string, targetId?: string) => { success: boolean; message: string };
  setName: (name: string) => void; setAvatar: (avatarId: AvatarId) => void; improveStat: (stat: keyof Stats) => void; travel: (region: RegionId) => void;
  startQuest: (questId: QuestId) => void; setMainQuestFollowing: (following: boolean) => void; followQuestChapter: (chapter: number | null) => void; trackQuest: (questId: QuestId | null) => void; trackSideQuest: (sideQuestId: string | null) => void; resolveQuest: (questId: QuestId, choice: QuestChoice) => { success: boolean; message: string };
  equip: (instanceId: string, slot: EquipmentSlot) => void; unequip: (slot: EquipmentSlot) => void;
  buy: (itemId: ItemId) => { success: boolean; message: string }; buyListing: (itemId: ItemId, goldPrice: number, diamondPrice?: number) => { success: boolean; message: string }; sell: (instanceId: string) => { success: boolean; message: string };
  interactNpc: (npcId: NpcId) => void; acceptSideQuest: (sideQuestId: string) => { success: boolean; message: string }; declineSideQuest: (sideQuestId: string) => { success: boolean; message: string }; resolveSideQuest: (sideQuestId: string, choiceId: string) => { success: boolean; message: string }; speakNpc: (npcId: NpcId, topicId?: string) => { success: boolean; message: string }; markMessagesSeen: () => void; reset: () => void;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const clamp = (value: unknown, min: number, max: number, fallback: number) =>
  typeof value === "number" && Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : fallback;

function loadInitial(): GameData {
  const base = freshState();
  if (typeof window === "undefined") return base;
  try {
    const source = [SAVE_KEY, ...LEGACY_SAVE_KEYS]
      .map((key) => ({ key, value: window.localStorage.getItem(key) }))
      .find((entry): entry is { key:string; value:string } => typeof entry.value === "string");
    if (!source) return base;
    const raw = source.value;
    const parsed: unknown = JSON.parse(raw);
    const legacyCampaignSave = source.key !== SAVE_KEY;
    if (!isRecord(parsed)) return base;

    const validItem = (value: unknown): value is InventoryItem =>
      isRecord(value) &&
      typeof value.itemId === "string" &&
      ITEMS.some((item) => item.id === value.itemId) &&
      typeof value.instanceId === "string" &&
      value.instanceId.length > 0;

    const parsedInventory = Array.isArray(parsed.inventory) ? parsed.inventory.filter(validItem) : base.inventory;
    const inventoryIds = new Set<string>();
    const cleanInventory = parsedInventory.filter((entry) => {
      if (inventoryIds.has(entry.instanceId)) return false;
      inventoryIds.add(entry.instanceId);
      return true;
    });

    const cleanEquipment = { ...base.equipment } as Record<EquipmentSlot, InventoryItem | null>;
    const equippedIds = new Set<string>();
    const parsedEquipment = isRecord(parsed.equipment) ? parsed.equipment : {};
    for (const slot of slots) {
      const candidate = parsedEquipment[slot];
      if (validItem(candidate) && getItem(candidate.itemId).slot === slot && !equippedIds.has(candidate.instanceId)) {
        cleanEquipment[slot] = candidate;
        equippedIds.add(candidate.instanceId);
      }
    }

    const finalInventory = cleanInventory.filter((entry) => !equippedIds.has(entry.instanceId));

    const cleanRelationships = { ...base.relationships };
    if (isRecord(parsed.relationships)) {
      for (const npc of NPCS) {
        cleanRelationships[npc.id] = Math.round(clamp(parsed.relationships[npc.id], -100, 100, base.relationships[npc.id]));
      }
    }

    const cleanDemand = { ...base.marketDemand };
    if (isRecord(parsed.marketDemand)) {
      for (const item of ITEMS) {
        cleanDemand[item.id] = Math.round(clamp(parsed.marketDemand[item.id], -30, 40, base.marketDemand[item.id]));
      }
    }

    const cleanReputation = { ...base.reputationParts };
    if (isRecord(parsed.reputationParts)) {
      for (const key of Object.keys(cleanReputation) as (keyof ReputationBreakdown)[]) {
        cleanReputation[key] = Math.round(clamp(parsed.reputationParts[key], 0, 1000000, base.reputationParts[key]));
      }
    }

    const cleanQuestStatus = { ...base.questStatus };
    if (isRecord(parsed.questStatus)) {
      for (const quest of QUESTS) {
        const value = parsed.questStatus[quest.id];
        if (value === "available" || value === "active" || value === "completed") {
          cleanQuestStatus[quest.id] = value;
        }
      }
    }

    const cleanRegionAccess = { ...base.regionAccess };
    if (isRecord(parsed.regionAccess)) {
      for (const region of Object.keys(base.regionAccess) as RegionId[]) {
        if (typeof parsed.regionAccess[region] === "boolean") {
          cleanRegionAccess[region] = parsed.regionAccess[region] as boolean;
        }
      }
    }

    const validRegion = (value: unknown): value is RegionId =>
      typeof value === "string" && Object.prototype.hasOwnProperty.call(base.regionAccess, value);
    const loadedRegionCandidate = parsed.currentRegion;
    const loadedRegion = validRegion(loadedRegionCandidate) && cleanRegionAccess[loadedRegionCandidate]
      ? loadedRegionCandidate
      : base.currentRegion;

    const cleanJournal = Array.isArray(parsed.journal)
      ? parsed.journal.filter((value): value is JournalEntry =>
          isRecord(value) &&
          typeof value.id === "string" &&
          typeof value.kind === "string" &&
          ["quest", "market", "world", "gm", "system"].includes(value.kind) &&
          typeof value.title === "string" &&
          typeof value.text === "string" &&
          typeof value.at === "string"
        ).slice(0, 60)
      : base.journal;

    const cleanGmMessages = Array.isArray(parsed.gmMessages)
      ? parsed.gmMessages.filter((value): value is GmMessage =>
          isRecord(value) &&
          typeof value.id === "string" &&
          typeof value.title === "string" &&
          typeof value.body === "string" &&
          ["warning", "world", "personal"].includes(value.tone as string) &&
          typeof value.seen === "boolean" &&
          typeof value.at === "string"
        ).slice(0, 20)
      : base.gmMessages;

    const avatarId: AvatarId = parsed.avatarId === "ranger" ? "ranger" : "vagabond";
    const name = typeof parsed.name === "string" ? parsed.name.trim().slice(0, 22) || base.name : base.name;

    const cleanIdentity = createInitialPlayerIdentity();
    if (isRecord(parsed.identity)) {
      if (isRecord(parsed.identity.axes)) for (const axis of Object.keys(cleanIdentity.axes) as (keyof typeof cleanIdentity.axes)[]) cleanIdentity.axes[axis] = Math.round(clamp(parsed.identity.axes[axis], -100, 100, cleanIdentity.axes[axis]));
      if (isRecord(parsed.identity.affinities)) for (const key of Object.keys(cleanIdentity.affinities) as (keyof typeof cleanIdentity.affinities)[]) cleanIdentity.affinities[key] = Math.round(clamp(parsed.identity.affinities[key], 0, 100, cleanIdentity.affinities[key]));
    }
    const cleanFacets: RelationshipFacetMap = createInitialRelationshipFacets(NPCS.map((n) => n.id));
    for (const npc of NPCS) {
      const rawFacet = isRecord(parsed.relationshipFacets) ? parsed.relationshipFacets[npc.id] : undefined;
      if (isRecord(rawFacet)) {
        cleanFacets[npc.id] = { trust: Math.round(clamp(rawFacet.trust, -100, 100, 0)), respect: Math.round(clamp(rawFacet.respect, -100, 100, 0)), affection: Math.round(clamp(rawFacet.affection, -100, 100, 0)), fear: Math.round(clamp(rawFacet.fear, -100, 100, 0)), debt: Math.round(clamp(rawFacet.debt, -100, 100, 0)), suspicion: Math.round(clamp(rawFacet.suspicion, -100, 100, 0)) };
      } else {
        const legacy = cleanRelationships[npc.id] ?? 0;
        cleanFacets[npc.id] = { trust: legacy, respect: legacy, affection: legacy > 0 ? Math.round(legacy / 3) : 0, fear: legacy < 0 ? Math.round(Math.abs(legacy) / 2) : 0, debt: 0, suspicion: legacy < 0 ? Math.round(Math.abs(legacy) / 2) : 0 };
      }
    }
    const syncRelationships = { ...cleanRelationships };
    for (const npc of NPCS) syncRelationships[npc.id] = relationshipAggregate(cleanFacets[npc.id]);
    const cleanMemories = Array.isArray(parsed.worldMemories) ? parsed.worldMemories.filter((v): v is WorldMemory => isRecord(v) && typeof v.id === "string" && typeof v.kind === "string" && typeof v.title === "string" && typeof v.text === "string" && typeof v.at === "string" && Array.isArray(v.tags)).slice(0,120) : base.worldMemories;
    const cleanNpcStates: NpcRuntimeMap = createInitialNpcRuntime(NPCS.map((n) => n.id), "migráció");
    if (isRecord(parsed.npcStates)) for (const npc of NPCS) {
      const rawState = parsed.npcStates[npc.id];
      if (isRecord(rawState) && typeof rawState.status === "string" && typeof rawState.updatedAt === "string") {
        const allowed = ["normal","friendly","suspicious","angry","injured","traveling","missing","disgraced","promoted"];
        if (allowed.includes(rawState.status)) cleanNpcStates[npc.id] = { status: rawState.status as any, updatedAt: rawState.updatedAt, note: typeof rawState.note === "string" ? rawState.note : undefined };
      }
    }

    const cleanTemporaryStatBuffs: TemporaryStatBuff[] = Array.isArray(parsed.temporaryStatBuffs) ? parsed.temporaryStatBuffs.filter((v): v is TemporaryStatBuff => isRecord(v) && typeof v.id === "string" && typeof v.stat === "string" && typeof v.amount === "number" && typeof v.expiresAt === "number" && typeof v.source === "string") : [];
    const cleanTemporaryItemBuffs: TemporaryItemBuff[] = Array.isArray(parsed.temporaryItemBuffs) ? parsed.temporaryItemBuffs.filter((v): v is TemporaryItemBuff => isRecord(v) && typeof v.instanceId === "string" && typeof v.stat === "string" && typeof v.amount === "number" && typeof v.expiresAt === "number" && typeof v.source === "string") : [];
    const migratedState = {
      gold: Math.round(clamp(parsed.gold, 0, 1000000000, base.gold)),
      questStatus: cleanQuestStatus,
      reputationParts: cleanReputation,
      relationships: syncRelationships,
      identity: cleanIdentity,
    };
    const derivedAccess = deriveRegionAccess({ ...migratedState, regionAccess: legacyCampaignSave ? {} : (isRecord(parsed.regionAccess) ? parsed.regionAccess as Partial<Record<RegionId,boolean>> : {}) });
    const finalLoadedRegion = validRegion(loadedRegion) && derivedAccess[loadedRegion] ? loadedRegion : (derivedAccess["inner"] ? "inner" : derivedAccess["market"] ? "market" : "outskirts");

    return {
      ...base,
      saveVersion: 3,
      name,
      avatarId,
      level: Math.round(clamp(parsed.level, 1, 100, base.level)),
      xp: Math.round(clamp(parsed.xp, 0, 1000000, base.xp)),
      gold: Math.round(clamp(parsed.gold, 0, 1000000000, base.gold)),
      diamonds: Math.round(clamp(parsed.diamonds, 0, 1000000, base.diamonds)),
      developmentPoints: Math.round(clamp(parsed.developmentPoints, 0, 1000000, base.developmentPoints)),
      health: Math.round(clamp(parsed.health, 0, 500, base.health)),
      currentRegion: finalLoadedRegion,
      mainQuestFollowing: Boolean(parsed.mainQuestFollowing),
      followedChapter: typeof parsed.followedChapter === "number" && Number.isInteger(parsed.followedChapter) ? parsed.followedChapter : (typeof parsed.trackedQuestId === "string" ? QUESTS.find(q => q.id === parsed.trackedQuestId)?.chapter ?? null : null),
      trackedQuestId: typeof parsed.trackedQuestId === "string" && QUESTS.some(q => q.id === parsed.trackedQuestId) ? parsed.trackedQuestId as QuestId : null,
      trackedSideQuestId: typeof parsed.trackedSideQuestId === "string" ? parsed.trackedSideQuestId : null,
      baseStats: {
        ...base.baseStats,
        ...Object.fromEntries(
          Object.keys(base.baseStats).map((key) => [
            key,
            Math.round(clamp(isRecord(parsed.baseStats) ? parsed.baseStats[key] : undefined, 0, 1000, base.baseStats[key as keyof Stats])),
          ])
        ),
      } as Stats,
      inventory: finalInventory,
      equipment: cleanEquipment,
      questStatus: cleanQuestStatus,
      regionAccess: derivedAccess,
      relationships: syncRelationships,
      relationshipFacets: cleanFacets,
      temporaryStatBuffs: cleanTemporaryStatBuffs.filter(b => b.expiresAt > Date.now()),
      temporaryItemBuffs: cleanTemporaryItemBuffs.filter(b => b.expiresAt > Date.now()),
      identity: cleanIdentity,
      narrativeState: sanitizeNarrativeState(parsed.narrativeState),
      worldMemories: cleanMemories,
      npcStates: cleanNpcStates,
      marketDemand: cleanDemand,
      reputationParts: cleanReputation,
      rewardRolls: (() => {
        const rawRolls = isRecord(parsed.rewardRolls) ? parsed.rewardRolls : {};
        const clean: Record<QuestId, RewardRoll> = {};
        for (const q of QUESTS) {
          const r = rawRolls[q.id];
          if (isRecord(r) && typeof r.sourceId === "string" && typeof r.seed === "string" && typeof r.roll === "number" && typeof r.lootRoll === "number" && typeof r.gold === "number" && typeof r.xp === "number") clean[q.id] = r as unknown as RewardRoll;
        }
        return clean;
      })(),
      rewardPity: (() => {
        const p = isRecord(parsed.rewardPity) ? parsed.rewardPity : {};
        return { rareMisses: Math.max(0, Math.floor(typeof p.rareMisses === "number" ? p.rareMisses : 0)), legendaryMisses: Math.max(0, Math.floor(typeof p.legendaryMisses === "number" ? p.legendaryMisses : 0)) };
      })(),
      journal: cleanJournal.length ? cleanJournal : base.journal,
      gmMessages: cleanGmMessages.length ? cleanGmMessages : base.gmMessages,
    };
  } catch {
    return base;
  }
}

function getEffectiveStatsWithBuffs(state: GameData) {
  return getEffectiveStats(state.baseStats, state.equipment, state.temporaryStatBuffs, state.temporaryItemBuffs);
}

export function useGameStore(): GameState {
  const [data, setData] = useState<GameData>(freshState);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => { setData(loadInitial()); setHydrated(true); }, []);
  const update = useCallback((fn: (state: GameData) => GameData) => setData((s) => { const next=fn(s); return { ...next, regionAccess: deriveRegionAccess(next) }; }), []);
  useEffect(() => { if (!hydrated) return; try { window.localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch { /* storage unavailable */ } }, [data, hydrated]);
  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setInterval(() => {
      setData((s) => {
        const wt = getWorldTime();
        const context = buildNarrativeContext({
          region: s.currentRegion,
          playerIdentity: s.identity,
          relationshipFacets: s.relationshipFacets,
          memories: s.worldMemories,
          npcStates: s.npcStates,
          questStatus: s.questStatus,
          activeQuestId: s.trackedQuestId,
          worldHour: wt.hour,
          eyeSignals: s.gmMessages.slice(0, 6).map(m => ({ title: m.title, body: m.body, tone: m.tone })),
        });
        const nextNarrative = tickNarrativeRuntime(s.narrativeState, context, Date.now());
        const before = new Set(s.narrativeState.runtime.sideQuests.records.filter(r=>r.status==="offered").map(r=>r.id));
        const freshSide = nextNarrative.runtime.sideQuests.records.filter(r=>r.status==="offered" && !before.has(r.id)).slice(0,2);
        const previouslyOpen = new Set(s.narrativeState.runtime.sideQuests.records.filter(r=>r.status==="offered" || r.status==="active").map(r=>r.id));
        const newlyExpired = nextNarrative.runtime.sideQuests.records.filter(r=>r.status==="expired" && previouslyOpen.has(r.id)).slice(0,2);
        const beforeEvents = new Set(s.narrativeState.runtime.worldEvents.events.map(e=>e.id));
        const freshEvents = nextNarrative.runtime.worldEvents.events.filter(e=>e.status==="active" && !beforeEvents.has(e.id)).slice(0,2);
        let messages = s.gmMessages;
        if (freshSide.length) {
          const names = freshSide.map(r=>NPCS.find(n=>n.id===r.blueprint.giver)?.name ?? "Valaki").join(", ");
          messages = [gm("A Szem figyel", `${names} története most érhet el hozzád. Nézd meg a Mellékküldetéseket.`, "personal"), ...messages].slice(0,20);
        }
        if (freshEvents.length) {
          messages = [gm("Világhír", freshEvents[0].title, "world"), ...messages].slice(0,20);
        }
        if (newlyExpired.length) {
          const expiredNames = newlyExpired.map(r => r.blueprint.objective.summary).join(", ");
          messages = [gm("Lejárt történet", `${expiredNames}: a határidő lejárt. A világ megőrzi a történet lezáratlan kimenetelét.`, "warning"), ...messages].slice(0,20);
        }
        const trackedSideQuestId = s.trackedSideQuestId && nextNarrative.runtime.sideQuests.records.some(r=>r.id===s.trackedSideQuestId && r.status==="active") ? s.trackedSideQuestId : null;
        return { ...s, trackedSideQuestId, narrativeState: nextNarrative, gmMessages: messages };
      });
    }, 30_000);
    return () => window.clearInterval(timer);
  }, [hydrated]);

  const setName = useCallback((name: string) => update((s) => ({ ...s, name: name.trim().slice(0, 22) || "Kalandor" })), [update]);
  const setAvatar = useCallback((avatarId: AvatarId) => update((s) => {
    if (avatarId !== "vagabond" && avatarId !== "ranger") return s;
    if (s.avatarId === avatarId) return s;
    return { ...s, avatarId, journal: [entry("system", "Új külső", "A karaktered új megjelenést választott."), ...s.journal].slice(0, 60) };
  }), [update]);
  const improveStat = useCallback((stat: keyof Stats) => update((s) => {
    if (s.developmentPoints < 1 || !(stat in s.baseStats)) return s;
    const next = { ...s.baseStats, [stat]: s.baseStats[stat] + 1 };
    return { ...s, baseStats: next, developmentPoints: s.developmentPoints - 1, reputationParts: { ...s.reputationParts, growth: s.reputationParts.growth + 1 }, journal: [entry("system", "Fejlődés", `${String(stat)} tulajdonságod nőtt.`), ...s.journal].slice(0, 60) };
  }), [update]);
  const travel = useCallback((region: RegionId) => update((s) => {
    if (!s.regionAccess[region] || s.currentRegion === region) return s;
    const names: Record<RegionId,string> = { outskirts:"Külváros", market:"Kereskedelmi Központ", arena:"Aréna", harbor:"Kikötő", inner:"Belváros", palace:"Királyi Palota", forest:"Zárt Erdő" };
    const firstVisit = !s.worldMemories.some(m => m.kind === "travel" && m.region === region);
    const memory = addMemory({ kind:"travel", title:"Új helyszín", text:`Megérkeztél: ${names[region]}.`, region, tags:["travel", region], importance:firstVisit?2:1, at:stamp() });
    const eye = eyeTravelObservation(names[region], firstVisit);
    const narrativeState = recordDynamicEvent(s.narrativeState, { type:"travel", at:stamp(), region, tags:["travel", region], summary:`Megérkezés: ${names[region]}.`, importance:firstVisit?2:1 });
    const narrativeNext = syncNarrativeDirector(narrativeState, buildNarrativeContext({ region, playerIdentity:s.identity, relationshipFacets:s.relationshipFacets, memories:[memory,...s.worldMemories], npcStates:s.npcStates, questStatus:s.questStatus, activeQuestId:s.trackedQuestId, worldHour:getWorldTime().hour, eyeSignals:s.gmMessages.slice(0,6).map(m=>({title:m.title,body:m.body,tone:m.tone})) }), stamp());
    return { ...s, currentRegion: region, narrativeState:narrativeNext, worldMemories:[memory, ...s.worldMemories].slice(0,120), reputationParts: { ...s.reputationParts, activity: s.reputationParts.activity + 1 }, journal: [entry("world", "Új tartózkodási hely", `Megérkeztél: ${names[region]}.`), ...s.journal].slice(0,60), gmMessages: eye ? [gm(eye.title, eye.body, eye.tone), ...s.gmMessages].slice(0,20) : s.gmMessages };
  }), [update]);
  const nextMainQuestId = (s: GameData, currentQuestId?: QuestId | null, chapter?: number | null) => {
    const ordered = [...QUESTS].filter(q => chapter == null || q.chapter === chapter).sort((a,b) => a.sequence-b.sequence);
    const startIndex = currentQuestId ? Math.max(0, ordered.findIndex(q => q.id === currentQuestId) + 1) : 0;
    const candidates = ordered.slice(startIndex);
    for (const q of candidates) {
      if (s.questStatus[q.id] === "completed") continue;
      if (!s.regionAccess[q.region]) continue;
      if (q.requires && s.questStatus[q.requires] !== "completed") continue;
      if ((q.minReputation ?? 0) > reputationScore(s.reputationParts)) continue;
      if ((q.entryCost ?? 0) > s.gold) continue;
      return q.id;
    }
    return null;
  };
  const setMainQuestFollowing = useCallback((following: boolean) => update((s) => {
    if (!following) return { ...s, mainQuestFollowing: false, followedChapter: null, trackedQuestId: null };
    if (s.mainQuestFollowing && s.followedChapter !== null) return s;
    const currentActive = QUESTS.find(q => s.questStatus[q.id] === "active");
    const chapter = currentActive?.chapter ?? 1;
    const target = currentActive?.id ?? nextMainQuestId(s, null, chapter);
    return { ...s, mainQuestFollowing: true, followedChapter: chapter, trackedQuestId: target };
  }), [update]);
  const followQuestChapter = useCallback((chapter: number | null) => update((s) => {
    if (chapter === null) return { ...s, mainQuestFollowing: false, followedChapter: null, trackedQuestId: null };
    const chapterQuests = QUESTS.filter(q => q.chapter === chapter).sort((a,b) => a.sequence-b.sequence);
    if (!chapterQuests.length) return s;
    const active = chapterQuests.find(q => s.questStatus[q.id] === "active");
    const target = active?.id ?? nextMainQuestId(s, null, chapter);
    if (!target) return { ...s, mainQuestFollowing: false, followedChapter: null, trackedQuestId: null };
    return { ...s, mainQuestFollowing: true, followedChapter: chapter, trackedQuestId: target };
  }), [update]);
  const trackSideQuest = useCallback((sideQuestId: string | null) => update((s) => ({ ...s, trackedSideQuestId: sideQuestId })), [update]);
  const trackQuest = useCallback((questId: QuestId | null) => update((s) => {
    if (questId === null) return { ...s, mainQuestFollowing: false, followedChapter: null, trackedQuestId: null };
    const q = QUESTS.find(x => x.id === questId);
    if (!q || s.questStatus[q.id] === "completed" || !s.regionAccess[q.region]) return s;
    return { ...s, mainQuestFollowing: true, followedChapter: q.chapter, trackedQuestId: q.id };
  }), [update]);
  const countItem = (state: GameData, itemId: string) => state.inventory.reduce((sum, inv) => sum + (inv.itemId === itemId ? 1 : 0), 0);
  const requirementsMet = (state: GameData, q: QuestDefinition) => {
    for (const r of q.requirements ?? []) {
      if (r.itemId && countItem(state, r.itemId) < (r.count ?? 1)) return false;
      if (r.gold && state.gold < r.gold) return false;
      if (r.reputation && reputationScore(state.reputationParts) < r.reputation) return false;
      if (r.stat && (getEffectiveStatsWithBuffs(state)[r.stat] ?? 0) < (r.statMin ?? 0)) return false;
      if (r.npcId && (state.relationships[r.npcId] ?? 0) < (r.relationMin ?? 0)) return false;
    }
    return true;
  };
  const consumeRequirements = (state: GameData, q: QuestDefinition) => {
    let inventory=[...state.inventory];
    for (const r of q.requirements ?? []) {
      if (!r.itemId || !r.consume) continue;
      let left=r.count ?? 1;
      inventory=inventory.filter(inv=>{ if(left>0 && inv.itemId===r.itemId){left--; return false;} return true; });
    }
    return inventory;
  };
  const startQuest = useCallback((questId: QuestId) => update((s) => {
    const q = QUESTS.find(x => x.id === questId); if (!q || s.questStatus[questId] !== "available" || !s.regionAccess[q.region]) return s;
    const giver = NPCS.find(n => n.id === q.giver); if (!giver || s.currentRegion !== q.region || !npcRuntimePresent(giver, getWorldTime().hour, s.npcStates[giver.id])) return s;
    if (q.requires && s.questStatus[q.requires] !== "completed") return s;
    if ((q.minReputation ?? 0) > reputationScore(s.reputationParts)) return s;
    if ((q.entryCost ?? 0) > s.gold) return s;
    const auditMemory = q.audit ? addMemory({ kind:"quest", title:"A történet egy helyhez kötődött", text:`${q.title}: ${q.audit.playerExperience}`, npcId:q.giver, region:q.region, district:NPCS.find(n=>n.id===q.giver)?.district, tags:["quest","main","audit",...q.audit.memoryTags], importance:2, at:stamp() }) : null;
    const memory = addMemory({ kind:"quest", title:"Új küldetés emléke", text:`Felvetted: ${q.title}.`, npcId:q.giver, region:q.region, district:NPCS.find(n=>n.id===q.giver)?.district, tags:["quest","main",`chapter:${q.chapter}`], importance:2, at:stamp() });
    const hasPriorQuestInRegion = s.worldMemories.some(m => m.kind === "quest" && m.region === q.region);
    const eye = eyeQuestObservation(q.title, true, !hasPriorQuestInRegion);
    const narrativeState = recordDynamicEvent(s.narrativeState, { type:"quest_started", at:stamp(), questId:q.id, npcId:q.giver, region:q.region, tags:["main", `chapter:${q.chapter}`], summary:`Megnyílt: ${q.title}.`, importance:2 });
    const narrativeNext = syncNarrativeDirector(narrativeState, buildNarrativeContext({ region:s.currentRegion, playerIdentity:s.identity, relationshipFacets:s.relationshipFacets, memories:[memory,...s.worldMemories], npcStates:s.npcStates, questStatus:{...s.questStatus,[questId]:"active"}, activeQuestId:q.id, worldHour:getWorldTime().hour, eyeSignals:s.gmMessages.slice(0,6).map(m=>({title:m.title,body:m.body,tone:m.tone})) }), stamp());
    return { ...s, narrativeState:narrativeNext, gold: s.gold - (q.entryCost ?? 0), questStatus: { ...s.questStatus, [questId]: "active" }, worldMemories:[...(auditMemory?[auditMemory]:[]),memory, ...s.worldMemories].slice(0,120), journal: [entry("quest", "Küldetés felvéve", q.title), ...(q.audit ? [entry("world", "Funkcionális történeti kapcsolat", q.audit.playerExperience)] : []), ...s.journal].slice(0,60), gmMessages: eye ? [gm(eye.title, eye.body, eye.tone), ...s.gmMessages].slice(0,20) : s.gmMessages };
  }), [update]);
  const resolveQuest = useCallback((questId: QuestId, choice: QuestChoice) => {
    let result = { success: false, message: "A fő cél még nincs teljesítve." };
    setData((s) => {
      const q=QUESTS.find(x=>x.id===questId);
      if(!q || s.questStatus[questId]!=="active"){ result.message="Előbb vedd fel ezt a küldetést."; return s; }
      if(!requirementsMet(s,q)){
        const missing=(q.requirements??[]).filter(r=>{
          if(r.itemId) return countItem(s,r.itemId) < (r.count??1);
          if(r.gold) return s.gold < r.gold;
          if(r.reputation) return reputationScore(s.reputationParts) < r.reputation;
          if(r.stat) return (getEffectiveStatsWithBuffs(s)[r.stat]??0) < (r.statMin??0);
          if(r.npcId) return (s.relationships[r.npcId]??0) < (r.relationMin??0);
          return false;
        });
        result.message=missing.length ? `Még hiányzik: ${missing.map(m=>m.itemId ? `${m.count??1} × ${getItem(m.itemId).name}` : m.label).join(", ")}.` : "A történet még nem tud tovább lépni.";
        return s;
      }
      const effective=getEffectiveStatsWithBuffs(s);
      const itemBonus=Object.values(s.equipment).reduce((sum,e)=>sum+(e?getItem(e.itemId).effects?.questBonus??0:0),0);
      const success=effective[choice.stat]+itemBonus >= choice.requirement;
      const gained=success?choice.reputation:{achievements:1,decisions:1,relationships:0,economic:0,growth:0};
      const parts={achievements:s.reputationParts.achievements+gained.achievements,decisions:s.reputationParts.decisions+gained.decisions,relationships:s.reputationParts.relationships+gained.relationships,economic:s.reputationParts.economic+gained.economic,growth:s.reputationParts.growth+gained.growth,activity:s.reputationParts.activity+1};
      let level=s.level,xp=s.xp+(success?choice.xp:Math.ceil(choice.xp/3)),developmentPoints=s.developmentPoints;
      while(xp>=XP_FOR_LEVEL(level)){xp-=XP_FOR_LEVEL(level);level++;developmentPoints+=3;}
      const nextStatus={...s.questStatus,[questId]:"completed" as QuestStatus};
      const trialText=success?choice.text:`A választott út kudarcot vallott, de a történet nem zárult le: ${q.dramaturgy?.failForward ?? "a nyom más módon folytatódik."}`;
      const beforeIdentity=s.identity; const identity=mergeIdentity(s.identity,identityDeltaForChoice(choice));
      const beforeFacets=s.relationshipFacets[choice.relation.npc]; const facets={...s.relationshipFacets,[choice.relation.npc]:applyFacetDelta(beforeFacets,createFacetDelta(choice,success))};
      const rel=relationshipAggregate(facets[choice.relation.npc]); const npcState=stateForRelationship(facets[choice.relation.npc]);
      const consumedInventory=consumeRequirements(s,q);
      const questRewardItems=success ? (q.rewards?.items??[]).flatMap(r=>Array.from({length:Math.max(0,r.count)},()=>makeInventoryItem(r.itemId))) : [];
      const existingRoll = s.rewardRolls[q.id];
      const rewardRoll = success ? (existingRoll ?? rollReward({ sourceId: q.id, kind: q.kind, region: q.region, questId: q.id, playerLevel: s.level, luckModifier: 0, pity: s.rewardPity })) : null;
      const dynamicRewardGold = rewardRoll?.gold ?? 0;
      const dynamicRewardDiamonds = rewardRoll?.diamonds ?? 0;
      const dynamicRewardItems = rewardRoll?.itemId ? [makeInventoryItem(rewardRoll.itemId)] : [];
      const nextPity = rewardRoll ? nextRewardPity(s.rewardPity, rewardRoll.rarity) : s.rewardPity;
      const inventoryAfterReward=[...consumedInventory,...questRewardItems,...dynamicRewardItems];
      if(inventoryAfterReward.length>80){ result={success:false,message:"A küldetés jutalma nem férne el a táskádban. Előbb szabadíts fel helyet."}; return s; }
      const memory=addMemory({kind:"choice",title:success?"A döntés emléke":"A kudarc emléke",text:`${q.title}: ${trialText}`,npcId:choice.relation.npc,region:q.region,district:NPCS.find(n=>n.id===choice.relation.npc)?.district,tags:["quest",success?"success":"failure",choice.consequenceTag??choice.stat],importance:success?3:2,at:stamp()});
      const dramatic=q.dramaturgy ? addMemory({kind:"world",title:q.dramaturgy.reveal,text:q.dramaturgy.consequence,npcId:q.giver,region:q.region,district:NPCS.find(n=>n.id===q.giver)?.district,tags:["quest","twist",choice.consequenceTag??"story"],importance:4,at:stamp()}) : null;
      const eye=eyeQuestObservation(q.title,success,false);
      const access={...s.regionAccess};
      let nextTracked=s.trackedQuestId;
      if(s.mainQuestFollowing){const tmp={...s,questStatus:nextStatus,regionAccess:access,reputationParts:parts,gold:s.gold+(success?choice.gold:4),inventory:consumedInventory}; nextTracked=nextMainQuestId(tmp,q.id,s.followedChapter);}
      const rewardGold=q.rewards?.gold??0;
      const rewardDiamonds=q.rewards?.diamonds??0;
      const finalState={...s,saveVersion:6,trackedQuestId:nextTracked,level,xp,developmentPoints,gold:s.gold+(success?choice.gold:4)+(success?rewardGold:0)+(success?dynamicRewardGold:0),diamonds:s.diamonds+(success?rewardDiamonds:0)+(success?dynamicRewardDiamonds:0),reputationParts:parts,identity,relationships:{...s.relationships,[choice.relation.npc]:rel},relationshipFacets:facets,npcStates:{...s.npcStates,[choice.relation.npc]:{status:npcState,updatedAt:stamp(),note:trialText.slice(0,120)}},inventory:inventoryAfterReward,rewardRolls: rewardRoll ? { ...s.rewardRolls, [q.id]: rewardRoll } : s.rewardRolls,rewardPity: nextPity,worldMemories:[...(dramatic?[dramatic]:[]),memory,...s.worldMemories].slice(0,160),questStatus:nextStatus,journal:[entry("quest",success?"Küldetés teljesítve":"A terv félresiklott",`${q.title}: ${trialText}${rewardRoll ? ` · Jutalom: ${explainRewardRoll(rewardRoll)}` : ""}`),...(dramatic?[entry("world","A történet fordulatot vett",dramatic.text)]:[]),...s.journal].slice(0,80),gmMessages:eye?[gm(eye.title,eye.body,eye.tone),...s.gmMessages].slice(0,20):s.gmMessages};
      finalState.regionAccess=deriveRegionAccess(finalState);
      finalState.narrativeState=recordDynamicEvent(finalState.narrativeState,{type:"quest_resolved",at:stamp(),questId:q.id,npcId:q.giver,region:q.region,tags:["main",success?"success":"failure",choice.consequenceTag??choice.stat,`chapter:${q.chapter}`],summary:`${q.title}: ${success?"siker":"kudarc"}.`,importance:success?4:3});
      finalState.narrativeState=syncNarrativeDirector(finalState.narrativeState,buildNarrativeContext({region:finalState.currentRegion,playerIdentity:finalState.identity,relationshipFacets:finalState.relationshipFacets,memories:finalState.worldMemories,npcStates:finalState.npcStates,questStatus:finalState.questStatus,activeQuestId:finalState.trackedQuestId,worldHour:getWorldTime().hour,eyeSignals:finalState.gmMessages.slice(0,6).map(m=>({title:m.title,body:m.body,tone:m.tone}))}),stamp());
      result={success,message: success ? (q.dramaturgy?.consequence ?? choice.text) : trialText};
      return finalState;
    });
    return result;
  }, []);
  const consumeItem = useCallback((instanceId: string) => {
    let result={success:false,message:"Ezt a tárgyat most nem tudod használni."};
    setData(s=>{
      const owned=s.inventory.find(x=>x.instanceId===instanceId);
      if(!owned) return s;
      const item=getItem(owned.itemId);
      const stats=getEffectiveStatsWithBuffs(s);
      const max=100+Math.max(0,stats.endurance)*5;
      const heal=Math.ceil(max*(item.effects?.healPercent??0)/100)+(item.effects?.heal??0);
      if(item.effects?.tempStrength){
        const buff:TemporaryStatBuff={id:"alchemy-strength",stat:"strength",amount:item.effects.tempStrength,expiresAt:Date.now()+Math.max(1,item.effects.tempHours??1)*60*60*1000,source:item.name};
        result={success:true,message:`${item.name}: +${buff.amount} Erő ${item.effects.tempHours??1} órára. A hatás nem halmozható.`};
        return {...s,temporaryStatBuffs:s.temporaryStatBuffs.filter(b=>b.id!==buff.id).concat(buff),inventory:s.inventory.filter(x=>x.instanceId!==instanceId),journal:[entry("system","Alkímiai erősítés",`${item.name} · +${buff.amount} Erő, időleges hatás.`),...s.journal].slice(0,60)};
      }
      if(item.effects?.tempItemStat){result={success:false,message:"Ezt az erősítő oldatot egy felszerelt tárgyon kell alkalmazni."};return s;}
      if(item.effects?.statBoost){
        const boosts=item.effects.statBoost;
        const usedTag=`knowledge:${item.id}`;
        if(hasActivityXpMemory(s,usedTag)) { result={success:false,message:`Már elsajátítottad ${item.name} tudását.`}; return s; }
        const nextBase={...s.baseStats};
        Object.entries(boosts).forEach(([stat,value])=>{ if(typeof value==='number' && stat in nextBase) nextBase[stat as keyof Stats]=(nextBase[stat as keyof Stats]??0)+value; });
        const gained=applyXpGain(s,3);
        const memory=addMemory({kind:"world",title:"Megismert tudás",text:`Használtad: ${item.name}. ${item.description}`,tags:["item-use",`activity-xp:${usedTag}`],importance:2,at:stamp()});
        result={success:true,message:`${item.name} használata végleges tudást adott. ${Object.entries(boosts).map(([stat,v])=>`+${v} ${stat}`).join(" · ")}`};
        return {...s,baseStats:nextBase,inventory:s.inventory.filter(x=>x.instanceId!==instanceId),...gained,worldMemories:[memory,...s.worldMemories].slice(0,160),journal:[entry("system","Tudás megszerzése",`${item.name} · maradandó hatás. +3 XP`),...s.journal].slice(0,80),reputationParts:{...s.reputationParts,growth:s.reputationParts.growth+1,activity:s.reputationParts.activity+1}};
      }
      if(itemCategory(item)!=="consumable" || heal<=0){result={success:false,message:"Ezt a tárgyat most nem tudod használni."};return s;}
      if(s.health>=max){result={success:false,message:"Már teljes az életerőd."};return s;}
      const restored=Math.min(max-s.health,heal);
      result={success:true,message:`${item.name}: +${restored} életerő.`};
      return {...s,health:s.health+restored,inventory:s.inventory.filter(x=>x.instanceId!==instanceId),journal:[entry("system","Élelem felhasználva",`${item.name} · +${restored} életerő.`),...s.journal].slice(0,60)};
    });
    return result;
  }, []);
  const rest = useCallback(() => { let result={success:false,message:""}; setData(s=>{ const max=100+Math.max(0,getEffectiveStatsWithBuffs(s).endurance)*5; if(s.health>=max){result={success:false,message:"Már teljes az életerőd."};return s;} result={success:true,message:"Pihentél. Az életerőd teljesen helyreállt."}; return {...s,health:max,journal:[entry("system","Pihenés","A hős kipihente a nap terheit.") ,...s.journal].slice(0,60)}; }); return result; }, []);
  const takeDamage = useCallback((amount:number, reason="Harc") => { let result={success:false,message:""}; setData(s=>{ const dmg=Math.max(0,Math.min(500,Math.floor(amount))); if(dmg<=0)return s; const hp=Math.max(0,s.health-dmg); result={success:true,message:`-${dmg} életerő · ${reason}.`}; return {...s,health:hp,journal:[entry("system","Életerő változás",`${reason}: -${dmg} életerő.`),...s.journal].slice(0,60)}; }); return result; }, []);
  const equip = useCallback((instanceId: string, slot: EquipmentSlot) => update((s) => { const instance=s.inventory.find(x=>x.instanceId===instanceId); if(!instance || getItem(instance.itemId).slot!==slot) return s; const old=s.equipment[slot]; const equipment={...s.equipment,[slot]:instance}; const max=100+Math.max(0,getEffectiveStats(s.baseStats,equipment).endurance)*5; return {...s, health:Math.min(s.health,max), inventory:[...s.inventory.filter(x=>x.instanceId!==instanceId),...(old?[old]:[])],equipment}; }), [update]);
  const unequip = useCallback((slot: EquipmentSlot) => update((s) => { const old=s.equipment[slot]; if(!old) return s; const equipment={...s.equipment,[slot]:null}; const max=100+Math.max(0,getEffectiveStats(s.baseStats,equipment).endurance)*5; return {...s,health:Math.min(s.health,max),inventory:[...s.inventory,old],equipment}; }), [update]);
  const buy = useCallback((itemId: ItemId) => {
    const s = data;
    const item = getItem(itemId);
    if (!isMarketEligible(item) || !itemAvailableInRegion(item, s.currentRegion)) {
      return { success:false, message:`Ezt a tárgyat a jelenlegi régió piacán nem forgalmazzák.` };
    }
    if (s.inventory.length>=80) {
      return { success:false, message:"A táskád megtelt (80/80)." };
    }
    const demand = s.marketDemand[itemId] ?? 0;
    const price = marketPrice(item.basePrice,demand,s.relationships.ilren,s.equipment,s.currentRegion,item.id);
    const diamondPrice = item.diamondPrice ?? 0;
    if (s.gold<price || s.diamonds<diamondPrice) {
      return { success:false, message: diamondPrice>0 ? `Ehhez ${price} arany és ${diamondPrice} 💎 szükséges.` : `Nincs elég aranyad.` };
    }
    setData({
      ...s,
      gold:s.gold-price,
      diamonds:s.diamonds-diamondPrice,
      inventory:[...s.inventory,makeInventoryItem(itemId)],
      marketDemand:{...s.marketDemand,[itemId]:Math.min(40,demand+4)},
      reputationParts:{...s.reputationParts,economic:s.reputationParts.economic+1},
      journal:[entry("market","Vásárlás",`${item.name} — ${price} arany${diamondPrice?` + ${diamondPrice} gyémánt`:""}.`),...s.journal].slice(0,60)
    });
    return { success:true, message: diamondPrice>0 ? `${item.name} megvásárolva: ${price} arany + ${diamondPrice} 💎.` : `${item.name} a táskádba került.` };
  }, [data]);
  const buyListing = useCallback((itemId: ItemId, goldPrice: number, diamondPrice = 0) => { let result={success:false,message:"Nincs elég fizetőeszközöd."}; setData(s=>{ if(!Number.isInteger(goldPrice) || goldPrice<1 || goldPrice>1000000 || !Number.isInteger(diamondPrice) || diamondPrice<0 || diamondPrice>100){result={success:false,message:"Érvénytelen piactéri ajánlat."};return s;} if(s.inventory.length>=80){result={success:false,message:"A táskád megtelt (80/80)."};return s;} if(s.gold<goldPrice || s.diamonds<diamondPrice){ result={success:false,message: diamondPrice ? `Ehhez ${goldPrice} arany és ${diamondPrice} 💎 szükséges.` : "Nincs elég aranyad."}; return s; } const item=getItem(itemId); if(!isMarketEligible(item)){result={success:false,message:"Ez a tárgy nem kerülhet játékospiaci forgalomba."}; return s;} result={success:true,message:`Megvetted ${item.name} tárgyat a játékospiacon.`}; return {...s,gold:s.gold-goldPrice,diamonds:s.diamonds-diamondPrice,inventory:[...s.inventory,makeInventoryItem(itemId)],reputationParts:{...s.reputationParts,economic:s.reputationParts.economic+1},journal:[entry("market","Játékospiaci vásárlás",`${item.name} — ${goldPrice} arany${diamondPrice?` + ${diamondPrice} gyémánt`:""}.`),...s.journal].slice(0,60),gmMessages:[gm("A Szem észrevette a cserét",`Egy játékospiaci tranzakció új tárgyat hozott a készletedbe: ${item.name}.`,"world"),...s.gmMessages].slice(0,20)}; }); return result; }, []);
  const sell = useCallback((instanceId: string) => { let result={success:false,message:"Ez a tárgy már nincs a táskádban."}; setData(s=>{const owned=s.inventory.find(x=>x.instanceId===instanceId);if(!owned)return s;const item=getItem(owned.itemId); if(!isSellable(item)){result={success:false,message:`${item.name} nem értékesíthető. A tárgy történeti, bizonyítéki vagy kötött státuszú.`}; return s;} const effective=getEffectiveStatsWithBuffs(s),price=sellingPrice(item.basePrice,effective.appraisal,s.equipment);result={success:true,message:`${item.name} elkelt.`};return {...s,gold:s.gold+price,inventory:s.inventory.filter(x=>x.instanceId!==instanceId),marketDemand:{...s.marketDemand,[item.id]:Math.max(-30,s.marketDemand[item.id]-3)},reputationParts:{...s.reputationParts,economic:s.reputationParts.economic+1},journal:[entry("market","Eladás",`${item.name} — ${price} arany.`),...s.journal].slice(0,60)};});return result;}, []);
  const useNpcFunction = useCallback((npcId: NpcId, functionId: string, targetId?: string) => {
    let result={success:false,message:"Ezt a funkciót most nem tudod használni."};
    setData(s=>{
      const npc=NPCS.find(n=>n.id===npcId); const fn=NPC_FUNCTIONS.find(x=>x.id===functionId && x.npcId===npcId);
      if(!npc||!fn){result={success:false,message:"Ismeretlen NPC-funkció."};return s;}
      const present=npcRuntimePresent(npc,getWorldTime().hour,s.npcStates[npc.id]);
      if(s.currentRegion!==npc.region){result={success:false,message:`Jelenleg nem tudsz interakcióba lépni vele, mert nem a(z) ${npc.region} helyszínén vagy.`};return s;}
      if(!present){result={success:false,message:`${npc.name} jelenleg más dolgaival foglalkozik. Most nem tudod használni a funkcióját.`};return s;}
      const max=100+Math.max(0,getEffectiveStatsWithBuffs(s).endurance)*5;
      let next={...s};
      const itemById=(id:string)=>ITEMS.find(i=>i.id===id);
      const addItem=(id:string)=>({...next,inventory:[...next.inventory,makeInventoryItem(id)]});
      const setGold=(cost:number)=>next.gold>=cost;
      const used=()=>{
        const activityTag=`npc-function:${fn.id}`;
        const seen=hasActivityXpMemory(next,activityTag);
        next={...next,
          journal:[entry("system",fn.title,`${npc.name} · ${fn.description}`),...next.journal].slice(0,60),
          reputationParts:{...next.reputationParts,relationships:next.reputationParts.relationships+1,activity:next.reputationParts.activity+1}
        };
        if(!seen){
          const gained=applyXpGain(next,2);
          const memory=addMemory({kind:"world",title:"Új funkció felfedezve",text:`${npc.name}: ${fn.title}`,tags:["npc-function",`activity-xp:${activityTag}`],importance:1,at:stamp()});
          next={...next,...gained,worldMemories:[memory,...next.worldMemories].slice(0,160)};
        }
      };
      switch(fn.kind){
        case "inn": {
          // The inn has two mutually exclusive actions: buy food OR rest.
          // A food purchase is explicitly tagged with `buy:` so it can never
          // accidentally fall through to the sleep path.
          if(targetId?.startsWith("buy:")){
            const selectedId=targetId.slice(4);
            const itemId=fn.itemIds?.includes(selectedId as ItemId) ? selectedId : undefined;
            const item=itemId?itemById(itemId):undefined;
            const cost=item?.basePrice ?? 24;
            if(!item){result={success:false,message:"A kiválasztott étel jelenleg nem érhető el."};return s;}
            if(!setGold(cost)){result={success:false,message:`Ehhez ${cost} arany szükséges.`};return s;}
            if(next.inventory.length>=80){result={success:false,message:"A táskád megtelt (80/80)."};return s;}
            next={...next,gold:next.gold-cost,inventory:[...next.inventory,makeInventoryItem(item.id)]};
            used();
            result={success:true,message:`Megvetted: ${item.name}. Az étel bekerült a táskádba.`};
            break;
          }
          const hours=Math.max(1,Math.min(8,Number((targetId??"1").replace("hours:",""))||1));
          const cost=(fn.cost??60)*hours; if(!setGold(cost)){result={success:false,message:`A választott ${hours} óra szállás ára ${cost} arany.`};return s;}
          if(s.health>=max){result={success:false,message:"Teljes az életerőd, nincs szükséged alvásra."};return s;}
          const restored=Math.min(max-s.health,Math.max(1,Math.ceil(max*0.10*hours)));
          next={...next,gold:next.gold-cost,health:Math.min(max,next.health+restored)}; used(); result={success:true,message:`${hours} óra alvás: +${restored} életerő. Szállás: ${cost} arany.`}; break;
        }
        case "foodTrade": case "food": {
          const selectedId = targetId?.startsWith("buy:") ? targetId.slice(4) : fn.itemIds?.[0];
          const itemId = fn.itemIds?.includes(selectedId as ItemId) ? selectedId : fn.itemIds?.[0];
          const item=itemId?itemById(itemId):undefined; const cost=fn.cost??item?.basePrice??20;
          if(!item){result={success:false,message:"Nincs elérhető étel."};return s;} if(!setGold(cost)){result={success:false,message:`Ehhez ${cost} arany szükséges.`};return s;}
          if(next.inventory.length>=80){result={success:false,message:"A táskád megtelt (80/80)."};return s;}
          next={...next,gold:next.gold-cost,inventory:[...next.inventory,makeInventoryItem(item.id)]}; used(); result={success:true,message:`Megvetted: ${item.name}. Az étel később százalékosan tölti vissza az életerődet.`}; break;
        }
        case "alchemy": {
          if(targetId?.startsWith("infuse:")){
            const instanceId=targetId.slice(7); const equipped=Object.values(next.equipment).find((v): v is InventoryItem => v !== null && v.instanceId===instanceId);
            if(!equipped){result={success:false,message:"Az erősítéshez egy felszerelt tárgyat kell kiválasztanod."};return s;}
            const active=next.temporaryItemBuffs.find(b=>b.instanceId===instanceId && b.expiresAt>Date.now());
            if(active){result={success:false,message:"Ezen a tárgyon már aktív alkímiai erősítés van."};return s;}
            const infusionIndex=next.inventory.findIndex(inv=>inv.itemId==="runeInfusion");
            if(infusionIndex<0){result={success:false,message:"Nincs nálad Rúnás erősítő oldat. Előbb vásárolj egyet Eldrától."};return s;}
            const buff:TemporaryItemBuff={instanceId,stat:"strength",amount:1,expiresAt:Date.now()+30*60*1000,source:"Rúnás erősítő oldat"};
            next={...next,temporaryItemBuffs:next.temporaryItemBuffs.filter(b=>b.instanceId!==instanceId).concat(buff),inventory:next.inventory.filter((_,i)=>i!==infusionIndex)}; used(); result={success:true,message:"A felszerelt tárgy egy órára +1 Erő bónuszt kapott. Az erősítő oldat elfogyott, a hatás nem halmozható."}; break;
          }
          const itemId=targetId?.startsWith("buy:")?targetId.slice(4):undefined; const item=itemId?itemById(itemId):undefined;
          if(!item || !fn.itemIds?.includes(item.id)){result={success:false,message:"Válassz egy alkímiai tárgyat."};return s;}
          const cost=item.basePrice; if(!setGold(cost)){result={success:false,message:`Ehhez ${cost} arany szükséges.`};return s;}
          if(next.inventory.length>=80){result={success:false,message:"A táskád megtelt (80/80)."};return s;}
          next={...next,gold:next.gold-cost,inventory:[...next.inventory,makeInventoryItem(item.id)]}; used(); result={success:true,message:`Megvetted: ${item.name}.`}; break;
        }
        case "forge": case "leatherwork": {
          if(targetId?.startsWith("craft:")){
            const recipeId=targetId.slice(6); const crafted=itemById(recipeId); if(!crafted||!crafted.slot||crafted.sideQuestOnly||crafted.category==="relic"||crafted.marketEligible===false){result={success:false,message:"Ez a történeti vagy egyedi tárgy nem készíthető ebben a műhelyben."};return s;}
            const recipeNeed=craftRecipeForItem(crafted, npc.region); const counts=new Map<string,number>(); next.inventory.forEach(inv=>counts.set(inv.itemId,(counts.get(inv.itemId)??0)+1)); const missing=recipeNeed.find(req=>(counts.get(req.id)??0)<req.count);
            if(missing){result={success:false,message:`Nincs elég anyagod. Szükséges: ${recipeNeed.map(req=>`${itemById(req.id)?.name??req.id} × ${req.count}`).join(", ")}.`};return s;}
            let inv=[...next.inventory]; for(const req of recipeNeed){let left=req.count;inv=inv.filter(x=>{if(left<=0||x.itemId!==req.id)return true;left--;return false;});} inv.push(makeInventoryItem(crafted.id)); next={...next,inventory:inv}; used(); result={success:true,message:`Elkészült: ${crafted.name}.`}; break;
          }
          if(targetId){
            const idx=next.inventory.findIndex(i=>i.instanceId===targetId); if(idx<0){result={success:false,message:"A kiválasztott tárgy nincs a táskádban."};return s;}
            const owned=next.inventory[idx]; const item=getItem(owned.itemId); if(!item.slot){result={success:false,message:"Ezt a tárgyat a műhelyben nem lehet szétszerelni."};return s;}
            const yields=dismantleYieldsForItem(item);
            next={...next,inventory:next.inventory.filter((_,i)=>i!==idx).concat(yields.flatMap(req=>Array.from({length:req.count},()=>makeInventoryItem(req.id))))}; used(); result={success:true,message:`${item.name} szétszerelve. ${yields.map(y=>`${getItem(y.id).name} × ${y.count}`).join(", ")} került vissza.`}; break;
          }
          result={success:false,message:"Válassz egy műveletet a műhelyben."}; break;
        }
        case "gamble": case "odds": { const cost=fn.cost??50; if(!setGold(cost)){result={success:false,message:`A tét ${cost} arany.`};return s;} const win=Math.random()<0.45; next={...next,gold:next.gold+(win?cost*2:-cost),reputationParts:{...next.reputationParts,economic:next.reputationParts.economic+(win?2:0),activity:next.reputationParts.activity+1}}; used(); result={success:true,message:win?`Nyertél. A fogadás után ${cost*2} aranyat kapsz.`:`Elvesztetted a ${cost} aranynyi tétet.`}; break; }
        case "training": case "arenaTraining": case "apprentice": {
          const cost=fn.cost??50; const stat=fn.stat??(fn.kind==="apprentice"?"smithing":"strength"); if(!setGold(cost)){result={success:false,message:`A képzés ára ${cost} arany.`};return s;} const newBase={...next.baseStats,[stat]:Math.min(50,next.baseStats[stat]+1)}; next={...next,gold:next.gold-cost,baseStats:newBase,identity:{...next.identity,affinities:{...next.identity.affinities,trade:fn.kind==="apprentice"?Math.min(100,next.identity.affinities.trade+2):next.identity.affinities.trade,combat:fn.kind==="arenaTraining"?Math.min(100,next.identity.affinities.combat+2):next.identity.affinities.combat}}}; used(); result={success:true,message:`Képzést kaptál: +1 ${stat}.`}; break; }
        case "healing": { const cost=fn.cost??35; if(!setGold(cost)){result={success:false,message:`Az ellátás ára ${cost} arany.`};return s;} const restored=Math.ceil(max*0.20); next={...next,gold:next.gold-cost,health:Math.min(max,next.health+restored)}; used(); result={success:true,message:`Ellátás: +${restored} életerő.`}; break; }
        case "fishing": { const itemId=fn.itemIds?.[0]??"saltFish"; if(next.inventory.length>=80){result={success:false,message:"A táskád tele van."};return s;} next={...next,inventory:[...next.inventory,makeInventoryItem(itemId)]}; used(); result={success:true,message:`Fogtál egyet: ${getItem(itemId).name}.`}; break; }
        case "trade": case "rareTrade": case "spiceTrade": case "market": case "streetMarket": case "cargo": case "warehouse": case "currency": case "information": case "rumor": case "documents": case "ledger": case "map": case "archive": case "investigation": case "harborMaster": case "security": case "guardPatrol": case "jail": case "doorGuard": case "ruins": case "well": case "social": case "club": case "patronage": case "credit": case "bank": case "guild": case "broker": case "caravan": case "transport": case "sailorHire": case "freeSailing": case "smuggling": case "sailorHire": case "palaceSecurity": case "diplomacy": case "arenaEntry": case "arenaAnnounce": case "challenge": case "weapons": case "arenaAnnounce": case "weapons": case "spiceTrade": case "foodTrade": {
          const selectedId = targetId?.startsWith("buy:") ? targetId.slice(4) : undefined;
          const gainItem = selectedId && fn.itemIds?.includes(selectedId as ItemId) ? selectedId : fn.itemIds?.[0];
          const item = gainItem ? itemById(gainItem) : undefined;
          const cost = item?.basePrice ?? fn.cost ?? 0;
          if(cost>0&&!setGold(cost)){result={success:false,message:`Ehhez ${cost} arany szükséges.`};return s;}
          if(gainItem){ if(next.inventory.length>=80){result={success:false,message:"A táskád megtelt (80/80)."};return s;} next={...next,gold:next.gold-cost,inventory:[...next.inventory,makeInventoryItem(gainItem)]}; } else { next={...next,gold:next.gold-cost}; }
          next={...next,identity:{...next.identity,affinities:{...next.identity.affinities,trade:fn.kind==="trade"||fn.kind==="caravan"?Math.min(100,next.identity.affinities.trade+1):next.identity.affinities.trade,social:fn.kind==="social"||fn.kind==="club"||fn.kind==="patronage"?Math.min(100,next.identity.affinities.social+1):next.identity.affinities.social,lore:fn.kind==="archive"||fn.kind==="investigation"?Math.min(100,next.identity.affinities.lore+1):next.identity.affinities.lore}}}; used(); result={success:true,message:gainItem&&item?`Megvetted: ${item.name}.`:`${fn.title} elvégezve. ${fn.description}`}; break;
        }
        default: result={success:true,message:`${fn.title}: ${fn.description}`}; break;
      }
      return next;
    });
    return result;
  }, []);
  const interactNpc = useCallback((npcId: NpcId) => update(s=>{const npc=NPCS.find(n=>n.id===npcId);if(!npc||!s.regionAccess[npc.region]||s.currentRegion!==npc.region||!npcRuntimePresent(npc,getWorldTime().hour,s.npcStates[npc.id]))return s;const facets={...s.relationshipFacets,[npcId]:applyFacetDelta(s.relationshipFacets[npcId],{trust:2,respect:1,affection:1})};const next=relationshipAggregate(facets[npcId]);const memory=addMemory({kind:"npc",title:"Találkozás",text:`Találkoztál ${npc.name} karakterével a ${npc.location ?? npc.district ?? "város"} helyszínen.`,npcId,region:npc.region,district:npc.district,tags:["meeting","npc"],importance:1,at:stamp()});const identity=mergeIdentity(s.identity,{axes:{orderFreedom:0,honorOpportunism:2,mercyCruelty:1,curiosityPragmatism:2,ambitionIndependence:1,riskSafety:0,loyaltyAutonomy:3},affinities:{combat:0,shadow:0,social:3,trade:0,lore:0}});const nextState={...s,identity,relationships:{...s.relationships,[npcId]:next},relationshipFacets:facets,npcStates:{...s.npcStates,[npcId]:{status:stateForRelationship(facets[npcId]),updatedAt:stamp(),note:"A találkozások hatással vannak a kapcsolatra."}},worldMemories:[memory,...s.worldMemories].slice(0,120),reputationParts:{...s.reputationParts,relationships:s.reputationParts.relationships+1,activity:s.reputationParts.activity+1},journal:[entry("world","Városlakóval találkoztál",`${npc.name} mostantól egy kicsit jobban ismer.`),...s.journal].slice(0,60),gmMessages:[gm("A Szem feljegyezte",`${npc.name} kapcsolatod most ${next}. A következő találkozás már nem ugyanaz lesz.`,"personal"),...s.gmMessages].slice(0,20)}; const ns=recordDynamicEvent(s.narrativeState,{type:"relationship",at:stamp(),npcId,region:npc.region,tags:["npc","relationship"],summary:`Találkozás és kapcsolati változás: ${npc.name}.`,importance:1}); nextState.narrativeState=syncNarrativeDirector(ns,buildNarrativeContext({region:s.currentRegion,playerIdentity:identity,relationshipFacets:facets,memories:[memory,...s.worldMemories],npcStates:nextState.npcStates,questStatus:s.questStatus,activeQuestId:s.trackedQuestId,worldHour:getWorldTime().hour,eyeSignals:s.gmMessages.slice(0,6).map(m=>({title:m.title,body:m.body,tone:m.tone}))}),stamp()); return nextState;}),[update]);
  const acceptSideQuest = useCallback((sideQuestId: string) => { let result = { success:false, message:"Ez a történet már nem érhető el." }; update(s => { const record=s.narrativeState.runtime.sideQuests.records.find(r=>r.id===sideQuestId); if(!record||record.status!=="offered") return s; const npc=NPCS.find(n=>n.id===record.blueprint.giver); if(!npc||s.currentRegion!==record.blueprint.region||!npcRuntimePresent(npc,getWorldTime().hour,s.npcStates[npc.id])) { result={success:false,message:"A történetadó jelenleg nincs elérhető közelségben."}; return s; } const ns=activateSideQuest(s.narrativeState,sideQuestId,Date.now()); const facets={...s.relationshipFacets,[npc.id]:applyFacetDelta(s.relationshipFacets[npc.id],{trust:2,respect:1,suspicion:-1})}; const memory=addMemory({kind:"quest",title:"Melléktörténet vállalva",text:`Elfogadtad ${npc.name} történetét.`,npcId:npc.id,region:npc.region,district:npc.district,tags:["side-quest","accepted",record.blueprint.source],importance:2,at:stamp()}); result={success:true,message:"Mellékküldetés elfogadva."}; return {...s,narrativeState:ns,relationshipFacets:facets,relationships:{...s.relationships,[npc.id]:relationshipAggregate(facets[npc.id])},worldMemories:[memory,...s.worldMemories].slice(0,160),journal:[entry("quest","Melléktörténet vállalva",record.blueprint.hook),...s.journal].slice(0,80),gmMessages:[gm("A Szem feljegyezte",`${npc.name} történetébe beléptél. A megoldás módja nyomot hagy majd.`,"personal"),...s.gmMessages].slice(0,20)}; }); return result; }, [update]);
  const declineSideQuest = useCallback((sideQuestId: string) => { let result={success:false,message:"Ez a történet már nem érhető el."}; update(s=>{const record=s.narrativeState.runtime.sideQuests.records.find(r=>r.id===sideQuestId); if(!record||record.status!=="offered") return s; const npc=NPCS.find(n=>n.id===record.blueprint.giver); const ns=resolveSideQuestRuntime(s.narrativeState,sideQuestId,"declined",Date.now()); if(!npc){result={success:true,message:"Figyelmen kívül hagytad a történetet."}; return {...s,narrativeState:ns};} const facets={...s.relationshipFacets,[npc.id]:applyFacetDelta(s.relationshipFacets[npc.id],{trust:-2,respect:-1,suspicion:1})}; const memory=addMemory({kind:"quest",title:"Melléktörténet elutasítva",text:`Nem vállaltad el ${npc.name} kérését.`,npcId:npc.id,region:npc.region,district:npc.district,tags:["side-quest","declined",record.blueprint.source],importance:1,at:stamp()}); result={success:true,message:"Figyelmen kívül hagytad. A kapcsolat emlékszik rá."}; return {...s,narrativeState:ns,relationshipFacets:facets,relationships:{...s.relationships,[npc.id]:relationshipAggregate(facets[npc.id])},worldMemories:[memory,...s.worldMemories].slice(0,160),journal:[entry("quest","Melléktörténet elutasítva",`${npc.name} emlékezni fog a döntésedre.`),...s.journal].slice(0,80),gmMessages:[gm("A Szem feljegyezte",`${npc.name} nem felejti el, hogy most nemet mondtál.`,"personal"),...s.gmMessages].slice(0,20)};}); return result;},[update]);
  const resolveSideQuest = useCallback((sideQuestId: string, choiceId: string) => {
    let result = { success: false, message: "Ez a történet már nem érhető el." };
    setData((s) => {
      const record = s.narrativeState.runtime.sideQuests.records.find((r) => r.id === sideQuestId);
      if (!record || record.status !== "active") return s;
      const npc = NPCS.find((n) => n.id === record.blueprint.giver);
      if (!npc || s.currentRegion !== record.blueprint.region || !npcRuntimePresent(npc, getWorldTime().hour, s.npcStates[npc.id])) {
        result = { success: false, message: "A történet lezárásához a jelen lévő történetadóval kell beszélned a saját régiójában." };
        return s;
      }
      const choice = record.blueprint.choiceSpace.find((c) => c.id === choiceId);
      if (!choice) {
        result = { success: false, message: "Ez a megoldási mód nem tartozik ehhez a történethez." };
        return s;
      }
      const requiredItems = record.blueprint.objective.requiredItemIds ?? [];
      const missingItems = requiredItems.filter((itemId) =>
        !s.inventory.some((item) => item.itemId === itemId) &&
        !Object.values(s.equipment).some((item) => item?.itemId === itemId)
      );
      if (missingItems.length) {
        result = { success: false, message: `Még szükséged van erre: ${missingItems.map((id) => getItem(id).name).join(", ")}.` };
        return s;
      }

      const effective = getEffectiveStatsWithBuffs(s);
      const itemBonus = Object.values(s.equipment).reduce((sum, item) => sum + (item ? getItem(item.itemId).effects?.questBonus ?? 0 : 0), 0);
      const outcome = evaluateSideQuestChoice(record.blueprint.scale, choice.method, effective, itemBonus);
      const success = outcome.success;
      const terminalStatus = success ? "completed" : "failed";
      const narrativeResolved = resolveSideQuestRuntime(s.narrativeState, sideQuestId, terminalStatus, Date.now());
      const reward = rollReward({ sourceId: record.id, questId: record.id, kind: "side", region: record.blueprint.region, playerLevel: s.level, luckModifier: 0, pity: s.rewardPity });
      const goldReward = success ? reward.gold : Math.floor(reward.gold * 0.25);
      const xpReward = success ? reward.xp : Math.max(1, Math.floor(reward.xp * 0.35));
      const rewardItems = success && reward.itemId ? [makeInventoryItem(reward.itemId)] : [];
      if (s.inventory.length + rewardItems.length > 80) {
        result = { success: false, message: "A jutalom nem férne el a táskádban. Szabadíts fel egy helyet, és próbáld újra." };
        return s;
      }
      const gained = applyXpGain(s, xpReward);
      const relationDelta = success
        ? choice.method === "conversation" ? { trust: 3, affection: 1, suspicion: -1 }
          : choice.method === "trade" ? { respect: 3, trust: 1, debt: -1 }
          : choice.method === "risk" ? { respect: 3, fear: 1 }
          : choice.method === "investigation" ? { respect: 2, trust: 1, suspicion: -2 }
          : { trust: 2, respect: 2 }
        : { trust: -1, respect: 0, suspicion: 2 };
      const facets = { ...s.relationshipFacets, [npc.id]: applyFacetDelta(s.relationshipFacets[npc.id], relationDelta) };
      const relation = relationshipAggregate(facets[npc.id]);
      const npcStatus = stateForRelationship(facets[npc.id]);
      const outcomeText = success
        ? `${npc.name} elfogadta a megoldásodat: ${choice.label}`
        : `A választott út félresiklott (${choice.label}), de a történet nem áll meg. A következményekből új lehetőség születhet.`;
      const memory = addMemory({ kind: "quest", title: success ? "Melléktörténet megoldva" : "Melléktörténet: kudarc és következmény", text: `${record.blueprint.hook} ${outcomeText}.`, npcId: npc.id, region: npc.region, district: npc.district, tags: ["side-quest", success ? "success" : "failure", `method:${choice.method}`, record.blueprint.source], importance: success ? 3 : 2, at: stamp() });
      let nextNarrative = recordDynamicEvent(narrativeResolved, { type: "quest_resolved", at: stamp(), questId: record.id, npcId: npc.id, region: npc.region, tags: ["side-quest", success ? "success" : "failure", `method:${choice.method}`, record.blueprint.source], summary: `${record.blueprint.hook} ${success ? "Megoldódott." : "A terv félresiklott, de új következményt hagyott."}`, importance: success ? 3 : 2 });
      const nextState: GameData = {
        ...s,
        ...gained,
        gold: s.gold + goldReward,
        diamonds: s.diamonds + (success ? reward.diamonds : 0),
        inventory: [...s.inventory, ...rewardItems],
        rewardPity: success ? nextRewardPity(s.rewardPity, reward.rarity) : s.rewardPity,
        trackedSideQuestId: s.trackedSideQuestId === sideQuestId ? null : s.trackedSideQuestId,
        narrativeState: nextNarrative,
        relationshipFacets: facets,
        relationships: { ...s.relationships, [npc.id]: relation },
        npcStates: { ...s.npcStates, [npc.id]: { status: npcStatus, updatedAt: stamp(), note: outcomeText.slice(0, 120) } },
        worldMemories: [memory, ...s.worldMemories].slice(0, 160),
        reputationParts: { ...s.reputationParts, achievements: s.reputationParts.achievements + (success ? 2 : 1), decisions: s.reputationParts.decisions + 1, relationships: s.reputationParts.relationships + (success ? 1 : 0), growth: s.reputationParts.growth + (success ? 1 : 0), activity: s.reputationParts.activity + 1 },
        journal: [entry("quest", success ? "Melléktörténet megoldva" : "Melléktörténet következménnyel", `${outcomeText} · ${xpReward} XP · ${goldReward} arany${success ? reward.diamonds ? ` · ${reward.diamonds} gyémánt` : "" : ""}${rewardItems.length ? ` · Zsákmány: ${getItem(rewardItems[0].itemId).name}` : ""}`), ...s.journal].slice(0, 80),
        gmMessages: [gm(success ? "A Szem feljegyezte a megoldást" : "A Szem megőrizte a kudarcot", `${npc.name}: ${outcomeText} Jutalom: ${xpReward} XP és ${goldReward} arany${success && rewardItems.length ? `, valamint ${getItem(rewardItems[0].itemId).name}` : ""}.`, success ? "personal" : "warning"), ...s.gmMessages].slice(0, 20),
      };
      nextNarrative = syncNarrativeDirector(nextState.narrativeState, buildNarrativeContext({ region: nextState.currentRegion, playerIdentity: nextState.identity, relationshipFacets: nextState.relationshipFacets, memories: nextState.worldMemories, npcStates: nextState.npcStates, questStatus: nextState.questStatus, activeQuestId: nextState.trackedQuestId, worldHour: getWorldTime().hour, eyeSignals: nextState.gmMessages.slice(0, 6).map((m) => ({ title: m.title, body: m.body, tone: m.tone })) }), stamp());
      nextState.narrativeState = nextNarrative;
      result = { success, message: `${success ? "Melléktörténet megoldva" : "A terv félresiklott, de a világ továbblép"}. ${outcomeText} Jutalom: ${xpReward} XP, ${goldReward} arany${success && reward.diamonds ? `, ${reward.diamonds} gyémánt` : ""}${rewardItems.length ? `, ${getItem(rewardItems[0].itemId).name}` : ""}.` };
      return nextState;
    });
    return result;
  }, []);
  const speakNpc = useCallback((npcId: NpcId, topicId?: string) => { let result={success:false,message:"Most nincs új beszélgetési téma."}; update(s=>{const npc=NPCS.find(n=>n.id===npcId); if(!npc||s.currentRegion!==npc.region||!npcRuntimePresent(npc,getWorldTime().hour,s.npcStates[npc.id])) {result={success:false,message:"Az NPC jelenleg nem elérhető."}; return s;} const context=buildNarrativeContext({region:s.currentRegion,playerIdentity:s.identity,relationshipFacets:s.relationshipFacets,memories:s.worldMemories,npcStates:s.npcStates,questStatus:s.questStatus,activeQuestId:s.trackedQuestId,worldHour:getWorldTime().hour,eyeSignals:s.gmMessages.slice(0,6).map(m=>({title:m.title,body:m.body,tone:m.tone}))}); const topics=getAvailableDialogueTopics(context,npcId,Date.now()); const topic=topics.find(t=>t.id===topicId)||topics[0]; if(!topic) return s; const ns=markDialogueTopicSeen(s.narrativeState,npcId,topic.id,Date.now()); const delta=topic.kind==="secret"?{trust:3,respect:2,affection:2,suspicion:-2}:{trust:1,respect:1,affection:1,suspicion:0}; const facets={...s.relationshipFacets,[npcId]:applyFacetDelta(s.relationshipFacets[npcId],delta)}; const memory=addMemory({kind:"npc",title:"Beszélgetés",text:`${npc.name}: ${topic.label}.`,npcId,region:npc.region,district:npc.district,tags:["dialogue",topic.kind],importance:topic.kind==="secret"?3:1,at:stamp()}); result={success:true,message:topic.reason}; return {...s,narrativeState:ns,relationshipFacets:facets,relationships:{...s.relationships,[npcId]:relationshipAggregate(facets[npcId])},worldMemories:[memory,...s.worldMemories].slice(0,160),journal:[entry("world",`${npc.name} mesélt`,topic.reason),...s.journal].slice(0,80),gmMessages:[gm("A Szem figyel",`${npc.name} most megosztott veled valamit: ${topic.label}.`,"personal"),...s.gmMessages].slice(0,20)};}); return result;},[update]);
  const markMessagesSeen = useCallback(() => update(s => ({ ...s, gmMessages: s.gmMessages.map(m => ({ ...m, seen: true })) })), [update]);
  const reset = useCallback(()=>setData(freshState()),[]);
  return { ...data, consumeItem, rest, takeDamage, useNpcFunction, setName, setAvatar, improveStat, travel, startQuest, setMainQuestFollowing, followQuestChapter, trackQuest, resolveQuest, equip, unequip, buy, buyListing, sell, interactNpc, acceptSideQuest, declineSideQuest, resolveSideQuest, speakNpc, markMessagesSeen, reset, trackSideQuest };
}
export const getReputation = (state: Pick<GameState,"reputationParts">) => reputationScore(state.reputationParts);
