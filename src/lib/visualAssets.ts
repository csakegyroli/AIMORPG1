/**
 * Presentation-only visual registry.
 * Every path is keyed by stable gameplay IDs; it does not own state, rules, or server data.
 * Source-to-crop records are preserved in docs/artwork-sources/integration-sources/crop-receipts.json.
 */
export const ITEM_ART: Record<string, string> = {
  "militiaBlade": "/assets/items/militiaBlade.webp",
  "oakShield": "/assets/items/oakShield.webp",
  "paddedArmor": "/assets/items/paddedArmor.webp",
  "travelerBoots": "/assets/items/travelerBoots.webp",
  "guildRing": "/assets/items/guildRing.webp",
  "lurkerGloves": "/assets/items/lurkerGloves.webp",
  "ledgerLens": "/assets/items/ledgerLens.webp",
  "arenaBandages": "/assets/items/arenaBandages.webp",
  "smokePhial": "/assets/items/smokePhial.webp",
  "moonleaf": "/assets/items/moonleaf.webp",
  "emberRoot": "/assets/items/emberRoot.webp",
  "strengthTonic": "/assets/items/strengthTonic.webp",
  "runeInfusion": "/assets/items/runeInfusion.webp",
  "gateRations": "/assets/items/gateRations.webp",
  "workshopIron": "/assets/items/workshopIron.webp",
  "tannersWax": "/assets/items/tannersWax.webp",
  "watchSeal": "/assets/items/watchSeal.webp",
  "sealedLetter": "/assets/items/sealedLetter.webp",
  "sealedTestimony": "/assets/items/sealedTestimony.webp",
  "courtSealRing": "/assets/items/courtSealRing.webp",
  "oathMedallion": "/assets/items/oathMedallion.webp",
  "blackArchiveWax": "/assets/items/blackArchiveWax.webp",
  "blackArchiveIndex": "/assets/items/blackArchiveIndex.webp",
  "caravanToolKit": "/assets/items/caravanToolKit.webp",
  "velvetWine": "/assets/items/velvetWine.webp",
  "casinoChips": "/assets/items/casinoChips.webp",
  "silkGloves": "/assets/items/silkGloves.webp",
  "royalArchiveCopy": "/assets/items/royalArchiveCopy.webp",
  "patronInvitation": "/assets/items/patronInvitation.webp",
  "luxuryCigar": "/assets/items/luxuryCigar.webp",
  "debtMarker": "/assets/items/debtMarker.webp",
  "innerBanquet": "/assets/items/innerBanquet.webp",
  "smokeStepBoots": "/assets/items/smokeStepBoots.webp",
  "watchCaptainsSaber": "/assets/items/watchCaptainsSaber.webp",
  "ashweaveCoat": "/assets/items/ashweaveCoat.webp",
  "royalRapier": "/assets/items/royalRapier.webp",
  "blackIronBuckler": "/assets/items/blackIronBuckler.webp",
  "archiveMantle": "/assets/items/archiveMantle.webp",
  "harborAegis": "/assets/items/harborAegis.webp",
  "brineproofScale": "/assets/items/brineproofScale.webp",
  "arenaBand": "/assets/items/arenaBand.webp",
  "courtShoes": "/assets/items/courtShoes.webp",
  "courierRunners": "/assets/items/courierRunners.webp",
  "courtInvitation": "/assets/items/courtInvitation.webp",
  "blackCoin": "/assets/items/blackCoin.webp",
  "royalTransitPass": "/assets/items/royalTransitPass.webp",
  "rareAmber": "/assets/items/rareAmber.webp",
  "blackSalt": "/assets/items/blackSalt.webp",
  "guildWaxSet": "/assets/items/guildWaxSet.webp",
  "echoThreadCloak": "/assets/items/echoThreadCloak.webp",
  "harborCoat": "/assets/items/harborCoat.webp",
  "dockHook": "/assets/items/dockHook.webp",
  "watchLantern": "/assets/items/watchLantern.webp",
  "rustedKey": "/assets/items/rustedKey.webp",
  "navigatorChart": "/assets/items/navigatorChart.webp",
  "sailorsStew": "/assets/items/sailorsStew.webp",
  "shipRepairKit": "/assets/items/shipRepairKit.webp",
  "diplomaticToken": "/assets/items/diplomaticToken.webp",
  "brokenSealRing": "/assets/items/brokenSealRing.webp",
  "canalKnife": "/assets/items/canalKnife.webp",
  "caravanCompass": "/assets/items/caravanCompass.webp",
  "championRibbon": "/assets/items/championRibbon.webp",
  "duelistCape": "/assets/items/duelistCape.webp",
  "firstWitnessLens": "/assets/items/firstWitnessLens.webp",
  "quietBell": "/assets/items/quietBell.webp",
  "sailorsKnife": "/assets/items/sailorsKnife.webp",
  "stormKnot": "/assets/items/stormKnot.webp",
  "stormglassBow": "/assets/items/stormglassBow.webp",
  "streetMap": "/assets/items/streetMap.webp",
  "guildPermit": "/assets/items/guildPermit.webp",
  "sealedLedger": "/assets/items/sealedLedger.webp",
  "tradeSilk": "/assets/items/tradeSilk.webp",
  "guildMeal": "/assets/items/guildMeal.webp",
  "sailcloth": "/assets/items/sailcloth.webp",
};

