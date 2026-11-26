#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const ts = require("typescript");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "aimorpg-smoke-"));

function walkFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full));
    else out.push(full);
  }
  return out;
}

function compile(source, output) {
  const code = fs.readFileSync(source, "utf8");
  const result = ts.transpileModule(code, {
    reportDiagnostics: true,
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      strict: true,
    },
    fileName: source,
  });
  const errors = (result.diagnostics ?? []).filter(d => d.category === ts.DiagnosticCategory.Error);
  assert.equal(errors.length, 0, `TypeScript syntax/transpile errors in ${source}: ${errors.map(e => ts.flattenDiagnosticMessageText(e.messageText, " ")).join("; ")}`);
  fs.writeFileSync(output, result.outputText);
}

try {
  const contentOut = path.join(temp, "content.js");
  const gameClientOut = path.join(temp, "GameClient.js");
  const accountPanelOut = path.join(temp, "AccountPanel.js");
  const eyeEntityOut = path.join(temp, "EyeEntity.js");
  const appPageOut = path.join(temp, "app-page.js");
  const appLayoutOut = path.join(temp, "app-layout.js");
  // Parse/transpile actual UI TSX without pretending this is a dependency-complete typecheck.
  compile(path.join(root, "src/components/GameClient.tsx"), gameClientOut);
  compile(path.join(root, "src/components/AccountPanel.tsx"), accountPanelOut);
  compile(path.join(root, "src/components/EyeEntity.tsx"), eyeEntityOut);
  compile(path.join(root, "src/app/page.tsx"), appPageOut);
  compile(path.join(root, "src/app/layout.tsx"), appLayoutOut);
  const expansionItemsOut = path.join(temp, "expansionItems.js");
  const synergiesOut = path.join(temp, "synergies.js");
  const questDesignOut = path.join(temp, "questDesign.js");
  const mainQuestAuditOut = path.join(temp, "mainQuestAudit.js");
  const mainStoryOut = path.join(temp, "mainStory.js");
  const rulesOut = path.join(temp, "rules.js");
  const simulationOut = path.join(temp, "simulation.js");
  const itemSystemOut = path.join(temp, "itemSystem.js");
  const campaignOut = path.join(temp, "campaign.js");
  const eyeOut = path.join(temp, "eye.js");
  const narrativeOut = path.join(temp, "narrative.js");
  const aiCouncilOut = path.join(temp, "aiCouncil.js");
  const rewardEconomyOut = path.join(temp, "rewardEconomy.js");
  const worldTimeOut = path.join(temp, "worldTime.js");
  const worldCalendarOut = path.join(temp, "worldCalendar.js");
  const visualAssetsOut = path.join(temp, "visualAssets.js");
  compile(path.join(root, "src/lib/expansionItems.ts"), expansionItemsOut);
  compile(path.join(root, "src/lib/questDesign.ts"), questDesignOut);
  compile(path.join(root, "src/lib/mainQuestAudit.ts"), mainQuestAuditOut);
  compile(path.join(root, "src/lib/mainStory.ts"), mainStoryOut);
  compile(path.join(root, "src/lib/content.ts"), contentOut);
  compile(path.join(root, "src/lib/synergies.ts"), synergiesOut);
  compile(path.join(root, "src/lib/rules.ts"), rulesOut);
  compile(path.join(root, "src/lib/simulation.ts"), simulationOut);
  compile(path.join(root, "src/lib/itemSystem.ts"), itemSystemOut);
  compile(path.join(root, "src/lib/campaign.ts"), campaignOut);
  compile(path.join(root, "src/lib/eye.ts"), eyeOut);
  compile(path.join(root, "src/lib/aiCouncil.ts"), aiCouncilOut);
  compile(path.join(root, "src/lib/rewardEconomy.ts"), rewardEconomyOut);
  compile(path.join(root, "src/lib/worldTime.ts"), worldTimeOut);
  compile(path.join(root, "src/lib/worldCalendar.ts"), worldCalendarOut);
  compile(path.join(root, "src/lib/visualAssets.ts"), visualAssetsOut);
  compile(path.join(root, "src/lib/narrative.ts"), narrativeOut);
  compile(path.join(root, "src/lib/store.ts"), path.join(temp, "store-syntax.js"));
  compile(path.join(root, "src/components/GameClient.tsx"), path.join(temp, "GameClient-syntax.js"));
  compile(path.join(root, "src/components/AccountPanel.tsx"), path.join(temp, "AccountPanel-syntax.js"));
  compile(path.join(root, "src/components/EyeEntity.tsx"), path.join(temp, "EyeEntity-syntax.js"));
  compile(path.join(root, "src/app/page.tsx"), path.join(temp, "page-syntax.js"));
  compile(path.join(root, "src/app/layout.tsx"), path.join(temp, "layout-syntax.js"));
  for (const source of walkFiles(path.join(root, "server/src")).filter(file => file.endsWith(".ts"))) {
    const relative = path.relative(path.join(root, "server/src"), source).replace(/[^A-Za-z0-9_.-]+/g, "_");
    compile(source, path.join(temp, `server-${relative}.js`));
  }

  const originalContent = fs.readFileSync(contentOut, "utf8");
  const originalRules = fs.readFileSync(rulesOut, "utf8");
  const originalSimulation = fs.readFileSync(simulationOut, "utf8");
  fs.writeFileSync(contentOut, originalContent.replace(/from "\.\/types"/g, 'from "./types"'));
  fs.copyFileSync(path.join(root, "src/lib/types.ts"), path.join(temp, "types.ts"));
  compile(path.join(root, "src/lib/types.ts"), path.join(temp, "types.js"));
  fs.copyFileSync(path.join(root, "src/lib/content.ts"), path.join(temp, "content.ts"));
  fs.copyFileSync(path.join(root, "src/lib/questDesign.ts"), path.join(temp, "questDesign.ts"));
  fs.copyFileSync(path.join(root, "src/lib/mainQuestAudit.ts"), path.join(temp, "mainQuestAudit.ts"));
  fs.copyFileSync(path.join(root, "src/lib/mainStory.ts"), path.join(temp, "mainStory.ts"));
  fs.copyFileSync(path.join(root, "src/lib/questDesign.ts"), path.join(temp, "questDesign.ts"));
  fs.copyFileSync(path.join(root, "src/lib/rules.ts"), path.join(temp, "rules.ts"));
  fs.writeFileSync(contentOut, originalContent);
  fs.writeFileSync(rulesOut, originalRules);

  const questDesign = require(questDesignOut);
  const mainQuestAudit = require(mainQuestAuditOut);
  const mainStory = require(mainStoryOut);
  const content = require(contentOut);
  const rules = require(rulesOut);
  const synergies = require(synergiesOut);
  const simulation = require(simulationOut);
  const itemSystem = require(itemSystemOut);
  const campaign = require(campaignOut);
  const eye = require(eyeOut);
  const aiCouncil = require(aiCouncilOut);
  const rewardEconomy = require(rewardEconomyOut);
  const worldTime = require(worldTimeOut);
  const worldCalendar = require(worldCalendarOut);
  const visualAssets = require(visualAssetsOut);
  const narrative = require(narrativeOut);

  const slotIds = new Set(["weapon", "shield", "armor", "accessory", "boots"]);
  const npcIds = new Set(content.NPCS.map((npc) => npc.id));
  const regionIds = new Set(content.REGIONS.map((region) => region.id));
  const itemIds = new Set(content.ITEMS.map((item) => item.id));
  assert.equal(itemIds.size, content.ITEMS.length, "Item IDs must be unique after content expansion.");

  assert.ok(content.ITEMS.length >= 180, `The v2 item expansion should have at least 180 items, found ${content.ITEMS.length}.`);
  assert.ok(content.ITEMS.some(item => item.id === "firstWitnessLens"), "The Eye relic must be available as authored content.");
  assert.ok(content.ITEMS.filter(item => item.synergyTags?.length).length >= 15, "Expected multiple synergy-capable items.");
  assert.equal(content.NPCS.length, 69);
  assert.equal(content.REGIONS.length, 7);
  assert.equal(content.QUESTS.length, 60);
  assert.equal(content.EQUIPMENT_SETS.length, 18, "Expected 18 regional rarity-specific equipment sets.");
  assert.equal(content.SET_ITEMS.length, 90, "Expected 90 set pieces (18 sets x 5 slots).");
  const nightCoverage = new Map();
  for (const npc of content.NPCS) { if (npc.nightShift) nightCoverage.set(npc.region, (nightCoverage.get(npc.region) ?? 0) + 1); }
  for (const region of ["outskirts","arena","market","inner","palace","harbor"]) assert.ok((nightCoverage.get(region) ?? 0) >= 2, `Need at least two night-shift NPCs in ${region}.`);
  const sim = simulation.createInitialPlayerIdentity();
  const changed = simulation.mergeIdentity(sim, simulation.identityDeltaForChoice({id:"test_c1", label:"Teszt", text:"Teszt", stat:"investigation", requirement:1, gold:0, xp:0, reputation:{achievements:0,decisions:0,relationships:0,economic:0,growth:0}, relation:{npc:content.NPCS[0].id, amount:5}}));
  assert.notDeepEqual(changed, sim, "Identity signals must be applied.");
  assert.equal(simulation.relationshipAggregate(simulation.applyFacetDelta({trust:0,respect:0,affection:0,fear:0,debt:0,suspicion:0},{trust:20,respect:10})), 9);
  assert.equal(new Set(content.QUESTS.map((q) => q.giver)).size, 60, "Every NPC must own one main quest node.");
  assert.equal(Object.keys(content.NPC_STORIES).length, 69, "Every NPC must have a story profile.");
  assert.equal(content.OUTSKIRTS_DISTRICTS.length, 6);
  assert.ok(Array.isArray(content.REGION_DISTRICTS));
  assert.equal(content.REGION_DISTRICTS.filter((d) => d.region === "outskirts").length, 6);
  assert.equal(content.REGION_DISTRICTS.filter((d) => d.region === "market").length, 4);
  assert.equal(content.REGION_DISTRICTS.filter((d) => d.region === "arena").length, 4);
  assert.equal(content.REGION_DISTRICTS.filter((d) => d.region === "inner").length, 5);
  assert.equal(content.REGION_DISTRICTS.filter((d) => d.region === "harbor").length, 5);
  assert.equal(content.REGION_DISTRICTS.filter((d) => d.region === "palace").length, 4);
  assert.deepEqual(new Set(content.OUTSKIRTS_DISTRICTS.map((d) => d.id)), new Set(["gate", "workshops", "oldMarket", "redStreets", "watch", "oldEdge"]));
  for (const district of content.OUTSKIRTS_DISTRICTS) {
    assert.ok(district.name && district.title && district.longDescription, `Incomplete district: ${district.id}`);
    assert.ok(Array.isArray(district.landmarks) && district.landmarks.length >= 3, `Missing landmarks: ${district.id}`);
    assert.ok(Array.isArray(district.streetLife) && district.streetLife.length >= 3, `Missing street life: ${district.id}`);
    assert.ok(Array.isArray(district.npcIds) && district.npcIds.length >= 3, `Missing living contacts: ${district.id}`);
    for (const id of district.npcIds) assert.ok(npcIds.has(id), `Unknown district NPC: ${district.id}/${id}`);
  }

  let itemUniqueArt = 0;
  let itemFamilyFallbackArt = 0;
  let itemSlotFallbackArt = 0;
  let itemCategoryFallbackArt = 0;
  const unresolvedItemArt = [];
  for (const item of content.ITEMS) {
    assert.ok(item.id && item.name);
    if (item.slot) assert.ok(slotIds.has(item.slot), `Invalid item slot: ${item.id}`);
    assert.ok(item.basePrice > 0, `Invalid item price: ${item.id}`);
    const kind = visualAssets.itemArtKindFor(item.id, item.slot, item.type, item.category);
    const artPath = visualAssets.itemArtFor(item.id, item.slot, item.type, item.category);
    if (kind === "unique") itemUniqueArt += 1;
    else if (kind === "family-fallback") itemFamilyFallbackArt += 1;
    else if (kind === "slot-fallback") itemSlotFallbackArt += 1;
    else if (kind === "category-fallback") itemCategoryFallbackArt += 1;
    else unresolvedItemArt.push(item.id);
    if (artPath) {
      const file = path.join(root, "public", artPath.replace(/^\//, ""));
      assert.ok(fs.existsSync(file), `Mapped item art path does not exist: ${item.id} -> ${artPath}`);
    }
  }
  assert.equal(itemUniqueArt, 74, `Expected 74 unique item-art mappings after alpha.18, found ${itemUniqueArt}.`);
  assert.equal(itemFamilyFallbackArt, 23, `Expected 23 explicitly declared item-family fallbacks after alpha.18, found ${itemFamilyFallbackArt}.`);
  assert.equal(itemUniqueArt + itemFamilyFallbackArt + itemSlotFallbackArt + itemCategoryFallbackArt + unresolvedItemArt.length, content.ITEMS.length,
    "Every catalog item must have one and only one visual resolution status.");
  assert.equal(unresolvedItemArt.length, 0, `Every current catalog item must resolve to explicit art or a labelled fallback: ${unresolvedItemArt.join(", ")}`);
  assert.equal(visualAssets.itemArtKindFor("__unknown_consumable__", undefined, "consumable"), "category-fallback");
  assert.ok(visualAssets.itemArtFor("__unknown_consumable__", undefined, "consumable"));
  assert.equal(visualAssets.itemArtKindFor("__unknown_document__", undefined, "consumable", "document"), "category-fallback");
  assert.ok(visualAssets.itemArtFor("__unknown_document__", undefined, "consumable", "document"));
  assert.equal(unresolvedItemArt.length, 0, `Items with no resolvable visual fallback: ${unresolvedItemArt.join(", ")}`);

  const instanceIds = new Set();
  for (const itemId of content.ITEMS.map((item) => item.id)) {
    const instance = rules.makeInventoryItem(itemId);
    assert.ok(!instanceIds.has(instance.instanceId));
    instanceIds.add(instance.instanceId);
  }

  for (const npc of content.NPCS) { assert.ok(regionIds.has(npc.region), `Invalid NPC region: ${npc.id}`); assert.ok(npc.district, `Missing NPC district: ${npc.id}`); }
  for (const district of content.REGION_DISTRICTS) { assert.ok(regionIds.has(district.region), `Invalid district region: ${district.id}`); for (const id of district.npcIds) assert.ok(npcIds.has(id), `Unknown district NPC: ${district.id}/${id}`); }

  const reqQuest = content.QUESTS.find((q) => q.id === "main_outskirts_04");
  assert.ok(reqQuest?.requirements?.some((r) => r.itemId === "workshopIron" && r.count === 20 && r.consume === true), "Borin quest must require and consume 20 Műhelyvas.");
  for (const quest of content.QUESTS) {
    assert.ok((quest.choices?.length ?? 0) >= 5, `Quest needs at least five contextual resolution approaches: ${quest.id}`);
    assert.ok((quest.requirements?.length ?? 0) >= 1, `Quest needs a tangible objective requirement: ${quest.id}`);
    for (const requirement of quest.requirements ?? []) {
      if (requirement.itemId) assert.ok(itemIds.has(requirement.itemId), `Unknown quest requirement item: ${quest.id}/${requirement.itemId}`);
      if (requirement.count) assert.ok(requirement.count >= 1, `Invalid quest requirement count: ${quest.id}`);
    }
    assert.ok(quest.dramaturgy?.hook && quest.dramaturgy?.twist && quest.dramaturgy?.reveal && quest.dramaturgy?.consequence && quest.dramaturgy?.failForward, `Incomplete dramaturgy: ${quest.id}`);
    assert.ok(quest.rewards && Array.isArray(quest.rewards.items), `Missing quest rewards: ${quest.id}`);
    for (const reward of quest.rewards.items ?? []) { assert.ok(itemIds.has(reward.itemId), `Unknown quest reward item: ${quest.id}/${reward.itemId}`); assert.ok(reward.count >= 1, `Invalid quest reward count: ${quest.id}/${reward.itemId}`); }
    assert.ok(npcIds.has(quest.giver), `Invalid quest giver: ${quest.id}`);
    assert.ok(regionIds.has(quest.region), `Invalid quest region: ${quest.id}`);
    for (const choice of quest.choices) {
      assert.ok(choice.stat in content.INITIAL_STATS, `Invalid quest stat: ${quest.id}/${choice.id}`);
      assert.ok(npcIds.has(choice.relation.npc), `Invalid relation NPC: ${quest.id}/${choice.id}`);
    }
  }

  const equipment = {
    weapon: rules.makeInventoryItem("militiaBlade"),
    shield: rules.makeInventoryItem("oakShield"),
    armor: rules.makeInventoryItem("paddedArmor"),
    accessory: rules.makeInventoryItem("guildRing"),
    boots: rules.makeInventoryItem("travelerBoots"),
  };

  const effective = rules.getEffectiveStats(content.INITIAL_STATS, equipment);
  assert.equal(effective.strength, 7);
  assert.equal(effective.defense, 10);
  assert.equal(effective.agility, 8);
  assert.equal(effective.trade, 7);
  assert.equal(rules.groupScore(content.INITIAL_STATS, equipment, "trade"), 6);

  const oathEquipment = { weapon: rules.makeInventoryItem("watchCaptainsSaber"), shield: rules.makeInventoryItem("blackIronBuckler"), armor: null, accessory: rules.makeInventoryItem("oathMedallion"), boots: null };
  const oathActive = synergies.getActiveGearSynergies(oathEquipment).find(entry => entry.id === "iron-oath");
  assert.ok(oathActive && oathActive.count === 3 && oathActive.activeThresholds.length === 2, "Three Iron Oath pieces should activate both synergy tiers.");
  const oathStats = rules.getEffectiveStats(content.INITIAL_STATS, oathEquipment);
  assert.equal(oathStats.strength, 10, "Iron Oath should add +4 Strength at its two active thresholds, on top of weapon stats.");
  assert.equal(oathStats.defense, 10, "Iron Oath should add +2 Defense on top of shield stats.");

  const eyeSet = { weapon: null, shield: null, armor: rules.makeInventoryItem("echoThreadCloak"), accessory: rules.makeInventoryItem("firstWitnessLens"), boots: null };
  assert.ok(synergies.getActiveGearSynergies(eyeSet).some(entry => entry.id === "eye-bound" && entry.activeThresholds.length === 1), "The Eye-bound synergy should activate with two matching relics.");
  const fullEyeSet = { weapon: rules.makeInventoryItem("royalRapier"), shield: null, armor: rules.makeInventoryItem("echoThreadCloak"), accessory: rules.makeInventoryItem("firstWitnessLens"), boots: null };
  assert.ok(synergies.getActiveGearSynergies(fullEyeSet).some(entry => entry.id === "eye-bound" && entry.activeThresholds.length === 2), "A weapon, armor, and accessory should unlock the complete Eye-bound synergy.");
  const missingBookQuest = mainStory.MAIN_STORY_BLUEPRINT.find(quest => quest.id === "main_palace_05");
  assert.ok(missingBookQuest?.rewards?.items?.some(item => item.itemId === "silverEyeShard" && item.count === 1), "The Eye shard must be obtainable as a main-story reward.");
  const getCatalogItem = (id) => content.ITEMS.find(item => item.id === id);
  assert.equal(itemSystem.canNpcCraftItem("garran", getCatalogItem("militiaBlade")), true, "Borin must craft weapons.");
  assert.equal(itemSystem.canNpcCraftItem("garran", getCatalogItem("oakShield")), true, "Borin must craft shields.");
  assert.equal(itemSystem.canNpcCraftItem("garran", getCatalogItem("paddedArmor")), false, "Borin must not craft armor.");
  assert.equal(itemSystem.canNpcCraftItem("velka", getCatalogItem("paddedArmor")), true, "Velka must craft armor.");
  assert.equal(itemSystem.canNpcCraftItem("velka", getCatalogItem("militiaBlade")), false, "Velka must not craft weapons.");
  assert.equal(itemSystem.canNpcCraftItem("nara", getCatalogItem("travelerBoots")), true, "Nara must craft boots.");
  assert.equal(itemSystem.canNpcCraftItem("nara", getCatalogItem("lurkerGloves")), true, "Nara must craft leather gloves.");
  assert.equal(itemSystem.canNpcCraftItem("nara", getCatalogItem("guildRing")), false, "Nara must not craft unrelated accessories.");
  assert.equal(itemSystem.canNpcCraftItem("arenaOlen", getCatalogItem("militiaBlade")), true, "Non-workshop forge NPCs retain existing behavior.");

  const royalRapierRecipe = itemSystem.craftRecipeForItem(content.ITEMS.find(item => item.id === "royalRapier"), "palace");
  assert.ok(royalRapierRecipe.some(req => req.id === "blackArchiveWax"), "Ink-and-seal gear should use black archive wax.");
  const stormBowRecipe = itemSystem.craftRecipeForItem(content.ITEMS.find(item => item.id === "stormglassBow"), "harbor");
  assert.ok(stormBowRecipe.some(req => req.id === "stormSalt"), "Storm-touched gear should use storm salt.");
  const echoCloakRecipe = itemSystem.craftRecipeForItem(content.ITEMS.find(item => item.id === "echoThreadCloak"), "forest");
  assert.ok(echoCloakRecipe.some(req => req.id === "memoryMoss"), "Eye-bound gear should use memory moss.");
  assert.deepEqual(itemSystem.craftRecipeForItem(content.ITEMS.find(item => item.id === "firstWitnessLens"), "palace"), [], "Unique story relics must never have a crafting recipe.");

  const ring = content.ITEMS.find((item) => item.id === "guildRing");
  assert.ok(ring);
  assert.equal(rules.marketPrice(ring.basePrice, 0, 0, equipment), 68);
  assert.equal(rules.sellingPrice(ring.basePrice, effective.appraisal, equipment), 39);

  for (const region of ["outskirts","arena","market","inner","palace","harbor"]) {
    const regional = itemSystem.regionalMarketItems(region);
    assert.ok(regional.length >= 10, `Regional market too small after set expansion: ${region}`);
    assert.ok(regional.every(itemSystem.isMarketEligible), `Regional market contains non-market item: ${region}`);
    const commonSetPieces = content.SET_ITEMS.filter(item => item.regions?.includes(region) && item.rarity === "Közönséges");
    assert.equal(commonSetPieces.length, 5, `Each region must sell exactly five common set pieces: ${region}`);
    assert.ok(commonSetPieces.every(item => regional.some(candidate => candidate.id === item.id)), `Common set pieces missing from market: ${region}`);
  }
  assert.equal(content.SET_ITEMS.filter(i => i.rarity === "Ritka" || i.rarity === "Legendás").filter(i => i.marketEligible).length, 0);
  const arenaSet = content.SET_ITEMS.find(i => i.id === "set_arena_common_weapon");
  assert.ok(arenaSet && arenaSet.setId === "arena_common" && arenaSet.setPiece === "weapon");
  const setEquipment = {
    weapon: rules.makeInventoryItem("set_arena_common_weapon"),
    shield: rules.makeInventoryItem("set_arena_common_shield"),
    armor: null, accessory: null, boots: null,
  };
  const setStats = rules.getEffectiveStats(content.INITIAL_STATS, setEquipment);
  assert.equal(setStats.endurance, 8, "Two-piece Arena set bonus should add +2 endurance on top of direct shield stats.");
  const fullArena = {
    weapon: rules.makeInventoryItem("set_arena_common_weapon"), shield: rules.makeInventoryItem("set_arena_common_shield"),
    armor: rules.makeInventoryItem("set_arena_common_armor"), accessory: rules.makeInventoryItem("set_arena_common_accessory"), boots: rules.makeInventoryItem("set_arena_common_boots"),
  };
  const fullSetStats = rules.getEffectiveStats(content.INITIAL_STATS, fullArena);
  assert.ok(fullSetStats.weaponMastery > content.INITIAL_STATS.weaponMastery);
  assert.ok(rules.getActiveEquipmentSetProgress(fullArena).find(x => x.set.id === "arena_common" && x.count === 5)?.activeBonuses.length === 3);
  assert.ok(itemSystem.isQuestItem(content.ITEMS.find((item) => item.id === "blackCoin")));
  assert.equal(itemSystem.isSellable(content.ITEMS.find((item) => item.id === "blackCoin")), false);
  assert.equal(itemSystem.itemLegalStatus(content.ITEMS.find((item) => item.id === "arenaBlackToken")), "illegal");
  assert.ok(itemSystem.itemAvailableInRegion(content.ITEMS.find((item) => item.id === "caravanCompass"), "market"));
  assert.ok(!itemSystem.itemAvailableInRegion(content.ITEMS.find((item) => item.id === "caravanCompass"), "palace"));
  assert.ok(rules.marketPrice(ring.basePrice, 0, 0, equipment, "market", ring.id) >= 1);

  const wt = worldTime.getWorldTime(worldTime.WORLD_CLOCK.anchorUtcMs);
  assert.equal(wt.year, 327);
  assert.equal(wt.month, 6);
  assert.equal(wt.day, 14);
  assert.equal(wt.dayOfYear, 165);
  const cal = worldCalendar.getCalendarState(122);
  assert.ok(cal.active.some(e => e.id === "royal_birthday"), "Royal birthday must be active on day 122.");
  assert.equal(cal.upcoming.length, 5);
  assert.equal(worldCalendar.daysUntil(122, 122), 0);
  assert.equal(worldCalendar.daysUntil(365, 1), 1);
  const economyReport = rewardEconomy.economyIntegrityReport();
  assert.equal(economyReport.itemCount, content.ITEMS.length);
  assert.equal(economyReport.questCount, content.QUESTS.length);
  assert.equal(economyReport.setCount, content.EQUIPMENT_SETS.length);
  for (const item of content.ITEMS) {
    const profile = rewardEconomy.getItemEconomyProfile(item);
    assert.ok(profile.nominalDropChance > 0, `Missing drop probability model: ${item.id}`);
    assert.ok(profile.priceFloor >= 1 && profile.priceCeiling >= profile.priceFloor, `Invalid price bounds: ${item.id}`);
    if (item.rarity === "Legendás") assert.ok(profile.diamondFloor >= 10, `Legendary must require a diamond floor: ${item.id}`);
  }
  const sideTableOutskirts = rewardEconomy.getSourceLootTable({kind:"side", region:"outskirts", sourceId:"test-side"});
  const tierTotal = sideTableOutskirts.common + sideTableOutskirts.rare + sideTableOutskirts.special + sideTableOutskirts.legendary;
  assert.ok(Math.abs(tierTotal - 100) < 0.001, `Loot probabilities must sum to 100%, got ${tierTotal}`);
  assert.ok(sideTableOutskirts.legendary <= 0.2, `Outskirts side legendary chance should remain very rare: ${sideTableOutskirts.legendary}`);
  assert.ok(rewardEconomy.itemDropChance(content.ITEMS.find(i=>i.id==="workshopIron"), {kind:"side", region:"outskirts"}) === 0.15, "Workshop iron side-quest drop chance must be exactly 15%.");
  const rewardA = rewardEconomy.rollReward({sourceId:"test-main-01",kind:"main",region:"outskirts",questId:"test-main-01",playerLevel:12});
  const rewardB = rewardEconomy.rollReward({sourceId:"test-main-01",kind:"main",region:"outskirts",questId:"test-main-01",playerLevel:12});
  assert.deepEqual(rewardA, rewardB, "Reward rolls must be deterministic per source/quest seed.");

  const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  assert.equal(packageJson.scripts.test, "node scripts/smoke-test.cjs && node scripts/security-smoke.cjs && node scripts/visual-assets-smoke.cjs && node scripts/visual-ui-smoke.cjs");
  assert.equal(packageJson.version, "2.0.0-alpha.26");
  const packageLock = JSON.parse(fs.readFileSync(path.join(root, "package-lock.json"), "utf8"));
  assert.equal(packageLock.version, packageJson.version, "package-lock root version should match package.json.");
  assert.equal(packageLock.packages[""].version, packageJson.version, "package-lock root package version should match package.json.");
  assert.ok(fs.existsSync(path.join(root, "server/prisma/migrations/20261016172000_v2_foundation/migration.sql")), "Checked-in first Prisma migration is required.");
  assert.ok(fs.existsSync(path.join(root, "docs/PROJECT_ROADMAP_2026.md")), "2026 architecture roadmap is required.");
  const authServiceSource = fs.readFileSync(path.join(root, "server/src/auth/auth.service.ts"), "utf8");
  const passwordSource = fs.readFileSync(path.join(root, "server/src/auth/passwords.ts"), "utf8");
  const aiServiceSource = fs.readFileSync(path.join(root, "server/src/ai/ai.service.ts"), "utf8");
  const serverMainSource = fs.readFileSync(path.join(root, "server/src/main.ts"), "utf8");
  assert.match(authServiceSource, /tokenHash: digest\(token\)/, "Session tokens must only be stored as digests.");
  assert.match(authServiceSource, /httpOnly: true/, "Auth cookie must be HttpOnly.");
  assert.match(passwordSource, /scrypt\(/, "Passwords must be hashed with scrypt.");
  assert.match(aiServiceSource, /api.openai.com\/v1\/responses/, "A Szem must use the server-side Responses API.");
  assert.match(aiServiceSource, /json_schema/, "AI response must be schema-constrained.");
  assert.match(aiServiceSource, /remainingHourly/, "AI quota status should be exposed.");
  assert.match(serverMainSource, /WEB_ORIGIN/, "API origin must be explicitly configured.");
  assert.match(serverMainSource, /express\.json\(\{ limit: "1mb"/, "API JSON parser must have an explicit request limit.");
  const storeSource = fs.readFileSync(path.join(root, "src/lib/store.ts"), "utf8");
  const clientSource = fs.readFileSync(path.join(root, "src/components/GameClient.tsx"), "utf8");
  assert.match(storeSource, /resolveSideQuest = useCallback/);
  assert.match(storeSource, /currentRegion !== record\.blueprint\.region/);
  assert.match(storeSource, /npcRuntimePresent\(npc, getWorldTime\(\)\.hour/);
  assert.match(clientSource, /game\.resolveSideQuest\(r\.id,choice\.id\)/);
  assert.match(clientSource, /<AccountPanel gameSnapshot=\{gameSnapshot\} \/>/);
  assert.match(clientSource, /A Szem értelmezze a történteket/);
  assert.equal(mainStory.MAIN_STORY_BLUEPRINT.length, 60, "Authored main story must contain 60 chapters/parts.");
  assert.ok(eye.EYE_RULES);
  assert.ok(eye.EYE_RULES.observes.length >= 5);
  assert.ok(eye.EYE_RULES.neverDoes.length >= 5);
  assert.ok(narrative.QUEST_DNA);
  assert.equal(Object.keys(narrative.QUEST_DNA).length, 60);
  for (const q of content.QUESTS) {
    const dna = narrative.QUEST_DNA[q.id];
    assert.ok(dna, `Missing Quest DNA: ${q.id}`);
    assert.equal(dna.giver, q.giver);
    assert.ok(narrative.QUEST_DNA_RULES.requiredFields.every((field) => Object.prototype.hasOwnProperty.call(dna, field)), `Incomplete Quest DNA: ${q.id}`);
    assert.equal(dna.failForward, true);
  }
  const initialNarrative = narrative.createInitialNarrativeState();
  assert.equal(initialNarrative.director.mode, "dormant");
  assert.equal(initialNarrative.canon.readonly, true);
  assert.equal(narrative.SIDE_QUEST_FRAMEWORK.mode, "inactive-until-ai-release");
  assert.equal(narrative.SIDE_QUEST_FRAMEWORK.model, "opportunity-to-story");
  assert.equal(narrative.sideQuestChoiceStat("conversation"), "speech");
  assert.equal(narrative.sideQuestChoiceStat("service"), "leadership");
  assert.equal(narrative.sideQuestChoiceStat("trade"), "bargaining");
  assert.equal(narrative.sideQuestChoiceStat("risk"), "survival");
  assert.equal(narrative.sideQuestChoiceStat("investigation"), "investigation");
  assert.deepEqual(narrative.evaluateSideQuestChoice("micro", "conversation", { speech: 5 }), { stat:"speech", score:5, requirement:5, success:true });
  assert.equal(narrative.evaluateSideQuestChoice("local", "conversation", { speech:6 }).success, false);
  assert.equal(narrative.evaluateSideQuestChoice("local", "risk", { survival:6 }, 1).success, true);
  assert.equal(narrative.evaluateSideQuestChoice("character_arc", "investigation", { investigation:8 }).success, false);
  assert.equal(narrative.evaluateSideQuestChoice("character_arc", "investigation", { investigation:8 }, 1).success, true);
  assert.ok(narrative.NARRATIVE_PRIMITIVES.intents.length >= 8);
  assert.ok(narrative.NARRATIVE_PRIMITIVES.choiceMethods.length >= 6);
  assert.ok(narrative.NARRATIVE_PRIMITIVES.consequenceTypes.length >= 5);
  assert.equal(narrative.NARRATIVE_PRIMITIVES.scales.length, 3);
  const council = aiCouncil.createInitialAICouncilState();
  assert.equal(council.mode, "ready_for_ai");
  assert.equal(council.handoff.aiMayGenerate, false);
  assert.equal(council.handoff.canonWriteAllowed, false);
  assert.ok(council.handoff.requiredValidators.length >= 7);
  const context = narrative.buildNarrativeContext({ region: "outskirts", playerIdentity: simulation.createInitialPlayerIdentity(), relationshipFacets: simulation.createInitialRelationshipFacets(content.NPCS.map((n)=>n.id)), memories: [], npcStates: simulation.createInitialNpcRuntime(content.NPCS.map((n)=>n.id)), questStatus: Object.fromEntries(content.QUESTS.map(q=>[q.id,"available"])), activeQuestId: null, worldHour: 12, eyeSignals: [] });
  const directorState = narrative.evaluateNarrativeDirector(context, "teszt");
  assert.equal(directorState.mode, "dormant");
  const opps = narrative.detectNarrativeOpportunities(context);
  assert.ok(Array.isArray(opps));
  const worldCandidates = narrative.buildWorldEventCandidates(context);
  assert.ok(Array.isArray(worldCandidates));
  const dialogue = narrative.buildDialogueContext(context, content.NPCS[0].id);
  assert.ok(dialogue && dialogue.npcId === content.NPCS[0].id);
  if (opps[0]) { const draft = narrative.draftSideQuestBlueprint(opps[0], context); assert.equal(draft.dynamicOnly, true); assert.equal(draft.kind, "side"); }
  const runtimeNpcs = simulation.createInitialNpcRuntime(content.NPCS.map((n)=>n.id));
  const runtimeRelations = simulation.createInitialRelationshipFacets(content.NPCS.map((n)=>n.id));
  const firstOutskirts = content.NPCS.find(n=>n.id === "rovan") ?? content.NPCS.find(n=>n.region === "outskirts");
  assert.ok(firstOutskirts, "Need at least one outskirts NPC for narrative runtime tests.");
  runtimeRelations[firstOutskirts.id] = {trust:55,respect:35,affection:25,fear:0,debt:10,suspicion:0};
  const runtimeContext = narrative.buildNarrativeContext({ region:"outskirts", playerIdentity:simulation.createInitialPlayerIdentity(), relationshipFacets:runtimeRelations, memories:[], npcStates:runtimeNpcs, questStatus:Object.fromEntries(content.QUESTS.map(q=>[q.id,"available"])), activeQuestId:null, worldHour:22, eyeSignals:[] });
  const runtimeState = narrative.buildDeterministicRuntime(initialNarrative, runtimeContext, Date.now());
  const councilState = aiCouncil.runAICouncilFoundation({ context: runtimeContext, state: runtimeState, nowMs: Date.now(), gold: 900, inventoryItemIds: ["workshopIron", "spiceBundle"], marketDemand: { workshopIron: 10 } }, runtimeState.aiCouncil);
  const syncedNarrative = narrative.syncNarrativeDirector(runtimeState, runtimeContext, new Date().toISOString());
  assert.equal(syncedNarrative.aiCouncil.mode, "ready_for_ai");
  assert.equal(syncedNarrative.aiCouncil.handoff.aiMayGenerate, false);
  assert.ok(councilState.worldObserver.lastSnapshot);
  assert.ok(councilState.storyMaster.lastSnapshot);
  assert.ok(councilState.economyMaster.lastSnapshot);
  assert.ok(councilState.decisionLayer.lastDecision);
  assert.equal(councilState.handoff.aiMayGenerate, false);
  assert.equal(councilState.handoff.dynamicWriteAllowed, true);
  assert.ok(runtimeState.runtime);
  assert.ok(Array.isArray(runtimeState.runtime.sideQuests.records));
  assert.ok(Array.isArray(runtimeState.runtime.worldEvents.events));
  assert.ok(runtimeState.runtime.sideQuests.records.length <= 2, "Runtime must throttle offered side quests.");
  const dialogueTestContext = narrative.buildNarrativeContext({ region:"outskirts", playerIdentity:simulation.createInitialPlayerIdentity(), relationshipFacets:runtimeRelations, memories:[], npcStates:runtimeNpcs, questStatus:Object.fromEntries(content.QUESTS.map(q=>[q.id,"available"])), activeQuestId:null, worldHour:12, eyeSignals:[] });
  const dialogueCtx = narrative.buildDialogueContext(dialogueTestContext, firstOutskirts.id);
  assert.ok(dialogueCtx && dialogueCtx.present);
  assert.equal(dialogueCtx.discoveredBackstoryLevel, "motivation");
  const topics = narrative.getAvailableDialogueTopics(dialogueTestContext, firstOutskirts.id);
  assert.ok(topics.some(t=>t.kind === "introduction"));
  if (runtimeState.runtime.sideQuests.records[0]) {
    const sqId = runtimeState.runtime.sideQuests.records[0].id;
    const active = narrative.activateSideQuest(runtimeState, sqId);
    assert.equal(active.runtime.sideQuests.records.find(r=>r.id===sqId)?.status, "active");
    const resolved = narrative.resolveSideQuestRuntime(active, sqId, "completed");
    assert.equal(resolved.runtime.sideQuests.records.find(r=>r.id===sqId)?.status, "completed");
    const failed = narrative.resolveSideQuestRuntime(active, sqId, "failed");
    assert.equal(failed.runtime.sideQuests.records.find(r=>r.id===sqId)?.status, "failed");
    assert.ok(failed.runtime.sideQuests.failedIds.includes(sqId), "Failure must persist in the side-quest outcome history.");
    const expired = narrative.resolveSideQuestRuntime(active, sqId, "expired");
    assert.equal(expired.runtime.sideQuests.records.find(r=>r.id===sqId)?.status, "expired");
    assert.ok(expired.runtime.sideQuests.expiredIds.includes(sqId), "Expired quest IDs must be persisted.");
  }
  if (runtimeState.runtime.sideQuests.records.length) {
    const expiredAt = new Date(Date.now() - 60_000).toISOString();
    const staleState = {
      ...runtimeState,
      runtime: {
        ...runtimeState.runtime,
        sideQuests: {
          ...runtimeState.runtime.sideQuests,
          records: runtimeState.runtime.sideQuests.records.map(r => ({ ...r, status: "active", expiresAt: expiredAt })),
        },
      },
    };
    const expiredTick = narrative.buildDeterministicRuntime(staleState, runtimeContext, Date.now());
    for (const previous of staleState.runtime.sideQuests.records) {
      assert.equal(expiredTick.runtime.sideQuests.records.find(r=>r.id===previous.id)?.status, "expired", "Ticking past a deadline must preserve the quest as expired.");
      assert.ok(expiredTick.runtime.sideQuests.expiredIds.includes(previous.id));
    }
  }
  if (runtimeState.director.worldEventCandidates[0]) {
    const eventState = narrative.activateWorldEvent(runtimeState, runtimeState.director.worldEventCandidates[0].id);
    assert.ok(eventState.runtime.worldEvents.events.some(e=>e.status === "active"));
  }

  assert.equal(campaign.chapterQuests(1).length, 24);
  assert.equal(campaign.chapterQuests(2).length, 8);
  assert.equal(campaign.chapterQuests(3).length, 10);
  assert.equal(campaign.chapterQuests(4).length, 7);
  assert.equal(campaign.chapterQuests(5).length, 5);
  assert.equal(campaign.chapterQuests(6).length, 6);
  const baseCampaignState = { gold: 12540, questStatus: Object.fromEntries(content.QUESTS.map(q=>[q.id,"available"])), reputationParts:{achievements:0,decisions:0,relationships:0,economic:0,growth:0,activity:0}, relationships:Object.fromEntries(content.NPCS.map(n=>[n.id,0])), identity:{affinities:{combat:0,shadow:0,social:0,trade:0,lore:0}} };
  assert.equal(campaign.regionGateStatus(baseCampaignState,"outskirts").unlocked,true);
  assert.equal(campaign.regionGateStatus(baseCampaignState,"arena").unlocked,false);
  assert.equal(campaign.regionGateStatus(baseCampaignState,"market").unlocked,false);
  const worldTimeSource = fs.readFileSync(path.join(root, "src/lib/worldTime.ts"), "utf8");
  assert.match(worldTimeSource, /realHoursPerKingdomDay: 12/);
  assert.match(worldTimeSource, /realMsPerKingdomDay: 12 \* 60 \* 60 \* 1000/);

  const assetRefs = new Set();
  for (const sourceFile of fs.readdirSync(path.join(root, "src"), { recursive: true })) {
    const absolute = path.join(root, "src", sourceFile);
    if (!fs.statSync(absolute).isFile()) continue;
    const text = fs.readFileSync(absolute, "utf8");
    for (const match of text.matchAll(/\/assets\/([A-Za-z0-9_.-]+)/g)) assetRefs.add(match[1]);
  }
  const assets = new Set(fs.readdirSync(path.join(root, "public/assets")));
  for (const ref of assetRefs) assert.ok(assets.has(ref), `Missing asset: ${ref}`);

  console.log("AImorpg core gameplay/content smoke test: PASS");
  console.log("TSX syntax/transpile smoke test: PASS (GameClient, AccountPanel, EyeEntity, app page and layout; not a full semantic TypeScript check)");
  console.log(`Validated ${content.ITEMS.length} items (${itemUniqueArt} unique images, ${itemFamilyFallbackArt} explicit family illustrations, ${itemSlotFallbackArt} equipment-slot fallbacks, ${itemCategoryFallbackArt} category fallbacks), ${content.EQUIPMENT_SETS.length} sets, ${content.NPCS.length} NPCs, ${content.QUESTS.length} quests, ${content.REGION_DISTRICTS.length} region districts, ${assetRefs.size} asset references.`);
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
