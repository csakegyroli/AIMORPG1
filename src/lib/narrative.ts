import type { NpcDefinition, NpcId, QuestDefinition, QuestKind, QuestStatus, RegionId, StatId, Stats } from "./types";
import type { NpcRuntimeMap, PlayerIdentityState, RelationshipFacets, RelationshipFacetMap, WorldMemory } from "./simulation";
import { NPCS, QUESTS, REGION_DISTRICTS, REGIONS, NPC_STORIES, NPC_FUNCTIONS, ITEMS } from "./content";
import { npcIsPresent } from "./simulation";
import { getItem } from "./rules";

export const NARRATIVE_FOUNDATION_VERSION = "2.1" as const;

export type QuestIntent = "investigate" | "retrieve" | "protect" | "deliver" | "negotiate" | "confront" | "escort" | "discover" | "prove";
export type QuestConflict = "truth_vs_access" | "duty_vs_opportunity" | "honor_vs_gain" | "order_vs_freedom" | "trust_vs_suspicion" | "knowledge_vs_safety" | "risk_vs_security" | "loyalty_vs_autonomy";
export type QuestResolutionMode = "single_path" | "multi_method" | "social" | "investigative" | "risk";

export type QuestDNA = {
  questId: string;
  kind: QuestKind;
  chapter: number;
  sequence: number;
  region: RegionId;
  giver: NpcId;
  intent: QuestIntent;
  conflict: QuestConflict;
  resolutionMode: QuestResolutionMode;
  stakes: "low" | "medium" | "high" | "arc";
  primaryStat: string;
  identitySignals: string[];
  relationshipSignals: string[];
  worldMemoryTags: string[];
  consequenceHorizon: { immediate: boolean; medium: boolean; longTerm: boolean };
  failForward: boolean;
  canonAnchors: string[];
  npcRole: string;
  regionRole: string;
};

export type DynamicNarrativeEvent = {
  id: string;
  type: "quest_started" | "quest_resolved" | "travel" | "relationship" | "npc_state" | "world_flag";
  at: string;
  questId?: string;
  npcId?: NpcId;
  region?: RegionId;
  tags: string[];
  summary: string;
  importance: 1 | 2 | 3 | 4;
};

export type DynamicWorldLayer = {
  flags: Record<string, string | number | boolean>;
  events: DynamicNarrativeEvent[];
  npcOverrides: Partial<NpcRuntimeMap>;
  discoveredCanonHints: string[];
};

export type DirectorHookKind = "relationship" | "local_problem" | "night_opportunity" | "world_reaction" | "identity_reflection";
export type DirectorHook = {
  kind: DirectorHookKind;
  npcId: NpcId;
  region: RegionId;
  priority: number;
  reason: string;
  tags: string[];
};

export type NarrativeOpportunityKind = "relationship" | "local_problem" | "night_opportunity" | "world_reaction" | "identity_reflection";
export type SideQuestScale = "micro" | "local" | "character_arc";
export type NarrativeOpportunity = {
  id: string;
  kind: NarrativeOpportunityKind;
  npcId: NpcId;
  region: RegionId;
  district?: string;
  priority: number;
  scale: SideQuestScale;
  triggerTags: string[];
  reason: string;
  anchors: { memoryIds: string[]; itemIds: string[]; questIds: string[] };
  expiresAt?: string;
};

export type SideQuestBlueprint = {
  schemaVersion: "1.0";
  id: string;
  kind: "side";
  source: NarrativeOpportunityKind;
  giver: NpcId;
  region: RegionId;
  district?: string;
  scale: SideQuestScale;
  hook: string;
  premise: string;
  objective: { kind: QuestIntent; summary: string; requiredItemIds: string[] };
  choiceSpace: Array<{ id: string; label: string; method: string }>;
  consequencePlan: Array<{ type: "relationship" | "memory" | "npc_state" | "world_flag" | "reward"; summary: string }>;
  canonReferences: string[];
  dynamicOnly: true;
};

export type DialogueContext = {
  npcId: NpcId;
  region: RegionId;
  district?: string;
  worldHour: number;
  present: boolean;
  relationship: RelationshipFacets;
  runtimeStatus: NpcRuntimeMap[NpcId]["status"];
  playerIdentity: PlayerIdentityState;
  knownMemoryIds: string[];
  discoveredBackstoryLevel: "surface" | "background" | "motivation" | "secret";
  activeMainQuestId: string | null;
  recentEventTags: string[];
};

export type WorldEventScope = "local" | "regional" | "server";
export type WorldEventCandidate = {
  id: string;
  region: RegionId;
  scope: WorldEventScope;
  canonical: boolean;
  title: string;
  reason: string;
  triggers: string[];
  participants: NpcId[];
  window: "now" | "today" | "soon";
  dynamicOnly: true;
};

export type SideQuestStatus = "offered" | "active" | "completed" | "failed" | "expired" | "declined";
export type RuntimeSideQuest = {
  id: string;
  opportunityId: string;
  blueprint: SideQuestBlueprint;
  status: SideQuestStatus;
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  sourceSignature: string;
};

export type SideQuestRuntimeState = {
  records: RuntimeSideQuest[];
  completedIds: string[];
  failedIds: string[];
  declinedIds: string[];
  expiredIds: string[];
  npcCooldownUntil: Record<string, number>;
  seenOpportunityIds: string[];
  lastEvaluationAt: number | null;
};

export type DialogueTopicKind = "introduction" | "backstory" | "motivation" | "secret" | "relationship" | "current_problem" | "function" | "main_quest" | "side_story";
export type DialogueTopic = {
  id: string;
  npcId: NpcId;
  kind: DialogueTopicKind;
  label: string;
  available: boolean;
  reason: string;
};
export type DialogueRuntimeSession = {
  npcId: NpcId;
  lastAt: number;
  topicsSeen: string[];
  turns: number;
};
export type DialogueRuntimeState = {
  sessions: Record<string, DialogueRuntimeSession>;
  topicCooldownUntil: Record<string, number>;
};

export type RuntimeWorldEvent = {
  id: string;
  scope: WorldEventScope;
  canonical: boolean;
  candidateId: string;
  region: RegionId;
  title: string;
  reason: string;
  participants: NpcId[];
  status: "scheduled" | "active" | "resolved" | "expired";
  createdAt: string;
  startsAt: number;
  expiresAt: number;
  triggerTags: string[];
};
export type WorldEventRuntimeState = {
  events: RuntimeWorldEvent[];
  resolvedIds: string[];
  lastEvaluationAt: number | null;
};

export type NarrativeRuntimeState = {
  sideQuests: SideQuestRuntimeState;
  dialogue: DialogueRuntimeState;
  worldEvents: WorldEventRuntimeState;
};

export type NarrativeDirectorState = {
  mode: "dormant";
  lastEvaluatedAt: string | null;
  hooks: DirectorHook[];
  opportunities: NarrativeOpportunity[];
  worldEventCandidates: WorldEventCandidate[];
};

import type { AICouncilState } from "./aiCouncil";
import { createInitialAICouncilState, sanitizeAICouncilState, runAICouncilFoundation } from "./aiCouncil";

