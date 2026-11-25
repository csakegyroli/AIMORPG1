import { ITEMS, EQUIPMENT_SETS, QUESTS } from "./content";
import { itemCategory, itemLegalStatus } from "./itemSystem";
import { mergedCalendarBonuses } from "./worldCalendar";
import type { ItemDefinition, ItemId, ItemRarity, QuestDefinition, QuestKind, RegionId } from "./types";

export type RarityEconomyProfile = {
  rarity: ItemRarity;
  nominalDropChance: number;
  priceMultiplier: number;
  diamondFloor: number;
};

export const RARITY_ECONOMY: Record<ItemRarity, RarityEconomyProfile> = {
  "Közönséges": { rarity: "Közönséges", nominalDropChance: 0.15, priceMultiplier: 1, diamondFloor: 0 },
  "Ritka": { rarity: "Ritka", nominalDropChance: 0.01, priceMultiplier: 8, diamondFloor: 0 },
  "Különleges": { rarity: "Különleges", nominalDropChance: 0.0025, priceMultiplier: 25, diamondFloor: 2 },
  "Legendás": { rarity: "Legendás", nominalDropChance: 0.001, priceMultiplier: 100, diamondFloor: 10 },
};

export const REGION_REWARD_SCALARS: Record<RegionId, number> = {
  outskirts: 1,
  arena: 1.22,
  market: 1.45,
  inner: 1.8,
  palace: 2.2,
  harbor: 2.55,
  forest: 2.9,
};

export type RewardSourceKind = "main" | "side" | "worldEvent" | "dungeon" | "pvp" | "vendor";

export type LootTableProfile = {
  source: string;
  kind: RewardSourceKind;
  region: RegionId;
  common: number;
  rare: number;
  special: number;
  legendary: number;
  itemPool: ItemId[];
};

export type RewardBudget = {
  goldMin: number;
  goldMax: number;
  xpMin: number;
  xpMax: number;
  diamondChance: number;
  diamondMin: number;
  diamondMax: number;
};

export type RewardPityState = { rareMisses: number; legendaryMisses: number };

export type RewardRoll = {
  roll: number;
  lootRoll: number;
  rarity: ItemRarity | null;
  itemId: ItemId | null;
  gold: number;
  diamonds: number;
  xp: number;
  seed: string;
  sourceId: string;
};

export type RewardRollContext = {
  sourceId: string;
  kind: RewardSourceKind;
  region: RegionId;
  questId?: string;
  choiceId?: string;
  playerLevel?: number;
  luckModifier?: number;
  pity?: RewardPityState;
  calendarDayOfYear?: number;
};

const CATEGORY_VALUE_MULTIPLIER: Record<string, number> = {
  equipment: 5,
  material: 1,
  consumable: 1.2,
  tradeGood: 1.8,
  upgrade: 3,
  quest: 3,
  key: 4,
  luxury: 5,
  contraband: 4.5,
  document: 2.5,
  relic: 6,
  currency: 1,
};

const REGION_LOOT_BONUS: Record<RegionId, Partial<Record<ItemRarity, number>>> = {
  outskirts: { "Közönséges": 1.25, "Ritka": 0.75, "Különleges": 0.5, "Legendás": 0.35 },
  arena: { "Közönséges": 1, "Ritka": 1.2, "Különleges": 1.3, "Legendás": 0.75 },
  market: { "Közönséges": 0.9, "Ritka": 1.25, "Különleges": 1.35, "Legendás": 0.85 },
  inner: { "Közönséges": 0.75, "Ritka": 1.1, "Különleges": 1.5, "Legendás": 1 },
  palace: { "Közönséges": 0.55, "Ritka": 1, "Különleges": 1.6, "Legendás": 1.25 },
  harbor: { "Közönséges": 0.8, "Ritka": 1.25, "Különleges": 1.4, "Legendás": 1.05 },
  forest: { "Közönséges": 0.5, "Ritka": 1, "Különleges": 1.55, "Legendás": 1.35 },
};

function hash01(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h += h << 13; h ^= h >>> 7; h += h << 3; h ^= h >>> 17; h += h << 5;
  return ((h >>> 0) % 1_000_000) / 1_000_000;
}

