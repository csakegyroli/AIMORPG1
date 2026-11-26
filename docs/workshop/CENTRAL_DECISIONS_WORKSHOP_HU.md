# AIMORPG — Műhelynegyed központi döntési csomag
## Projektgazdai jóváhagyásra

**Baseline:** AIMORPG v2.0.0-alpha.26 · main · 894e9606fa84f5d609d810152e326b1cfae09b18  
**Branch:** workshop/phase-1-npc-specification  
**Minden döntés tulajdonosa:** projektgazda  
**Státusz:** minden pont PENDING  
**Mód:** SPECIFICATION ONLY — semmilyen döntés nem tekinthető elfogadottnak.

## Döntési összefoglaló

| ID | Téma | Érintett NPC | Státusz |
|---|---|---|---|
| WD-01 | +1–+9 itemfejlesztés | Borin, Velka, Nara | PENDING |
| WD-02 | Durability / condition | Borin, Velka, Nara | PENDING |
| WD-03 | Repair | főként Velka, Borin, Nara | PENDING |
| WD-04 | Profession mastery | mind a négy | PENDING |
| WD-05 | Recipe és output központi tulajdonosa | Borin, Velka, Nara | PENDING |
| WD-06 | Sikertelen craft következménye | Borin, Velka, Nara | PENDING |
| WD-07 | Alapanyagveszteség / dismantle yield | Borin, Velka, Nara | PENDING |
| WD-08 | Tranzakció, idempotency, duplikáció elleni védelem | mind a négy | PENDING |

---

## WD-01 — +1–+9 itemfejlesztés

**Probléma:** alpha.26-ban InventoryItem csak instanceId és itemId; nincs tartós enhancement level, stat scaling, fail state, védelem vagy history. A smithingKit itemleírása finomhangoló eszközöket említ, de nem bizonyít +1–+9 runtime-ot.

**Érintett NPC-k:** Borin (kovács), Velka (páncél), Nara (bőrtermék), Tomen (tanulási/gyakorlási kapcsolat).

**Forrásfájlok:** src/lib/types.ts:48-60; src/lib/content.ts:68; src/lib/store.ts:643-660; src/lib/rules.ts:92-94; src/lib/rewardEconomy.ts; src/components/GameClient.tsx:760-798.

**Lehetséges megoldások:**
- A. Nincs tartós +1–+9 rendszer ebben a játékszakaszban; a smithingKit marad item, nem aktiválható fejlesztési rendszer.
- B. Közös, item-instance szintű enhancement contract; kizárólag központi adatmodellben, közös szabályokkal, server-authoritative resolutionnel és migrációval.

**Kockázatok:** global item template módosítása több játékos azonos itemjét érintené; client RNG manipulálható; sikertelen fejlesztés gazdasági veszteséget és Pay-to-Win kockázatot okozhat; stat/set/synergy egyensúly sérülhet.

**Javaslat:** B csak teljes instance, transaction, server-authority, save migration és economy review után. Addig A.

**Döntés tulajdonosa:** projektgazda. **Státusz: PENDING.**

## WD-02 — Durability / condition

**Probléma:** alpha.26 item instance nem tárol condition/durability értéket; item definition statikus template. NPC Canon említ javítást, de runtime condition state nincs.

**Érintett NPC-k:** Velka elsődlegesen; Borin és Nara másodlagosan.

**Forrásfájlok:** src/lib/types.ts:48-60; src/lib/content.ts:313, 316, 323; src/lib/store.ts:643-652; src/lib/rules.ts:92-94.

**Lehetséges megoldások:**
- A. Nincs durability rendszer; a „javítás” csak narratív/quest kontextusban jelenik meg, nem item condition változásként.
- B. Közös item-instance condition mező, központi hatásképlettel, capekkel, repair és save migration szabállyal.

**Kockázatok:** inventory instance migráció, régi save default, felszerelés statváltozás, javítási anyagköltség és gold sink, item resale és quest gear kompatibilitás.

**Javaslat:** A, amíg a B opció teljes közös architektúrája nem jóváhagyott.

