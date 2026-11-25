import type { QuestDefinition, QuestChoice, QuestRequirement, StatId } from "./types";

const choice = (id:string,label:string,text:string,stat:StatId,requirement:number,relationNpc:string,gold:number,xp:number,tag:string):QuestChoice => ({
  id,label,text,stat,requirement,gold,xp,
  reputation:{achievements:5,decisions:4,relationships:3,economic:2,growth:2},
  relation:{npc:relationNpc as any,amount:7}, consequenceTag:tag
});

const req=(label:string,itemId?:string,count?:number,extra?:Partial<QuestRequirement>):QuestRequirement=>({label,itemId,count,...extra});

export const MAIN_QUEST_DESIGN: Record<string,{requirements?:QuestRequirement[];dramaturgy:{hook:string;twist:string;reveal:string;consequence:string;failForward:string};choices:QuestChoice[]}> = {
  main_outskirts_04:{
    requirements:[req("20 Műhelyvas", "workshopIron", 20, {consume:true})],
    dramaturgy:{
      hook:"Borin üres anyagpolcai mögött nem csak hiány van: valaki rendszeresen félrerakja a jobb vasat.",
      twist:"A hiányzó vas egyik részét ugyanaz a közvetítő mozgatja, akiről Damar korábban hallgatott.",
      reveal:"A 20 vasból 6 darabon idegen mesterjel bukkan elő, és Borin felismeri a jelet egy régi megrendelésről.",
      consequence:"Borin hálás lesz, de az számít majd, honnan szerezted az anyagot.",
      failForward:"Ha nem tiszta forrásból jön az anyag, a küldetés akkor is lezárható, de később egy műhelykapcsolat bizalma sérülhet."
    },
    choices:[
      choice("m04_c1","Tisztán, nyíltan adom át","Elmondod Borinnak, kitől szerezted és mennyit fizettél érte. A műhely emlékezni fog a tiszta útra.","speech",7,"garran",48,62,"clean-source"),
      choice("m04_c2","Hallgatok a forrásról","A vasat leteszed az asztalra, a történetet megtartod magadnak. Borin az eredménynek örül, a Szem a hallgatásnak emlékét őrzi.","deception",7,"garran",54,66,"silent-source"),
      choice("m04_c3","Megmondom, mit kellett ezért elveszítenem","A szerzés történetét is átadod. Borin megérti az árát, és nem csak az anyagot látja benned.","empathy",6,"garran",44,70,"shared-cost"),
      choice("m04_c4","Előbb megmutatom Borinnak a hibás darabokat","Hat vasdarabot külön teszel, és bizonyítani próbálod, hogy az anyag egy része visszafejthető egy régi megrendeléshez.","investigation",8,"garran",52,76,"trace-source"),
      choice("m04_c5","A vasért cserébe egy szívességet kérek","Nem pénzt kérsz érte. Borinnak most először kell kimondania, hogy később ő tartozik majd neked.","bargaining",8,"garran",36,82,"future-debt")
    ]
  }
};

const regionFlavor:Record<string,{stat:StatId;alt:StatId;third:StatId}>={
  outskirts:{stat:"investigation",alt:"speech",third:"stealth"}, arena:{stat:"weaponMastery",alt:"perception",third:"willpower"}, market:{stat:"trade",alt:"bargaining",third:"logistics"}, inner:{stat:"charisma",alt:"speech",third:"deception"}, palace:{stat:"politics",alt:"investigation",third:"empathy"}, harbor:{stat:"navigation",alt:"survival",third:"deception"}
};

