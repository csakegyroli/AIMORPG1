import { EQUIPMENT_SETS, ITEMS } from "./content";
import type { EquipmentSetDefinition, EquipmentSlot, ItemDefinition, ItemId, ItemLegalStatus, NpcId, RegionId } from "./types";

export const ITEM_CATEGORY_LABELS: Record<string, string> = {
  equipment: "Felszerelés", consumable: "Fogyóeszköz", material: "Alapanyag", tradeGood: "Kereskedelmi áru", upgrade: "Fejlesztés",
  quest: "Küldetéstárgy", key: "Kulcstárgy", luxury: "Luxuscikk", contraband: "Tiltott áru", document: "Irat", relic: "Relikvia",
};

export const ITEM_LEGAL_LABELS: Record<ItemLegalStatus, string> = {
  legal: "Szabadon kereskedhető",
  restricted: "Korlátozott",
  illegal: "Tiltott",
  evidence: "Bizonyíték / történeti tárgy",
};

export const REGIONAL_MARKET_NAMES: Record<RegionId, string> = {
  outskirts: "Külvárosi készlet",
  market: "Kereskedelmi Központ készlete",
  arena: "Arénai készlet",
  inner: "Belvárosi készlet",
  palace: "Palotai különkészlet",
  harbor: "Kikötői készlet",
  forest: "Zárt erdei készlet",
};

const EXPLICIT_POOL: Record<RegionId, ItemId[]> = {
  outskirts: ["set_outskirts_common_weapon","set_outskirts_common_shield","set_outskirts_common_armor","set_outskirts_common_accessory","set_outskirts_common_boots","militiaBlade","oakShield","paddedArmor","travelerBoots","smokePhial","gateRations","workshopIron","tannersWax","streetMap","redStreetTokens","watchSeal","silentWellVial","watchLantern"],
  arena: ["set_arena_common_weapon","set_arena_common_shield","set_arena_common_armor","set_arena_common_accessory","set_arena_common_boots","militiaBlade","paddedArmor","travelerBoots","arenaBand","arenaBandages","gladiatorOil","arenaWhetstone","crowdScrip","championRibbon","matchLedger","arenaBlackToken","duelistCape","watchLantern"],
  market: ["set_market_common_weapon","set_market_common_shield","set_market_common_armor","set_market_common_accessory","set_market_common_boots","guildRing","ledgerLens","tradeSilk","merchantInk","caravanCompass","guildPermit","warehouseSeal","rareAmber","blackSalt","guildWaxSet","sealedLedger","blackCoinLedgerFragment"],
  inner: ["set_inner_common_weapon","set_inner_common_shield","set_inner_common_armor","set_inner_common_accessory","set_inner_common_boots","guildRing","ledgerLens","velvetWine","casinoChips","silkGloves","promissoryNote","luxuryCigar","royalTransitPass","rareAmber","guildWaxSet","duelistCape","courtShoes"],
  palace: ["set_palace_common_weapon","set_palace_common_shield","set_palace_common_armor","set_palace_common_accessory","set_palace_common_boots","royalSealWax","royalArchiveCopy","courtSealRing","diplomaticToken","courtShoes","royalTransitPass"],
  harbor: ["set_harbor_common_weapon","set_harbor_common_shield","set_harbor_common_armor","set_harbor_common_accessory","set_harbor_common_boots","travelerBoots","saltFish","sailcloth","sailorsKnife","navigatorChart","smugglersPass","blackSalt","harborCoat","dockHook","blackCoinCargoTag"],
  forest: [],
};

// Kept separate from the legacy authored pools so new content is easy to audit.
const EXPANSION_POOL: Partial<Record<RegionId, ItemId[]>> = {
  outskirts: ["watchCaptainsSaber","oathMedallion","ashweaveCoat","canalKnife","smokeStepBoots","courierRunners","memoryMoss"],
  arena: ["watchCaptainsSaber","blackIronBuckler","harborAegis","oathMedallion"],
  market: ["quietBell","archiveMantle","brokenSealRing","courierRunners","blackArchiveWax","memoryMoss"],
  inner: ["ashweaveCoat","quietBell","brokenSealRing","royalRapier","echoThreadCloak"],
  palace: ["archiveMantle","brokenSealRing","royalRapier","echoThreadCloak","blackArchiveWax"],
  harbor: ["canalKnife","stormglassBow","brineproofScale","stormKnot","harborAegis","stormSalt"],
  forest: [],
};

export function itemCategory(item: ItemDefinition): string {
  return item.category ?? (item.slot ? "equipment" : item.type === "consumable" ? "consumable" : "tradeGood");
}

export function itemLegalStatus(item: ItemDefinition): ItemLegalStatus { return item.legalStatus ?? "legal"; }

export function getEquipmentSet(item?: ItemDefinition): EquipmentSetDefinition | undefined {
  return item?.setId ? EQUIPMENT_SETS.find(set => set.id === item.setId) : undefined;
}

export function getEquipmentSetProgress(equipment: Record<EquipmentSlot, { itemId: ItemId } | null>) {
  const counts = new Map<string, number>();
  Object.values(equipment).forEach(entry => {
    if (!entry) return;
    const item = ITEMS.find(candidate => candidate.id === entry.itemId);
    if (!item?.setId) return;
    counts.set(item.setId, (counts.get(item.setId) ?? 0) + 1);
  });
  return EQUIPMENT_SETS.map(set => ({ set, count: counts.get(set.id) ?? 0, activeBonuses: set.bonuses.filter(bonus => (counts.get(set.id) ?? 0) >= bonus.minPieces) }));
}

