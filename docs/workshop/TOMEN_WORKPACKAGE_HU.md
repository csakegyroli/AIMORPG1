# Műhelynegyed — Tomen (tomen)
## NPC munkacsomag — alpha.26 specifikáció

**Baseline:** main · AIMORPG v2.0.0-alpha.26 · commit 894e9606fa84f5d609d810152e326b1cfae09b18  
**Branch:** workshop/phase-1-npc-specification  
**Státusz:** **SPECIFICATION COMPLETE — ROLE / PROGRESSION DESIGN BLOCKED BY CENTRAL DECISION**  
**Mód:** SPECIFICATION ONLY. Forráskódot ez a munkacsomag nem módosít.

## 1. Canon és karakterazonosság — VERIFIED

- ID: tomen; név: Tomen; szerep: Tanonc.
- Hely: Rézkopács műhely, Műhelynegyed; 07:00–17:00.
- NPC service: „Apró javítás, anyagismeret”.
- Minden műhelyből elles valamit, de egyik mesternél sem marad sokáig, mert mindig megkérdezi, miért kell úgy csinálni, ahogy a mester mondja.
- Motivációja: olyan mestert találni, aki valóban tanítja, nem csak dolgoztatja; saját nevét nem kötné műhelyhez, amíg nem érzi kiérdemeltnek.
- Titka egy régi szerszám jele, amely visszatér a Fekete Érme történetében.
- Canon szerepe a fiatal, kérdező nézőpont és az örökölt szakmai hibák feltárása.

**Forrás:** src/lib/content.ts:324, 413, 470, 507.

## 2. Alpha.26 forráshelyek

| Forrás | Hely | Bizonyított tény |
|---|---:|---|
| NPC-definíció | src/lib/content.ts:324 | tanonc, hely, szolgáltatás, 07–17 |
| NPC-funkció | src/lib/content.ts:470 | fn-tomen, apprentice, 15 arany |
| NPC-történet | src/lib/content.ts:507 | tanoncsors, motiváció, titok, questRole |
| Runtime | src/lib/store.ts:568-590, 659-660 | shared NPC validation + apprentice training handler |
| UI | src/components/GameClient.tsx:760-798 | generic special-function card, nincs tanoncpróba minijáték |
| Statok | src/lib/content.ts:7-31; src/lib/types.ts:4-12 | smithing létező global stat |
| Fő küldetés | src/lib/mainStory.ts:33 | main_outskirts_12, 1 smithingKit, 5 választási út |
| Inventory | src/lib/types.ts:48-60; src/lib/store.ts:52, 87-120 | közös item instance és mentés |

## 3. Meglévő runtime — IMPLEMENTED, de nem külön tanoncmechanika

- NPC-funkció: fn-tomen, kind: apprentice, cost: 15.
- A useNpcFunction a training, arenaTraining, apprentice eseteket közös handlerben kezeli.
- Apprentice esetén a cél stat alapértelmezés szerint smithing.
- Sikeres hívás: 15 arany levonás, baseStats.smithing +1, maximum 50.
- A játékos trade affinity értéke +2, maximum 100.
- used() további közös hatása: journal-bejegyzés és reputation activity/relationships növekedés; a funkció első használatakor 2 XP és memory.
- Nincs feladatválasztás, anyagismereti teszt, minijáték, külön szakmai XP, mastery, receptfeloldás vagy repair művelet.
- Ha a smithing már 50, a jelenlegi handler a költséget még levonja, a stat nem nő, de a trade affinity és used() hatás továbbra is lefut. Ezt regressziós esetként kezelni kell.

## 4. Önálló játékosérték — a Canonból következő nyitott döntés

Tomen Canonja tanoncot ír le, aki mestert keres, nem kész szakembert, aki a játékost tanítja. A jelenlegi runtime viszont a játékost képzi. A két szerep között értelmezési feszültség van; nem oldható fel önkényesen.

**A opció — Tomen mint gyakorlati oktató a játékosnak**
- Megtartja a jelenlegi 15 aranyas smithing képzést.
- Később gyakorlati feladatokkal magyarázza a smithing stat működését.
- Kockázat: Tomen motivációja (ő keres mestert) kevésbé illeszkedik ahhoz, hogy ő oktató.