const DRAMA:Record<string,string[][]>={
  outskirts:[
    ["Miri három nevet ad, de egyik sem egyezik a kapuőr naplójával.","A közös név egy olyan emberhez kötődik, akit mindenki másképp nevez.","A hiányzó név valójában egy szerepkört takar.","A következő lépésnél már nem lesz mindegy, kinek hiszel.","A téves azonosítás sem zsákutca: rossz embert kérdezel meg, de jó helyre irányít."],
    ["Rovan hivatalos bélyegzője többet ér, mint egy szemtanú szava.","A jelentőteremben egy régi bejegyzést valaki frissen másolt át.","A fekete viasz nem a város egyik műhelyéből származik.","A rend ezután téged is számon tart.","Ha a bizonyíték hibás, Rovan ugyan nem zárja le az ügyet, de más nyomot kapsz."],
    ["Damar szerint a hiányzó kulcs nem eltűnt, hanem gazdát cserélt.","A raktárban két ember emlékszik ugyanarra az estére, de mást mesélnek.","A kulcs utolsó használata egy nem hivatalos szállításra vezethető vissza.","A Damarhoz fűződő viszonyod ettől kezdve a forrásodra is reagál.","Ha nem találod a kulcsot, egy másik raktár nyitja meg ugyanazt a nyomot."],
  ],
  arena:[
    ["A ringben valaki túl pontosan ismeri az ellenfelek gyenge pontjait.","A mérkőzések előtt ugyanaz a jel tűnik fel a fogadási lapokon.","A manipuláció nem egyetlen emberhez kötődik.","A következő kihívó már tudni fogja, mit tettél itt.","A rossz bizonyíték új ellenfelet hoz, de a történet továbbmegy."],
    ["Korr repedt markolata nem véletlenül törött el.","A hibás fegyverek ugyanabból a műhelyláncból érkeznek.","Valaki nyer a rossz minőségen.","A harci világban a felszerelésről alkotott véleményed is hír lesz.","Ha nincs bizonyítékod, egy próbamérkőzésen kell visszaszerezned a hitelt."],
  ],
  market:[
    ["Ilren könyvei között ugyanaz a tinta bukkan fel három különböző ügyletben.","A fekete szegély nem könyvelési stílus, hanem jelölés.","Valaki tudatosan ugyanazokat a tranzakciókat rejti el.","Az információ értékét ezután mások is mérni kezdik.","Ha a minta nem áll össze, egy negyedik könyv nyitja meg a következő nyomot."],
    ["Malk karavánja nem egyszerűen elkésett: valaki útvonalat cserélt.","A hibás jegyen egy másik város neve szerepel.","A szállítási hálózatnak van egy vakfoltja.","A későbbi utazásaidnál ez a vakfolt ismét előkerülhet.","Ha nem találod meg a jegyet, a karaván egyik embere tanúskodik helyette."],
  ],
  inner:[
    ["Adrian egy nevet mond, de a meghívón egy másik szerepel.","A társasági rang mögött rejtett szabály működik.","A belépő nem tárgy, hanem kapcsolat.","Aki itt beenged, később is emlékezni fog rád.","Ha elveszíted a belépőt, egy drágább út marad."],
    ["Selene vendéglistája egy hiányzó ember köré épül.","A törlés időpontja fontosabb, mint a név.","Valaki azt akarta, hogy a hiány láthatatlan maradjon.","A szalonokban a hiányzó emberek is történetté válnak.","Ha nem kapod meg a listát, egy pletyka ugyanoda vezet."],
  ],
  palace:[
    ["Elian nem a bizonyítékot nézi először, hanem azt, hogy ki küldött vele.","A meghallgatásra már más is készült.","A Palota nem üres lapot kap, amikor megjelensz.","A hivatalos út innentől következményekkel jár.","Ha elutasítanak, az archívum egy mellékbejáratot enged meg."],
    ["Mara két küldöttség kérdésében ugyanazt az egy hajóutat hallja ki.","Az érdekek ütköznek, de a fekete jel közös.","A válság már túlmutat a városon.","A Kikötő innentől politikai helyszínné válik számodra.","Ha nem tudod összerakni a diplomáciai képet, Mara egy próbát ad más úton."],
  ],
  harbor:[
    ["Kael egy rakjegyet úgy tart a fény felé, mintha nem a papír lenne a bizonyíték.","A hajó jelét a Palota egyik dokumentuma is ismeri.","A Fekete Érme tengeri útja először válik bizonyíthatóvá.","A kikötőben már nem csak városi emberek figyelnek rád.","Ha a hajót nem azonosítod, a rakodók ugyanazt a jelet mutatják meg máson."],
    ["Dain szerint a papír sorrendje a hazugság legolcsóbb formája.","Három hajó közül egyik sem ott járt, ahol a könyv szerint kellett volna.","A hamis útvonal valaki számára életbevágóan fontos.","A következő hajóutat már ennek tudatában kell nézned.","Ha rosszul rendezed az adatokat, egy ember kerül elő, aki ismeri az igaz sorrendet."],
  ]
};
const uniqueBeats:Record<string,string[]>= {
  outskirts:["A kapuőr emlékszik a csomagod súlyára.","A kovács a vas színéből felismeri a forrását.","A fogadóban egy félmondat fontosabb, mint egy vallomás.","A piac megváltoztatja ugyanazt a történetet minden ember szájában.","A műhelyek között terjed a hír, hogy valaki kérdéseket tesz fel.","Egy tanonc többet látott, mint amennyit el mer mondani."],
  arena:["A közönség nem felejt el egy rossz mozdulatot.","A fogadóirodákban egy szám többet ér, mint egy szemtanú.","A kovács felismeri, ha egy fegyver túl könnyűnek tűnik.","A gyógyító tudja, ki sérült meg tegnap éjszaka.","A bajnokok egymás között mást beszélnek, mint a nézők előtt."],
  market:["Egy könyvelő ugyanazt a hibát másképp nevezi, mint egy kereskedő.","A raktárpecsét a papírnál nehezebben hazudik.","A karavánosok nem kérdeznek feleslegesen.","A bankár nem az összeget jegyzi meg, hanem a nevet.","A céhben minden szívességnek két ára van."],
  inner:["Egy pohár bor mellett több igazság hangzik el, mint egy tárgyalóasztalnál.","A klubajtó mögött a pénz szerepét a név veszi át.","A hitel nem csak arany, hanem jövő.","A mecénás nem ugyanazt keresi, mint a gyűjtő.","A vendéglátó többet tud a távozókról, mint az érkezőkről."],
  palace:["A pecsétek sorrendje néha fontosabb, mint a pecsét önmagában.","Az udvarban a késés is üzenet.","A levéltárosok olyan hiányokat őriznek, amelyeket senki sem akar kimondani.","Az őrségnek a szándék is bizonyíték.","A diplomata kérdése néha veszélyesebb, mint egy vád."],
  harbor:["A dagály elvisz egy nyomot, de hoz helyette egy másikat.","A rakjegy csak akkor igaz, ha a hajó is ott volt.","A halászok a kikötő másik emlékezetét őrzik.","A tengerész döntéseit nem csak a pénz méri.","A csempész ugyanazt az útvonalat ismeri, csak más néven."],
};

