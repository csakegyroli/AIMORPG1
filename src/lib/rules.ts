import { EQUIPMENT_SETS, ITEMS } from "./content";
import { itemAvailableInRegion, itemLegalStatus, regionPriceModifier } from "./itemSystem";
import type { EquipmentSlot, InventoryItem, ItemId, ReputationBreakdown, RegionId, Stats, TemporaryItemBuff, TemporaryStatBuff } from "./types";
import { getGearSynergyStats } from "./synergies";

export const XP_FOR_LEVEL = (level: number) => 40 + (level - 1) * 25;

export function getItem(itemId: ItemId) {
  const found = ITEMS.find((item) => item.id === itemId);
  if (!found) throw new Error(`Ismeretlen tárgy: ${String(itemId)}`);
  return found;
}

export function getActiveEquipmentSetProgress(equipment: Record<EquipmentSlot, InventoryItem | null>) {
  const counts = new Map<string, number>();
  Object.values(equipment).forEach((entry) => {
    if (!entry) return;
    const item = getItem(entry.itemId);
    if (!item.setId) return;
    counts.set(item.setId, (counts.get(item.setId) ?? 0) + 1);
  });
  return EQUIPMENT_SETS.map(set => ({ set, count: counts.get(set.id) ?? 0, activeBonuses: set.bonuses.filter(bonus => (counts.get(set.id) ?? 0) >= bonus.minPieces) }));
}

export function getEquipmentSetBonusStats(equipment: Record<EquipmentSlot, InventoryItem | null>): Partial<Stats> {
  const progress = getActiveEquipmentSetProgress(equipment);
  const bonus: Partial<Stats> = {};
  progress.forEach(({ activeBonuses }) => activeBonuses.forEach(active => {
    Object.entries(active.stats ?? {}).forEach(([stat, value]) => {
      bonus[stat as keyof Stats] = (bonus[stat as keyof Stats] ?? 0) + (value ?? 0);
    });
  }));
  return bonus;
}

export function getEffectiveStats(base: Stats, equipment: Record<EquipmentSlot, InventoryItem | null>, temporaryStatBuffs: TemporaryStatBuff[] = [], temporaryItemBuffs: TemporaryItemBuff[] = []): Stats {
  const effective = { ...base };
  Object.values(equipment).forEach((entry) => {
    if (!entry) return;
    const stats = getItem(entry.itemId).stats;
    if (!stats) return;
    Object.entries(stats).forEach(([stat, value]) => {
      effective[stat as keyof Stats] += value ?? 0;
    });
  });
  const setBonus = getEquipmentSetBonusStats(equipment);
  Object.entries(setBonus).forEach(([stat, value]) => {
    effective[stat as keyof Stats] += value ?? 0;
  });
  const synergyBonus = getGearSynergyStats(equipment);
  Object.entries(synergyBonus).forEach(([stat, value]) => { effective[stat as keyof Stats] += value ?? 0; });
  const now = Date.now();
  temporaryStatBuffs.filter(b => b.expiresAt > now).forEach(b => { effective[b.stat] += b.amount; });
  temporaryItemBuffs.filter(b => b.expiresAt > now).forEach(b => { effective[b.stat] += b.amount; });
  return effective;
}

export function reputationScore(parts: ReputationBreakdown) {
  const weighted = parts.achievements * 0.3 + parts.decisions * 0.25 + parts.relationships * 0.2 + parts.economic * 0.15 + parts.growth * 0.1;
  // Hírnév korlátlan: a növekedés szándékosan nem 0–1000 skálára van zárva.
  return Math.max(0, Math.round(weighted * 10 + parts.activity * 2));
}

export function groupScore(base: Stats, equipment: Record<EquipmentSlot, InventoryItem | null>, group: string) {
  const effective = getEffectiveStats(base, equipment);
  const ids = Object.entries(effective).filter(([id]) => {
    const combat = ["strength","endurance","weaponMastery","defense","reflex","willpower"];
    const shadow = ["agility","stealth","pickpocket","lockpicking","perception","survival"];
    const social = ["speech","charisma","intimidation","deception","empathy","leadership"];
    const trade = ["trade","bargaining","appraisal","smithing","alchemy","logistics"];
    const lore = ["intelligence","lore","investigation","politics","navigation","magicSense"];
    return ({combat,shadow,social,trade,lore} as Record<string,string[]>)[group]?.includes(id);
  }).map(([,value])=>value);
  return ids.length ? Math.round(ids.reduce((a,b)=>a+b,0)/ids.length) : 0;
}

export function marketPrice(basePrice: number, demand: number, relationship: number, equipment: Record<EquipmentSlot, InventoryItem | null>, region: RegionId = "outskirts", itemId?: ItemId) {
  const discountFromRelation = Math.min(0.05, Math.max(0, relationship) / 2000);
  const itemDiscount = Object.values(equipment).reduce((sum, entry) => sum + (entry ? getItem(entry.itemId).effects?.merchantDiscount ?? 0 : 0), 0);
  const totalDiscount = Math.min(0.05, discountFromRelation + itemDiscount);
  const factor = Math.min(1.25, Math.max(0.8, 1 + demand / 100));
  const regional = itemId ? ITEMS.find(i => i.id === itemId) : undefined;
  const regionalFactor = regional ? regionPriceModifier(regional, region) : 1;
  return Math.max(1, Math.round(basePrice * factor * regionalFactor * (1 - totalDiscount)));
}

export function sellingPrice(basePrice: number, appraisal: number, equipment: Record<EquipmentSlot, InventoryItem | null>) {
  const extra = Object.values(equipment).reduce((sum, entry) => sum + (entry ? getItem(entry.itemId).effects?.sellBonus ?? 0 : 0), 0);
  return Math.max(1, Math.round(basePrice * (0.5 + Math.min(0.12, appraisal * 0.008) + extra)));
}

export function makeInventoryItem(itemId: ItemId): InventoryItem {
  return { itemId, instanceId: `${itemId}-${Math.random().toString(36).slice(2, 9)}-${Date.now().toString(36)}` };
}
