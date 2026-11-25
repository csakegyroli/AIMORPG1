import type { NpcDefinition, NpcId, QuestChoice, RegionId } from "./types";

export const IDENTITY_AXES = [
  "orderFreedom",
  "honorOpportunism",
  "mercyCruelty",
  "curiosityPragmatism",
  "ambitionIndependence",
  "riskSafety",
  "loyaltyAutonomy",
] as const;
export type IdentityAxis = (typeof IDENTITY_AXES)[number];
export type IdentityScores = Record<IdentityAxis, number>;
export type IdentityAffinity = "combat" | "shadow" | "social" | "trade" | "lore";
export type IdentityAffinities = Record<IdentityAffinity, number>;
export type PlayerIdentityState = { axes: IdentityScores; affinities: IdentityAffinities };

export type RelationshipFacets = {
  trust: number;
  respect: number;
  affection: number;
  fear: number;
  debt: number;
  suspicion: number;
};
export type RelationshipFacetMap = Record<NpcId, RelationshipFacets>;

export type WorldMemory = {
  id: string;
  kind: "quest" | "npc" | "travel" | "choice" | "world";
  title: string;
  text: string;
  npcId?: NpcId;
  region?: RegionId;
  district?: string;
  tags: string[];
  importance: 1 | 2 | 3 | 4;
  at: string;
};

export type NpcRuntimeStatus = "normal" | "friendly" | "suspicious" | "angry" | "injured" | "traveling" | "missing" | "disgraced" | "promoted";
export type NpcRuntimeState = { status: NpcRuntimeStatus; updatedAt: string; note?: string };
export type NpcRuntimeMap = Record<NpcId, NpcRuntimeState>;

export function createInitialPlayerIdentity(): PlayerIdentityState {
  return {
    axes: {
      orderFreedom: 0,
      honorOpportunism: 0,
      mercyCruelty: 0,
      curiosityPragmatism: 0,
      ambitionIndependence: 0,
      riskSafety: 0,
      loyaltyAutonomy: 0,
    },
    affinities: { combat: 0, shadow: 0, social: 0, trade: 0, lore: 0 },
  };
}

export function createInitialRelationshipFacets(ids: NpcId[]): RelationshipFacetMap {
  return Object.fromEntries(ids.map((id) => [id, { trust: 0, respect: 0, affection: 0, fear: 0, debt: 0, suspicion: 0 }])) as RelationshipFacetMap;
}

export function createInitialNpcRuntime(ids: NpcId[], at = "kezdés"): NpcRuntimeMap {
  return Object.fromEntries(ids.map((id) => [id, { status: "normal", updatedAt: at }])) as NpcRuntimeMap;
}

const STAT_SIGNALS: Record<string, Partial<IdentityScores>> = {
  strength: { riskSafety: 8, honorOpportunism: 3 },
  endurance: { riskSafety: 6, honorOpportunism: 2 },
  weaponMastery: { riskSafety: 10, honorOpportunism: 6, orderFreedom: 2 },
  defense: { riskSafety: -6, honorOpportunism: 10, loyaltyAutonomy: 5 },
  reflex: { riskSafety: 5 },
  willpower: { honorOpportunism: 8, loyaltyAutonomy: 3 },
  agility: { orderFreedom: -2, riskSafety: 4 },
  stealth: { orderFreedom: -10, honorOpportunism: -6, ambitionIndependence: -4 },
  pickpocket: { orderFreedom: -12, honorOpportunism: -10, ambitionIndependence: -4 },
  lockpicking: { orderFreedom: -8, curiosityPragmatism: 5, ambitionIndependence: 4 },
  perception: { curiosityPragmatism: 9, riskSafety: -2 },
  survival: { ambitionIndependence: 9, riskSafety: 8, orderFreedom: -3 },
  speech: { orderFreedom: 3, loyaltyAutonomy: 5 },
  charisma: { ambitionIndependence: 8, loyaltyAutonomy: -3 },
  intimidation: { orderFreedom: -6, mercyCruelty: -9, riskSafety: 6 },
  deception: { orderFreedom: -12, honorOpportunism: -10, riskSafety: 8, ambitionIndependence: 4 },
  empathy: { mercyCruelty: 12, loyaltyAutonomy: 8, honorOpportunism: 5 },
  leadership: { orderFreedom: 7, ambitionIndependence: 10, loyaltyAutonomy: 10 },
  trade: { ambitionIndependence: 9, curiosityPragmatism: -8 },
  bargaining: { honorOpportunism: -3, ambitionIndependence: 6, curiosityPragmatism: -5 },
  appraisal: { curiosityPragmatism: 6, ambitionIndependence: 5 },
  smithing: { honorOpportunism: 7, orderFreedom: 4, loyaltyAutonomy: 2 },
  alchemy: { curiosityPragmatism: 10, riskSafety: 4 },
  logistics: { orderFreedom: 8, curiosityPragmatism: -8, riskSafety: -4 },
  intelligence: { curiosityPragmatism: 10 },
  lore: { curiosityPragmatism: 12, orderFreedom: 4 },
  investigation: { curiosityPragmatism: 12, orderFreedom: 8 },
  politics: { orderFreedom: 9, ambitionIndependence: 12, loyaltyAutonomy: -2 },
  navigation: { ambitionIndependence: 12, orderFreedom: -3, riskSafety: 8 },
  magicSense: { curiosityPragmatism: 14, orderFreedom: -2 },
};

