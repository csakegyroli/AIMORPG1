# Műhelynegyed — Velka (velka)
## NPC munkacsomag — alpha.26 specifikáció

**Baseline:** main · AIMORPG v2.0.0-alpha.26 · commit 894e9606fa84f5d609d810152e326b1cfae09b18  
**Branch:** workshop/phase-1-npc-specification  
**Státusz:** **SPECIFICATION COMPLETE — UNIQUE SERVICE DESIGN BLOCKED BY OVERLAP / CENTRAL DECISIONS**  
**Mód:** SPECIFICATION ONLY. Forráskódot ez a munkacsomag nem módosít.

## 1. Canon és karakterazonosság — VERIFIED

- ID: velka; név: Velka; szerep: Páncélkovács.
- Hely: Velka Páncélműhelye, Műhelynegyed; nyitvatartás 08:00–18:00.
- NPC service: „Páncéljavítás, védelmi felszerelés”.
- Saját műhelyt akar, mert katonai beszállító családjában a megrendelés fontosabb volt a viselő embernél. Tartós páncélt akar elérhetővé tenni azoknak is, akik nem tudnak vagyonokat fizetni. A hibás beszállítói fémbetétek forrását ismeri.
- A karakter központi témája a páncél minősége, a gyártói felelősség és az, hogy a viselő túlélje a rossz döntéseket.

**Forrás:** src/lib/content.ts:316, 413, 464, 501.

## 2. Alpha.26 forráshelyek

| Forrás | Hely | Bizonyított tény |
|---|---:|---|
| NPC-definíció | src/lib/content.ts:316 | Páncélkovács, saját műhely, 08–18 |
| Műhelynegyed Canon | src/lib/content.ts:413 | district identity és NPC-lista |
| Funkció | src/lib/content.ts:464 | fn-velka, kind: forge; páncél szétszerelés/újraillesztés és védelmi felszerelés craft |
| NPC-történet | src/lib/content.ts:501 | beszállítói család, minőség, hibás fémbetét |
| Fő küldetés | src/lib/mainStory.ts:27 | main_outskirts_06, 3 Bőrviasz, Velka vizsgálata |
| Item/recipe | src/lib/itemSystem.ts:113-147 | Velka ugyanazt a regionális helper-t használja |
| Runtime | src/lib/store.ts:568-590, 643-652 | a forge és leatherwork közös handler |
| UI | src/components/GameClient.tsx:760-798 | a forge UI közös; a panel NPC-re nem szűri a terméktípust |
| Kapcsolat/állapot | src/lib/simulation.ts:60-65, 134-170 | közös relationship facet és NPC runtime |

## 3. Meglévő runtime — IMPLEMENTED / ÁTFEDÉS

Velka fn-velka funkciója kind: forge. A store case forge ágában pontosan ugyanaz a craft/dismantle kód fut, mint Borinnál. A handler a npc.id alapján nem választ külön recipe-t, nem korlátozza a slotot páncélra, és nem használ külön javítási állapotot.

A UI a forge típusú funkcióhoz ugyanazt a terméklistát, receptelőnézetet és szétszerelést adja. A forgeCraftables lista a régióhoz/sethez tartozó, közönséges rarity-jű, slotos tárgyakat szűri; nem Velka-specifikus páncéllistát állít elő.

**Következtetés:** Velka Canonban önálló páncélkovács, de alpha.26 runtime-ban nem önálló páncélmechanika. A leírásban szereplő „újraillesztés” és „páncéljavítás” nincs alátámasztva durability/condition runtime-mal.

## 4. Önálló játékosérték — két alternatíva, nem eldöntött

**A opció — páncél-specialista műhely**
- Velka páncélokkal és védelmi felszereléssel foglalkozik.
- Borin a fegyver/kovács főszerepét viszi.
- Közös item/recipe/transaction szerződés marad; a specializáció csak a megjelenített katalógus és jogosultság központilag jóváhagyott szűrése.
- Nem adhat új statot, új itemet vagy lokális rarity-t.