function clamp01(n: number) { return Math.max(0, Math.min(1, n)); }
function weightedPick<T>(entries: Array<{ value: T; weight: number }>, roll: number): T | null {
  const total = entries.reduce((sum, x) => sum + Math.max(0, x.weight), 0);
  if (total <= 0) return null;
  let cursor = clamp01(roll) * total;
  for (const entry of entries) {
    cursor -= Math.max(0, entry.weight);
    if (cursor <= 0) return entry.value;
  }
  return entries[entries.length - 1]?.value ?? null;
}

export function getItemEconomyProfile(item: ItemDefinition): {
  nominalDropChance: number;
  priceFloor: number;
  priceCeiling: number;
  diamondFloor: number;
  economicClass: "common" | "trade" | "premium" | "artifact";
} {
  const rarity = RARITY_ECONOMY[item.rarity];
  const categoryMultiplier = CATEGORY_VALUE_MULTIPLIER[itemCategory(item)] ?? 1;
  const base = Math.max(1, Math.round(item.basePrice));
  const derived = Math.max(1, Math.round(base * rarity.priceMultiplier * Math.max(0.5, categoryMultiplier / 2)));
  const diamondFloor = Math.max(item.diamondPrice ?? 0, rarity.diamondFloor);
  const economicClass = item.rarity === "Legendás" ? "artifact" : item.rarity === "Különleges" ? "premium" : item.category === "tradeGood" || item.category === "material" ? "trade" : "common";
  return {
    nominalDropChance: rarity.nominalDropChance,
    priceFloor: Math.max(base, Math.round(derived * 0.65)),
    priceCeiling: Math.max(base, Math.round(derived * 1.9)),
    diamondFloor,
    economicClass,
  };
}

export function getSourceLootTable(context: Pick<RewardRollContext, "kind" | "region" | "sourceId">): LootTableProfile {
  const baseByKind: Record<RewardSourceKind, [number, number, number, number]> = {
    main: [72, 20, 7.9, 0.1],
    side: [82, 15, 2.9, 0.1],
    worldEvent: [55, 28, 16.5, 0.5],
    dungeon: [48, 30, 20.5, 1.5],
    pvp: [50, 30, 18.5, 1.5],
    vendor: [100, 0, 0, 0],
  };
  const raw = baseByKind[context.kind];
  const scalar = REGION_REWARD_SCALARS[context.region] ?? 1;
  // Stronger regions do not simply hand out better loot; they progressively
  // move probability mass from common to rare tiers while preserving 100%.
  const weights = [
    raw[0] / Math.pow(scalar, 0.55),
    raw[1] * Math.pow(scalar, 0.7),
    raw[2] * Math.pow(scalar, 0.85),
    raw[3] * scalar,
  ];
  const total = weights.reduce((a, b) => a + b, 0) || 1;
  const common = (weights[0] / total) * 100;
  const rare = (weights[1] / total) * 100;
  const special = (weights[2] / total) * 100;
  const legendary = (weights[3] / total) * 100;
  const pool = ITEMS.filter(item => {
    if (item.questItem || item.category === "quest" || item.category === "key" || item.category === "document" || item.category === "currency") return false;
    if (item.regions?.length && !item.regions.includes(context.region)) return false;
    return true;
  });
  return {
    source: context.sourceId, kind: context.kind, region: context.region,
    common, rare, special, legendary, itemPool: pool.map(item => item.id),
  };
}

export function itemDropChance(item: ItemDefinition, context: Pick<RewardRollContext, "kind" | "region">): number {
  const profile = RARITY_ECONOMY[item.rarity];
  if (item.id === "workshopIron" && context.region === "outskirts" && context.kind === "side") return 0.15;
  const table = getSourceLootTable({ ...context, sourceId: "preview" });
  const rarityPercent = item.rarity === "Közönséges" ? table.common : item.rarity === "Ritka" ? table.rare : item.rarity === "Különleges" ? table.special : table.legendary;
  const sameRarity = ITEMS.filter(candidate => table.itemPool.includes(candidate.id) && candidate.rarity === item.rarity);
  if (!sameRarity.length) return 0;
  // Within a rarity tier, items are equally likely unless their category carries
  // an explicit economic bias. The value remains visible and deterministic.
  const categoryBias = itemCategory(item) === "material" ? 1.15 : itemCategory(item) === "equipment" ? 1 : 0.85;
  const avgBias = sameRarity.reduce((sum, candidate) => sum + (itemCategory(candidate) === "material" ? 1.15 : itemCategory(candidate) === "equipment" ? 1 : 0.85), 0) / sameRarity.length;
  const share = categoryBias / Math.max(0.01, avgBias) / sameRarity.length;
  return Math.max(0, Math.min(1, (rarityPercent / 100) * share));
}

