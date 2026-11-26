import type { ItemDefinition } from "./types";

export type InnRestBlockReason = "full-health" | "insufficient-gold" | "invalid-preview";
export type InnFoodBlockReason = "insufficient-gold" | "inventory-full" | "invalid-item";

export type InnRestPreview = {
  maxHealth: number; currentHealth: number; restoredHealth: number; resultingHealth: number;
  price: number; canRest: boolean; reason: InnRestBlockReason | null;
};
export type InnFoodPreview = {
  price: number; healingAmount: number; restoredHealth: number;
  canPurchase: boolean; reason: InnFoodBlockReason | null;
};

/** Alma's fixed one-hour rest: 10% max HP, capped at max HP. */
export function getInnRestPreview(currentHealth: number, maxHealth: number, gold: number, price = 60): InnRestPreview {
  const safeMax = Number.isFinite(maxHealth) ? Math.max(0, Math.floor(maxHealth)) : 0;
  const safeCurrent = Number.isFinite(currentHealth) ? Math.max(0, Math.min(safeMax, Math.floor(currentHealth))) : 0;
  const safeGold = Number.isFinite(gold) ? Math.max(0, Math.floor(gold)) : 0;
  const safePrice = Number.isFinite(price) ? Math.max(0, Math.floor(price)) : -1;
  const restoredHealth = Math.min(Math.max(0, safeMax - safeCurrent), Math.ceil(safeMax * 0.1));
  let reason: InnRestBlockReason | null = null;
  if (safeMax <= 0 || safePrice < 0) reason = "invalid-preview";
  else if (safeCurrent >= safeMax) reason = "full-health";
  else if (safeGold < safePrice) reason = "insufficient-gold";
  return { maxHealth: safeMax, currentHealth: safeCurrent, restoredHealth, resultingHealth: safeCurrent + restoredHealth, price: safePrice, canRest: reason === null, reason };
}

/** Preview an existing allow-listed inn food without changing its authored item effect. */
export function getInnFoodPreview(item: ItemDefinition, maxHealth: number, currentHealth: number, gold: number, inventoryCount: number, inventoryLimit = 80): InnFoodPreview {
  const safeMax = Number.isFinite(maxHealth) ? Math.max(0, Math.floor(maxHealth)) : 0;
  const safeCurrent = Number.isFinite(currentHealth) ? Math.max(0, Math.min(safeMax, Math.floor(currentHealth))) : 0;
  const price = Number.isFinite(item.basePrice) && item.basePrice >= 0 ? Math.floor(item.basePrice) : -1;
  const effects = item.effects;
  const healingAmount = Math.max(0, Math.ceil(safeMax * (effects?.healPercent ?? 0) / 100) + (effects?.heal ?? 0));
  const restoredHealth = Math.min(Math.max(0, safeMax - safeCurrent), healingAmount);
  const safeGold = Number.isFinite(gold) ? Math.max(0, Math.floor(gold)) : 0;
  let reason: InnFoodBlockReason | null = null;
  if (item.type !== "consumable" || price < 0) reason = "invalid-item";
  else if (inventoryCount >= inventoryLimit) reason = "inventory-full";
  else if (safeGold < price) reason = "insufficient-gold";
  return { price, healingAmount, restoredHealth, canPurchase: reason === null, reason };
}