export type NarrativeState = {
  foundationVersion: string;
  canon: { version: string; readonly: true };
  dynamic: DynamicWorldLayer;
  director: NarrativeDirectorState;
  runtime: NarrativeRuntimeState;
  aiCouncil: AICouncilState;
};

export const CANON_LAYER = Object.freeze({
  version: "capital-season-1",
  readonly: true,
  rules: [
    "A canon fact may be extended by a dynamic state, never contradicted silently.",
    "NPC identity, region structure, main quest structure and Black Coin arc are canon.",
    "The future AI may propose dynamic content but may never invent canon facts.",
    "The map remains the primary play surface; narrative systems provide context, not teleportation."
  ] as const,
});

export const QUEST_DNA_RULES = Object.freeze({
  requiredFields: [
    "intent", "conflict", "resolutionMode", "stakes", "identitySignals", "relationshipSignals",
    "worldMemoryTags", "consequenceHorizon", "failForward", "canonAnchors"
  ],
  principles: [
    "A quest changes at least one state that another system can remember.",
    "A quest's conflict is more important than its reward.",
    "A player choice should be legible through consequence, not hidden math.",
    "Main quests teach the world; side quests deepen it.",
    "Fail-forward keeps the authored spine alive while preserving the method of failure."
  ] as const,
});

function inferIntent(q: QuestDefinition): QuestIntent {
  const text = `${q.title} ${q.objective} ${q.story}`.toLowerCase();
  if (/(vizsg|azonosíts|egyeztesd|derítsd ki|nyom)/.test(text)) return "investigate";
  if (/(szerezz|találd meg|megkeres|hiányzik|szállít)/.test(text)) return "retrieve";
  if (/(véd|őriz|ments|biztons)/.test(text)) return "protect";
  if (/(add át|kézbes|juttasd|vigyél)/.test(text)) return "deliver";
  if (/(alku|egyez|meggyőz|szerep)/.test(text)) return "negotiate";
  if (/(állj|küzd|harc|konfront)/.test(text)) return "confront";
  if (/(kövesd|kísér)/.test(text)) return "escort";
  if (/(jel|régi|fedezd|találd ki|fejtsd)/.test(text)) return "discover";
  return "prove";
}

function inferConflict(q: QuestDefinition, giver: NpcId): QuestConflict {
  const text = `${q.title} ${q.story} ${q.consequence}`.toLowerCase();
  if (/(becsület|tiszta|jó hír|megbízhat)/.test(text)) return "honor_vs_gain";
  if (/(rend|őrség|pecsét|hivatal)/.test(text)) return "duty_vs_opportunity";
  if (/(titok|fekete|nyom|bizonyít)/.test(text)) return "truth_vs_access";
  if (/(kockázat|veszély|ár)/.test(text)) return "risk_vs_security";
  if (/(kapcsolat|bizalom|szívesség)/.test(text)) return "trust_vs_suspicion";
  if (giver === "miri" || giver === "damar" || giver === "harborMira") return "order_vs_freedom";
  if (giver === "palaceMara" || giver === "corvin") return "loyalty_vs_autonomy";
  return "knowledge_vs_safety";
}

function inferMode(q: QuestDefinition): QuestResolutionMode {
  if (q.choices.length >= 3) return q.choices.some(c => ["speech", "charisma", "empathy", "bargaining"].includes(c.stat)) ? "multi_method" : "risk";
  return "single_path";
}

function inferStakes(q: QuestDefinition): QuestDNA["stakes"] {
  if (q.chapter <= 1 && q.sequence <= 3) return "low";
  if (["palace", "harbor"].includes(q.region)) return q.sequence >= 4 ? "arc" : "high";
  if (q.sequence >= 6) return "high";
  return "medium";
}

export function deriveQuestDNA(q: QuestDefinition): QuestDNA {
  const npc = NPCS.find(n => n.id === q.giver);
  const story = NPC_STORIES[q.giver];
  const intent = inferIntent(q);
  const conflict = inferConflict(q, q.giver);
  const identitySignals = q.choices.map(c => c.stat).slice(0, 4);
  const relationshipSignals = ["giver", ...(q.choices.map(c => c.stat).filter(s => ["speech", "charisma", "empathy", "intimidation", "deception", "bargaining"].includes(s)))];
  const canonAnchors = [q.region, `chapter:${q.chapter}`, `giver:${q.giver}`, ...(story ? [story.questRole] : [])];
  const district = npc?.district;
  return {
    questId: q.id,
    kind: q.kind,
    chapter: q.chapter,
    sequence: q.sequence,
    region: q.region,
    giver: q.giver,
    intent,
    conflict,
    resolutionMode: inferMode(q),
    stakes: inferStakes(q),
    primaryStat: q.choices[0]?.stat ?? "investigation",
    identitySignals,
    relationshipSignals,
    worldMemoryTags: ["quest", q.kind, `chapter:${q.chapter}`, q.region, ...(district ? [`district:${district}`] : []), intent, conflict],
    consequenceHorizon: { immediate: true, medium: true, longTerm: q.chapter >= 2 || q.sequence >= 4 },
    failForward: q.kind === "main",
    canonAnchors,
    npcRole: story?.questRole ?? q.giver,
    regionRole: REGION_DISTRICTS.find(d => d.region === q.region)?.theme ?? q.region,
  };
}

export const QUEST_DNA = Object.freeze(Object.fromEntries(QUESTS.map(q => [q.id, deriveQuestDNA(q)])) as Record<string, QuestDNA>);

export type NarrativeContextInput = {
  region: RegionId;
  playerIdentity: PlayerIdentityState;
  relationshipFacets: RelationshipFacetMap;
  memories: WorldMemory[];
  npcStates: NpcRuntimeMap;
  questStatus: Record<string, QuestStatus>;
  activeQuestId: string | null;
  worldHour?: number;
  eyeSignals?: Array<{ title:string; body:string; tone:string }>;
};

export type NarrativeContext = Omit<NarrativeContextInput, "worldHour" | "eyeSignals"> & {
  worldHour: number;
  eyeSignals: Array<{ title:string; body:string; tone:string }>;
  recentMemoryTags: string[];
  activeQuestDNA: QuestDNA | null;
  relationshipPressure: Array<{ npcId: NpcId; pressure: number }>;
};

export function buildNarrativeContext(input: NarrativeContextInput): NarrativeContext {
  const normalized = {
    ...input,
    worldHour: Number.isFinite(input.worldHour) ? Number(input.worldHour) : 12,
    eyeSignals: Array.isArray(input.eyeSignals) ? input.eyeSignals : [],
  };
  const recentMemoryTags = Array.from(new Set(normalized.memories.slice(0, 16).flatMap(m => m.tags))).slice(0, 24);
  const activeQuestDNA = normalized.activeQuestId ? QUEST_DNA[normalized.activeQuestId] ?? null : null;
  const relationshipPressure = NPCS.map(npc => {
    const f = normalized.relationshipFacets[npc.id];
    const pressure = Math.abs(f.trust) + Math.abs(f.respect) + Math.abs(f.affection) + Math.abs(f.fear) + Math.abs(f.debt) + Math.abs(f.suspicion);
    return { npcId: npc.id, pressure };
  }).filter(x => x.pressure >= 45).sort((a,b) => b.pressure - a.pressure).slice(0, 8);
  return { ...normalized, recentMemoryTags, activeQuestDNA, relationshipPressure };
}