export function getRewardBudget(quest: QuestDefinition, playerLevel = 1): RewardBudget {
  const scalar = REGION_REWARD_SCALARS[quest.region] ?? 1;
  const kindScalar = quest.kind === "main" ? 1.2 : 1;
  const sequenceScalar = 1 + Math.min(0.7, quest.sequence / 70);
  const levelScalar = 1 + Math.min(1.5, Math.max(0, playerLevel - 1) * 0.04);
  const baseGold = Math.round(40 * scalar * kindScalar * sequenceScalar * levelScalar);
  const baseXp = Math.round(12 * scalar * kindScalar * sequenceScalar);
  return {
    goldMin: Math.max(10, Math.round(baseGold * 0.65)),
    goldMax: Math.max(20, Math.round(baseGold * 1.45)),
    xpMin: Math.max(5, Math.round(baseXp * 0.6)),
    xpMax: Math.max(10, Math.round(baseXp * 1.35)),
    diamondChance: quest.kind === "main" ? Math.min(0.18, 0.02 * scalar) : Math.min(0.10, 0.01 * scalar),
    diamondMin: quest.region === "palace" || quest.region === "harbor" ? 1 : 0,
    diamondMax: quest.region === "palace" || quest.region === "harbor" ? 3 : 2,
  };
}

export function rewardPreview(quest: QuestDefinition, playerLevel = 1, pity: RewardPityState = { rareMisses: 0, legendaryMisses: 0 }) {
  const budget = getRewardBudget(quest, playerLevel);
  const calendar = mergedCalendarBonuses(undefined);
  const goldModifier = 1 + (calendar.goldPct ?? 0) / 100;
  const xpModifier = 1 + ((calendar.xpPct ?? 0) + (quest.region === "arena" ? (calendar.combatXpPct ?? 0) : 0)) / 100;
  const table = getPityAdjustedLootTable(getSourceLootTable({ kind: quest.kind, region: quest.region, sourceId: quest.id }), pity);
  const choiceGoldMin = quest.choices.length ? Math.min(...quest.choices.map(c => c.gold)) : 0;
  const choiceGoldMax = quest.choices.length ? Math.max(...quest.choices.map(c => c.gold)) : 0;
  const choiceXpMin = quest.choices.length ? Math.min(...quest.choices.map(c => c.xp)) : 0;
  const choiceXpMax = quest.choices.length ? Math.max(...quest.choices.map(c => c.xp)) : 0;
  return {
    budget,
    table,
    goldMin: Math.round((choiceGoldMin + (quest.rewards?.gold ?? 0) + budget.goldMin) * goldModifier),
    goldMax: Math.round((choiceGoldMax + (quest.rewards?.gold ?? 0) + budget.goldMax) * goldModifier),
    xpMin: Math.round((choiceXpMin + budget.xpMin) * xpModifier),
    xpMax: Math.round((choiceXpMax + budget.xpMax) * xpModifier),
    hasDynamicLoot: true,
  };
}

export function getPityAdjustedLootTable(table: LootTableProfile, pity: RewardPityState): LootTableProfile {
  const rareBoost = Math.min(5, Math.max(0, pity.rareMisses) * 0.25);
  const legendaryBoost = Math.min(0.5, Math.max(0, pity.legendaryMisses) * 0.01);
  let common = table.common;
  let rare = table.rare;
  let special = table.special;
  let legendary = table.legendary;
  let needed = rareBoost + legendaryBoost;
  const takeCommon = Math.min(common, needed);
  common -= takeCommon;
  needed -= takeCommon;
  if (needed > 0) {
    const takeRare = Math.min(rare, needed);
    rare -= takeRare;
    needed -= takeRare;
  }
  rare += rareBoost;
  legendary += legendaryBoost;
  const total = common + rare + special + legendary || 1;
  return { ...table, common: (common / total) * 100, rare: (rare / total) * 100, special: (special / total) * 100, legendary: (legendary / total) * 100 };
}

export function nextRewardPity(current: RewardPityState, rarity: ItemRarity | null): RewardPityState {
  if (rarity === "Legendás") return { rareMisses: 0, legendaryMisses: 0 };
  if (rarity === "Ritka" || rarity === "Különleges") return { rareMisses: 0, legendaryMisses: Math.max(0, current.legendaryMisses) + 1 };
  return { rareMisses: Math.max(0, current.rareMisses) + 1, legendaryMisses: Math.max(0, current.legendaryMisses) + 1 };
}