/**
 * Slot-family art is only a presentation fallback for generated equipment-set pieces.
 * It is intentionally NOT represented as unique artwork for those set items.
 */
export const ITEM_SLOT_ART: Record<string, string> = {
  weapon: ITEM_ART.militiaBlade,
  shield: ITEM_ART.oakShield,
  armor: ITEM_ART.paddedArmor,
  accessory: ITEM_ART.lurkerGloves,
  boots: ITEM_ART.travelerBoots,
};

/**
 * Explicit, semantic family art for non-equipment items without unique crops.
 * These are deliberately labelled as fallback art in the UI; they are not
 * presented as unique artwork for the item ID. A map/document may use a ledger
 * or letter illustration, a token uses the existing casino-chip art, etc.
 */
export const ITEM_FAMILY_FALLBACK_ART: Record<string, string> = {
  redStreetTokens: ITEM_ART.casinoChips,
  silentWellVial: ITEM_ART.smokePhial,
  heartyStew: ITEM_ART.sailorsStew,
  smithingKit: ITEM_ART.caravanToolKit,
  gladiatorOil: ITEM_ART.smokePhial,
  arenaWhetstone: ITEM_ART.workshopIron,
  crowdScrip: ITEM_ART.casinoChips,
  matchLedger: ITEM_ART.blackArchiveIndex,
  arenaBlackToken: ITEM_ART.casinoChips,
  arenaProtein: ITEM_ART.gateRations,
  arenaResin: ITEM_ART.tannersWax,
  merchantInk: ITEM_ART.blackArchiveIndex,
  warehouseSeal: ITEM_ART.watchSeal,
  blackCoinLedgerFragment: ITEM_ART.blackArchiveIndex,
  promissoryNote: ITEM_ART.sealedLetter,
  royalSealWax: ITEM_ART.blackArchiveWax,
  saltFish: ITEM_ART.gateRations,
  smugglersPass: ITEM_ART.watchSeal,
  captainsLogPage: ITEM_ART.royalArchiveCopy,
  blackCoinCargoTag: ITEM_ART.debtMarker,
  memoryMoss: ITEM_ART.moonleaf,
  stormSalt: ITEM_ART.blackSalt,
  silverEyeShard: ITEM_ART.runeInfusion,
};

/**
 * Semantic category illustrations for items without a unique or item-specific family crop.
 * These are explicit, visibly labelled fallbacks, never claimed as unique item art.
 */
export const ITEM_CATEGORY_FALLBACK_ART: Record<string, string> = {
  equipment: ITEM_ART.militiaBlade,
  consumable: ITEM_ART.smokePhial,
  material: ITEM_ART.workshopIron,
  tradeGood: ITEM_ART.silkGloves,
  upgrade: ITEM_ART.caravanToolKit,
  quest: ITEM_ART.blackArchiveIndex,
  key: ITEM_ART.watchSeal,
  luxury: ITEM_ART.oathMedallion,
  contraband: ITEM_ART.debtMarker,
  document: ITEM_ART.royalArchiveCopy,
  relic: ITEM_ART.runeInfusion,
  currency: ITEM_ART.casinoChips,
};