**Döntés tulajdonosa:** projektgazda. **Státusz: PENDING.**

## WD-03 — Repair

**Probléma:** Borin NPC service „Fegyverjavítás”; Velka „Páncéljavítás”; Nara „javítás”. Az alpha.26 runtime-ban nincs durability mező vagy javítási handler. Velka action labelje „Páncélt javíttatok”, de a forge handler craft/dismantle-t futtat.

**Érintett NPC-k:** Borin, Velka, Nara.

**Forrásfájlok:** src/lib/content.ts:313, 316, 323, 462, 464, 469; src/lib/store.ts:643-652; src/lib/types.ts:48-60.

**Lehetséges megoldások:**
- A. Repair nem mechanikai szolgáltatás, amíg durability nincs; UI/copy nem állíthatja, hogy item condition javul.
- B. Durability bevezetése után közös repair service; NPC-nként jóváhagyott jogosultság és input/output.

**Kockázatok:** félrevezető UI; item stat/állapot inkonzisztencia; free repair exploit; quest item és felszerelt item kezelése.

**Javaslat:** A átmenetileg; B csak WD-02 után.

**Döntés tulajdonosa:** projektgazda. **Státusz: PENDING.**

## WD-04 — Profession mastery

**Probléma:** alpha.26 smithing global stat létezik; Tomen 15 aranyért +1 smithinget ad 50-ig. Nincs profession mastery, külön XP, rank vagy recipe unlock state. A used() első funkcióhasználatkor 2 általános XP-t ad, ez nem mastery.

**Érintett NPC-k:** Tomen elsődlegesen; Borin, Velka, Nara mint lehetséges szakmai tevékenységforrások.

**Forrásfájlok:** src/lib/content.ts:29, 470; src/lib/store.ts:581-590, 659-660; src/lib/types.ts:1-12; src/lib/simulation.ts:60-65.

**Lehetséges megoldások:**
- A. Csak a meglévő global stats és NPC relationship/memory használata; külön mastery nincs.
- B. Egy közös profession mastery szolgáltatás/contract, amely több szakma tracket kezel; nincs district-local currency vagy saját XP-store.

**Kockázatok:** párhuzamos progression modellek, XP inflation, save migration, repeat farming, recipe gating egyetlen NPC mögött.

**Javaslat:** A, amíg a projektgazda a közös progression tulajdonost és API-t nem hagyja jóvá. Tomen szerepét külön kell eldönteni (oktató vagy tanulótárs).

**Döntés tulajdonosa:** projektgazda. **Státusz: PENDING.**

## WD-05 — Crafting recipe és output tulajdonosa

**Probléma:** alpha.26 craftRecipeForItem(item, region) régióalapú generikus képlet. Nincs NPC-specializációs recipe registry, recipe ID, output quantity vagy unlock contract. A Borin és Velka forge, Nara leatherwork, de a store ugyanazt a helper-t hívja.

**Érintett NPC-k:** Borin, Velka, Nara; Tomen csak későbbi oktatási kapcsolatként.

**Forrásfájlok:** src/lib/itemSystem.ts:113-147; src/lib/store.ts:643-652; src/lib/content.ts:462-470; src/lib/types.ts:35-60.

**Lehetséges megoldások:**
- A. A meglévő generikus regionális recipe marad, a kerületi NPC-k csak hozzáférési pontok; semmilyen specializált recept nincs.
- B. Egyetlen központilag tulajdonolt recipe registry/contract, amely NPC/profession/output/input/unlock szabályokat tartalmaz; a district csak javaslatot ad.

**Kockázatok:** párhuzamos recipe modellek, eltérő UI/store preview, anyag- és output duplikáció, más kerületek recipe ütközése.

**Javaslat:** B hosszú távon, de a jelenlegi fejlesztési körben A és a recipe registry csak design jóváhagyás után.

**Döntés tulajdonosa:** projektgazda. **Státusz: PENDING.**

## WD-06 — Sikertelen craft következményei