function isNightNpc(npcId: NpcId) {
  const npc = NPCS.find(n => n.id === npcId);
  return Boolean(npc?.nightShift);
}

export const NARRATIVE_PRIMITIVES = Object.freeze({
  intents: ["investigate", "retrieve", "protect", "deliver", "negotiate", "confront", "escort", "discover", "prove"] as const,
  conflicts: ["truth_vs_access", "duty_vs_opportunity", "honor_vs_gain", "order_vs_freedom", "trust_vs_suspicion", "knowledge_vs_safety", "risk_vs_security", "loyalty_vs_autonomy"] as const,
  choiceMethods: ["conversation", "trade", "craft", "investigation", "combat", "stealth", "service", "risk"] as const,
  consequenceTypes: ["relationship", "memory", "npc_state", "world_flag", "reward"] as const,
  scales: ["micro", "local", "character_arc"] as const,
  rules: [
    "The engine stores primitives and opportunities, not a library of prewritten side quests.",
    "A future generator may recombine primitives only inside the current Canon and Dynamic world state.",
    "Every generated quest must have at least one living NPC motive and one concrete world anchor.",
    "Every generated quest must leave a memory or state consequence.",
    "A dynamic quest can never silently rewrite Canon or resolve a main quest.",
  ] as const,
});

function discoveryLevelForNpc(context: NarrativeContext, npcId: NpcId): DialogueContext["discoveredBackstoryLevel"] {
  const f = context.relationshipFacets[npcId];
  if (!f) return "surface";
  if (f.trust >= 70 && f.affection >= 55) return "secret";
  if (f.trust >= 45 && f.respect >= 30) return "motivation";
  if (f.trust >= 20 || f.respect >= 20 || f.affection >= 20) return "background";
  return "surface";
}

export function buildDialogueContext(context: NarrativeContext, npcId: NpcId): DialogueContext | null {
  const npc = NPCS.find(n => n.id === npcId);
  if (!npc) return null;
  const relationship = context.relationshipFacets[npcId] ?? { trust:0,respect:0,affection:0,fear:0,debt:0,suspicion:0 };
  const hour = context.worldHour;
  const present = context.npcStates[npcId]?.status !== "missing" && context.npcStates[npcId]?.status !== "traveling" && npc.startHour === undefined ? true : (context.npcStates[npcId]?.status !== "missing" && context.npcStates[npcId]?.status !== "traveling" && (npc.startHour === undefined || (npc.startHour <= npc.endHour! ? hour >= npc.startHour && hour < npc.endHour! : hour >= npc.startHour || hour < npc.endHour!)));
  return {
    npcId, region: npc.region, district: npc.district, worldHour: hour, present, relationship,
    runtimeStatus: context.npcStates[npcId]?.status ?? "normal",
    playerIdentity: context.playerIdentity,
    knownMemoryIds: context.memories.filter(m => m.npcId === npcId).slice(0, 12).map(m => m.id),
    discoveredBackstoryLevel: discoveryLevelForNpc(context, npcId),
    activeMainQuestId: context.activeQuestId,
    recentEventTags: context.recentMemoryTags.slice(0, 12),
  };
}

function candidateScale(priority: number): SideQuestScale {
  if (priority >= 86) return "character_arc";
  if (priority >= 62) return "local";
  return "micro";
}

export function detectNarrativeOpportunities(context: NarrativeContext): NarrativeOpportunity[] {
  const opportunities: NarrativeOpportunity[] = [];
  const add = (kind: NarrativeOpportunityKind, npc: NpcId, priority: number, reason: string, tags: string[], scale?: SideQuestScale, memoryIds: string[] = [], itemIds: string[] = [], questIds: string[] = []) => {
    const n = NPCS.find(x => x.id === npc); if (!n || n.region !== context.region) return;
    opportunities.push({ id: `opp-${kind}-${npc}-${tags.join("-")}`, kind, npcId:npc, region:n.region, district:n.district, priority:Math.min(100,Math.max(1,priority)), scale:scale ?? candidateScale(priority), triggerTags:tags, reason, anchors:{memoryIds:memoryIds.slice(0,4), itemIds:itemIds.slice(0,4), questIds:questIds.slice(0,4)} });
  };
  for (const p of context.relationshipPressure) {
    if (p.pressure < 55) continue;
    const f = context.relationshipFacets[p.npcId];
    if (f.debt >= 25) add("relationship", p.npcId, 66 + Math.min(20, f.debt), "Tartozás vagy viszonzatlan szívesség feszül a kapcsolatban.", ["debt","relationship"], undefined, context.memories.filter(m=>m.npcId===p.npcId && m.kind === "choice").map(m=>m.id));
    else if (f.suspicion >= 35) add("relationship", p.npcId, 62 + Math.min(20, f.suspicion), "A gyanú olyan szintre ért, amelyből konfliktus vagy teszt születhet.", ["suspicion","relationship"], undefined, context.memories.filter(m=>m.npcId===p.npcId).map(m=>m.id));
    else if (f.trust >= 40) add("relationship", p.npcId, 58 + Math.min(25, f.trust), "A bizalom már elbír egy személyesebb kérést vagy vallomást.", ["trust","relationship"], undefined, context.memories.filter(m=>m.npcId===p.npcId).map(m=>m.id));
  }
  const night = context.worldHour >= 20 || context.worldHour < 6;
  if (night) {
    const nightNpc = NPCS.find(n => n.region === context.region && isNightNpc(n.id) && context.npcStates[n.id]?.status !== "missing" && context.npcStates[n.id]?.status !== "traveling");
    if (nightNpc) add("night_opportunity", nightNpc.id, 70, "Éjszakai jelenlétből adódó lehetőség; a nappali helyzethez képest más emberek és más ügyek kerülnek előtérbe.", ["night","continuity"], "local");
  }
  const topIdentity = Object.entries(context.playerIdentity.affinities).sort((a,b)=>b[1]-a[1])[0];
  if (topIdentity && topIdentity[1] >= 12) {
    const local = NPCS.find(n => n.region === context.region);
    if (local) add("identity_reflection", local.id, 48 + Math.min(30, topIdentity[1]), `A játékos ${topIdentity[0]} irányú viselkedése helyi helyzetben is tükröződhet.`, ["identity",topIdentity[0]]);
  }
  const important = context.memories.filter(m=>m.region===context.region && m.importance>=3).slice(0,3);
  for (const m of important) {
    if (!m.npcId) continue;
    add("world_reaction", m.npcId, 60 + m.importance*7, "Egy fontos helyi emlék új következményt vagy visszhangot indokolhat.", ["memory","world-reaction"], "local", [m.id], [], m.kind === "quest" && m.tags.includes("main") ? [m.title] : []);
  }
  return opportunities.sort((a,b)=>b.priority-a.priority).slice(0,12);
}