**B opció — minőségellenőrző és beszállítói vizsgálóműhely**
- Velka fő játékosértéke a páncélhibák felismerése, anyag- és beszállítói eredet összevetése.
- A fő küldetésben létező vizsgálati tematika folytatható kizárólag opcionális, új side-content formájában; a védett fő küldetés nem bővíthető és nem módosítható.
- A vizsgálat nem állíthat item durability-t, nem javíthat itemet, és nem hozhat létre új bizonyíték/item ID-t központi jóváhagyás nélkül.

**Javaslat:** az A opció biztosítja a Canon szerinti önálló páncélkovács-szerepet a legkevesebb új globális függőséggel. A B opció narratív megkülönböztető rétegként kiegészítheti, de a két opció együtt csak projektgazdai jóváhagyással fogadható el. Egyik sem implementációs engedély.

## 5. Teljes játékmeneti ciklus

**Jelenlegi ciklus:** megkeresés → NPC jelenlét/régió ellenőrzés → általános forge UI → item kiválasztás → regionális recept előnézet → craft vagy dismantle → journal/reputation/activity hatás.

**A opció tervezési ciklusa (PROPOSAL):**
1. Velka megkeresése a 08–18 időablakban.
2. Védelmi felszerelés katalógus megnyitása.
3. Item kiválasztása, slot/rarity/stats megtekintése.
4. Közös recipe és inputmennyiség előnézete.
5. Inputok és inventory-kapacitás ellenőrzése.
6. Kifejezett megerősítés.
7. A közös craft tranzakció végrehajtása, egy item instance outputtal.
8. Eredmény és input/output lista.
9. Kilépés vagy újabb rendelés.

**B opció tervezési ciklusa (PROPOSAL):**
1. Páncélt vagy beszállítói tételt választ a játékos.
2. Velka megmutatja az ellenőrizhető adatokat, amelyek a Canonban és katalógusban ténylegesen léteznek.
3. A játékos stat- és beszélgetési megközelítést választ.
4. Meglévő közös quest/side-quest resolver oldja fel az eredményt.
5. Az eredmény kizárólag jóváhagyott narratív/memória/kapcsolati hatás.
6. Nincs tartósság, javítás vagy új item, amíg a közös adatmodell nincs jóváhagyva.

## 6. Döntések és alternatívák

- Páncél craft / dismantle a jelenlegi közös szolgáltatásban.
- A páncél specialista UI-szűrés és azonos recipe helper használata.
- Opcionális minőségvizsgálat narratív megoldása.
- Repair funkció elhalasztása durability döntésig.
- Nem elérhető NPC esetén várakozás másik in-game időpontra vagy másik szolgáltató keresése; az elérhetőséget a runtime óra és NPC státusz szabályozza.

## 7. Előfeltételek, itemek, statok, jogosultságok

- NPC: velka, régió outskirts, kerület workshops.
- Jelenlét: 08:00–18:00.
- Slotok közül a páncél elsődleges célja armor; a shield védelmi felszerelésként való besorolása külön döntést igényel.
- Külvárosi generic recipe: workshopIron + tannersWax; armor recipe 5 Műhelyvas + 2 Bőrviasz.
- A helper nem követel smithing, defense vagy endurance stat minimumot.
- Fő küldetés main_outskirts_06: 3 tannersWax elfogyasztása; jutalom 1 guildWaxSet; a choice statok smithing, investigation, speech, perception, leadership.

## 8. Siker / részleges siker / kudarc / megszakítás

**Jelenlegi craft:** siker vagy elutasítás; részleges craft nincs.  
**Jelenlegi repair:** nincs runtime, ezért nincs siker/kudarc ág sem.  
**Jelenlegi fő küldetés:** a fő quest resolver kezeli a választási próbát és fail-forward dramaturgiát; a küldetés védett, változatlan.