**Probléma:** alpha.26 craft determinisztikus: ha validáció sikeres és anyag megvan, craft sikerül. Nincs minőségpróba vagy craft failure. A validációs kudarcok előtt nincs inputlevonás. A játéktervben szereplő „kis kockázat” csak Tomen NPC leírásában szerepel, nem craft resolverben.

**Érintett NPC-k:** Borin, Velka, Nara, Tomen.

**Forrásfájlok:** src/lib/store.ts:643-660; src/lib/content.ts:462-470; src/lib/itemSystem.ts:113-131.

**Lehetséges megoldások:**
- A. Determinisztikus craft; csak invalid input/insufficient resource esetén fail, inputveszteség nélkül.
- B. Központilag szabályozott minőség/skill outcome, ahol a failure cost és anyagveszteség előre látható és tesztelt.

**Kockázatok:** RNG manipuláció, frusztráció, resource sink túl nagy vagy túl kicsi, repeat exploit, kliensoldali eredményhamisítás.

**Javaslat:** A; failure chance csak server-authoritative contract és economy review után.

**Döntés tulajdonosa:** projektgazda. **Státusz: PENDING.**

## WD-07 — Alapanyagveszteség és dismantle yield

**Probléma:** a helper a recipe input felét adja vissza, típusonként minimum 1 darabbal. Ez kis receptnél a teljes anyag visszanyerését jelentheti; a dismantle output capacity nincs explicit ellenőrizve a műhely handlerben.

**Érintett NPC-k:** Borin, Velka, Nara.

**Forrásfájlok:** src/lib/itemSystem.ts:134-147; src/lib/store.ts:643-652; src/components/GameClient.tsx:768-798.

**Lehetséges megoldások:**
- A. A jelenlegi fél-recept/minimum-1 szabály marad, de explicit protected-item és capacity guard tesztekkel.
- B. Közös, központilag meghatározott yield table vagy loss factor, inventory cap atomikus ellenőrzéssel.

**Kockázatok:** végtelen craft/dismantle loop, alapanyag duplikáció, inventory túllépés, quest input visszanyerése.

**Javaslat:** B csak teljes economy simulation után; addig A, de a jelenlegi kapacitási és protected-item kockázatot javítás előtt P0-ként kezelni kell.

**Döntés tulajdonosa:** projektgazda. **Státusz: PENDING.**

## WD-08 — Tranzakció és duplikáció elleni védelem

**Probléma:** useNpcFunction kliensoldali setData state updater. A UI gombok meghívják a store actiont; nincs látható server-authoritative crafting endpoint, transaction ID, idempotency key vagy durable operation log. A save localStorage-ba íródik.

**Érintett NPC-k:** mind a négy; magasabb kockázat Borin/Velka/Nara item műveleteinél, Tomen ismételhető stat-vásárlásánál.

**Forrásfájlok:** src/lib/store.ts:16-18, 87-120, 300-312, 568-590, 643-660; src/lib/types.ts:48-60; src/lib/rules.ts:92-94.

**Lehetséges megoldások:**
- A. A jelenlegi single-player demo local state modellje marad; UI/store validációk és regression tesztek, de nem állítjuk, hogy csalásbiztos.
- B. Szerver-authoritative action API: a szerver validál, atomikusan debitel/creditel, idempotency key-t kezel, és a kliens csak a szerver eredményét jeleníti meg.

**Kockázatok:** kliens manipuláció, double submit, replay, reload/rollback, item/gold duplikáció, multi-device state conflict.

**Javaslat:** B, ha a crafting a multiplayer/economy végleges része; A csak a demo korlátozott állapotának őszinte dokumentálásával.

**Döntés tulajdonosa:** projektgazda. **Státusz: PENDING.**

## Jóváhagyási szabály

Minden döntés külön, egyértelmű projektgazdai jóváhagyást igényel. Egy döntés elfogadása nem jelenti a kapcsolódó forrásfájlok módosításának automatikus engedélyezését. A jóváhagyás után külön implementációs scope, branch, owner és tesztkapu szükséges.