export function buildWorldEventCandidates(context: NarrativeContext): WorldEventCandidate[] {
  const candidates: WorldEventCandidate[] = [];
  const night = context.worldHour >= 20 || context.worldHour < 6;
  const localNpcs = NPCS.filter(n=>n.region===context.region);
  if (night) {
    const nightNpc = localNpcs.find(n=>n.nightShift);
    if (nightNpc) candidates.push({ id:`we-night-${context.region}`, region:context.region, title:"Éjszakai mozgás", reason:"A régió éjszakai ritmusa önálló életet hoz létre.", triggers:["night","night_shift"], participants:[nightNpc.id], window:"now", dynamicOnly:true, scope:"local", canonical:false });
  }
  const important = context.memories.find(m=>m.region===context.region && m.importance>=3);
  if (important) candidates.push({ id:`we-memory-${important.id}`, region:context.region, title:"Egy régi tett visszhangja", reason:"Egy korábbi fontos eseménynek új helyi következménye lehet.", triggers:["memory","consequence"], participants:important.npcId?[important.npcId]:localNpcs.slice(0,2).map(n=>n.id), window:"soon", dynamicOnly:true, scope:"regional", canonical:false });
  if (context.relationshipPressure[0]) {
    const npcId=context.relationshipPressure[0].npcId;
    candidates.push({ id:`we-rel-${npcId}`, region:context.region, title:"Feszülő kapcsolat", reason:"Egy erős kapcsolatállapot a környezetben is változást okozhat.", triggers:["relationship","social_pressure"], participants:[npcId], window:"today", dynamicOnly:true, scope:"regional", canonical:false });
  }
  return candidates.slice(0,6);
}

export function draftSideQuestBlueprint(opportunity: NarrativeOpportunity, context: NarrativeContext): SideQuestBlueprint {
  const npc = NPCS.find(n=>n.id===opportunity.npcId)!;
  const f = context.relationshipFacets[npc.id];
  const intent: QuestIntent = opportunity.kind === "world_reaction" ? "investigate" : opportunity.kind === "night_opportunity" ? "discover" : opportunity.kind === "identity_reflection" ? "prove" : opportunity.kind === "relationship" ? (f?.suspicion>=35 ? "confront" : f?.debt>=25 ? "deliver" : "negotiate") : "retrieve";
  const objectiveText = opportunity.kind === "relationship" ? "Rendezd vagy mélyítsd el a kapcsolatból születő ügyet." : opportunity.kind === "night_opportunity" ? "Derítsd ki, mi történik a régióban az éjszakai órákban." : opportunity.kind === "identity_reflection" ? "Oldj meg egy, a jelenlegi játékosi viselkedésedhez illő helyzetet." : opportunity.kind === "world_reaction" ? "Derítsd ki, miért tér vissza a korábbi esemény következménye." : "Oldj meg egy helyi problémát, amely a környék életéből fakad.";
  return { schemaVersion:"1.0", id:`draft-${opportunity.id}`, kind:"side", source:opportunity.kind, giver:npc.id, region:npc.region, district:npc.district, scale:opportunity.scale, hook:`${npc.name} életében valami megváltozott, és ez most téged is elér.`, premise:opportunity.reason, objective:{kind:intent,summary:objectiveText,requiredItemIds:opportunity.anchors.itemIds}, choiceSpace:[{id:"dialogue",label:"Megbeszéled",method:"conversation"},{id:"service",label:"Segítesz",method:"service"},{id:"risk",label:"Kockázatot vállalsz",method:"risk"}], consequencePlan:[{type:"relationship",summary:"A kapcsolat a végrehajtás módjától függően változik."},{type:"memory",summary:"A világ emléket őriz a történetről."}], canonReferences:[context.region,npc.id,...opportunity.anchors.questIds], dynamicOnly:true };
}

export function evaluateNarrativeDirector(context: NarrativeContext, at: string): NarrativeDirectorState {
  const hooks: DirectorHook[] = [];
  for (const pressure of context.relationshipPressure) {
    const npc = NPCS.find(n => n.id === pressure.npcId);
    if (!npc || npc.region !== context.region) continue;
    const f = context.relationshipFacets[npc.id];
    const tags = ["relationship"];
    let reason = "A kapcsolat elég jelentőssé vált ahhoz, hogy történeti helyzetet indokoljon.";
    let priority = Math.min(100, 30 + pressure.pressure);
    if (f.suspicion >= 35) { tags.push("suspicion"); reason = "A gyanú elegendő ahhoz, hogy a kapcsolat új konfliktust hordozzon."; priority += 8; }
    if (f.debt >= 25) { tags.push("debt"); reason = "Egy tartozás vagy viszonzatlan szívesség történeti nyomást hozhat létre."; priority += 8; }
    hooks.push({ kind: "relationship", npcId: npc.id, region: context.region, priority: Math.min(100, priority), reason, tags });
  }
  if (context.eyeSignals.length > 0) {
    const localEyeNpc = NPCS.find(n => n.region === context.region);
    if (localEyeNpc) hooks.push({ kind: "world_reaction", npcId: localEyeNpc.id, region: context.region, priority: 52, reason: "A Szem friss megfigyelése már értelmezhető történeti jelzésként, de még nem írja felül a világ állapotát.", tags: ["eye", "observation"] });
  }
  if (context.memories.some(m => m.region === context.region && m.importance === 3)) {
    const local = NPCS.find(n => n.region === context.region);
    if (local) hooks.push({ kind: "world_reaction", npcId: local.id, region: context.region, priority: 62, reason: "Fontos korábbi esemény történt itt; a világ hitelesen reagálhat rá.", tags: ["memory", "world-reaction"] });
  }
  const nightNpc = NPCS.find(n => n.region === context.region && isNightNpc(n.id));
  if (context.worldHour >= 20 || context.worldHour < 6) {
    const nightNpc = NPCS.find(n => n.region === context.region && isNightNpc(n.id) && context.npcStates[n.id]?.status !== "missing" && context.npcStates[n.id]?.status !== "traveling");
    if (nightNpc) hooks.push({ kind: "night_opportunity", npcId: nightNpc.id, region: context.region, priority: 48, reason: "Az éjszakai szereplők folytatják a világ életét akkor is, amikor a nappali NPC-k nem elérhetők.", tags: ["night", "continuity"] });
  }
  const topIdentity = Object.entries(context.playerIdentity.affinities).sort((a,b)=>b[1]-a[1])[0];
  if (topIdentity && topIdentity[1] >= 12) {
    const local = NPCS.find(n => n.region === context.region);
    if (local) hooks.push({ kind: "identity_reflection", npcId: local.id, region: context.region, priority: 45 + Math.min(15, topIdentity[1]), reason: `A játékos viselkedése ${topIdentity[0]} irányba erősödik; ezt egy hiteles helyi helyzet tükrözheti.`, tags: ["identity", topIdentity[0]] });
  }
  const opportunities = detectNarrativeOpportunities(context);
  const worldEventCandidates = buildWorldEventCandidates(context);
  return { mode: "dormant", lastEvaluatedAt: at, hooks: hooks.sort((a,b)=>b.priority-a.priority).slice(0, 10), opportunities, worldEventCandidates };
}