export function itemArtFor(itemId: string, slot?: string, type?: string, category?: string): string | undefined {
  const exact = ITEM_ART[itemId];
  if (exact) return exact;
  const family = ITEM_FAMILY_FALLBACK_ART[itemId];
  if (family) return family;
  if (slot && ITEM_SLOT_ART[slot]) return ITEM_SLOT_ART[slot];
  if (type && ITEM_SLOT_ART[type]) return ITEM_SLOT_ART[type];
  if (category && ITEM_CATEGORY_FALLBACK_ART[category]) return ITEM_CATEGORY_FALLBACK_ART[category];
  if (type === "consumable") return ITEM_CATEGORY_FALLBACK_ART.consumable;
  return undefined;
}

export function itemArtKindFor(itemId: string, slot?: string, type?: string, category?: string): "unique" | "family-fallback" | "slot-fallback" | "category-fallback" | "none" {
  if (ITEM_ART[itemId]) return "unique";
  if (ITEM_FAMILY_FALLBACK_ART[itemId]) return "family-fallback";
  if ((slot && ITEM_SLOT_ART[slot]) || (type && ITEM_SLOT_ART[type])) return "slot-fallback";
  if ((category && ITEM_CATEGORY_FALLBACK_ART[category]) || type === "consumable") return "category-fallback";
  return "none";
}

/** Unique, ID-based portraits for records whose prior avatarSrc was shared/generic.
 * Existing authored portrait links remain the fallback when there is no entry here.
 */
export const NPC_PORTRAIT_ART: Record<string, string> = {
  "alma": "/assets/npcs/alma.webp",
  "petar": "/assets/npcs/petar.webp",
  "vera": "/assets/npcs/vera.webp",
  "jarek": "/assets/npcs/jarek.webp",
  "nara": "/assets/npcs/nara.webp",
  "tomen": "/assets/npcs/tomen.webp",
  "zora": "/assets/npcs/zora.webp",
  "cador": "/assets/npcs/cador.webp",
  "pell": "/assets/npcs/pell.webp",
  "havel": "/assets/npcs/havel.webp",
  "brenka": "/assets/npcs/brenka.webp",
  "silas": "/assets/npcs/silas.webp",
  "tosk": "/assets/npcs/tosk.webp",
  "lena": "/assets/npcs/lena.webp",
  "bran": "/assets/npcs/bran.webp",
  "orren": "/assets/npcs/orren.webp",
  "rovan": "/assets/npcs/rovan.webp",
  "siven": "/assets/npcs/siven.webp",
  "maela": "/assets/npcs/maela.webp",
  "garran": "/assets/npcs/garran.webp",
  "malk": "/assets/npcs/malk.webp",
  "eldra": "/assets/npcs/eldra.webp",
  "sera": "/assets/npcs/sera.webp",
  "oris": "/assets/npcs/oris.webp",
  "niven": "/assets/npcs/niven.webp",
  "taris": "/assets/npcs/taris.webp",
  "cassian": "/assets/npcs/cassian.webp",
  "lyra": "/assets/npcs/lyra.webp",
  "fen": "/assets/npcs/fen.webp",
  "marwen": "/assets/npcs/marwen.webp",
  "marketInn": "/assets/npcs/marketInn.webp",
  "marketSmith": "/assets/npcs/marketSmith.webp",
  "arenaSena": "/assets/npcs/arenaSena.webp",
  "arenaKorr": "/assets/npcs/arenaKorr.webp",
  "arenaVeya": "/assets/npcs/arenaVeya.webp",
  "arenaBram": "/assets/npcs/arenaBram.webp",
  "arenaRusk": "/assets/npcs/arenaRusk.webp",
  "arenaTalia": "/assets/npcs/arenaTalia.webp",
  "arenaOlen": "/assets/npcs/arenaOlen.webp",
  "arenaInn": "/assets/npcs/arenaInn.webp",
  "arenaSmith": "/assets/npcs/arenaSmith.webp",
  "harborKael": "/assets/npcs/harborKael.webp",
  "harborMira": "/assets/npcs/harborMira.webp",
  "harborJoren": "/assets/npcs/harborJoren.webp",
  "harborTessa": "/assets/npcs/harborTessa.webp",
  "harborSable": "/assets/npcs/harborSable.webp",
  "harborDain": "/assets/npcs/harborDain.webp",
  "harborSmith": "/assets/npcs/harborSmith.webp",
  "harborInn": "/assets/npcs/harborInn.webp",
  "adrian": "/assets/npcs/adrian.webp",
  "selene": "/assets/npcs/selene.webp",
  "marcell": "/assets/npcs/marcell.webp",
  "livia": "/assets/npcs/livia.webp",
  "octavia": "/assets/npcs/octavia.webp",
  "corvin": "/assets/npcs/corvin.webp",
  "violet": "/assets/npcs/violet.webp",
  "innerSmith": "/assets/npcs/innerSmith.webp",
  "palaceElian": "/assets/npcs/palaceElian.webp",
  "palaceMara": "/assets/npcs/palaceMara.webp",
  "palaceOrven": "/assets/npcs/palaceOrven.webp",
  "palaceAster": "/assets/npcs/palaceAster.webp",
  "palaceYsra": "/assets/npcs/palaceYsra.webp",
  "palaceInn": "/assets/npcs/palaceInn.webp",
  "palaceSmith": "/assets/npcs/palaceSmith.webp",
};

