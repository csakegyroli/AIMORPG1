import type { NpcId, RegionId } from "./types";
import type {
  NarrativeContext,
  NarrativeOpportunity,
  NarrativeState,
  RuntimeSideQuest,
  RuntimeWorldEvent,
  SideQuestBlueprint,
  WorldEventCandidate,
} from "./narrative";
import { ITEMS, NPCS, NPC_FUNCTIONS } from "./content";
import { npcIsPresent, type RelationshipFacets } from "./simulation";

/**
 * AIMORPG AI Council foundation.
 *
 * This file intentionally contains NO model/API invocation. Every manager emits
 * deterministic observations/proposals that a future AI layer may consume.
 * The AI may only operate through the contracts defined here.
 */
export const AI_COUNCIL_VERSION = "1.0.0" as const;

export type AIManagerId = "worldObserver" | "storyMaster" | "economyMaster";
export type AICouncilMode = "dormant" | "ready_for_ai";
export type AIProposalType =
  | "observation"
  | "story_opportunity"
  | "economy_pressure"
  | "dialogue_pressure"
  | "world_event_candidate"
  | "side_quest_candidate"
  | "decision";

export type AIProposal = {
  id: string;
  manager: AIManagerId | "decisionLayer";
  type: AIProposalType;
  priority: number;
  confidence: number;
  region?: RegionId;
  npcId?: NpcId;
  reason: string;
  constraints: string[];
  tags: string[];
  payload: Record<string, unknown>;
  createdAt: string;
};

export type WorldObserverSnapshot = {
  currentRegion: RegionId;
  worldHour: number;
  recentMemoryTags: string[];
  importantMemoryIds: string[];
  playerStallPressure: number;
  relationshipPressure: Array<{ npcId: NpcId; pressure: number }>;
  activeMainQuestId: string | null;
  npcAvailability: Record<string, boolean>;
};

export type StoryMasterSnapshot = {
  activeMainQuestId: string | null;
  activeMainQuestRegion: RegionId | null;
  openOpportunities: NarrativeOpportunity[];
  runtimeSideQuests: RuntimeSideQuest[];
  dialoguePressure: Array<{ npcId: NpcId; pressure: number; facet: RelationshipFacets }>;
  currentRegion: RegionId;
};

export type EconomyMasterSnapshot = {
  currentRegion: RegionId;
  visibleRegionalItemIds: string[];
  craftableItemIds: string[];
  resourcePressure: Array<{ itemId: string; reason: string; pressure: number }>;
  playerGoldBand: "poor" | "stable" | "wealthy" | "unknown";
  inventoryMaterialCount: number;
};

export type AICouncilDecision = {
  id: string;
  selectedProposalIds: string[];
  rejectedProposalIds: string[];
  reason: string;
  hardConstraintsPassed: boolean;
  createdAt: string;
};

export type AICouncilState = {
  version: string;
  mode: AICouncilMode;
  lastRunAt: string | null;
  worldObserver: { lastSnapshot: WorldObserverSnapshot | null; proposals: AIProposal[] };
  storyMaster: { lastSnapshot: StoryMasterSnapshot | null; proposals: AIProposal[] };
  economyMaster: { lastSnapshot: EconomyMasterSnapshot | null; proposals: AIProposal[] };
  decisionLayer: { lastDecision: AICouncilDecision | null; queue: AIProposal[] };
  handoff: {
    aiMayGenerate: boolean;
    canonWriteAllowed: boolean;
    dynamicWriteAllowed: boolean;
    requiredValidators: string[];
  };
};

export type AICouncilInput = {
  context: NarrativeContext;
  state: NarrativeState;
  nowMs: number;
  gold?: number;
  inventoryItemIds?: string[];
  marketDemand?: Record<string, number>;
};

export const AI_COUNCIL_RULES = Object.freeze({
  proposalMaxPerManager: 8,
  queueMax: 24,
  decisionMaxSelections: 2,
  confidenceThreshold: 0.62,
  priorityThreshold: 45,
  maxAiGeneratedSideQuestPerTick: 1,
  maxAiGeneratedWorldEventPerTick: 1,
  validators: ["canon", "npc", "world", "item", "relationship", "timeline", "consequence"] as const,
  invariants: [
    "The AI never writes Canon directly.",
    "The World Observer never decides outcomes.",
    "The Story Master never invents facts outside Canon or Dynamic state.",
    "The Economy Master cannot grant currency or items by itself.",
    "The Decision Layer cannot override player agency.",
    "At most one new AI side quest and one new AI world event may be approved per tick.",
    "All AI outputs must be structured proposals before runtime execution.",
  ] as const,
});