export function chooseLootRarity(table: LootTableProfile, roll: number): ItemRarity | null {
  const rarity = weightedPick<ItemRarity>([
    { value: "Közönséges", weight: table.common },
    { value: "Ritka", weight: table.rare },
    { value: "Különleges", weight: table.special },
    { value: "Legendás", weight: table.legendary },
  ], roll);
  return rarity;
}

export function rollReward(context: RewardRollContext): RewardRoll {
  // A reward seed is tied to the source/quest, not the player's choice, so a player cannot reroll loot by switching choices.
  const seed = [context.sourceId, context.questId ?? "", context.region].join("|");
  const lootRoll = hash01(`${seed}|loot`);
  const goldRoll = hash01(`${seed}|gold`);
  const xpRoll = hash01(`${seed}|xp`);
  const diamondRoll = hash01(`${seed}|diamond`);
  const calendar = mergedCalendarBonuses(undefined);
  const luck = Math.max(0, Math.min(0.5, (context.luckModifier ?? 0) + (calendar.lootLuckPct ?? 0) / 100));
  const table = getPityAdjustedLootTable(getSourceLootTable(context), context.pity ?? { rareMisses: 0, legendaryMisses: 0 });
  const rarity = chooseLootRarity(table, clamp01(lootRoll * (1 - luck) + luck));
  const candidates = rarity ? ITEMS.filter(item => table.itemPool.includes(item.id) && item.rarity === rarity) : [];
  const itemCandidate = candidates.length ? candidates[Math.floor(hash01(`${seed}|item`) * candidates.length)] : null;
  const budget = getRewardBudget({ id: context.questId ?? context.sourceId, title: context.sourceId, region: context.region, giver: "miri", summary: "", story: "", objective: "", kind: context.kind === "worldEvent" ? "side" : context.kind === "dungeon" ? "side" : context.kind === "pvp" ? "side" : context.kind === "vendor" ? "side" : context.kind === "main" ? "main" : "side", chapter: 1, sequence: 1, choices: [] } as QuestDefinition, context.playerLevel ?? 1);
  const gold = Math.round((budget.goldMin + goldRoll * (budget.goldMax - budget.goldMin)) * (1 + (calendar.goldPct ?? 0) / 100));
  const xp = Math.round((budget.xpMin + xpRoll * (budget.xpMax - budget.xpMin)) * (1 + ((calendar.xpPct ?? 0) + (context.kind === "pvp" ? (calendar.combatXpPct ?? 0) : 0)) / 100));
  const diamondChance = Math.min(1, budget.diamondChance * (1 + (calendar.diamondPct ?? 0) / 100));
  const diamonds = diamondRoll < diamondChance ? Math.max(1, Math.round(budget.diamondMin + hash01(`${seed}|diamond-count`) * Math.max(0, budget.diamondMax - budget.diamondMin))) : 0;
  return { roll: hash01(`${seed}|master`) * 1000, lootRoll, rarity, itemId: itemCandidate?.id ?? null, gold, diamonds, xp, seed, sourceId: context.sourceId };
}

export function explainRewardRoll(roll: RewardRoll): string {
  const item = roll.itemId ? ITEMS.find(x => x.id === roll.itemId) : null;
  const parts = [`${roll.xp} XP`, `${roll.gold} arany`];
  if (roll.diamonds) parts.push(`${roll.diamonds} 💎`);
  if (item) parts.push(`${item.name} · ${item.rarity}`);
  return parts.join(" · ");
}

export function economyIntegrityReport() {
  const byRarity = new Map<ItemRarity, number>();
  for (const item of ITEMS) byRarity.set(item.rarity, (byRarity.get(item.rarity) ?? 0) + 1);
  const legendaryProfiles = ITEMS.filter(i => i.rarity === "Legendás").map(i => ({ id: i.id, ...getItemEconomyProfile(i) }));
  const impossibleLegacyPrices = ITEMS.filter(item => item.rarity === "Legendás" && (item.diamondPrice ?? 0) < RARITY_ECONOMY.Legendás.diamondFloor);
  return {
    itemCount: ITEMS.length,
    byRarity: Object.fromEntries(byRarity),
    legendaryProfiles,
    impossibleLegacyPrices,
    setCount: EQUIPMENT_SETS.length,
    questCount: QUESTS.length,
  };
}