const RUNTIME_RULES = Object.freeze({
  maxOfferedSideQuestsPerRegion: 3,
  maxActiveSideQuestsPerNpc: 1,
  maxActiveSideQuestsTotal: 4,
  npcCooldownMs: 6 * 60 * 60 * 1000,
  opportunityReofferMs: 12 * 60 * 60 * 1000,
  dialogueCooldownMs: 20 * 60 * 1000,
  worldEventDurationMs: 90 * 60 * 1000,
  maxRuntimeEvents: 40,
  maxSideQuestRecords: 80,
} as const);

function emptyRuntime(): NarrativeRuntimeState {
  return {
    sideQuests: { records: [], completedIds: [], failedIds: [], declinedIds: [], expiredIds: [], npcCooldownUntil: {}, seenOpportunityIds: [], lastEvaluationAt: null },
    dialogue: { sessions: {}, topicCooldownUntil: {} },
    worldEvents: { events: [], resolvedIds: [], lastEvaluationAt: null },
  };
}

function runtimeKeyForOpportunity(opportunity: NarrativeOpportunity) {
  return [opportunity.kind, opportunity.npcId, opportunity.region, opportunity.district ?? "", ...opportunity.triggerTags.slice().sort()].join("|");
}

function availableNow(context: NarrativeContext, npcId: NpcId): boolean {
  const npc = NPCS.find(n => n.id === npcId);
  return Boolean(npc && npc.region === context.region && npcIsPresent(npc, context.worldHour, context.npcStates[npcId]));
}

function hasRecentOpportunity(runtime: SideQuestRuntimeState, opportunity: NarrativeOpportunity, now: number) {
  const sig = runtimeKeyForOpportunity(opportunity);
  const record = runtime.records.find(r => r.sourceSignature === sig && ["offered", "active"].includes(r.status));
  if (record) return true;
  const last = runtime.records
    .filter(r => r.sourceSignature === sig)
    .sort((a,b)=>Date.parse(b.updatedAt)-Date.parse(a.updatedAt))[0];
  if (!last) return false;
  return now - Date.parse(last.updatedAt) < RUNTIME_RULES.opportunityReofferMs;
}

function runtimeEligibleOpportunity(context: NarrativeContext, runtime: SideQuestRuntimeState, opportunity: NarrativeOpportunity, now: number) {
  if (!availableNow(context, opportunity.npcId)) return false;
  const npcCooldown = runtime.npcCooldownUntil[opportunity.npcId] ?? 0;
  if (npcCooldown > now) return false;
  if (hasRecentOpportunity(runtime, opportunity, now)) return false;
  const activeTotal = runtime.records.filter(r => r.status === "active").length;
  if (activeTotal >= RUNTIME_RULES.maxActiveSideQuestsTotal) return false;
  const activeForNpc = runtime.records.filter(r => r.blueprint.giver === opportunity.npcId && r.status === "active").length;
  if (activeForNpc >= RUNTIME_RULES.maxActiveSideQuestsPerNpc) return false;
  const sameRegionOffered = runtime.records.filter(r => r.blueprint.region === context.region && ["offered", "active"].includes(r.status)).length;
  if (sameRegionOffered >= RUNTIME_RULES.maxOfferedSideQuestsPerRegion) return false;
  // Do not flood the player while a main quest is freshly active; local stories should breathe around it.
  if (context.activeQuestId && context.questStatus[context.activeQuestId] === "active" && opportunity.kind === "identity_reflection" && opportunity.priority < 70) return false;
  return true;
}

export function sideQuestChoiceStat(method: string): StatId {
  switch (method) {
    case "conversation": return "speech";
    case "service": return "leadership";
    case "trade": return "bargaining";
    case "risk": return "survival";
    case "investigation": return "investigation";
    default: return "empathy";
  }
}

export function sideQuestChoiceRequirement(scale: SideQuestScale): number {
  // The first tier is accessible with starter stats; larger stories ask for investment or gear.
  return scale === "micro" ? 5 : scale === "local" ? 7 : 9;
}

export function evaluateSideQuestChoice(scale: SideQuestScale, method: string, stats: Stats, bonus = 0) {
  const stat = sideQuestChoiceStat(method);
  const score = (stats[stat] ?? 0) + bonus;
  const requirement = sideQuestChoiceRequirement(scale);
  return { stat, score, requirement, success: score >= requirement };
}

function normalizeChoiceSpace(opportunity: NarrativeOpportunity, npc: NpcDefinition): SideQuestBlueprint["choiceSpace"] {
  const base = [
    { id: "talk", label: "Beszélsz vele.", method: "conversation" },
    { id: "service", label: `${npc.name} kérését teljesíted.`, method: "service" },
    { id: "trade", label: "Erőforrással vagy kereskedelemmel oldod meg.", method: "trade" },
    { id: "risk", label: "Kockázatosabb utat választasz.", method: "risk" },
    { id: "investigate", label: "Előbb utánanézel az ügy valódi hátterének.", method: "investigation" },
  ];
  if (opportunity.kind === "relationship") base[0].label = npc.role === "Fogadós" ? "Leülsz vele beszélni a pultnál." : `Meghallgatod, mit akar ${npc.name}.`;
  if (opportunity.kind === "night_opportunity") base[2].label = "Éjszakai kerülőúton próbálod megoldani.";
  return base;
}

function buildDeterministicSideQuest(opportunity: NarrativeOpportunity, context: NarrativeContext): SideQuestBlueprint {
  const npc = NPCS.find(n=>n.id===opportunity.npcId)!;
  const base = draftSideQuestBlueprint(opportunity, context);
  const fn = NPC_FUNCTIONS.filter(f=>f.npcId===npc.id)[0];
  const anchoredItems = opportunity.anchors.itemIds.filter(id => ITEMS.some(i=>i.id===id));
  const objectiveItem = anchoredItems[0] ?? undefined;
  const itemSummary = objectiveItem ? ` A helyzet egy ismert tárgyhoz kötődik: ${getItem(objectiveItem).name}.` : "";
  return {
    ...base,
    hook: `${npc.name} ${opportunity.reason.toLowerCase()} ${npc.role}ként nem tudja egyedül elvinni ezt az ügyet.${itemSummary}`,
    premise: `${opportunity.reason}${fn ? ` A helyszínen a(z) ${fn.title.toLowerCase()} funkciója is kapcsolódhat hozzá.` : ""}`,
    objective: { ...base.objective, summary: `${base.objective.summary}${objectiveItem ? ` Szükség lehet rá: ${getItem(objectiveItem).name}.` : ""}`, requiredItemIds: anchoredItems },
    choiceSpace: normalizeChoiceSpace(opportunity, npc),
    consequencePlan: [
      { type: "relationship", summary: "A megoldás módja változtatja a kapcsolatot a megbízóval." },
      { type: "memory", summary: "A világ megőrzi, hogy a játékos mit vállalt el és hogyan oldotta meg." },
      { type: "npc_state", summary: "Az NPC állapota a játékos viselkedése szerint változhat." },
      { type: "world_flag", summary: "Helyi állapotjelző változhat, hogy későbbi történetek hivatkozhassanak rá." },
      { type: "reward", summary: "A jutalom a világ meglévő gazdaságából és az NPC funkciójából származik." },
    ],
  };
}