const AFFINITY_BY_STAT: Record<string, IdentityAffinity> = {
  strength: "combat", endurance: "combat", weaponMastery: "combat", defense: "combat", reflex: "combat", willpower: "combat",
  agility: "shadow", stealth: "shadow", pickpocket: "shadow", lockpicking: "shadow", perception: "shadow", survival: "shadow",
  speech: "social", charisma: "social", intimidation: "social", deception: "social", empathy: "social", leadership: "social",
  trade: "trade", bargaining: "trade", appraisal: "trade", smithing: "trade", alchemy: "trade", logistics: "trade",
  intelligence: "lore", lore: "lore", investigation: "lore", politics: "lore", navigation: "lore", magicSense: "lore",
};

function bounded(value: number, min = -100, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function identityDeltaForChoice(choice: QuestChoice): PlayerIdentityState {
  const axes: Partial<IdentityScores> = {};
  const statSignals = STAT_SIGNALS[choice.stat] ?? {};
  for (const [key, value] of Object.entries(statSignals)) axes[key as IdentityAxis] = (axes[key as IdentityAxis] ?? 0) + value;
  // Choice position matters, but only subtly; the written choice should remain primary.
  if (choice.id.endsWith("_c1")) axes.orderFreedom = (axes.orderFreedom ?? 0) + 2;
  if (choice.id.endsWith("_c2")) axes.ambitionIndependence = (axes.ambitionIndependence ?? 0) + 2;
  if (choice.id.endsWith("_c3")) axes.riskSafety = (axes.riskSafety ?? 0) + 4;
  const affinity = AFFINITY_BY_STAT[choice.stat];
  const affinities: Partial<IdentityAffinities> = affinity ? { [affinity]: 4 } : {};
  return { axes: axes as IdentityScores, affinities: affinities as IdentityAffinities };
}

export function mergeIdentity(base: PlayerIdentityState, delta: PlayerIdentityState): PlayerIdentityState {
  const axes = { ...base.axes };
  for (const axis of IDENTITY_AXES) axes[axis] = bounded((axes[axis] ?? 0) + (delta.axes[axis] ?? 0));
  const affinities = { ...base.affinities };
  for (const key of Object.keys(affinities) as IdentityAffinity[]) affinities[key] = Math.max(0, Math.min(100, Math.round(affinities[key] + (delta.affinities[key] ?? 0))));
  return { axes, affinities };
}

export function relationshipAggregate(facets: RelationshipFacets): number {
  const raw = facets.trust * 0.30 + facets.respect * 0.25 + facets.affection * 0.15 + facets.debt * 0.10 - facets.suspicion * 0.10 + facets.fear * 0.05;
  return bounded(raw);
}

export function createFacetDelta(choice: QuestChoice, success: boolean): Partial<RelationshipFacets> {
  if (!success) return { suspicion: 4, fear: choice.stat === "intimidation" ? 3 : 0 };
  const amount = choice.relation.amount;
  const byStat: Partial<RelationshipFacets> = STAT_SIGNALS[choice.stat] ? {} : {};
  if (["empathy", "speech", "charisma"].includes(choice.stat)) {
    byStat.trust = amount;
    byStat.affection = Math.ceil(amount * 0.6);
  } else if (["intimidation", "strength", "weaponMastery"].includes(choice.stat)) {
    byStat.respect = amount;
    byStat.fear = Math.ceil(amount * 0.6);
  } else if (["trade", "bargaining", "logistics"].includes(choice.stat)) {
    byStat.respect = Math.ceil(amount * 0.8);
    byStat.debt = Math.ceil(amount * 0.5);
  } else if (["stealth", "deception", "pickpocket", "lockpicking"].includes(choice.stat)) {
    byStat.respect = Math.ceil(amount * 0.4);
    byStat.suspicion = Math.ceil(amount * 0.8);
  } else {
    byStat.trust = Math.ceil(amount * 0.6);
    byStat.respect = Math.ceil(amount * 0.8);
  }
  return byStat;
}

export function applyFacetDelta(base: RelationshipFacets, delta: Partial<RelationshipFacets>): RelationshipFacets {
  const result = { ...base };
  for (const key of Object.keys(result) as (keyof RelationshipFacets)[]) result[key] = bounded(result[key] + (delta[key] ?? 0));
  return result;
}

export function stateForRelationship(facets: RelationshipFacets): NpcRuntimeStatus {
  if (facets.suspicion >= 65) return "angry";
  if (facets.suspicion >= 35) return "suspicious";
  if (facets.trust >= 40 && facets.respect >= 25) return "friendly";
  return "normal";
}

export function addMemory(memory: Omit<WorldMemory, "id">): WorldMemory {
  return { ...memory, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}` };
}

export function sanitizeMemory(value: unknown): value is WorldMemory {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.id === "string" && typeof v.title === "string" && typeof v.text === "string" && typeof v.at === "string" && typeof v.kind === "string" && Array.isArray(v.tags);
}

export function npcIsPresent(npc: NpcDefinition, hour: number, runtime?: NpcRuntimeState): boolean {
  if (runtime?.status === "missing" || runtime?.status === "traveling" || runtime?.status === "disgraced") return false;
  if (npc.startHour === undefined || npc.endHour === undefined) return true;
  return npc.startHour <= npc.endHour ? hour >= npc.startHour && hour < npc.endHour : hour >= npc.startHour || hour < npc.endHour;
}