function fallbackDesign(q:QuestDefinition){
  const f=regionFlavor[q.region]||regionFlavor.outskirts;
  const n=q.sequence;
  const drama=DRAMA[q.region] ?? DRAMA.outskirts;
  const pair=drama[(n-1)%drama.length];
  const beats=uniqueBeats[q.region]||uniqueBeats.outskirts;
  const hook=pair[0]+" "+(beats[(n-1)%beats.length]||"");
  const twist=pair[1]; const reveal=`${pair[2]} ${q.story}`; const consequence=pair[3] + " " + (q.consequence??""); const failForward=pair[4];
  const modeSets:Record<string,string[][]>={
    outskirts:[["Kérdezek és visszaellenőrzöm","A bizonyítékot több forrásból ütközteted.",f.stat],["A helyi emberre bízom","Egy kapcsolatot használsz, nem pénzt.",f.alt],["Megveszem a gyors utat","Pénzt áldozol, hogy gyorsabban juss információhoz.","trade"],["Kockáztatok","A veszélyesebb utat választod, amely kevesebb nyomot hagy.",f.third],["A helyszínen oldom meg","A helyet és a tárgyakat vizsgálod meg közvetlenül.","perception"]],
    arena:[["Edzéssel bizonyítok","A testedet teszed próbára, mielőtt beszélsz.","weaponMastery"],["Figyelek a részletekre","Az oddsokból és sérülésekből olvasol.","perception"],["Fogadással tesztelem","Pénzt és hírnevet teszel kockára.","willpower"],["Kihívom az érintettet","Nyíltan vállalod a konfliktust.","strength"],["A fegyveren keresem az igazat","A felszerelésen végzett vizsgálat dönt.","smithing"]],
    market:[["Auditot vezetek","A számok közti eltérést keresed.","trade"],["Alkut kötök","A másik fél érdekét használod fel.","bargaining"],["Útvonalat követek","Az árumozgásból olvasol.","logistics"],["Megveszem az információt","Pénzzel rövidíted le az utat.","appraisal"],["Nyíltan vádolok","Kockára teszed a kereskedői hírneved.","speech"]],
    inner:[["Megnyerem a termet","Társasági jelenléttel szerzel helyet.","charisma"],["Kérdezek a gyenge pontról","Egyetlen emberből próbálsz többet kihozni.","speech"],["Játszom a pénzzel","A szerencsével teszteled a rendszert.","willpower"],["A tartozást használom","Adósságon keresztül nyitsz ajtót.","deception"],["A távolmaradást választom","Megfigyelsz, amíg mások elkövetik a hibát.","perception"]],
    palace:[["Hivatalos úton kérek","A szabályokat a saját oldalukon használod.","politics"],["Bizonyítékot teszek le","A tárgyat beszélteted a helyedben.","investigation"],["Szövetségest keresek","Egy ember oldalán lépsz közelebb.","empathy"],["Kockára teszem a nevem","Nyíltan vállalod a gyanút.","willpower"],["Megkerülöm az ajtót","A szabályok hézagát használod.","deception"]],
    harbor:[["Vámnál kezdem","Papírral és rakjeggyel indulsz.","navigation"],["A legénységet kérdezem","A tenger embereiből olvasol.","survival"],["A rakományt követem","Anyag és súly vezet.","investigation"],["Csempészutat választok","Gyorsabb, veszélyesebb és sötétebb út.","deception"],["Hajóra szállok","Nem nyomot követsz: belépsz a következő fejezetbe.","navigation"]]
  };
  const modes=modeSets[q.region]||modeSets.outskirts;
  const choices=modes.map((m,i)=>choice(`${q.id}_r${i+1}`,m[0],m[1],m[2] as StatId,7+Math.floor(n/6)+(i===3?1:0),q.giver,28+i*8,44+i*9,["verify","relation","economy","risk","direct"][i]));
  return {dramaturgy:{hook,twist,reveal,consequence,failForward},choices};
}

export type QuestDesignResult = { requirements?: QuestRequirement[]; dramaturgy:{hook:string;twist:string;reveal:string;consequence:string;failForward:string}; choices:QuestChoice[] };

export function designQuest(q:QuestDefinition): QuestDesignResult{
  return MAIN_QUEST_DESIGN[q.id] ?? fallbackDesign(q);
}
