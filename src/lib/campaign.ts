import { NPCS, QUESTS } from "./content";
import type { NpcId, RegionId, QuestStatus } from "./types";

export type CampaignStateLike = {
  gold: number;
  questStatus: Record<string, QuestStatus>;
  reputationParts: { achievements:number; decisions:number; relationships:number; economic:number; growth:number; activity:number };
  relationships: Record<string, number>;
  identity: { affinities: { combat:number; shadow:number; social:number; trade:number; lore:number } };
};

type GateRule = {
  minReputation: number;
  minGold: number;
  allOf?: GateCondition[];
  anyOf?: GateCondition[];
  alternatives?: GateCondition[][];
};

type GateCondition =
  | { kind:"chapterProgress"; chapter:number; ratio:number }
  | { kind:"chapterComplete"; chapter:number }
  | { kind:"relationship"; region:RegionId; amount:number }
  | { kind:"affinity"; key:keyof CampaignStateLike["identity"]["affinities"]; amount:number };

export const CAMPAIGN_REGION_GATES: Record<RegionId, GateRule | null> = {
  outskirts: null,
  arena: {
    minReputation: 8,
    minGold: 30,
    allOf: [{ kind:"chapterProgress", chapter:1, ratio:0.75 }],
    anyOf: [{ kind:"affinity", key:"combat", amount:12 }, { kind:"chapterProgress", chapter:1, ratio:0.75 }],
  },
  market: {
    minReputation: 10,
    minGold: 120,
    allOf: [{ kind:"chapterProgress", chapter:1, ratio:0.50 }],
    anyOf: [{ kind:"affinity", key:"trade", amount:10 }, { kind:"chapterProgress", chapter:1, ratio:0.60 }],
  },
  inner: {
    minReputation: 18,
    minGold: 750,
    alternatives: [
      [{ kind:"chapterComplete", chapter:2 }, { kind:"relationship", region:"arena", amount:18 }],
      [{ kind:"chapterComplete", chapter:3 }, { kind:"relationship", region:"market", amount:18 }],
    ],
  },
  palace: {
    minReputation: 35,
    minGold: 2500,
    allOf: [
      { kind:"chapterComplete", chapter:4 },
      { kind:"relationship", region:"inner", amount:22 },
    ],
  },
  harbor: {
    minReputation: 15,
    minGold: 100,
    anyOf: [
      { kind:"chapterProgress", chapter:3, ratio:0.80 },
      { kind:"chapterProgress", chapter:4, ratio:0.50 },
      { kind:"chapterComplete", chapter:5 },
    ],
  },
  forest: {
    minReputation: Number.MAX_SAFE_INTEGER,
    minGold: Number.MAX_SAFE_INTEGER,
  },
};

export function chapterQuests(chapter:number) {
  return QUESTS.filter(q=>q.chapter===chapter).sort((a,b)=>a.sequence-b.sequence);
}

export function chapterCompletedCount(state:CampaignStateLike, chapter:number) {
  const qs=chapterQuests(chapter);
  return qs.filter(q=>state.questStatus[q.id]==="completed").length;
}

export function chapterProgress(state:CampaignStateLike, chapter:number) {
  const qs=chapterQuests(chapter);
  return qs.length ? chapterCompletedCount(state,chapter)/qs.length : 0;
}

export function chapterIsMastered(state:CampaignStateLike, chapter:number) {
  return chapterProgress(state,chapter)>=0.95;
}

function relationshipInRegion(state:CampaignStateLike, region:RegionId) {
  const regionNpcIds=NPCS.filter(n=>n.region===region).map(n=>n.id);
  return Math.max(0,...regionNpcIds.map(id=>state.relationships[id]??0));
}

function conditionMet(state:CampaignStateLike, condition:GateCondition) {
  if (condition.kind==="chapterProgress") return chapterProgress(state,condition.chapter)>=condition.ratio;
  if (condition.kind==="chapterComplete") return chapterCompletedCount(state,condition.chapter)===chapterQuests(condition.chapter).length;
  if (condition.kind==="relationship") return relationshipInRegion(state,condition.region)>=condition.amount;
  return (state.identity.affinities[condition.key]??0)>=condition.amount;
}