export const REGION_ART: Record<string, string> = {
  outskirts: "/assets/world/concept02-region-outer-district.webp",
  market: "/assets/world/concept02-region-trade-center.webp",
  arena: "/assets/world/concept02-region-arena.webp",
  inner: "/assets/world/concept02-region-inner-city.webp",
  palace: "/assets/world/concept02-region-palace-district.webp",
  harbor: "/assets/world/concept02-region-harbor.webp",
  forest: "/assets/world/forest-exploration.webp",
};

/** All current district IDs resolve to a visually prepared background without changing gameplay data. */
export const DISTRICT_ART: Record<string, string> = {
  "gate": "/assets/districts/gate.webp",
  "workshops": "/assets/districts/workshops.webp",
  "oldMarket": "/assets/districts/oldMarket.webp",
  "redStreets": "/assets/districts/redStreets.webp",
  "watch": "/assets/districts/watch.webp",
  "oldEdge": "/assets/districts/oldEdge.webp",
  "hallOfTrials": "/assets/districts/hallOfTrials.webp",
  "fightersYard": "/assets/districts/fightersYard.webp",
  "crowdQuarter": "/assets/districts/crowdQuarter.webp",
  "championsHall": "/assets/districts/championsHall.webp",
  "exchangeSquare": "/assets/districts/exchangeSquare.webp",
  "caravanYard": "/assets/districts/caravanYard.webp",
  "guildRow": "/assets/districts/guildRow.webp",
  "warehouseRing": "/assets/districts/warehouseRing.webp",
  "goldenPromenade": "/assets/districts/goldenPromenade.webp",
  "velvetSalon": "/assets/districts/velvetSalon.webp",
  "ivoryArcade": "/assets/districts/ivoryArcade.webp",
  "ledgerCourt": "/assets/districts/ledgerCourt.webp",
  "patronsQuarter": "/assets/districts/patronsQuarter.webp",
  "crownCourt": "/assets/districts/crownCourt.webp",
  "glassGallery": "/assets/districts/glassGallery.webp",
  "royalArchive": "/assets/districts/royalArchive.webp",
  "guardWing": "/assets/districts/guardWing.webp",
  "ironPiers": "/assets/districts/ironPiers.webp",
  "sailorsRow": "/assets/districts/sailorsRow.webp",
  "fishMarket": "/assets/districts/fishMarket.webp",
  "freeDocks": "/assets/districts/freeDocks.webp",
  "nightWarehouses": "/assets/districts/nightWarehouses.webp",
};

export function districtArtFor(districtId: string, fallback?: string): string {
  return DISTRICT_ART[districtId] ?? fallback ?? "/assets/world/capital-dawn.webp";
}