export function buildDeterministicRuntime(state: NarrativeState, context: NarrativeContext, atMs = Date.now()): NarrativeState {
  const runtime: NarrativeRuntimeState = state.runtime ?? emptyRuntime();
  const opportunities = detectNarrativeOpportunities(context);
  const side = { ...runtime.sideQuests };
  const nowIso = new Date(atMs).toISOString();
  // Keep expired stories in the journal instead of silently deleting them.
  // This makes missed deadlines a visible, persistent world outcome.
  const expiredRecords = side.records.filter(r => r.expiresAt && Date.parse(r.expiresAt) <= atMs && ["offered", "active"].includes(r.status));
  const expiredIdsNow = new Set(expiredRecords.map(r => r.id));
  let records = side.records.map(r => expiredIdsNow.has(r.id) ? { ...r, status: "expired" as const, updatedAt: nowIso } : r);
  side.expiredIds = Array.from(new Set([...side.expiredIds, ...expiredRecords.map(r => r.id)])).slice(-120);
  side.records = records;
  const accepted: RuntimeSideQuest[] = [];
  for (const opportunity of opportunities) {
    const acceptedNpcActive = accepted.filter(r => r.blueprint.giver === opportunity.npcId).length;
    const acceptedRegionOffered = accepted.filter(r => r.blueprint.region === context.region).length;
    if (acceptedNpcActive >= RUNTIME_RULES.maxActiveSideQuestsPerNpc) continue;
    if (acceptedRegionOffered >= RUNTIME_RULES.maxOfferedSideQuestsPerRegion) continue;
    if (!runtimeEligibleOpportunity(context, side, opportunity, atMs)) continue;
    const blueprint = buildDeterministicSideQuest(opportunity, context);
    const expiresAt = new Date(atMs + (opportunity.scale === "character_arc" ? 48 : opportunity.scale === "local" ? 24 : 12) * 60 * 60 * 1000).toISOString();
    accepted.push({ id: `sq-${opportunity.id}-${Math.floor(atMs / 3600000)}`, opportunityId: opportunity.id, blueprint, status: "offered", createdAt: nowIso, updatedAt: nowIso, expiresAt, sourceSignature: runtimeKeyForOpportunity(opportunity) });
    side.seenOpportunityIds = Array.from(new Set([...side.seenOpportunityIds, opportunity.id])).slice(-120);
    if (accepted.length >= 2) break;
  }
  records = [...accepted, ...records].slice(0, RUNTIME_RULES.maxSideQuestRecords);
  const dialogue = { ...runtime.dialogue, topicCooldownUntil: Object.fromEntries(Object.entries(runtime.dialogue.topicCooldownUntil).filter(([,until]) => Number(until) > atMs)) };
  let worldEvents = { ...runtime.worldEvents, events: runtime.worldEvents.events.filter(e => e.status !== "expired" && e.expiresAt > atMs).slice(0, RUNTIME_RULES.maxRuntimeEvents) };
  const activeRegions = new Set(worldEvents.events.filter(e => e.status === "active").map(e => e.region));
  for (const candidate of buildWorldEventCandidates(context)) {
    if (candidate.window !== "now" || activeRegions.has(candidate.region)) continue;
    const alreadyResolved = worldEvents.resolvedIds.includes(candidate.id);
    const exists = worldEvents.events.some(e => e.candidateId === candidate.id && e.expiresAt > atMs);
    if (alreadyResolved || exists) continue;
    const event: RuntimeWorldEvent = {
      id: `we-${candidate.id}-${Math.floor(atMs / 3600000)}`,
      candidateId: candidate.id,
      scope: candidate.scope,
      canonical: candidate.canonical,
      region: candidate.region,
      title: candidate.title,
      reason: candidate.reason,
      participants: candidate.participants,
      status: "active",
      createdAt: nowIso,
      startsAt: atMs,
      expiresAt: atMs + RUNTIME_RULES.worldEventDurationMs,
      triggerTags: candidate.triggers,
    };
    worldEvents = { ...worldEvents, events: [event, ...worldEvents.events].slice(0, RUNTIME_RULES.maxRuntimeEvents) };
    activeRegions.add(candidate.region);
    if (activeRegions.size >= 2) break;
  }
  return {
    ...state,
    runtime: {
      sideQuests: { ...side, records, lastEvaluationAt: atMs },
      dialogue,
      worldEvents: { ...worldEvents, lastEvaluationAt: atMs },
    },
    director: { ...evaluateNarrativeDirector(context, nowIso) },
  };
}

export function getAvailableDialogueTopics(context: NarrativeContext, npcId: NpcId, nowMs = Date.now()): DialogueTopic[] {
  const npc = NPCS.find(n=>n.id===npcId);
  if (!npc) return [];
  const dc = buildDialogueContext(context, npcId);
  if (!dc || !dc.present) return [];
  const level = dc.discoveredBackstoryLevel;
  const topics: DialogueTopic[] = [
    { id:`${npcId}:intro`, npcId, kind:"introduction", label:"Az ember, aki előtted áll", available:true, reason:"Alapismeret." },
    { id:`${npcId}:function`, npcId, kind:"function", label:npc.service ?? "A munkájáról", available:true, reason:"A helyhez és szerephez kötött funkció." },
    { id:`${npcId}:background`, npcId, kind:"backstory", label:"A múltjáról", available:level!=="surface", reason:"A kapcsolat már lehetővé tesz több személyes információt." },
    { id:`${npcId}:motivation`, npcId, kind:"motivation", label:"Mit akar valójában?", available:["motivation","secret"].includes(level), reason:"Több bizalom és tisztelet kell." },
    { id:`${npcId}:secret`, npcId, kind:"secret", label:"Amit másoknak nem mond el", available:level==="secret", reason:"Ez már bizalmi titok." },
    { id:`${npcId}:relationship`, npcId, kind:"relationship", label:"A kapcsolatotokról", available:true, reason:"A közös múlt része." },
  ];
  return topics.filter(t => t.available).map(t => ({ ...t, available: (context.relationshipFacets[npcId]?.suspicion ?? 0) < 65 || t.kind === "introduction" })).filter(t=>t.available);
}

export function registerDialogueTurn(state: NarrativeState, npcId: NpcId, topicId: string, atMs = Date.now()): NarrativeState {
  const session = state.runtime?.dialogue.sessions[npcId] ?? { npcId, lastAt: 0, topicsSeen: [], turns: 0 };
  const next: DialogueRuntimeSession = { npcId, lastAt: atMs, topicsSeen: Array.from(new Set([...session.topicsSeen, topicId])).slice(-20), turns: session.turns + 1 };
  return { ...state, runtime: { ...state.runtime, dialogue: { ...state.runtime.dialogue, sessions: { ...state.runtime.dialogue.sessions, [npcId]: next }, topicCooldownUntil: { ...state.runtime.dialogue.topicCooldownUntil, [topicId]: atMs + RUNTIME_RULES.dialogueCooldownMs } } } };
}

