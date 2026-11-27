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
export type InnTransactionState = { gold: number; health: number; inventoryCount: number };
export type InnTransactionPlan = {
  success: boolean; reason: string | null; nextState: InnTransactionState;
  preview: InnRestPreview | InnFoodPreview | null;
};

/** Alma's fixed one-hour rest: 10% max HP, rounded up and capped at max HP. */
export function getInnRestPreview(currentHealth: number, maxHealth: number, gold: number, price = 60): InnRestPreview {
  const safeMax = Number.isFinite(maxHealth) ? Math.max(0, Math.floor(maxHealth)) : 0;
  const safeCurrent = Number.isFinite(currentHealth) ? Math.max(0, currentHealth) : 0;
  const safeGold = Number.isFinite(gold) ? Math.max(0, Math.floor(gold)) : 0;
  const safePrice = Number.isFinite(price) && price >= 0 ? Math.floor(price) : -1;
  const restoredHealth = Math.min(Math.max(0, safeMax - safeCurrent), Math.ceil(safeMax * 0.1));
  let reason: InnRestBlockReason | null = null;
  if (safeMax <= 0 || safePrice < 0) reason = "invalid-preview";
  else if (safeCurrent >= safeMax) reason = "full-health";
  else if (safeGold < safePrice) reason = "insufficient-gold";
  return {
    maxHealth: safeMax, currentHealth: safeCurrent, restoredHealth,
    resultingHealth: safeCurrent + restoredHealth, price: safePrice,
    canRest: reason === null, reason,
  };
}

/** Pure rest transaction planner shared by the store and executable tests. */
export function planInnRest(state: InnTransactionState, maxHealth: number, price = 60): InnTransactionPlan {
  const preview = getInnRestPreview(state.health, maxHealth, state.gold, price);
  if (!preview.canRest) return { success: false, reason: preview.reason, nextState: state, preview };
  return {
    success: true, reason: null,
    nextState: {
      ...state,
      gold: Math.max(0, Math.floor(state.gold)) - preview.price,
      health: preview.resultingHealth,
    },
    preview,
  };
}

/** Preview an existing allow-listed food without changing its authored item effect. */
export function getInnFoodPreview(
  item: ItemDefinition, maxHealth: number, currentHealth: number, gold: number,
  inventoryCount: number, inventoryLimit = 80, allowed = true,
): InnFoodPreview {
  const safeMax = Number.isFinite(maxHealth) ? Math.max(0, Math.floor(maxHealth)) : 0;
  const safeCurrent = Number.isFinite(currentHealth) ? Math.max(0, currentHealth) : 0;
  const price = Number.isFinite(item.basePrice) && item.basePrice >= 0 ? Math.floor(item.basePrice) : -1;
  const effects = item.effects;
  const healingAmount = Math.max(0, Math.ceil(safeMax * (effects?.healPercent ?? 0) / 100) + (effects?.heal ?? 0));
  const restoredHealth = Math.min(Math.max(0, safeMax - safeCurrent), healingAmount);
  const safeGold = Number.isFinite(gold) ? Math.max(0, Math.floor(gold)) : 0;
  let reason: InnFoodBlockReason | null = null;
  if (!allowed || item.type !== "consumable" || price < 0) reason = "invalid-item";
  else if (!Number.isInteger(inventoryCount) || inventoryCount < 0 || inventoryCount >= inventoryLimit) reason = "inventory-full";
  else if (safeGold < price) reason = "insufficient-gold";
  return { price, healingAmount, restoredHealth, canPurchase: reason === null, reason };
}

/** Pure purchase planner: rejects unknown/disallowed/non-consumable items without partial mutation. */
export function planInnFoodPurchase(
  state: InnTransactionState, item: ItemDefinition | undefined,
  allowedItemIds: readonly string[], maxHealth: number, inventoryLimit = 80,
): InnTransactionPlan {
  if (!item) return { success: false, reason: "invalid-item", nextState: state, preview: null };
  const allowed = allowedItemIds.includes(item.id) && item.type === "consumable";
  const preview = getInnFoodPreview(
    item, maxHealth, state.health, state.gold, state.inventoryCount, inventoryLimit, allowed,
  );
  if (!preview.canPurchase) return { success: false, reason: preview.reason, nextState: state, preview };
  return {
    success: true, reason: null,
    nextState: {
      ...state,
      gold: Math.max(0, Math.floor(state.gold)) - preview.price,
      inventoryCount: state.inventoryCount + 1,
    },
    preview,
  };
}

/** Bounded, session-local transaction-ID guard. Its receipts are never persisted. */
export type InnTransactionReservation = "reserved" | "duplicate" | "collision" | "invalid";
export function createInnTransactionGuard(limit = 256) {
  const receipts = new Map<string, string>();
  const maxEntries = Number.isFinite(limit) ? Math.max(1, Math.floor(limit)) : 256;
  return (transactionId: unknown, fingerprint: string): InnTransactionReservation => {
    if (typeof transactionId !== "string" || !/^[a-zA-Z0-9:_-]{12,128}$/.test(transactionId)) return "invalid";
    const prior = receipts.get(transactionId);
    if (prior !== undefined) return prior === fingerprint ? "duplicate" : "collision";
    receipts.set(transactionId, fingerprint);
    while (receipts.size > maxEntries) {
      const oldest = receipts.keys().next().value;
      if (oldest === undefined) break;
      receipts.delete(oldest);
    }
    return "reserved";
  };
}


/** State machine for cancellable UI submissions before store commit. */
export type InnSubmissionStatus = "idle" | "pending" | "committed" | "cancelled";
export function createInnSubmissionController() {
  let status: InnSubmissionStatus = "idle";
  let activeId: string | null = null;
  return {
    begin(id: string): boolean {
      if (status === "pending") return false;
      status = "pending";
      activeId = id;
      return true;
    },
    canCommit(id: string): boolean {
      return status === "pending" && activeId === id;
    },
    cancel(id: string): boolean {
      if (status !== "pending" || activeId !== id) return false;
      status = "cancelled";
      activeId = null;
      return true;
    },
    commit(id: string): boolean {
      if (status !== "pending" || activeId !== id) return false;
      status = "committed";
      activeId = null;
      return true;
    },
    getStatus(): InnSubmissionStatus {
      return status;
    },
    reset(): void {
      if (status !== "pending") {
        status = "idle";
        activeId = null;
      }
    },
  };
}
