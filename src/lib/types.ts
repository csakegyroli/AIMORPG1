export const STAT_GROUPS = ["combat", "shadow", "social", "trade", "lore"] as const;
export type StatGroup = (typeof STAT_GROUPS)[number];

export type StatId =
  | "strength" | "endurance" | "weaponMastery" | "defense" | "reflex" | "willpower"
  | "agility" | "stealth" | "pickpocket" | "lockpicking" | "perception" | "survival"
  | "speech" | "charisma" | "intimidation" | "deception" | "empathy" | "leadership"
  | "trade" | "bargaining" | "appraisal" | "smithing" | "alchemy" | "logistics"
  | "intelligence" | "lore" | "investigation" | "politics" | "navigation" | "magicSense";

export type Stats = Record<StatId, number>;
export type EquipmentSlot = "weapon" | "shield" | "armor" | "accessory" | "boots";
export type RegionId = "outskirts" | "market" | "arena" | "harbor" | "inner" | "palace" | "forest";
export type NpcId = "arenaSena" | "arenaKorr" | "arenaVeya" | "arenaBram" | "arenaRusk" | "arenaTalia" | "arenaOlen" | "miri" | "rovan" | "damar" | "ilren" | "garran" | "eldra" | "serin" | "velka" | "alma" | "petar" | "vera" | "jarek" | "nara" | "tomen" | "zora" | "cador" | "pell" | "havel" | "brenka" | "silas" | "tosk" | "lena" | "bran" | "orren" | "siven" | "maela" | "malk" | "sera" | "oris" | "niven" | "taris" | "cassian" | "lyra" | "fen" | "marwen" | "adrian" | "selene" | "marcell" | "livia" | "octavia" | "corvin" | "violet" | "palaceElian" | "palaceMara" | "palaceOrven" | "palaceAster" | "palaceYsra" | "harborKael" | "harborMira" | "harborJoren" | "harborTessa" | "harborSable" | "harborDain" | "marketInn" | "marketSmith" | "arenaInn" | "arenaSmith" | "innerSmith" | "palaceInn" | "palaceSmith" | "harborSmith" | "harborInn";
export type OutskirtsDistrictId = "gate" | "workshops" | "oldMarket" | "redStreets" | "watch" | "oldEdge";
export type RegionDistrict = { id: string; region: RegionId; name: string; title: string; theme: string; description: string; npcIds: NpcId[]; landmark?: string; art?: string; };
export type ItemId = string;
export type ItemCategory = "equipment" | "consumable" | "material" | "tradeGood" | "upgrade" | "quest" | "key" | "luxury" | "contraband" | "document" | "relic" | "currency";
export type ItemLegalStatus = "legal" | "restricted" | "illegal" | "evidence";
export type QuestId = string;
export type QuestStatus = "available" | "active" | "completed";
export type QuestKind = "main" | "side";
export type AvatarId = "vagabond" | "ranger";
export type ViewId = "overview" | "character" | "messages" | "inventory" | "quests" | "regions" | "npcs" | "market" | "chronicle" | "gm" | "profile";