export const markDialogueTopicSeen = registerDialogueTurn;

export function activateSideQuest(state: NarrativeState, sideQuestId: string, atMs = Date.now()): NarrativeState {
  const records = state.runtime.sideQuests.records.map(r => r.id === sideQuestId && r.status === "offered" ? { ...r, status: "active" as const, updatedAt: new Date(atMs).toISOString() } : r);
  return { ...state, runtime: { ...state.runtime, sideQuests: { ...state.runtime.sideQuests, records } } };
}

export function resolveSideQuestRuntime(state: NarrativeState, sideQuestId: string, status: "completed" | "failed" | "declined" | "expired", atMs = Date.now()): NarrativeState {
  const record = state.runtime.sideQuests.records.find(r=>r.id===sideQuestId);
  if (!record) return state;
  const updatedAt = new Date(atMs).toISOString();
  const records = state.runtime.sideQuests.records.map(r => r.id===sideQuestId ? { ...r, status, updatedAt } : r);
  const appendId = (ids: string[]) => Array.from(new Set([...ids, sideQuestId])).slice(-120);
  const side = {
    ...state.runtime.sideQuests,
    records,
    completedIds: status === "completed" ? appendId(state.runtime.sideQuests.completedIds) : state.runtime.sideQuests.completedIds,
    failedIds: status === "failed" ? appendId(state.runtime.sideQuests.failedIds) : state.runtime.sideQuests.failedIds,
    declinedIds: status === "declined" ? appendId(state.runtime.sideQuests.declinedIds) : state.runtime.sideQuests.declinedIds,
    expiredIds: status === "expired" ? appendId(state.runtime.sideQuests.expiredIds) : state.runtime.sideQuests.expiredIds,
  };
  return { ...state, runtime: { ...state.runtime, sideQuests: { ...side, npcCooldownUntil: { ...side.npcCooldownUntil, [record.blueprint.giver]: atMs + RUNTIME_RULES.npcCooldownMs } } } };
}

export function activateWorldEvent(state: NarrativeState, candidateId: string, atMs = Date.now()): NarrativeState {
  const candidate = state.director.worldEventCandidates.find(c=>c.id===candidateId);
  if (!candidate) return state;
  const id = `we-${candidateId}-${Math.floor(atMs/3600000)}`;
  const event: RuntimeWorldEvent = { id, candidateId, scope:candidate.scope, canonical:candidate.canonical, region:candidate.region, title:candidate.title, reason:candidate.reason, participants:candidate.participants, status:"active", createdAt:new Date(atMs).toISOString(), startsAt:atMs, expiresAt:atMs+RUNTIME_RULES.worldEventDurationMs, triggerTags:candidate.triggers };
  const events = [event, ...state.runtime.worldEvents.events.filter(e=>e.status!=="active")].slice(0,RUNTIME_RULES.maxRuntimeEvents);
  return { ...state, runtime: { ...state.runtime, worldEvents: { ...state.runtime.worldEvents, events } } };
}

export function tickNarrativeRuntime(state: NarrativeState, context: NarrativeContext, atMs = Date.now()): NarrativeState {
  const last = state.runtime?.sideQuests?.lastEvaluationAt ?? state.runtime?.worldEvents?.lastEvaluationAt ?? null;
  if (last && atMs - last < 60_000) return state;
  let next = buildDeterministicRuntime(state, context, atMs);
  const expired = next.runtime.worldEvents.events.map(e => e.expiresAt <= atMs && e.status === "active" ? { ...e, status:"expired" as const } : e);
  next = { ...next, runtime: { ...next.runtime, worldEvents: { ...next.runtime.worldEvents, events: expired } } };
  return next;
}

export function createInitialNarrativeState(): NarrativeState {
  return {
    foundationVersion: NARRATIVE_FOUNDATION_VERSION,
    canon: { version: CANON_LAYER.version, readonly: true },
    dynamic: { flags: {}, events: [], npcOverrides: {}, discoveredCanonHints: [] },
    director: { mode: "dormant", lastEvaluatedAt: null, hooks: [], opportunities: [], worldEventCandidates: [] },
    runtime: emptyRuntime(),
    aiCouncil: createInitialAICouncilState(),
  };
}