**Tervezési szabály:** ha a jövőben lesz minőségellenőrzés, annak kudarcai nem írhatják át a statokat vagy item template-eket, és nem törölhetnek felszerelést. A konkrét következmény csak központi quest/economy/transaction szerződés alapján dönthető el.

## 9. Költség és jutalom

- Craft: közös recipe input; jelenleg nincs arany munkadíj.
- Dismantle: felszerelés eltávolítása és recipe-fél hozam.
- Repair: nincs durability, nincs költség vagy output.
- Fő küldetés 06: 3 Bőrviasz fogy; 1 Céhes viaszszett jutalom.
- A guildWaxSet anyag és a globális recipe helper közötti szerepet nem szabad Velka lokális pénznemévé vagy kizárólagos inputjává tenni.

## 10. Kapcsolat és fejlődés

A craft/dismantle sikeres használata a közös used() útvonalat hívja: journal + reputation activity/relationships növekedés, és az első funkcióhasználatkor 2 XP/memory. NPC-specifikus facet delta nincs a craft handlerben. A fő quest choice-ok a meglévő relationship/identity rendszeren keresztül hatnak. Külön armor mastery nem létezik.

## 11. UI és interakció

- Ugyanaz a forge workbench, mint Borinnál.
- Jelenleg nem csak armor listázódik; a UI a regionális, közönséges, slotos tárgyakat jeleníti meg.
- A „Páncélt javíttatok” action label félrevezető a tényleges runtime-hoz képest: nem repairt indít, hanem a közös forge panelt nyitja.
- Javasolt UI: páncél/defense terméklista és explicit „készítés” vs „szétszerelés” állapot. A „javítás” felirat csak durability-vel együtt használható.
- Előnézetben statok, rarity, recipe input és inventory-szám.

## 12. Állapot és mentés

Velka nem rendelkezik külön állapotmezővel. Az item instance továbbra is instanceId + itemId; save key aimorpg-final-demo-v1-29, saveVersion 6. A repair és armor condition új adatot igényelne, ezért központi save/migration döntés nélkül blokkolt.

## 13. Exploitvédelem

A jelenlegi craft/dismantle kockázatok Borinnal közösek: client-side store, nincs server-authoritative transaction/idempotency, nincs explicit dismantle output capacity guard, nincs craft history. A UI nem jogosultsági határ; a store az egyetlen jelenlegi ellenőrzési pont, de kliensoldali. A jövőbeni armor filtert a store-ban is ellenőrizni kell, nem csak a UI-ban.

## 14. Tesztterv

1. Velka fn-velka csak Velka NPC ID-val használható.
2. 07:59, 08:00, 17:59, 18:00 jelenlét-határok.
3. Wrong region / absent runtime status.
4. Armor craft recipe mennyisége (5 iron + 2 wax).
5. Weapon craft Velka-nál jelenleg alpha.26-ban működő generic viselkedésként rögzítve; jövőbeli filter csak döntés után.
6. Armor dismantle yield és output capacity boundary.
7. Invalid/protected item rejection.
8. Craft double-submit és dismantle replay.
9. „Páncélt javíttatok” label és tényleges UI/handler közötti eltérés regresszióteszt.
10. No durability/no repair assertion until central approval.
11. Save/reload preserves inventory/equipment instance uniqueness.
12. Main quest main_outskirts_06 exact requirements/reward/choice set unchanged.
13. Side activity must not change any of the 60 main quests.
14. Browser tests desktop/mobile and NPC unavailable state.

## 15. Keresztkörzeti függőségek

- Borin: közös forge handler és recipe output; fegyver/páncél felelősség határa.
- Nara: Bőrviasz és anyagvizsgálat; a main_outskirts_11 választási térben a játékos megmutathatja a mintát Velkának.
- Régi Piac / Kikötő: Velka titkos beszállítója és hibás fémbetétszállítmány eredete.
- Őrségi Negyed: a hibás beszállítás és sérült páncélok következményeinek esetleges hivatalos vizsgálata.
- Aréna / Olen: fegyverhangolás és általános felszereléskezelés felelőssége.