export function getEquipmentSetCollectionProgress(inventory: Array<{ itemId: ItemId }>, equipment: Record<EquipmentSlot, { itemId: ItemId } | null>) {
  const counts = new Map<string, number>();
  [...inventory, ...Object.values(equipment).filter(Boolean) as Array<{ itemId: ItemId }>].forEach(entry => {
    const item = ITEMS.find(candidate => candidate.id === entry.itemId);
    if (!item?.setId) return;
    counts.set(item.setId, (counts.get(item.setId) ?? 0) + 1);
  });
  return EQUIPMENT_SETS.map(set => ({ set, count: Math.min(5, counts.get(set.id) ?? 0) }));
}

export function isQuestItem(item: ItemDefinition) { return Boolean(item.questItem) || itemCategory(item) === "quest"; }
export function isMarketEligible(item: ItemDefinition) { return item.marketEligible !== false && !isQuestItem(item); }
export function isSellable(item: ItemDefinition) { return item.sellable !== false && !isQuestItem(item); }

export function regionalItemIds(region: RegionId): ItemId[] {
  return Array.from(new Set([...(EXPLICIT_POOL[region] ?? []), ...(EXPANSION_POOL[region] ?? [])]));
}

export function regionalMarketItems(region: RegionId): ItemDefinition[] {
  const ids = new Set(regionalItemIds(region));
  return ITEMS.filter(item => ids.has(item.id) && isMarketEligible(item));
}

export function itemAvailableInRegion(item: ItemDefinition, region: RegionId): boolean {
  if (!isMarketEligible(item)) return false;
  if (EXPLICIT_POOL[region]?.includes(item.id)) return true;
  return Boolean(item.regions?.includes(region));
}

export function regionPriceModifier(item: ItemDefinition, region: RegionId): number {
  // Regional identity is allowed to affect price, but never enough to become a hard exploit.
  const category = itemCategory(item);
  const status = itemLegalStatus(item);
  if (status === "illegal") return 1.35;
  if (status === "restricted") return 1.15;
  if (category === "luxury" && (region === "inner" || region === "palace")) return 1.08;
  if (category === "material" && region === "market") return 0.92;
  if (category === "tradeGood" && region === "harbor") return 0.94;
  return 1;
}

export function itemSourceLabel(item: ItemDefinition): string {
  return item.origin ?? (item.regions?.length ? item.regions.join(", ") : "Ismeretlen eredet");
}

/**
 * Műhelynegyed specialist boundaries.
 * Other forge NPCs retain the existing regional crafting behavior.
 */
export function canNpcCraftItem(npcId: NpcId, item: ItemDefinition): boolean {
  const specialties: Partial<Record<NpcId, readonly EquipmentSlot[]>> = {
    garran: ["weapon", "shield"],
    velka: ["armor"],
    nara: ["boots", "armor", "accessory"],
  };
  const allowedSlots = specialties[npcId];
  if (!allowedSlots) return true;
  if (!item.slot || !allowedSlots.includes(item.slot)) return false;
  if (npcId === "nara" && item.slot !== "boots") {
    return /bőr|bőrvért|kesztyű|csizma/i.test(`${item.name} ${item.description}`);
  }
  return true;
}

export type CraftRequirement = { id: ItemId; count: number };
export function craftRecipeForItem(item: ItemDefinition, region: RegionId): CraftRequirement[] {
  // Story-bound and unique relics must be earned through play, never fabricated.
  if (item.sideQuestOnly || item.category === "relic" || item.marketEligible === false) return [];
  const primary = item.slot;
  if (!primary) return [];
  const regionSecondary: Record<RegionId, string> = {
    outskirts: "tannersWax", market: "merchantInk", arena: "arenaWhetstone", inner: "guildWaxSet", palace: "royalSealWax", harbor: "shipRepairKit", forest: "tannersWax"
  };
  const affinitySecondary = item.synergyTags?.includes("ink-and-seal") ? "blackArchiveWax"
    : item.synergyTags?.includes("storm-touched") ? "stormSalt"
    : item.synergyTags?.includes("eye-bound") ? "memoryMoss"
    : null;
  const secondary = affinitySecondary ?? regionSecondary[region] ?? "tannersWax";
  const secondaryCount = primary === "armor" ? 2 : primary === "weapon" ? 1 : 1;
  const ironCount = primary === "weapon" ? 4 : primary === "shield" ? 3 : primary === "armor" ? 5 : 2;
  if (primary === "accessory") return [{ id: secondary, count: 1 }, { id: "workshopIron", count: 1 }];
  return [{ id: "workshopIron", count: ironCount }, { id: secondary, count: secondaryCount }];
}


export function dismantleYieldsForItem(item: ItemDefinition): CraftRequirement[] {
  if (!item.slot) return [];
  const regionByOrigin: Record<string, RegionId> = {
    "Külváros": "outskirts",
    "Aréna": "arena",
    "Kereskedelmi Központ": "market",
    "Belváros": "inner",
    "Palota": "palace",
    "Kikötő": "harbor",
  };
  const region = item.regions?.[0] ?? "outskirts";
  const recipe = craftRecipeForItem(item, region);
  return recipe.map(req => ({ id: req.id, count: Math.max(1, Math.floor(req.count * 0.5)) }));
}