export function recordDynamicEvent(
  state: NarrativeState,
  event: Omit<DynamicNarrativeEvent, "id">,
): NarrativeState {
  const next = { ...state, dynamic: { ...state.dynamic, events: [{ ...event, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` }, ...state.dynamic.events].slice(0, 200) } };
  return next;
}

export function syncNarrativeDirector(
  state: NarrativeState,
  context: NarrativeContext,
  at: string,
): NarrativeState {
  // The AI remains dormant. The council foundation runs deterministically and only
  // prepares observations/proposals for the future AI handoff.
  const deterministic = buildDeterministicRuntime(state, context, Date.now());
  const council = runAICouncilFoundation({ context, state: deterministic, nowMs: Date.now() }, deterministic.aiCouncil);
  return { ...deterministic, aiCouncil: council };
}

export function sanitizeNarrativeState(value: unknown): NarrativeState {
  const base = createInitialNarrativeState();
  if (!value || typeof value !== "object") return base;
  const v = value as Record<string, unknown>;
  const dynamic = v.dynamic && typeof v.dynamic === "object" ? v.dynamic as Record<string, unknown> : {};
  const events = Array.isArray(dynamic.events) ? dynamic.events.filter((e): e is DynamicNarrativeEvent => {
    if (!e || typeof e !== "object") return false;
    const x = e as Record<string, unknown>;
    return typeof x.id === "string" && typeof x.type === "string" && typeof x.at === "string" && typeof x.summary === "string" && Array.isArray(x.tags);
  }).slice(0, 200) : [];
  const flags: Record<string, string | number | boolean> = {};
  if (dynamic.flags && typeof dynamic.flags === "object") {
    for (const [key, raw] of Object.entries(dynamic.flags as Record<string, unknown>)) {
      if (typeof raw === "string" || typeof raw === "number" || typeof raw === "boolean") flags[key] = raw;
    }
  }
  const director = v.director && typeof v.director === "object" ? v.director as Record<string, unknown> : {};
  return {
    foundationVersion: typeof v.foundationVersion === "string" ? v.foundationVersion : NARRATIVE_FOUNDATION_VERSION,
    canon: { version: CANON_LAYER.version, readonly: true },
    dynamic: {
      flags,
      events,
      npcOverrides: {},
      discoveredCanonHints: Array.isArray(dynamic.discoveredCanonHints) ? dynamic.discoveredCanonHints.filter((x): x is string => typeof x === "string").slice(0, 100) : [],
    },
    director: {
      mode: "dormant",
      lastEvaluatedAt: typeof director.lastEvaluatedAt === "string" ? director.lastEvaluatedAt : null,
      hooks: Array.isArray(director.hooks) ? director.hooks.filter((h): h is DirectorHook => !!h && typeof h === "object" && typeof (h as any).kind === "string" && typeof (h as any).npcId === "string" && typeof (h as any).region === "string" && typeof (h as any).reason === "string" && Array.isArray((h as any).tags)).slice(0,10) : [],
      opportunities: Array.isArray((director as any).opportunities) ? (director as any).opportunities.filter((o:any)=>o && typeof o.id === "string" && typeof o.npcId === "string" && typeof o.region === "string" && typeof o.reason === "string" && Array.isArray(o.triggerTags)).slice(0,12) : [],
      worldEventCandidates: Array.isArray((director as any).worldEventCandidates) ? (director as any).worldEventCandidates.filter((e:any)=>e && typeof e.id === "string" && typeof e.region === "string" && typeof e.title === "string" && Array.isArray(e.participants)).slice(0,6) : [],
    },
    runtime: {
      sideQuests: {
        records: Array.isArray((v as any).runtime?.sideQuests?.records) ? (v as any).runtime.sideQuests.records.filter((r:any)=>r&&typeof r.id==="string"&&r.blueprint&&typeof r.blueprint.giver==="string").slice(0,80) : [],
        completedIds: Array.isArray((v as any).runtime?.sideQuests?.completedIds) ? (v as any).runtime.sideQuests.completedIds.filter((x:any)=>typeof x==="string").slice(-120) : [],
        failedIds: Array.isArray((v as any).runtime?.sideQuests?.failedIds) ? (v as any).runtime.sideQuests.failedIds.filter((x:any)=>typeof x==="string").slice(-120) : [],
        declinedIds: Array.isArray((v as any).runtime?.sideQuests?.declinedIds) ? (v as any).runtime.sideQuests.declinedIds.filter((x:any)=>typeof x==="string").slice(-120) : [],
        expiredIds: Array.isArray((v as any).runtime?.sideQuests?.expiredIds) ? (v as any).runtime.sideQuests.expiredIds.filter((x:any)=>typeof x==="string").slice(-120) : [],
        npcCooldownUntil: (v as any).runtime?.sideQuests?.npcCooldownUntil && typeof (v as any).runtime.sideQuests.npcCooldownUntil === "object" ? (v as any).runtime.sideQuests.npcCooldownUntil : {},
        seenOpportunityIds: Array.isArray((v as any).runtime?.sideQuests?.seenOpportunityIds) ? (v as any).runtime.sideQuests.seenOpportunityIds.filter((x:any)=>typeof x==="string").slice(-120) : [],
        lastEvaluationAt: typeof (v as any).runtime?.sideQuests?.lastEvaluationAt === "number" ? (v as any).runtime.sideQuests.lastEvaluationAt : null,
      },
      dialogue: {
        sessions: (v as any).runtime?.dialogue?.sessions && typeof (v as any).runtime.dialogue.sessions === "object" ? (v as any).runtime.dialogue.sessions : {},
        topicCooldownUntil: (v as any).runtime?.dialogue?.topicCooldownUntil && typeof (v as any).runtime.dialogue.topicCooldownUntil === "object" ? (v as any).runtime.dialogue.topicCooldownUntil : {},
      },
      worldEvents: {
        events: Array.isArray((v as any).runtime?.worldEvents?.events) ? (v as any).runtime.worldEvents.events.filter((e:any)=>e&&typeof e.id==="string"&&typeof e.region==="string"&&typeof e.title==="string").map((e:any)=>({ ...e, scope:(e.scope==="server"||e.scope==="regional"||e.scope==="local")?e.scope:"regional", canonical:Boolean(e.canonical) })).slice(0,40) : [],
        resolvedIds: Array.isArray((v as any).runtime?.worldEvents?.resolvedIds) ? (v as any).runtime.worldEvents.resolvedIds.filter((x:any)=>typeof x==="string").slice(-120) : [],
        lastEvaluationAt: typeof (v as any).runtime?.worldEvents?.lastEvaluationAt === "number" ? (v as any).runtime.worldEvents.lastEvaluationAt : null,
      },
    },
    aiCouncil: sanitizeAICouncilState((v as any).aiCouncil),
  };
}

export type CanonServerWorldEventDefinition = {
  id: string;
  title: string;
  scope: "server";
  canonical: true;
  trigger: string;
  unlocks?: RegionId[];
  introduces?: NpcId[];
  introducesItems?: string[];
};

export const CANON_SERVER_WORLD_EVENTS: readonly CanonServerWorldEventDefinition[] = Object.freeze([
  { id:"season-opening", title:"Az új királysági év megnyitója", scope:"server", canonical:true, trigger:"Manually authored season opening." },
  { id:"king-birthday", title:"A király születésnapja", scope:"server", canonical:true, trigger:"Manually authored royal celebration; may temporarily alter reward tables without changing canon." },
  { id:"region-unlock", title:"Egy új régió kapuinak megnyitása", scope:"server", canonical:true, trigger:"Manually authored narrative milestone.", unlocks:["inner"] },
  { id:"new-character-arrival", title:"Egy új arc érkezése a fővárosba", scope:"server", canonical:true, trigger:"Manually authored character introduction." },
] as const);

export const WORLD_EVENT_PROTOCOL = Object.freeze({
  canon: [
    "Server-scale world events are authored by the game team and belong to Canon.",
    "Season openings/closings, region unlock beats and major world introductions are never AI-authored.",
    "Canon events may reference Dynamic state, but Dynamic events may never silently rewrite Canon."
  ] as const,
  dynamic: [
    "Local/regional events may be surfaced by the deterministic runtime or future AI.",
    "Dynamic events are temporary, scoped, and expire or resolve without changing the authored spine.",
    "The player is informed through A Szem and Overview; the map remains the play surface."
  ] as const
});

export const SIDE_QUEST_FRAMEWORK = Object.freeze({
  mode: "inactive-until-ai-release",
  model: "opportunity-to-story",
  stages: [
    "world_snapshot",
    "opportunity_detection",
    "npc_motivation_check",
    "player_context_check",
    "story_shape_selection",
    "dynamic_quest_draft",
    "canon_validation",
    "runtime_validation",
    "memory_and_consequence_registration",
  ] as const,
  allowedSources: ["relationship", "local_problem", "night_opportunity", "world_reaction", "identity_reflection"] as const,
  hardConstraints: [
    "Never contradict CANON_LAYER.",
    "Never alter main quest outcomes.",
    "Never create an NPC who does not exist in canon.",
    "Never teleport the player or complete a side quest from the information layer.",
    "A side quest must have a reason rooted in NPC motivation, relationship, world memory or current world state.",
    "A side quest can be unavailable without penalizing the player for being offline.",
    "Only existing items, districts, NPC functions and world locations may be used.",
    "A generated quest must leave a durable memory or state consequence.",
    "AI may create Dynamic content only; Canon remains immutable.",
  ] as const,
  futureAIOutput: [
    "hook", "premise", "objective", "choiceSpace", "consequencePlan", "canonReferences",
    "dialogueIntent", "itemAnchors", "worldEventLinks", "expiry",
  ] as const,
  validationGates: ["canon", "npc", "world", "item", "relationship", "timeline", "consequence"] as const,
});
