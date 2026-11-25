import { ITEMS } from "./content";
import type { EquipmentSlot, InventoryItem, Stats } from "./types";

export type SynergyThreshold = { pieces: number; label: string; description: string; stats: Partial<Stats> };
export type GearSynergy = { id: string; name: string; lore: string; tags: string[]; thresholds: SynergyThreshold[] };
export type ActiveGearSynergy = GearSynergy & { count: number; activeThresholds: SynergyThreshold[]; nextThreshold: SynergyThreshold | null };

export const GEAR_SYNERGIES: GearSynergy[] = [
  { id: "iron-oath", name: "Vasfogadalom", lore: "A felszerelés darabjai ugyanannak a régi őrségi fogadalomnak a nyomát hordozzák.", tags: ["iron-oath"], thresholds: [
    { pieces: 2, label: "Kitartó őrség", description: "+2 Erő, +2 Védekezés", stats: { strength: 2, defense: 2 } },
    { pieces: 3, label: "Az utolsó kapu", description: "+2 Állóképesség, +1 Akarat", stats: { endurance: 2, willpower: 1 } },
  ] },
  { id: "whisper-thread", name: "Suttogó szál", lore: "A puha anyagok és halk eszközök együtt a zajok közötti rést mutatják meg.", tags: ["whisper-thread"], thresholds: [
    { pieces: 2, label: "Néma mozdulat", description: "+2 Lopakodás, +1 Ügyesség", stats: { stealth: 2, agility: 1 } },
    { pieces: 3, label: "A város vakfoltja", description: "+2 Észlelés, +1 Zárnyitás", stats: { perception: 2, lockpicking: 1 } },
  ] },
  { id: "ink-and-seal", name: "Tinta és pecsét", lore: "A tárgyak ugyanannak az eltűnt iratútnak a részei: a nyomot a hivatalos rendben keresd.", tags: ["ink-and-seal"], thresholds: [
    { pieces: 2, label: "Olvasható hazugság", description: "+2 Nyomozás, +1 Értékbecslés", stats: { investigation: 2, appraisal: 1 } },
    { pieces: 3, label: "A második aláírás", description: "+2 Politika, +1 Műveltség", stats: { politics: 2, lore: 1 } },
  ] },
  { id: "storm-touched", name: "Viharhoz kötve", lore: "A viharkészlet az egyensúlyt, a terhelés olvasását és a mozdulat időzítését jutalmazza.", tags: ["storm-touched"], thresholds: [
    { pieces: 2, label: "Biztos fedélzet", description: "+2 Túlélés, +1 Reflex", stats: { survival: 2, reflex: 1 } },
    { pieces: 3, label: "Viharálló akarat", description: "+2 Navigáció, +1 Állóképesség", stats: { navigation: 2, endurance: 1 } },
  ] },
  { id: "eye-bound", name: "A Szem visszhangja", lore: "A megfigyelő relikviák nem adnak jövőbelátást. A hiányzó részletekre teszik érzékennyé a viselőjüket.", tags: ["eye-bound"], thresholds: [
    { pieces: 2, label: "Az ellentmondás észlelése", description: "+2 Észlelés, +2 Nyomozás", stats: { perception: 2, investigation: 2 } },
    { pieces: 3, label: "Emlék a repedésben", description: "+2 Mágiaérzék, +1 Műveltség", stats: { magicSense: 2, lore: 1 } },
  ] },
];

function equippedDefinitions(equipment: Record<EquipmentSlot, InventoryItem | null>) {
  return Object.values(equipment).flatMap((instance) => {
    if (!instance) return [];
    const item = ITEMS.find((candidate) => candidate.id === instance.itemId);
    return item ? [item] : [];
  });
}

export function getActiveGearSynergies(equipment: Record<EquipmentSlot, InventoryItem | null>): ActiveGearSynergy[] {
  const equipped = equippedDefinitions(equipment);
  return GEAR_SYNERGIES.map((synergy) => {
    const count = equipped.filter((item) => item.synergyTags?.some((tag) => synergy.tags.includes(tag))).length;
    const activeThresholds = synergy.thresholds.filter((threshold) => count >= threshold.pieces);
    const nextThreshold = synergy.thresholds.find((threshold) => count < threshold.pieces) ?? null;
    return { ...synergy, count, activeThresholds, nextThreshold };
  }).filter((synergy) => synergy.count > 0);
}

export function getGearSynergyStats(equipment: Record<EquipmentSlot, InventoryItem | null>): Partial<Stats> {
  const result: Partial<Stats> = {};
  for (const synergy of getActiveGearSynergies(equipment)) {
    for (const threshold of synergy.activeThresholds) {
      for (const [stat, value] of Object.entries(threshold.stats)) {
        const key = stat as keyof Stats;
        result[key] = (result[key] ?? 0) + (value ?? 0);
      }
    }
  }
  return result;
}

export function describeStatBonuses(stats: Partial<Stats>): string[] {
  return Object.entries(stats).filter(([, value]) => (value ?? 0) !== 0).map(([stat, value]) => `${stat}: ${(value ?? 0) > 0 ? "+" : ""}${value}`);
}