export type StatDefinition = { id: StatId; label: string; group: StatGroup; description: string };
export type ItemRarity = "Közönséges" | "Ritka" | "Különleges" | "Legendás";
export type EquipmentSetBonus = { minPieces: number; label: string; stats?: Partial<Stats> };
export type EquipmentSetDefinition = { id: string; name: string; region: RegionId; rarity: ItemRarity; description: string; bonuses: EquipmentSetBonus[] };
export type ItemDefinition = {
  id: ItemId;
  name: string;
  type: EquipmentSlot | "consumable";
  category?: ItemCategory;
  regions?: RegionId[];
  origin?: string;
  legalStatus?: ItemLegalStatus;
  tradeValue?: number;
  questItem?: boolean;
  sellable?: boolean;
  marketEligible?: boolean;
  tags?: string[];
  synergyTags?: string[];
  slot?: EquipmentSlot;
  icon: string;
  basePrice: number;
  description: string;
  stats?: Partial<Stats>;
  effects?: { merchantDiscount?: number; sellBonus?: number; questBonus?: number; heal?: number; healPercent?: number; tempStrength?: number; tempStat?: StatId; tempStatAmount?: number; tempHours?: number; tempItemStat?: StatId; tempItemAmount?: number; statBoost?: Partial<Stats>; };
  rarity: ItemRarity;
  setId?: string;
  setPiece?: EquipmentSlot;
  setName?: string;
  sideQuestOnly?: boolean;
  diamondPrice?: number;
};
export type InventoryItem = { instanceId: string; itemId: ItemId };
export type TemporaryStatBuff = { id: string; stat: StatId; amount: number; expiresAt: number; source: string };
export type TemporaryItemBuff = { instanceId: string; stat: StatId; amount: number; expiresAt: number; source: string };
export type NpcDefinition = { id: NpcId; name: string; role: string; region: RegionId; short: string; color: string; avatarSrc?: string; district?: string; location?: string; service?: string; routine?: string; startHour?: number; endHour?: number; nightShift?: boolean };
export type NpcFunctionKind = "alchemy" | "forge" | "inn" | "food" | "gamble" | "training" | "medical" | "information" | "security" | "trade" | "bank" | "currency" | "caravan" | "guild" | "warehouse" | "rareTrade" | "broker" | "social" | "club" | "credit" | "patronage" | "archive" | "diplomacy" | "palaceSecurity" | "investigation" | "harborMaster" | "fishing" | "sailorHire" | "freeSailing" | "smuggling" | "cargo" | "arenaEntry" | "arenaTraining" | "healing" | "arenaAnnounce" | "odds" | "challenge" | "weapons" | "apprentice" | "leatherwork" | "transport" | "map" | "foodTrade" | "documents" | "guardPatrol" | "jail" | "ruins" | "well" | "rumor" | "doorGuard" | "spiceTrade" | "ledger" | "streetMarket" | "market";
export type NpcFunctionDefinition = { id: string; npcId: NpcId; title: string; description: string; kind: NpcFunctionKind; actionLabel: string; cost?: number; regionOnly?: boolean; itemIds?: ItemId[]; stat?: StatId; };
export type RegionDefinition = { id: RegionId; name: string; icon: string; description: string; available: boolean; lockText?: string };
export type QuestRequirement = {
  itemId?: ItemId;
  count?: number;
  gold?: number;
  reputation?: number;
  stat?: StatId;
  statMin?: number;
  npcId?: NpcId;
  relationMin?: number;
  consume?: boolean;
  label: string;
};
export type QuestChoice = {
  id: string;
  label: string;
  text: string;
  stat: StatId;
  requirement: number;
  gold: number;
  xp: number;
  reputation: { achievements: number; decisions: number; relationships: number; economic: number; growth: number };
  relation: { npc: NpcId; amount: number };
  prerequisite?: QuestRequirement;
  consequenceTag?: string;
};
export type QuestReward = { items?: { itemId: ItemId; count: number }[]; gold?: number; diamonds?: number };
export type QuestFunctionHook = { npcId: NpcId; functionId: string; role: "core" | "support"; label: string; narrativeUse: string };
export type QuestItemHook = { itemId: ItemId; role: "clue" | "tool" | "material" | "evidence" | "reward" | "document" | "tradeGood"; narrativeUse: string };
export type MainQuestAudit = { functionHooks: QuestFunctionHook[]; itemHooks: QuestItemHook[]; relationshipFocus: NpcId[]; memoryTags: string[]; playerExperience: string; consequenceThread: string; nextThread: string };
export type QuestDefinition = {
  id: QuestId; title: string; region: RegionId; giver: NpcId; summary: string; story: string; objective: string; kind: QuestKind; chapter: number; sequence: number; choices: QuestChoice[];
  requirements?: QuestRequirement[]; requires?: QuestId; minReputation?: number; entryCost?: number; unlocks?: RegionId[]; nextQuest?: QuestId; consequence?: string; audit?: MainQuestAudit; rewards?: QuestReward;
  dramaturgy?: { hook: string; twist: string; reveal: string; consequence: string; failForward: string; };
};
export type ReputationBreakdown = { achievements: number; decisions: number; relationships: number; economic: number; growth: number; activity: number };
export type RewardPityState = { rareMisses: number; legendaryMisses: number };
export type CalendarBonusPackage = { goldPct?:number; xpPct?:number; diamondPct?:number; lootLuckPct?:number; marketBuyPct?:number; marketSellPct?:number; combatXpPct?:number; sideQuestChancePct?:number; note?:string };
export type CanonCalendarEvent = { id:string; title:string; dayOfYear:number; durationDays:number; type:"national"|"regional"|"seasonal"|"arena"|"market"|"harbor"|"palace"; scope:"server"|"regional"; region?:RegionId; description:string; preparation:string; bonuses:CalendarBonusPackage; canon:true };

export type RewardRollState = { sourceId: string; roll: number; lootRoll: number; rarity: ItemRarity | null; itemId: ItemId | null; gold: number; diamonds: number; xp: number; seed: string };
export type JournalEntry = { id: string; kind: "quest" | "market" | "world" | "gm" | "system"; title: string; text: string; at: string };
export type GmMessage = { id: string; title: string; body: string; tone: "warning" | "world" | "personal"; seen: boolean; at: string };
