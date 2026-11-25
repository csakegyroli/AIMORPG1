import type { MainQuestAudit } from "./types";

export const MAIN_QUEST_AUDIT: Record<string, MainQuestAudit> = {
  "main_outskirts_01": {
    functionHooks: [{ npcId: "miri", functionId: "fn-miri", role: "core", label: "miri", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "vera", functionId: "fn-vera", role: "support", label: "fn-vera", narrativeUse: 'Érmevizsgálat erősíti meg, hogy a pletyka mögött tárgyi nyom van.' }],
    itemHooks: [],
    relationshipFocus: ["miri", "vera"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "miri"],
    playerExperience: 'Érmevizsgálat erősíti meg, hogy a pletyka mögött tárgyi nyom van.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_02": {
    functionHooks: [{ npcId: "rovan", functionId: "fn-rovan", role: "core", label: "rovan", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "lena", functionId: "fn-lena", role: "support", label: "fn-lena", narrativeUse: 'A pecsételt irat hivatalos bizonyítékká válik.' }],
    itemHooks: [],
    relationshipFocus: ["rovan", "lena"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "rovan"],
    playerExperience: 'A pecsételt irat hivatalos bizonyítékká válik.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_03": {
    functionHooks: [{ npcId: "damar", functionId: "fn-damar", role: "core", label: "damar", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "petar", functionId: "fn-petar", role: "support", label: "fn-petar", narrativeUse: 'A raktárkulcs útvonala szállítási láncot nyit meg.' }],
    itemHooks: [],
    relationshipFocus: ["damar", "petar"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "damar"],
    playerExperience: 'A raktárkulcs útvonala szállítási láncot nyit meg.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_04": {
    functionHooks: [{ npcId: "garran", functionId: "fn-garran", role: "core", label: "garran", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "garran", functionId: "fn-garran", role: "support", label: "fn-garran", narrativeUse: 'A kovácsműhely a szükséges alapanyag történeti helye.' }],
    itemHooks: [{ itemId: "workshopIron", role: "material", narrativeUse: 'A Borin-féle kovácsműhelyhez kötött alapanyag.' }],
    relationshipFocus: ["garran", "garran"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "garran"],
    playerExperience: 'A kovácsműhely a szükséges alapanyag történeti helye.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_05": {
    functionHooks: [{ npcId: "eldra", functionId: "fn-eldra", role: "core", label: "eldra", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "maela", functionId: "fn-maela", role: "support", label: "fn-maela", narrativeUse: 'A kút körüli nyomok Eldra különös vizsgálatát táplálják.' }],
    itemHooks: [{ itemId: "silentWellVial", role: "evidence", narrativeUse: 'A Régi Perem vizsgálható nyoma.' }],
    relationshipFocus: ["eldra", "maela"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "eldra"],
    playerExperience: 'A kút körüli nyomok Eldra különös vizsgálatát táplálják.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_06": {
    functionHooks: [{ npcId: "velka", functionId: "fn-velka", role: "core", label: "velka", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "nara", functionId: "fn-nara", role: "support", label: "fn-nara", narrativeUse: 'A páncél és bőr eredete a felszerelés útját követi.' }],
    itemHooks: [],
    relationshipFocus: ["velka", "nara"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "velka"],
    playerExperience: 'A páncél és bőr eredete a felszerelés útját követi.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_07": {
    functionHooks: [{ npcId: "alma", functionId: "fn-alma", role: "core", label: "alma", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "pell", functionId: "fn-pell", role: "support", label: "fn-pell", narrativeUse: 'A fogadóban hallott történetet a piac megerősíti.' }],
    itemHooks: [],
    relationshipFocus: ["alma", "pell"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "alma"],
    playerExperience: 'A fogadóban hallott történetet a piac megerősíti.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_08": {
    functionHooks: [{ npcId: "petar", functionId: "fn-petar", role: "core", label: "petar", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "jarek", functionId: "fn-jarek", role: "support", label: "fn-jarek", narrativeUse: 'A fuvar útvonalát térképi bizonyítékra lehet váltani.' }],
    itemHooks: [],
    relationshipFocus: ["petar", "jarek"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "petar"],
    playerExperience: 'A fuvar útvonalát térképi bizonyítékra lehet váltani.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_09": {
    functionHooks: [{ npcId: "vera", functionId: "fn-vera", role: "core", label: "vera", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "lyra", functionId: "fn-lyra", role: "support", label: "fn-lyra", narrativeUse: 'A második pénzváltó ugyanazt a rendellenességet ismeri fel.' }],
    itemHooks: [{ itemId: "blackCoin", role: "evidence", narrativeUse: 'Az első biztos Fekete Érme-azonosító.' }],
    relationshipFocus: ["vera", "lyra"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "vera"],
    playerExperience: 'A második pénzváltó ugyanazt a rendellenességet ismeri fel.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_10": {
    functionHooks: [{ npcId: "jarek", functionId: "fn-jarek", role: "core", label: "jarek", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "malk", functionId: "fn-malk", role: "support", label: "fn-malk", narrativeUse: 'A hiányzó útvonalhoz karavánadat tartozik.' }],
    itemHooks: [{ itemId: "streetMap", role: "tool", narrativeUse: 'Útvonal és hiányzó kapocs bizonyítéka.' }],
    relationshipFocus: ["jarek", "malk"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "jarek"],
    playerExperience: 'A hiányzó útvonalhoz karavánadat tartozik.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_11": {
    functionHooks: [{ npcId: "nara", functionId: "fn-nara", role: "core", label: "nara", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "garran", functionId: "fn-garran", role: "support", label: "fn-garran", narrativeUse: 'A bőr anyaga más mesterségekhez kötődik.' }],
    itemHooks: [],
    relationshipFocus: ["nara", "garran"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "nara"],
    playerExperience: 'A bőr anyaga más mesterségekhez kötődik.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_12": {
    functionHooks: [{ npcId: "tomen", functionId: "fn-tomen", role: "core", label: "tomen", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "garran", functionId: "fn-garran", role: "support", label: "fn-garran", narrativeUse: 'A mesterség tapasztalt mestere megerősíti a tanonc gyanúját.' }],
    itemHooks: [],
    relationshipFocus: ["tomen", "garran"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "tomen"],
    playerExperience: 'A mesterség tapasztalt mestere megerősíti a tanonc gyanúját.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_13": {
    functionHooks: [{ npcId: "zora", functionId: "fn-zora", role: "core", label: "zora", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "pell", functionId: "fn-pell", role: "support", label: "fn-pell", narrativeUse: 'A piac hangja megerősíti az idegen hajó történetét.' }],
    itemHooks: [],
    relationshipFocus: ["zora", "pell"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "zora"],
    playerExperience: 'A piac hangja megerősíti az idegen hajó történetét.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_14": {
    functionHooks: [{ npcId: "cador", functionId: "fn-cador", role: "core", label: "cador", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "oris", functionId: "fn-oris", role: "support", label: "fn-oris", narrativeUse: 'A könyvelési eltérést fizikailag is le kell ellenőrizni.' }],
    itemHooks: [{ itemId: "sealedLedger", role: "evidence", narrativeUse: 'Könyvelési eltérés kézzelfogható változata.' }],
    relationshipFocus: ["cador", "oris"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "cador"],
    playerExperience: 'A könyvelési eltérést fizikailag is le kell ellenőrizni.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_15": {
    functionHooks: [{ npcId: "pell", functionId: "fn-pell", role: "core", label: "pell", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "alma", functionId: "fn-alma", role: "support", label: "fn-alma", narrativeUse: 'A friss étel és a fogadó beszélgetése összeköti a két helyet.' }],
    itemHooks: [],
    relationshipFocus: ["pell", "alma"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "pell"],
    playerExperience: 'A friss étel és a fogadó beszélgetése összeköti a két helyet.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_16": {
    functionHooks: [{ npcId: "havel", functionId: "fn-havel", role: "core", label: "havel", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "brenka", functionId: "fn-brenka", role: "support", label: "fn-brenka", narrativeUse: 'A fogadás adóssága az Aréna pénzéhez vezet.' }],
    itemHooks: [],
    relationshipFocus: ["havel", "brenka"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "havel"],
    playerExperience: 'A fogadás adóssága az Aréna pénzéhez vezet.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_17": {
    functionHooks: [{ npcId: "brenka", functionId: "fn-brenka", role: "core", label: "brenka", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "arenaRusk", functionId: "fn-rusk", role: "support", label: "fn-rusk", narrativeUse: 'Az arénai odds igazolja a Vörös Utcák pénzmozgását.' }],
    itemHooks: [{ itemId: "arenaBlackToken", role: "evidence", narrativeUse: 'A fogadási háló tárgyi jele.' }],
    relationshipFocus: ["brenka", "arenaRusk"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "brenka"],
    playerExperience: 'Az arénai odds igazolja a Vörös Utcák pénzmozgását.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_18": {
    functionHooks: [{ npcId: "silas", functionId: "fn-silas", role: "core", label: "silas", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "miri", functionId: "fn-miri", role: "support", label: "fn-miri", narrativeUse: 'A közvetítő hálózata új embert enged közel.' }],
    itemHooks: [],
    relationshipFocus: ["silas", "miri"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "silas"],
    playerExperience: 'A közvetítő hálózata új embert enged közel.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_19": {
    functionHooks: [{ npcId: "tosk", functionId: "fn-tosk", role: "core", label: "tosk", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "havel", functionId: "fn-havel", role: "support", label: "fn-havel", narrativeUse: 'A fogadó pincéjében folytatódik a zárt ajtó története.' }],
    itemHooks: [],
    relationshipFocus: ["tosk", "havel"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "tosk"],
    playerExperience: 'A fogadó pincéjében folytatódik a zárt ajtó története.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_20": {
    functionHooks: [{ npcId: "lena", functionId: "fn-lena", role: "core", label: "lena", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "cador", functionId: "fn-cador", role: "support", label: "fn-cador", narrativeUse: 'A hivatalos irat mögötti számok a könyvelőhöz vezetnek.' }],
    itemHooks: [{ itemId: "watchSeal", role: "document", narrativeUse: 'Hivatalos nyomozási okirat.' }],
    relationshipFocus: ["lena", "cador"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "lena"],
    playerExperience: 'A hivatalos irat mögötti számok a könyvelőhöz vezetnek.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_21": {
    functionHooks: [{ npcId: "bran", functionId: "fn-bran", role: "core", label: "bran", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "rovan", functionId: "fn-rovan", role: "support", label: "fn-rovan", narrativeUse: 'A fogda emléke összekapcsolódik az őrségi üggyel.' }],
    itemHooks: [],
    relationshipFocus: ["bran", "rovan"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "bran"],
    playerExperience: 'A fogda emléke összekapcsolódik az őrségi üggyel.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_22": {
    functionHooks: [{ npcId: "orren", functionId: "fn-orren", role: "core", label: "orren", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "rovan", functionId: "fn-rovan", role: "support", label: "fn-rovan", narrativeUse: 'A járőrjelentés a hivatalos nyomozást erősíti.' }],
    itemHooks: [],
    relationshipFocus: ["orren", "rovan"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "orren"],
    playerExperience: 'A járőrjelentés a hivatalos nyomozást erősíti.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_23": {
    functionHooks: [{ npcId: "siven", functionId: "fn-siven", role: "core", label: "siven", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "eldra", functionId: "fn-eldra", role: "support", label: "fn-eldra", narrativeUse: 'A régi tárgy mágikus és történeti jellegét Eldra tudja értelmezni.' }],
    itemHooks: [{ itemId: "royalArchiveCopy", role: "clue", narrativeUse: 'A régi múlt egy későbbi archív tárgya.' }],
    relationshipFocus: ["siven", "eldra"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "siven"],
    playerExperience: 'A régi tárgy mágikus és történeti jellegét Eldra tudja értelmezni.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_outskirts_24": {
    functionHooks: [{ npcId: "maela", functionId: "fn-maela", role: "core", label: "maela", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "eldra", functionId: "fn-eldra", role: "support", label: "fn-eldra", narrativeUse: 'A kút nyoma a furcsa jelekhez vezet.' }],
    itemHooks: [],
    relationshipFocus: ["maela", "eldra"],
    memoryTags: ["main-quest", "outskirts", "npc-function", "maela"],
    playerExperience: 'A kút nyoma a furcsa jelekhez vezet.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_arena_01": {
    functionHooks: [{ npcId: "arenaSena", functionId: "fn-sena", role: "core", label: "sena", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "arenaInn", functionId: "fn-arenaInn", role: "support", label: "fn-arenaInn", narrativeUse: 'Az Aréna első napja a pihenés és regeneráció valódi szükségletét mutatja meg.' }],
    itemHooks: [],
    relationshipFocus: ["arenaSena", "arenaInn"],
    memoryTags: ["main-quest", "arena", "npc-function", "sena"],
    playerExperience: 'Az Aréna első napja a pihenés és regeneráció valódi szükségletét mutatja meg.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_arena_02": {
    functionHooks: [{ npcId: "arenaKorr", functionId: "fn-korr", role: "core", label: "korr", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "arenaSmith", functionId: "fn-arenaSmith", role: "support", label: "fn-arenaSmith", narrativeUse: 'A harci felszerelés állapota közvetlenül befolyásolja a teljesítményt.' }],
    itemHooks: [],
    relationshipFocus: ["arenaKorr", "arenaSmith"],
    memoryTags: ["main-quest", "arena", "npc-function", "korr"],
    playerExperience: 'A harci felszerelés állapota közvetlenül befolyásolja a teljesítményt.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_arena_03": {
    functionHooks: [{ npcId: "arenaVeya", functionId: "fn-veya", role: "core", label: "veya", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "arenaInn", functionId: "fn-arenaInn", role: "support", label: "fn-arenaInn", narrativeUse: 'A sérülés után a szállás és étel is a harci ciklus része.' }],
    itemHooks: [{ itemId: "arenaBandages", role: "tool", narrativeUse: 'Harci sérülés és regeneráció tárgya.' }],
    relationshipFocus: ["arenaVeya", "arenaInn"],
    memoryTags: ["main-quest", "arena", "npc-function", "veya"],
    playerExperience: 'A sérülés után a szállás és étel is a harci ciklus része.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_arena_04": {
    functionHooks: [{ npcId: "arenaBram", functionId: "fn-bram", role: "core", label: "bram", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "arenaSena", functionId: "fn-sena", role: "support", label: "fn-sena", narrativeUse: 'A nyilvános név előfeltétele az újabb kihívásnak.' }],
    itemHooks: [{ itemId: "crowdScrip", role: "evidence", narrativeUse: 'Közönséghez kötött eseménypénz.' }],
    relationshipFocus: ["arenaBram", "arenaSena"],
    memoryTags: ["main-quest", "arena", "npc-function", "bram"],
    playerExperience: 'A nyilvános név előfeltétele az újabb kihívásnak.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_arena_05": {
    functionHooks: [{ npcId: "arenaRusk", functionId: "fn-rusk", role: "core", label: "rusk", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "brenka", functionId: "fn-brenka", role: "support", label: "fn-brenka", narrativeUse: 'A külvárosi fogadóiroda pénzmozgása összeér a hivatalos oddsokkal.' }],
    itemHooks: [{ itemId: "matchLedger", role: "evidence", narrativeUse: 'A fogadási manipuláció könyve.' }],
    relationshipFocus: ["arenaRusk", "brenka"],
    memoryTags: ["main-quest", "arena", "npc-function", "rusk"],
    playerExperience: 'A külvárosi fogadóiroda pénzmozgása összeér a hivatalos oddsokkal.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_arena_06": {
    functionHooks: [{ npcId: "arenaTalia", functionId: "fn-talia", role: "core", label: "talia", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "arenaKorr", functionId: "fn-korr", role: "support", label: "fn-korr", narrativeUse: 'A képesség és felkészülés nélkül a kihívás ára magas.' }],
    itemHooks: [],
    relationshipFocus: ["arenaTalia", "arenaKorr"],
    memoryTags: ["main-quest", "arena", "npc-function", "talia"],
    playerExperience: 'A képesség és felkészülés nélkül a kihívás ára magas.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_arena_07": {
    functionHooks: [{ npcId: "arenaOlen", functionId: "fn-olen", role: "core", label: "olen", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "arenaSmith", functionId: "fn-arenaSmith", role: "support", label: "fn-arenaSmith", narrativeUse: 'A fegyverhangolás közben azonosítható a hamis jel.' }],
    itemHooks: [{ itemId: "watchLantern", role: "evidence", narrativeUse: 'Az arénai éjszakai jelzés.' }],
    relationshipFocus: ["arenaOlen", "arenaSmith"],
    memoryTags: ["main-quest", "arena", "npc-function", "olen"],
    playerExperience: 'A fegyverhangolás közben azonosítható a hamis jel.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_arena_08": {
    functionHooks: [{ npcId: "serin", functionId: "fn-serin", role: "core", label: "serin", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "arenaTalia", functionId: "fn-talia", role: "support", label: "fn-talia", narrativeUse: 'A bajnoki rang a későbbi társadalmi hozzáférés kulcsa.' }],
    itemHooks: [],
    relationshipFocus: ["serin", "arenaTalia"],
    memoryTags: ["main-quest", "arena", "npc-function", "serin"],
    playerExperience: 'A bajnoki rang a későbbi társadalmi hozzáférés kulcsa.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_market_01": {
    functionHooks: [{ npcId: "ilren", functionId: "fn-ilren", role: "core", label: "ilren", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "lyra", functionId: "fn-lyra", role: "support", label: "fn-lyra", narrativeUse: 'Az érme árfolyama megmutatja, hol mozog a fekete pénz.' }],
    itemHooks: [{ itemId: "merchantInk", role: "material", narrativeUse: 'Kereskedői nyilvántartásokhoz szükséges anyag.' }],
    relationshipFocus: ["ilren", "lyra"],
    memoryTags: ["main-quest", "market", "npc-function", "ilren"],
    playerExperience: 'Az érme árfolyama megmutatja, hol mozog a fekete pénz.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_market_02": {
    functionHooks: [{ npcId: "malk", functionId: "fn-malk", role: "core", label: "malk", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "fen", functionId: "fn-fen", role: "support", label: "fn-fen", narrativeUse: 'A karavánkockázat feltárja a hiányzó útvonal okát.' }],
    itemHooks: [{ itemId: "caravanCompass", role: "tool", narrativeUse: 'A karaván útvonalának eszköze.' }],
    relationshipFocus: ["malk", "fen"],
    memoryTags: ["main-quest", "market", "npc-function", "malk"],
    playerExperience: 'A karavánkockázat feltárja a hiányzó útvonal okát.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_market_03": {
    functionHooks: [{ npcId: "sera", functionId: "fn-sera", role: "core", label: "sera", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "cador", functionId: "fn-cador", role: "support", label: "fn-cador", narrativeUse: 'Az engedélyhez kapcsolódó számla később bizonyítékként szolgál.' }],
    itemHooks: [{ itemId: "guildPermit", role: "document", narrativeUse: 'A céhes hozzáférés igazolása.' }],
    relationshipFocus: ["sera", "cador"],
    memoryTags: ["main-quest", "market", "npc-function", "sera"],
    playerExperience: 'Az engedélyhez kapcsolódó számla később bizonyítékként szolgál.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_market_04": {
    functionHooks: [{ npcId: "oris", functionId: "fn-oris", role: "core", label: "oris", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "marwen", functionId: "fn-marwen", role: "support", label: "fn-marwen", narrativeUse: 'A pecsét hitelessége a fizikai raktárhoz kötött.' }],
    itemHooks: [{ itemId: "warehouseSeal", role: "evidence", narrativeUse: 'A raktárnyitás nyoma.' }],
    relationshipFocus: ["oris", "marwen"],
    memoryTags: ["main-quest", "market", "npc-function", "oris"],
    playerExperience: 'A pecsét hitelessége a fizikai raktárhoz kötött.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_market_05": {
    functionHooks: [{ npcId: "niven", functionId: "fn-niven", role: "core", label: "niven", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "ilren", functionId: "fn-ilren", role: "support", label: "fn-ilren", narrativeUse: 'A ritka áru kereskedelmi útvonala dokumentálható.' }],
    itemHooks: [{ itemId: "rareAmber", role: "tradeGood", narrativeUse: 'Eredet alapján azonosítható ritka áru.' }],
    relationshipFocus: ["niven", "ilren"],
    memoryTags: ["main-quest", "market", "npc-function", "niven"],
    playerExperience: 'A ritka áru kereskedelmi útvonala dokumentálható.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_market_06": {
    functionHooks: [{ npcId: "taris", functionId: "fn-taris", role: "core", label: "taris", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "cassian", functionId: "fn-cassian", role: "support", label: "fn-cassian", narrativeUse: 'Az alku mögötti fedezet banki információvá válik.' }],
    itemHooks: [],
    relationshipFocus: ["taris", "cassian"],
    memoryTags: ["main-quest", "market", "npc-function", "taris"],
    playerExperience: 'Az alku mögötti fedezet banki információvá válik.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_market_07": {
    functionHooks: [{ npcId: "cassian", functionId: "fn-cassian", role: "core", label: "cassian", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "livia", functionId: "fn-livia", role: "support", label: "fn-livia", narrativeUse: 'A tartozás átvezet a Belváros hitelvilágába.' }],
    itemHooks: [{ itemId: "promissoryNote", role: "document", narrativeUse: 'A tartozási lánc irata.' }],
    relationshipFocus: ["cassian", "livia"],
    memoryTags: ["main-quest", "market", "npc-function", "cassian"],
    playerExperience: 'A tartozás átvezet a Belváros hitelvilágába.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_market_08": {
    functionHooks: [{ npcId: "lyra", functionId: "fn-lyra", role: "core", label: "lyra", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "vera", functionId: "fn-vera", role: "support", label: "fn-vera", narrativeUse: 'A váltás története visszautal a Külváros pénzváltására.' }],
    itemHooks: [{ itemId: "blackCoinLedgerFragment", role: "evidence", narrativeUse: 'A fekete tranzakció lenyomata.' }],
    relationshipFocus: ["lyra", "vera"],
    memoryTags: ["main-quest", "market", "npc-function", "lyra"],
    playerExperience: 'A váltás története visszautal a Külváros pénzváltására.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_market_09": {
    functionHooks: [{ npcId: "fen", functionId: "fn-fen", role: "core", label: "fen", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "malk", functionId: "fn-malk", role: "support", label: "fn-malk", narrativeUse: 'A karavánút és az olcsó kockázat közös döntéssé válik.' }],
    itemHooks: [],
    relationshipFocus: ["fen", "malk"],
    memoryTags: ["main-quest", "market", "npc-function", "fen"],
    playerExperience: 'A karavánút és az olcsó kockázat közös döntéssé válik.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_market_10": {
    functionHooks: [{ npcId: "marwen", functionId: "fn-marwen", role: "core", label: "marwen", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "palaceOrven", functionId: "fn-orven", role: "support", label: "fn-orven", narrativeUse: 'A raktári pecsét már királyi vizsgálatot igényel.' }],
    itemHooks: [{ itemId: "warehouseSeal", role: "evidence", narrativeUse: 'A zárolási lánc kulcstárgya.' }],
    relationshipFocus: ["marwen", "palaceOrven"],
    memoryTags: ["main-quest", "market", "npc-function", "marwen"],
    playerExperience: 'A raktári pecsét már királyi vizsgálatot igényel.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_inner_01": {
    functionHooks: [{ npcId: "adrian", functionId: "fn-adrian", role: "core", label: "adrian", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "selene", functionId: "fn-selene", role: "support", label: "fn-selene", narrativeUse: 'A bemutatkozás után a társasági térképet egy szalonban kell olvasni.' }],
    itemHooks: [{ itemId: "patronInvitation", role: "document", narrativeUse: 'A társadalmi belépés tárgyi jele.' }],
    relationshipFocus: ["adrian", "selene"],
    memoryTags: ["main-quest", "inner", "npc-function", "adrian"],
    playerExperience: 'A bemutatkozás után a társasági térképet egy szalonban kell olvasni.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_inner_02": {
    functionHooks: [{ npcId: "selene", functionId: "fn-selene", role: "core", label: "selene", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "corvin", functionId: "fn-corvin", role: "support", label: "fn-corvin", narrativeUse: 'A hiányzó vendég a zárt klubok felé vezet.' }],
    itemHooks: [],
    relationshipFocus: ["selene", "corvin"],
    memoryTags: ["main-quest", "inner", "npc-function", "selene"],
    playerExperience: 'A hiányzó vendég a zárt klubok felé vezet.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_inner_03": {
    functionHooks: [{ npcId: "marcell", functionId: "fn-marcell", role: "core", label: "marcell", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "livia", functionId: "fn-livia", role: "support", label: "fn-livia", narrativeUse: 'A játékasztal vesztesége hitelkapcsolattá válik.' }],
    itemHooks: [{ itemId: "casinoChips", role: "tool", narrativeUse: 'A zárt játékasztal eszköze.' }],
    relationshipFocus: ["marcell", "livia"],
    memoryTags: ["main-quest", "inner", "npc-function", "marcell"],
    playerExperience: 'A játékasztal vesztesége hitelkapcsolattá válik.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_inner_04": {
    functionHooks: [{ npcId: "livia", functionId: "fn-livia", role: "core", label: "livia", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "cassian", functionId: "fn-cassian", role: "support", label: "fn-cassian", narrativeUse: 'A hitel mélyebb pénzügyi kapcsolatot tár fel.' }],
    itemHooks: [{ itemId: "promissoryNote", role: "document", narrativeUse: 'A hitel és tartozás nyoma.' }],
    relationshipFocus: ["livia", "cassian"],
    memoryTags: ["main-quest", "inner", "npc-function", "livia"],
    playerExperience: 'A hitel mélyebb pénzügyi kapcsolatot tár fel.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_inner_05": {
    functionHooks: [{ npcId: "octavia", functionId: "fn-octavia", role: "core", label: "octavia", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "niven", functionId: "fn-niven", role: "support", label: "fn-niven", narrativeUse: 'A ritka tárgy eredetét kereskedelmi adatokkal kell megérteni.' }],
    itemHooks: [{ itemId: "royalTransitPass", role: "document", narrativeUse: 'A ritka tárgy utazási lánca.' }],
    relationshipFocus: ["octavia", "niven"],
    memoryTags: ["main-quest", "inner", "npc-function", "octavia"],
    playerExperience: 'A ritka tárgy eredetét kereskedelmi adatokkal kell megérteni.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_inner_06": {
    functionHooks: [{ npcId: "corvin", functionId: "fn-corvin", role: "core", label: "corvin", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "selene", functionId: "fn-selene", role: "support", label: "fn-selene", narrativeUse: 'A klubinformáció társasági kapcsolattá válik.' }],
    itemHooks: [],
    relationshipFocus: ["corvin", "selene"],
    memoryTags: ["main-quest", "inner", "npc-function", "corvin"],
    playerExperience: 'A klubinformáció társasági kapcsolattá válik.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_inner_07": {
    functionHooks: [{ npcId: "violet", functionId: "fn-violet", role: "core", label: "violet", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "adrian", functionId: "fn-adrian", role: "support", label: "fn-adrian", narrativeUse: 'A csomag címzettje a megfelelő ember megtalálásához vezet.' }],
    itemHooks: [{ itemId: "sealedLetter", role: "evidence", narrativeUse: 'A szobában hagyott üzenet.' }],
    relationshipFocus: ["violet", "adrian"],
    memoryTags: ["main-quest", "inner", "npc-function", "violet"],
    playerExperience: 'A csomag címzettje a megfelelő ember megtalálásához vezet.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_palace_01": {
    functionHooks: [{ npcId: "palaceElian", functionId: "fn-elian", role: "core", label: "elian", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "palaceAster", functionId: "fn-aster", role: "support", label: "fn-aster", narrativeUse: 'Az audiencia belépése hivatalos jogosultsághoz kötődik.' }],
    itemHooks: [{ itemId: "courtInvitation", role: "document", narrativeUse: 'Az első hivatalos belépés jele.' }],
    relationshipFocus: ["palaceElian", "palaceAster"],
    memoryTags: ["main-quest", "palace", "npc-function", "elian"],
    playerExperience: 'Az audiencia belépése hivatalos jogosultsághoz kötődik.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_palace_02": {
    functionHooks: [{ npcId: "palaceMara", functionId: "fn-mara", role: "core", label: "mara", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "palaceElian", functionId: "fn-elian", role: "support", label: "fn-elian", narrativeUse: 'A diplomáciai kapcsolatot az udvari rend nyitja meg.' }],
    itemHooks: [{ itemId: "diplomaticToken", role: "document", narrativeUse: 'Diplomáciai kapcsolat tárgyi jele.' }],
    relationshipFocus: ["palaceMara", "palaceElian"],
    memoryTags: ["main-quest", "palace", "npc-function", "mara"],
    playerExperience: 'A diplomáciai kapcsolatot az udvari rend nyitja meg.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_palace_03": {
    functionHooks: [{ npcId: "palaceOrven", functionId: "fn-orven", role: "core", label: "orven", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "palaceYsra", functionId: "fn-ysra", role: "support", label: "fn-ysra", narrativeUse: 'A bizonyíték értelmezéséhez archívumi kutatás kell.' }],
    itemHooks: [{ itemId: "courtSealRing", role: "evidence", narrativeUse: 'A pecsétlánc bizonyítéka.' }],
    relationshipFocus: ["palaceOrven", "palaceYsra"],
    memoryTags: ["main-quest", "palace", "npc-function", "orven"],
    playerExperience: 'A bizonyíték értelmezéséhez archívumi kutatás kell.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_palace_04": {
    functionHooks: [{ npcId: "palaceAster", functionId: "fn-aster", role: "core", label: "aster", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "palaceSmith", functionId: "fn-palaceSmith", role: "support", label: "fn-palaceSmith", narrativeUse: 'A királyi fegyvertár hozzáférése biztonsági láncot jelez.' }],
    itemHooks: [{ itemId: "royalTransitPass", role: "document", narrativeUse: 'Lezárt udvari szárnyhoz kötött jogosultság.' }],
    relationshipFocus: ["palaceAster", "palaceSmith"],
    memoryTags: ["main-quest", "palace", "npc-function", "aster"],
    playerExperience: 'A királyi fegyvertár hozzáférése biztonsági láncot jelez.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_palace_05": {
    functionHooks: [{ npcId: "palaceYsra", functionId: "fn-ysra", role: "core", label: "ysra", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "palaceOrven", functionId: "fn-orven", role: "support", label: "fn-orven", narrativeUse: 'A hiányzó könyv bizonyítéklánccá válik.' }],
    itemHooks: [{ itemId: "blackArchiveIndex", role: "evidence", narrativeUse: 'Az eltűnt könyv archív indexe.' }],
    relationshipFocus: ["palaceYsra", "palaceOrven"],
    memoryTags: ["main-quest", "palace", "npc-function", "ysra"],
    playerExperience: 'A hiányzó könyv bizonyítéklánccá válik.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_harbor_01": {
    functionHooks: [{ npcId: "harborKael", functionId: "fn-kael", role: "core", label: "kael", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "harborDain", functionId: "fn-dain", role: "support", label: "fn-dain", narrativeUse: 'A hivatalos engedély mellé rakjegy kell, hogy a hajó története bizonyítható legyen.' }],
    itemHooks: [{ itemId: "blackCoinCargoTag", role: "evidence", narrativeUse: 'A Fekete Érme rakományjele.' }],
    relationshipFocus: ["harborKael", "harborDain"],
    memoryTags: ["main-quest", "harbor", "npc-function", "kael"],
    playerExperience: 'A hivatalos engedély mellé rakjegy kell, hogy a hajó története bizonyítható legyen.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_harbor_02": {
    functionHooks: [{ npcId: "harborDain", functionId: "fn-dain", role: "core", label: "dain", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "harborKael", functionId: "fn-kael", role: "support", label: "fn-kael", narrativeUse: 'A rakjegyek rendjét a kikötői hivatalos adatok hitelesítik.' }],
    itemHooks: [{ itemId: "sealedLetter", role: "document", narrativeUse: 'Rakjegyekhez tartozó írásos nyom.' }],
    relationshipFocus: ["harborDain", "harborKael"],
    memoryTags: ["main-quest", "harbor", "npc-function", "dain"],
    playerExperience: 'A rakjegyek rendjét a kikötői hivatalos adatok hitelesítik.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_harbor_03": {
    functionHooks: [{ npcId: "harborJoren", functionId: "fn-joren", role: "core", label: "joren", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "harborSmith", functionId: "fn-harborSmith", role: "support", label: "fn-harborSmith", narrativeUse: 'A fémes áru eredete a rakparti műhelyhez vezet.' }],
    itemHooks: [{ itemId: "blackSalt", role: "tradeGood", narrativeUse: 'A kikötői eredet jele.' }],
    relationshipFocus: ["harborJoren", "harborSmith"],
    memoryTags: ["main-quest", "harbor", "npc-function", "joren"],
    playerExperience: 'A fémes áru eredete a rakparti műhelyhez vezet.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_harbor_04": {
    functionHooks: [{ npcId: "harborTessa", functionId: "fn-tessa", role: "core", label: "tessa", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "harborInn", functionId: "fn-harborInn", role: "support", label: "fn-harborInn", narrativeUse: 'A tisztességes tengerészélethez pihenés és ellátás kell.' }],
    itemHooks: [{ itemId: "sailcloth", role: "material", narrativeUse: 'A tengerészeti élet alapanyaga.' }],
    relationshipFocus: ["harborTessa", "harborInn"],
    memoryTags: ["main-quest", "harbor", "npc-function", "tessa"],
    playerExperience: 'A tisztességes tengerészélethez pihenés és ellátás kell.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_harbor_05": {
    functionHooks: [{ npcId: "harborSable", functionId: "fn-sable", role: "core", label: "sable", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "harborMira", functionId: "fn-mira", role: "support", label: "fn-mira", narrativeUse: 'A szabad út határán a csempészútvonal kísértése jelenik meg.' }],
    itemHooks: [{ itemId: "navigatorChart", role: "tool", narrativeUse: 'Független hajóúthoz szükséges útmutató.' }],
    relationshipFocus: ["harborSable", "harborMira"],
    memoryTags: ["main-quest", "harbor", "npc-function", "sable"],
    playerExperience: 'A szabad út határán a csempészútvonal kísértése jelenik meg.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
  "main_harbor_06": {
    functionHooks: [{ npcId: "harborMira", functionId: "fn-mira", role: "core", label: "mira", narrativeUse: "A fő küldetés ezt a karakterfunkciót használja valódi történeti cselekvési pontként." }, { npcId: "harborKael", functionId: "fn-kael", role: "support", label: "fn-kael", narrativeUse: 'A fekete rakomány hivatalos ellenőrzési ponttal zárul.' }],
    itemHooks: [{ itemId: "blackCoin", role: "evidence", narrativeUse: 'A fő történeti tárgy.' }],
    relationshipFocus: ["harborMira", "harborKael"],
    memoryTags: ["main-quest", "harbor", "npc-function", "mira"],
    playerExperience: 'A fekete rakomány hivatalos ellenőrzési ponttal zárul.',
    consequenceThread: 'A lezárt döntés későbbi kapcsolatot, világemlékezetet és következő nyomot hoz létre.',
    nextThread: 'A következő csomópont egy új NPC-funkción keresztül folytatja a történetet.'
  },
};