function iso(nowMs: number) { return new Date(nowMs).toISOString(); }

function playerStallPressure(context: NarrativeContext): number {
  const active = context.activeQuestId ? context.questStatus[context.activeQuestId] === "active" : false;
  if (!active) return 72;
  const recent = context.memories.filter(m => Date.now() - Date.parse(m.at) < 1000 * 60 * 60 * 12);
  const activity = recent.length;
  return Math.max(0, Math.min(100, 60 - activity * 8));
}

function buildWorldObserverSnapshot(input: AICouncilInput): WorldObserverSnapshot {
  const { context } = input;
  const npcAvailability: Record<string, boolean> = {};
  for (const npc of NPCS) npcAvailability[npc.id] = npcIsPresent(npc, context.worldHour, context.npcStates[npc.id]);
  return {
    currentRegion: context.region,
    worldHour: context.worldHour,
    recentMemoryTags: context.recentMemoryTags.slice(0, 24),
    importantMemoryIds: context.memories.filter(m => m.importance >= 3).slice(0, 12).map(m => m.id),
    playerStallPressure: playerStallPressure(context),
    relationshipPressure: context.relationshipPressure.slice(0, 8),
    activeMainQuestId: context.activeQuestId,
    npcAvailability,
  };
}

function buildStoryMasterSnapshot(input: AICouncilInput): StoryMasterSnapshot {
  const { context, state } = input;
  const dialoguePressure = context.relationshipPressure.map(({ npcId, pressure }) => ({
    npcId,
    pressure,
    facet: context.relationshipFacets[npcId],
  }));
  return {
    activeMainQuestId: context.activeQuestId,
    activeMainQuestRegion: context.activeQuestDNA?.region ?? null,
    openOpportunities: state.director.opportunities.slice(0, 12),
    runtimeSideQuests: state.runtime.sideQuests.records.filter(r => ["offered", "active"].includes(r.status)).slice(0, 12),
    dialoguePressure,
    currentRegion: context.region,
  };
}

function buildEconomySnapshot(input: AICouncilInput): EconomyMasterSnapshot {
  const { context, gold, inventoryItemIds = [], marketDemand = {} } = input;
  const visibleRegionalItemIds = ITEMS.filter(i => (i.regions ?? []).includes(context.region)).map(i => i.id).slice(0, 40);
  const craftableItemIds = ITEMS.filter(i => i.category === "equipment" && !i.questItem).map(i => i.id).slice(0, 30);
  const materialCounts = new Map<string, number>();
  for (const id of inventoryItemIds) materialCounts.set(id, (materialCounts.get(id) ?? 0) + 1);
  const resourcePressure = ITEMS.filter(i => i.category === "material").map(item => {
    const owned = materialCounts.get(item.id) ?? 0;
    const demand = marketDemand[item.id] ?? 0;
    const pressure = Math.max(0, Math.min(100, 50 + demand * 2 - owned * 3));
    return { itemId: item.id, pressure, reason: demand >= 8 ? "A helyi kereslet erős." : owned <= 2 ? "A játékos készlete alacsony." : "Nincs rendkívüli nyomás." };
  }).filter(x => x.pressure >= 55).sort((a,b)=>b.pressure-a.pressure).slice(0, 8);
  const playerGoldBand = typeof gold !== "number" ? "unknown" : gold < 200 ? "poor" : gold < 1500 ? "stable" : gold < 5000 ? "wealthy" : "wealthy";
  return { currentRegion: context.region, visibleRegionalItemIds, craftableItemIds, resourcePressure, playerGoldBand, inventoryMaterialCount: Array.from(materialCounts.values()).reduce((a,b)=>a+b,0) };
}

function proposal(id: string, manager: AIManagerId | "decisionLayer", type: AIProposalType, priority: number, confidence: number, reason: string, tags: string[], payload: Record<string, unknown>, nowMs: number, region?: RegionId, npcId?: NpcId, constraints: string[] = []): AIProposal {
  return { id, manager, type, priority, confidence, reason, tags, payload, region, npcId, constraints, createdAt: iso(nowMs) };
}

