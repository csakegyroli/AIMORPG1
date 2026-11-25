import type { ItemDefinition } from "./types";

/** v2.0 alpha: authored items with explicit equipment-affinity tags. */
export const EXPANSION_ITEMS: ItemDefinition[] = [
  {
    id: "watchCaptainsSaber", name: "A Kapitány utolsó kardja", type: "weapon", slot: "weapon", icon: "⚔", basePrice: 185,
    description: "A külvárosi őrség régi kapitányának pengéje. A markolat belsejébe vésett fogadalom csak akkor látszik, ha a fény oldalról éri.",
    category: "equipment", regions: ["outskirts", "arena"], origin: "Külváros · Őrségi negyed", legalStatus: "legal", tradeValue: 210,
    sellable: true, marketEligible: true, stats: { strength: 3, weaponMastery: 2, leadership: 1 }, rarity: "Ritka", synergyTags: ["iron-oath"]
  },
  {
    id: "blackIronBuckler", name: "Feketevas kispajzs", type: "shield", slot: "shield", icon: "⬡", basePrice: 160,
    description: "Kis pajzs, amelyet nem a szépsége, hanem a hajlított perem mögé rejtett második acélréteg tesz híressé.",
    category: "equipment", regions: ["outskirts", "arena"], origin: "Aréna · Fegyvertár", legalStatus: "legal", tradeValue: 180,
    sellable: true, marketEligible: true, stats: { defense: 3, endurance: 2 }, rarity: "Ritka", synergyTags: ["iron-oath"]
  },
  {
    id: "oathMedallion", name: "A Névtelen Őrség medálja", type: "accessory", slot: "accessory", icon: "◉", basePrice: 145,
    description: "Három apró rovás jelzi a fogadalmat: védd azt, aki nem tudja megvédeni magát; emlékezz arra, amit láttál; ne hazudj a holtakról.",
    category: "equipment", regions: ["outskirts", "inner"], origin: "Külváros · Régi őrhely", legalStatus: "legal", tradeValue: 165,
    sellable: true, marketEligible: true, stats: { willpower: 2, empathy: 1 }, rarity: "Különleges", synergyTags: ["iron-oath"]
  },
  {
    id: "ashweaveCoat", name: "Hamuval szőtt kabát", type: "armor", slot: "armor", icon: "◈", basePrice: 178,
    description: "Füstös fonálból és puha bőrből készült kabát. A varrásai elnyelik a súrlódás hangját, de nyomot hagynak rajta a friss hamuban.",
    category: "equipment", regions: ["outskirts", "inner"], origin: "Belváros · Hátsó szabóműhely", legalStatus: "legal", tradeValue: 196,
    sellable: true, marketEligible: true, stats: { stealth: 2, agility: 2, perception: 1 }, rarity: "Ritka", synergyTags: ["whisper-thread"]
  },
  {
    id: "canalKnife", name: "Csatornaőrök keskeny kése", type: "weapon", slot: "weapon", icon: "†", basePrice: 132,
    description: "Rövid, csendes penge. A penge tövénél vékony vonal mutatja, milyen mélyre merülhet vízbe anélkül, hogy a markolat felázna.",
    category: "equipment", regions: ["outskirts", "harbor"], origin: "Külváros · Csatornajárat", legalStatus: "restricted", tradeValue: 152,
    sellable: true, marketEligible: true, stats: { agility: 2, stealth: 2, pickpocket: 1 }, rarity: "Ritka", synergyTags: ["whisper-thread"]
  },
  {
    id: "smokeStepBoots", name: "Füstjáró csizma", type: "boots", slot: "boots", icon: "♟", basePrice: 155,
    description: "A talp alá varrt puha réteg nem tünteti el a lábnyomot, de a kövön hagyott hangot igen.",
    category: "equipment", regions: ["outskirts", "inner"], origin: "Külváros · Vörös utcák", legalStatus: "legal", tradeValue: 176,
    sellable: true, marketEligible: true, stats: { stealth: 2, lockpicking: 1, agility: 2 }, rarity: "Ritka", synergyTags: ["whisper-thread"]
  },
  {
    id: "quietBell", name: "Néma harang", type: "accessory", slot: "accessory", icon: "♧", basePrice: 172,
    description: "Apró rézharang, amely nem hangot ad, hanem a rezgést vezeti a viselő ujjaihoz. Ajtók, lépések és rejtett üregek jelzésére használják.",
    category: "equipment", regions: ["market", "inner"], origin: "Belváros · Hangművesek utcája", legalStatus: "legal", tradeValue: 198,
    sellable: true, marketEligible: true, stats: { perception: 2, investigation: 1, stealth: 1 }, rarity: "Különleges", synergyTags: ["whisper-thread", "eye-bound"]
  },
  {
    id: "archiveMantle", name: "A Hamisítók Levéltári köpenye", type: "armor", slot: "armor", icon: "▤", basePrice: 205,
    description: "Valaha levéltári segédek viselték. Rejtett zsebei nem iratot, hanem irattöredéket, pecsétet és a papír eredetét áruló port rejtenek.",
    category: "equipment", regions: ["market", "palace"], origin: "Palota · Alsó archívum", legalStatus: "restricted", tradeValue: 235,
    sellable: true, marketEligible: true, stats: { intelligence: 2, lore: 2, investigation: 2 }, rarity: "Ritka", synergyTags: ["ink-and-seal"]
  },
  {
    id: "brokenSealRing", name: "Törött pecsétgyűrű", type: "accessory", slot: "accessory", icon: "◌", basePrice: 148,
    description: "A gyűrűből kitört a címer közepe. A peremén maradt viaszlenyomat még így is elárulja, melyik hivatalban használták.",
    category: "equipment", regions: ["market", "palace"], origin: "Kereskedelmi Központ · Régi könyvpiac", legalStatus: "restricted", tradeValue: 170,
    sellable: true, marketEligible: true, stats: { appraisal: 2, politics: 1, investigation: 1 }, rarity: "Ritka", synergyTags: ["ink-and-seal", "eye-bound"]
  },
  {
    id: "courierRunners", name: "Futárcéh gyorsjárója", type: "boots", slot: "boots", icon: "➶", basePrice: 138,
    description: "Könnyű, sarokra húzott csizma hosszú lépcsőkhöz és szűk folyosókhoz. A talp belső íve a gyors irányváltást segíti.",
    category: "equipment", regions: ["market", "outskirts"], origin: "Kereskedelmi Központ · Futárcéh", legalStatus: "legal", tradeValue: 158,
    sellable: true, marketEligible: true, stats: { agility: 2, navigation: 1, logistics: 1 }, rarity: "Ritka", synergyTags: ["ink-and-seal"]
  },
  {
    id: "royalRapier", name: "Az Üres Trón tőre", type: "weapon", slot: "weapon", icon: "⚔", basePrice: 248,
    description: "Udvari ceremóniákra készült, de a hegyét nem dísznek csiszolták. A markolat belsejében egy korábbi uralkodó aláírása rejtőzik.",
    category: "equipment", regions: ["inner", "palace"], origin: "Palota · Ceremoniális fegyvertár", legalStatus: "restricted", tradeValue: 280,
    sellable: true, marketEligible: true, stats: { weaponMastery: 2, speech: 2, politics: 1 }, rarity: "Különleges", synergyTags: ["ink-and-seal", "iron-oath", "eye-bound"]
  },
  {
    id: "stormglassBow", name: "Vihartükör íj", type: "weapon", slot: "weapon", icon: "➶", basePrice: 225,
    description: "A kikötői üvegművesek és a hegyi vadászok közös munkája. A markolat üvegcsíkjai a nedves levegőben halványan felizzanak.",
    category: "equipment", regions: ["harbor", "forest"], origin: "Kikötő · Hajósok negyede", legalStatus: "legal", tradeValue: 255,
    sellable: true, marketEligible: true, stats: { perception: 2, reflex: 2, navigation: 1 }, rarity: "Különleges", synergyTags: ["storm-touched"]
  },
  {
    id: "brineproofScale", name: "Sószél pikkelyvért", type: "armor", slot: "armor", icon: "◈", basePrice: 218,
    description: "Egymásra csúszó, vékony fémlapok. A só nem marja úgy, mint a közönséges acélt, a páncél pedig mozgás közben is enged.",
    category: "equipment", regions: ["harbor"], origin: "Kikötő · Hajókovácsok", legalStatus: "legal", tradeValue: 244,
    sellable: true, marketEligible: true, stats: { defense: 2, endurance: 2, survival: 1 }, rarity: "Ritka", synergyTags: ["storm-touched"]
  },
  {
    id: "stormKnot", name: "Viharkötél csomója", type: "accessory", slot: "accessory", icon: "⌁", basePrice: 166,
    description: "Tengerészcsomóba fogott kék üveggyöngy. A régi hajósok szerint a csomó nem megállítja a vihart, csak megtanít együtt mozogni vele.",
    category: "equipment", regions: ["harbor"], origin: "Kikötő · Szabad hajósok", legalStatus: "legal", tradeValue: 188,
    sellable: true, marketEligible: true, stats: { survival: 2, navigation: 2, willpower: 1 }, rarity: "Különleges", synergyTags: ["storm-touched"]
  },
  {
    id: "harborAegis", name: "Hullámtörő őrpajzs", type: "shield", slot: "shield", icon: "⬡", basePrice: 208,
    description: "A pajzs peremébe hajógerincből származó rézszeg került. A fedélzeten és a sikátori verekedésben is ugyanaz az elve: állj meg, és ne engedd tovább a csapást.",
    category: "equipment", regions: ["harbor", "arena"], origin: "Kikötő · Vasrakpart", legalStatus: "legal", tradeValue: 236,
    sellable: true, marketEligible: true, stats: { defense: 3, endurance: 1, strength: 1 }, rarity: "Ritka", synergyTags: ["storm-touched", "iron-oath"]
  },
  {
    id: "firstWitnessLens", name: "Az Első Tanú lencséje", type: "accessory", slot: "accessory", icon: "◉", basePrice: 310,
    description: "A repedt kristály nem mutatja meg a jövőt. A fény szögét változtatja meg, hogy a már megtörtént dolgok apró ellentmondásai láthatóvá váljanak.",
    category: "relic", regions: ["palace", "forest"], origin: "Ismeretlen eredet · A Szem töredéke", legalStatus: "evidence", tradeValue: 360,
    sellable: false, marketEligible: false, sideQuestOnly: true, stats: { perception: 3, investigation: 2, magicSense: 2 }, rarity: "Legendás", synergyTags: ["eye-bound"]
  },
  {
    id: "echoThreadCloak", name: "Visszhangszál köpeny", type: "armor", slot: "armor", icon: "◇", basePrice: 265,
    description: "A köpeny fonalai nem nyelik el a hangot: megőrzik a rezgés alakját. Viselője hamarabb veszi észre, ha egy történetben hiányzik valami.",
    category: "equipment", regions: ["inner", "palace", "forest"], origin: "Régi csillagvizsgáló", legalStatus: "restricted", tradeValue: 300,
    sellable: true, marketEligible: true, stats: { lore: 2, perception: 2, magicSense: 1 }, rarity: "Különleges", synergyTags: ["eye-bound"]
  },
  {
    id: "memoryMoss", name: "Emlékmoha", type: "consumable", icon: "❧", basePrice: 42,
    description: "Nedves kőfalakon növő, ezüstös moha. A levéltárosok nem írnak vele: a régi tinta szagát és néhány halvány festéknyomot hív elő.",
    category: "material", regions: ["outskirts", "palace", "forest"], origin: "Külvárosi kutak és erdei romok", legalStatus: "legal", tradeValue: 50,
    sellable: true, marketEligible: true, rarity: "Ritka", tags: ["alchemy", "memory", "investigation"]
  },
  {
    id: "blackArchiveWax", name: "Fekete archív viasz", type: "consumable", icon: "⬢", basePrice: 51,
    description: "Pecsétviasz, amelynek hamuja is sötét marad. A királyi hivatalokban hivatalosan nem létezik, a raktári könyvekben mégis rendszeresen fogy.",
    category: "material", regions: ["market", "palace"], origin: "Kereskedelmi Központ · zárt árusor", legalStatus: "restricted", tradeValue: 62,
    sellable: true, marketEligible: true, rarity: "Ritka", tags: ["crafting", "archive", "evidence"]
  },
  {
    id: "stormSalt", name: "Viharsó", type: "consumable", icon: "✧", basePrice: 39,
    description: "Kikötői szélben kristályosodó só. A hajósok a kötél, a bőr és a régi térképek megóvására használják.",
    category: "material", regions: ["harbor", "forest"], origin: "Kikötő · Sós raktár", legalStatus: "legal", tradeValue: 45,
    sellable: true, marketEligible: true, rarity: "Közönséges", tags: ["crafting", "navigation", "survival"]
  },
  {
    id: "silverEyeShard", name: "Ezüst Szem-szilánk", type: "consumable", icon: "◉", basePrice: 1,
    description: "Egy apró, hideg szilánk. Nem világít, és nem suttog. Csak akkor ver vissza fényt, ha valaki szándékosan kihagyott egy részletet.",
    category: "quest", regions: ["forest", "palace"], origin: "Palota · Az eltűnt könyv ürege", legalStatus: "evidence", tradeValue: 0,
    sellable: false, marketEligible: false, questItem: true, rarity: "Legendás", tags: ["canon-clue", "eye", "memory"]
  },
];