**B opció — Tomen mint tanulótárs / közös diagnoszta**
- A játékos és Tomen együtt vizsgál meg hibás szerszámot vagy anyagmintát.
- A játékos döntései és meglévő statjai segítenek; Tomen saját kérdései hozzák elő az új következtetést.
- Ez jobban illeszkedik a Canonhoz és a main_outskirts_12 történeti szerepéhez.
- Kockázat: új side-content / activity resolver és jutalomkontraktus kellhet.

**Javaslat:** B legyen a narratív fő irány; a jelenlegi +1 smithing vásárlás maradjon legacy funkció addig, amíg a projektgazda eldönti, hogy kiváltja vagy megtartja. Ez nem módosíthatja a fő küldetést és nem hozhat létre profession mastery-t.

## 5. Teljes játékmeneti ciklus

**Jelenlegi:** megkeresés → régió/jelenlét check → 15 arany ellenőrzés → smithing +1 (50-es cap) → trade affinity +2 → közös used() hatások.

**B opció javasolt opcionális ciklusa:**
1. Tomen egy konkrét szerszámhibát vagy anyagjelenséget mutat, amely a már létező Canonhoz kapcsolódik.
2. A játékos kiválasztja a vizsgálati megközelítést: szétszedés/technikai tudás (smithing), jelmegfigyelés (perception), mesterek megkérdezése (speech), tanonc védelme (empathy), bizonyíték megőrzése (investigation).
3. A választás a közös quest/side-quest resolver által meghatározott statpróbán fut.
4. A kimenet success/failure vagy a közös resolver által támogatott fail-forward.
5. Jutalom csak jóváhagyott közös reward táblából vagy narratív/memória hatásból származhat.
6. A repeat limitet és jutalmat a központi side-quest/progression szerződés rögzíti.

Ez a ciklus a fő küldetésben már megjelenő döntéstérből merít, de új opcionális tartalomként csak központi jóváhagyás után készülhet.

## 6. Játékosdöntések és alternatívák

- Jelenlegi képzés megvásárlása vagy kihagyása.
- Képzésnél: 15 arany elköltése akkor is, ha a smithing már 50 — jelenlegi edge case, nem kívánatos végleges UX.
- Javasolt közös diagnosztikai activitynél: technikai bontás, megfigyelés, mesterek megkérdezése, empatikus támogatás, bizonyítékmegőrzés.
- A fő questben az öt választás már létezik; nem lehet újraírni vagy jutalmazási szempontból módosítani.

## 7. Előfeltételek, itemek, statok, jogosultságok

- NPC tomen, outskirts, workshops, 07:00–17:00.
- fn-tomen költsége 15 arany.
- smithing global stat, jelenlegi cap 50.
- trade identity affinity cap 100, apprentice használatakor +2.
- Jelenlegi apprentice handler nem követel itemet vagy statminimumot.
- Fő quest main_outskirts_12: 1 smithingKit elfogyasztása; jutalom 2 merchantInk; choice statok smithing, perception, speech, empathy, investigation.
- smithingKit leírása apró reszelőket, olajokat és keményítőanyagot említ; ez nem bizonyít +1–+9 rendszert.

## 8. Siker / részleges siker / kudarc / megszakítás

**Jelenlegi:** arany hiányában nincs változás; elegendő arany esetén a stat +1 vagy cap miatt változatlan, trade affinity +2, used() hatások. Nincs partial vagy random failure.

**Javasolt activity:** a közös resolver success/failure kimenete, explicit fail-forward; a kudarc nem törölhet felszerelést vagy main quest state-et. A konkrét jutalom és ismételhetőség központi döntés.

## 9. Költség és jutalom

- Jelenlegi költség 15 arany.
- Jelenlegi jutalom +1 smithing (50-ig), +2 trade affinity (100-ig).
- Első funkcióhasználatkor +2 XP és memory; minden sikeres használat journal + reputation activity/relationships.
- A cap feletti vásárlás jelenleg aranyat von le statnövekedés nélkül.
- Nincs külön practice mark, mastery token, tanonc valuta vagy szakmai XP.

## 10. Kapcsolat és fejlődés

A useNpcFunction apprentice handler nem növeli Tomen relationship facets értékeit. A used() a globális reputation breakdown relationships és activity számlálóit növeli, nem NPC-facetet. A fő quest választásai a közös identity/relationship/quest resolverben kapnak következményt. Profession mastery nem létezik.

## 11. UI és interakció