function runWorldObserver(input: AICouncilInput): { snapshot: WorldObserverSnapshot; proposals: AIProposal[] } {
  const snapshot = buildWorldObserverSnapshot(input);
  const p: AIProposal[] = [];
  if (snapshot.playerStallPressure >= 70) p.push(proposal(`wo-stall-${snapshot.currentRegion}`, "worldObserver", "observation", 76, 0.91, "A játékos haladási nyomása magas; lehetőség nyílhat egy helyi történetre anélkül, hogy a főszálat felülírnánk.", ["stall", "opportunity"], { stallPressure: snapshot.playerStallPressure }, input.nowMs, snapshot.currentRegion));
  if (snapshot.worldHour >= 20 || snapshot.worldHour < 6) p.push(proposal(`wo-night-${snapshot.currentRegion}`, "worldObserver", "observation", 64, 0.88, "Éjszakai ciklus aktív; éjszakai szereplő és esemény válhat relevánssá.", ["night", "continuity"], { worldHour: snapshot.worldHour }, input.nowMs, snapshot.currentRegion));
  for (const rel of snapshot.relationshipPressure.slice(0, 3)) p.push(proposal(`wo-rel-${rel.npcId}`, "worldObserver", "observation", Math.min(92, 50 + rel.pressure), 0.84, "Erős kapcsolati nyomás van jelen.", ["relationship"], { pressure: rel.pressure }, input.nowMs, snapshot.currentRegion, rel.npcId));
  return { snapshot, proposals: p.slice(0, AI_COUNCIL_RULES.proposalMaxPerManager) };
}

function runStoryMaster(input: AICouncilInput): { snapshot: StoryMasterSnapshot; proposals: AIProposal[] } {
  const snapshot = buildStoryMasterSnapshot(input);
  const p: AIProposal[] = [];
  for (const opportunity of snapshot.openOpportunities.slice(0, 5)) {
    p.push(proposal(`sm-${opportunity.id}`, "storyMaster", "story_opportunity", opportunity.priority, 0.86, opportunity.reason, opportunity.triggerTags, { opportunityId: opportunity.id, scale: opportunity.scale }, input.nowMs, opportunity.region, opportunity.npcId));
  }
  for (const d of snapshot.dialoguePressure.slice(0, 3)) {
    if (d.pressure >= 55) p.push(proposal(`sm-dialogue-${d.npcId}`, "storyMaster", "dialogue_pressure", Math.min(90, d.pressure), 0.81, "Az NPC és a játékos közötti kapcsolat elég erős ahhoz, hogy új beszélgetési mélységet indokoljon.", ["dialogue", "relationship"], { npcId: d.npcId }, input.nowMs, snapshot.currentRegion, d.npcId));
  }
  return { snapshot, proposals: p.slice(0, AI_COUNCIL_RULES.proposalMaxPerManager) };
}

function runEconomyMaster(input: AICouncilInput): { snapshot: EconomyMasterSnapshot; proposals: AIProposal[] } {
  const snapshot = buildEconomySnapshot(input);
  const p: AIProposal[] = [];
  for (const r of snapshot.resourcePressure.slice(0, 5)) {
    p.push(proposal(`em-${r.itemId}`, "economyMaster", "economy_pressure", r.pressure, 0.80, r.reason, ["economy", "resource"], { itemId: r.itemId, pressure: r.pressure }, input.nowMs, snapshot.currentRegion));
  }
  if (snapshot.playerGoldBand === "poor") p.push(proposal(`em-gold-${snapshot.currentRegion}`, "economyMaster", "economy_pressure", 58, 0.78, "A játékos vagyoni helyzete indokolhat olcsóbb, helyi erőforrásokra épülő történeti lehetőséget.", ["economy", "poverty"], { band: snapshot.playerGoldBand }, input.nowMs, snapshot.currentRegion));
  return { snapshot, proposals: p.slice(0, AI_COUNCIL_RULES.proposalMaxPerManager) };
}

function validateProposal(p: AIProposal, input: AICouncilInput): boolean {
  if (p.confidence < 0.4 || p.priority < 20) return false;
  if (p.region && !input.context.region) return false;
  if (p.npcId) {
    const npc = NPCS.find(n => n.id === p.npcId);
    if (!npc) return false;
  }
  if (p.type === "side_quest_candidate" && !input.context.region) return false;
  return true;
}