export function regionGateStatus(state:CampaignStateLike, region:RegionId) {
  if (region==="outskirts") return { unlocked:true, reason:"A Külváros a történet kezdőpontja.", gate:CAMPAIGN_REGION_GATES[region] };
  if (region==="forest") return { unlocked:false, reason:"A második szezon története még nem nyitotta meg ezt a területet.", gate:CAMPAIGN_REGION_GATES[region] };
  const gate=CAMPAIGN_REGION_GATES[region];
  if (!gate) return { unlocked:true, reason:"A történet elérhetővé tette ezt a régiót.", gate };
  const rep=state.reputationParts.achievements*0.3 + state.reputationParts.decisions*0.25 + state.reputationParts.relationships*0.2 + state.reputationParts.economic*0.15 + state.reputationParts.growth*0.1;
  const reputation=Math.max(0,Math.round(rep*10 + state.reputationParts.activity*2));
  const all=(gate.allOf??[]).every(c=>conditionMet(state,c));
  const any=(gate.anyOf??[]).length===0 || (gate.anyOf??[]).some(c=>conditionMet(state,c));
  const alternatives=(gate.alternatives??[]);
  const alternativeMet=alternatives.length===0 || alternatives.some(group=>group.every(c=>conditionMet(state,c)));
  const unlocked=reputation>=gate.minReputation && state.gold>=gate.minGold && all && any && alternativeMet;
  if(unlocked) return { unlocked:true, reason:"A történet és a lehetőségeid megnyitották ezt a régiót.", gate };
  const reasons:string[]=[];
  if(reputation<gate.minReputation) reasons.push("Még nincs meg az a hírnév, amely miatt itt komolyan vennének.");
  if(state.gold<gate.minGold) reasons.push("A belépés és az élet költsége jelenleg meghaladja a rendelkezésedre álló vagyont.");
  const failedAll=(gate.allOf??[]).filter(c=>!conditionMet(state,c));
  for(const c of failedAll) reasons.push(describeConditionNarrative(c));
  if(!any) reasons.push("Még nem teljesítettél egyetlen hiteles utat sem, amely megnyitná ezt a régiót.");
  if(!alternativeMet) reasons.push("Egy történeti vagy kapcsolati út még hiányzik ahhoz, hogy ide tartozónak tekintsenek.");
  return { unlocked:false, reason:reasons.join(" · "), gate };
}

function describeConditionNarrative(c:GateCondition) {
  if(c.kind==="chapterProgress") return `A történet még nem jutott el a megfelelő pontra a(z) ${chapterName(c.chapter)} fejezetben.`;
  if(c.kind==="chapterComplete") return `A(z) ${chapterName(c.chapter)} fejezet teljes történeti íve még nincs lezárva.`;
  if(c.kind==="relationship") return `Még nincs elég erős kapcsolatod a(z) ${regionName(c.region)} embereivel.`;
  const labels:{combat:string;shadow:string;social:string;trade:string;lore:string}={combat:"harci",shadow:"árnyékból dolgozó",social:"társasági",trade:"kereskedői",lore:"tudásalapú"};
  return `Még nem bizonyítottad eléggé a(z) ${labels[c.key]} rátermettségedet.`;
}
function describeCondition(c:GateCondition) {
  if(c.kind==="chapterProgress") return `${chapterName(c.chapter)} legalább ${Math.round(c.ratio*100)}%`;
  if(c.kind==="chapterComplete") return `${chapterName(c.chapter)} lezárása`;
  if(c.kind==="relationship") return `${regionName(c.region)} kapcsolata legalább ${c.amount}`;
  const labels:{combat:string;shadow:string;social:string;trade:string;lore:string}={combat:"Harc",shadow:"Árnyék",social:"Társas",trade:"Kereskedelem",lore:"Tudás"};
  return `${labels[c.key]} affinitás ${c.amount}`;
}

function chapterName(chapter:number) {
  return ({1:"A lehetőség ára",2:"A fogadások árnya",3:"A mérleg nyelve",4:"A fény ára",5:"A korona vizsgálata",6:"A Fekete Érme tengeri útja"} as Record<number,string>)[chapter] ?? `Főfejezet ${chapter}`;
}
function regionName(region:RegionId) {
  return ({outskirts:"Külváros",arena:"Aréna",market:"Kereskedelmi Központ",inner:"Belváros",palace:"Királyi Palota",harbor:"Kikötő",forest:"Zárt Erdő"} as Record<RegionId,string>)[region];
}

export function deriveRegionAccess(state:CampaignStateLike & { regionAccess?: Partial<Record<RegionId,boolean>> }) {
  const access={} as Record<RegionId,boolean>;
  (Object.keys(CAMPAIGN_REGION_GATES) as RegionId[]).forEach(region=>{
    const previouslyUnlocked=Boolean(state.regionAccess?.[region]);
    access[region]=previouslyUnlocked || regionGateStatus(state,region).unlocked;
  });
  access.outskirts=true;
  access.forest=false;
  return access;
}

export const REGIONAL_AUDIT = [
  { chapter:1, region:"outskirts", total:24, mastery:95, next:["arena","market"] },
  { chapter:2, region:"arena", total:8, mastery:95, next:["inner"] },
  { chapter:3, region:"market", total:10, mastery:95, next:["inner","harbor"] },
  { chapter:4, region:"inner", total:7, mastery:95, next:["palace","harbor"] },
  { chapter:5, region:"palace", total:5, mastery:95, next:["harbor"] },
  { chapter:6, region:"harbor", total:6, mastery:95, next:[] },
] as const;