- A NpcFunctionPanel a Tomen apprentice funkcióját generic special-function kártyaként mutatja.
- Egy gomb van: „Tanoncpróbát kérek”; nincs feladatválasztó, tutorial, minijáték vagy előnézet.
- A 15 arany költség a funkcióadatban létezik, de a special card UI nem ad részletes költség-/jutalom-előnézetet.
- Javasolt: költség, aktuális smithing/cap, tényleges várható statváltozás és trade-affinity változás előzetes megjelenítése; cap esetén a gomb tiltása vagy világos figyelmeztetés.
- Ha B opció kerül elfogadásra, külön activity state és visszajelzés szükséges a közös UI szerződés szerint.

## 12. Állapot és mentés

A jelenlegi képzés csak meglévő gold, baseStats, identity affinity, reputation, memory és journal mezőket módosít. Nincs Tomen-specifikus training record vagy mastery state. Save key aimorpg-final-demo-v1-29, saveVersion 6. Új mastery vagy task-state csak központi save/migration jóváhagyással.

## 13. Exploitvédelem

- Ismételt hívás ismételten aranyat von le; a smithing 50-es capnél a vásárlás nem növeli a statot.
- Az első used() XP csak egyszer adódik, de a reputation activity/relationships és journal minden sikeres használatnál nő.
- Nincs idempotency token, replay protection vagy szerveroldali authority.
- Ha új activity lesz, egy feladatjutalom csak egyszer legyen claimelhető; a UI disable nem elég, a store/state resolver ellenőrzés kell.
- Tomen nem adhat végtelen XP-t, goldot vagy mastery pontot.

## 14. Tesztterv

1. fn-tomen az apprentice handlerhez kapcsolódik.
2. 06:59, 07:00, 16:59, 17:00 presence boundary.
3. Wrong region / absent NPC.
4. 14 arany: nincs state change.
5. 15 arany, smithing 49: smithing 50, trade affinity +2.
6. 15 arany, smithing 50: jelenlegi kód levonja a goldot; ezt rögzítő teszt és projektgazdai döntés.
7. Trade affinity 99/100 cap.
8. Első használat +2 XP/memory; ismételt használat nem ad új activity XP-t.
9. Reputation activity/relationships növekedés ismétlése a jelenlegi runtime szerint.
10. NPC relationship facets változatlanok a jelenlegi handlerben.
11. UI megmutatja a 15 gold költséget és cap állapotot.
12. Reload után a stat/affinity/gold megmarad.
13. Javasolt activity success/failure/partial/replay csak a közös resolver jóváhagyása után.
14. Main quest main_outskirts_12 input/output/choice változatlan.

## 15. Keresztkörzeti függőségek

- Borin: mesterség és hibás szerszámok; Borin első mesteremberi kapcsolat.
- Velka: minőség és beszállítói felelősség.
- Nara: bőr- és anyageredet, main_outskirts_11 előzmény.
- Régi Piac: merchantInk jutalom item a fő questből, de nem tanonc mastery.
- Kapuváros / Vera: a fő történet korábbi súlyvizsgálata kapcsolódik a hibás fémkeverékhez.
- Őrségi Negyed: a mesterpecsét és hamis beszállítói lánc későbbi vizsgálati következményei.

## 16. Fájl-engedélyezés

**Most:** csak dokumentáció.  
**Később, külön jóváhagyással:** src/lib/content.ts, src/lib/store.ts, src/components/GameClient.tsx, scripts/smoke-test.cjs, scripts/visual-ui-smoke.cjs.  
**Központi tulajdon / tiltott önálló módosítás:** types.ts, rules.ts, simulation.ts, narrative.ts, rewardEconomy.ts, mainStory.ts, mainQuestAudit.ts, save schema, XP/stat/mastery/economy.

## 17. Elfogadási kritériumok és nyitott döntések

- Jelenlegi apprentice runtime és edge case pontosan dokumentált.
- Tomen Canon és oktatói szerepe közötti feszültség látható.
- Nincs kitalált minijáték vagy mastery rendszer implementáltnak állítva.
- A fő küldetés változatlan.
- Projektgazda dönt: A (oktató) vagy B (tanulótárs/diagnoszta), és mi legyen a jelenlegi 15 gold traininggel.
- Projektgazda dönt: smithing capnél tiltott legyen-e a vásárlás.

**Végső státusz:** SPECIFICATION COMPLETE — ROLE / PROGRESSION DESIGN BLOCKED BY CENTRAL DECISION.