function chooseDecisions(proposals: AIProposal[], input: AICouncilInput, nowMs: number): AICouncilDecision {
  const valid = proposals.filter(p => validateProposal(p, input)).sort((a,b)=>(b.priority*b.confidence)-(a.priority*a.confidence));
  const selected: AIProposal[] = [];
  const seenNpc = new Set<string>();
  for (const p of valid) {
    if (p.type === "dialogue_pressure" && p.npcId && seenNpc.has(p.npcId)) continue;
    if (selected.length >= AI_COUNCIL_RULES.decisionMaxSelections) break;
    if (p.type === "economy_pressure" && selected.some(x=>x.type === "economy_pressure")) continue;
    selected.push(p);
    if (p.npcId) seenNpc.add(p.npcId);
  }
  return {
    id: `decision-${nowMs}`,
    selectedProposalIds: selected.map(p=>p.id),
    rejectedProposalIds: valid.filter(p=>!selected.includes(p)).map(p=>p.id),
    reason: selected.length ? "A legmagasabb relevanciajú, egymással összeegyeztethető javaslatok kerültek előre." : "Nincs elég erős, valid és összeegyeztethető javaslat.",
    hardConstraintsPassed: true,
    createdAt: iso(nowMs),
  };
}

export function createInitialAICouncilState(): AICouncilState {
  return {
    version: AI_COUNCIL_VERSION,
    mode: "ready_for_ai",
    lastRunAt: null,
    worldObserver: { lastSnapshot: null, proposals: [] },
    storyMaster: { lastSnapshot: null, proposals: [] },
    economyMaster: { lastSnapshot: null, proposals: [] },
    decisionLayer: { lastDecision: null, queue: [] },
    handoff: {
      aiMayGenerate: false,
      canonWriteAllowed: false,
      dynamicWriteAllowed: true,
      requiredValidators: [...AI_COUNCIL_RULES.validators],
    },
  };
}

export function runAICouncilFoundation(input: AICouncilInput, previous = createInitialAICouncilState()): AICouncilState {
  const world = runWorldObserver(input);
  const story = runStoryMaster(input);
  const economy = runEconomyMaster(input);
  const all = [...world.proposals, ...story.proposals, ...economy.proposals];
  const decision = chooseDecisions(all, input, input.nowMs);
  return {
    ...previous,
    version: AI_COUNCIL_VERSION,
    mode: "ready_for_ai",
    lastRunAt: iso(input.nowMs),
    worldObserver: { lastSnapshot: world.snapshot, proposals: world.proposals },
    storyMaster: { lastSnapshot: story.snapshot, proposals: story.proposals },
    economyMaster: { lastSnapshot: economy.snapshot, proposals: economy.proposals },
    decisionLayer: { lastDecision: decision, queue: all.filter(p => validateProposal(p, input)).slice(0, AI_COUNCIL_RULES.queueMax) },
  };
}

export function sanitizeAICouncilState(value: unknown): AICouncilState {
  const base = createInitialAICouncilState();
  if (!value || typeof value !== "object") return base;
  const v = value as Record<string, unknown>;
  return { ...base, version: typeof v.version === "string" ? v.version : AI_COUNCIL_VERSION, mode: "ready_for_ai", lastRunAt: typeof v.lastRunAt === "string" ? v.lastRunAt : null };
}

export const AI_COUNCIL_ARCHITECTURE = Object.freeze({
  orchestrator: "AI Játékmester",
  managers: {
    worldObserver: "A Szem / Világfigyelő",
    storyMaster: "Történetmester",
    economyMaster: "Gazdaságmester",
  },
  decisionLayer: "Döntéshozó réteg",
  downstream: ["Küldetések", "NPC-k", "Eventek", "Régiók"],
  principle: "A jövőbeli AI csak strukturált javaslatokat adhat; a runtime és a validátorok döntenek a végrehajthatóságról.",
});

export function runAIGameMasterFoundation(input: AICouncilInput, previous = createInitialAICouncilState()): AICouncilState {
  // Deterministic orchestration only. This is the exact place where a future model
  // gateway may be inserted after all validators and handoff checks are production-ready.
  return runAICouncilFoundation(input, previous);
}