## 16. Fájl-engedélyezés

Ebben a fázisban kizárólag ez a dokumentum módosítható. Jövőbeni, külön jóváhagyású források: src/lib/content.ts, src/lib/itemSystem.ts, src/lib/store.ts, src/components/GameClient.tsx, tesztek. Központi tulajdonú: types.ts, rules.ts, rewardEconomy.ts, simulation.ts, narrative.ts, mainStory.ts, mainQuestAudit.ts, save schema, item stat/rarity/economy.

## 17. Elfogadási kritériumok és nyitott döntések

- A Canon és az actual runtime külön dokumentált.
- A Borinnal való funkcionális átfedés nincs önkényesen feloldva.
- A repair nincs implementáltnak feltüntetve.
- A páncél-specializáció csak projektgazdai jóváhagyás után kerülhet runtime-ba.
- Döntés kell: Velka csak armor specialist legyen, vagy minőségvizsgálati narratív funkciót is kapjon?
- Döntés kell: a shield Borin vagy Velka termékkörébe tartozzon?
- Döntés kell: repair csak durability-vel együtt vagy külön, durability nélküli narratív szolgáltatásként?

**Végső státusz:** SPECIFICATION COMPLETE — UNIQUE SERVICE DESIGN BLOCKED BY OVERLAP / CENTRAL DECISIONS.


---

## 18. Célzott PHASE 2 — Borin–Velka szerepütközés

A teljes, nyolc kategóriás termékkör-mátrix és a két alternatív szereposztás a BORIN_GARRAN_WORKPACKAGE_HU.md 18. fejezetében szerepel.

**VERIFIED CURRENT:**
- fn-velka kind=forge; Borin fn-garran szintén forge.
- A store közös craft/dismantle ága nem vizsgálja az NPC ID-t termékjogosultság vagy receptválasztás céljából.
- A UI a forge típushoz ugyanazt a panelt rendereli; a terméklista régió/set + common rarity + slot alapján szűr, nem páncélra.
- A dismantle lista bármely inventory slotos itemet felkínál.
- Nincs durability/condition mező és repair handler; a „Páncélt javíttatok” action label jelenleg nem a végrehajtott műveletet nevezi meg.

| Szempont | A — Velka páncél-specialista | B — Velka minőség-/beszállítóvizsgáló |
|---|---|---|
| Canon-kompatibilitás | Közvetlenül megfelel a Páncélkovács szerepnek és a védelmi felszerelés craft-leírásnak; Borin vért/pajzs említése miatt átfedés marad. | Illik a karakter történetéhez; a jelenlegi craft-leírás szolgáltatásmódosítása szükséges. |
| Játékosoldali egyediség | Slot-alapú páncél-specializáció. | Vizsgálati/diagnosztikai funkció, nem második craftkatalógus. |
| Runtime módosítás | Központi NPC-termékkör allowlist és azonos UI/store validáció. | Külön diagnosztikai action; repair csak condition rendszer után. |
| Recipe következmény | A közös helper maradhat; új recept nem szükségszerű. | A vizsgálatnak nincs craft outputja; repair recipe csak külön döntéssel. |
| UI következmény | Páncélkatalógus; a repair címke csak működő repair után maradhat. | Vizsgálati panel; pontos, nem félrevezető action label. |

A páncélcraft, pajzsbesorolás, dismantle-jog és repair négy külön döntés. WD-09 szerephatár, WD-02 durability és WD-03 repair nélkül Velka nem kaphat önálló repair jogosultságot.

**Forrás:** alpha.26 src/lib/content.ts:316,464,501; src/lib/store.ts:643-652; src/components/GameClient.tsx:760-798; src/lib/types.ts:48-60.

**Státusz:** SPECIFICATION COMPLETE — UNIQUE SERVICE / REPAIR DESIGN BLOCKED BY CENTRAL DECISIONS.
