# AIMORPG — WORLD SIMULATION BIBLE v1.0

## Cél

A játék következő rétege nem új menüpontok hozzáadása, hanem egy olyan háttérrendszer kiépítése, amelyben a játékos viselkedése, az NPC-khez fűződő kapcsolat, a világ emlékezete és az NPC-k állapota ugyanannak a történeti rendszernek a része.

A rendszer négy elsődleges rétege egymásra épül:

1. **Játékosidentitás** — a viselkedésből levezetett, rejtett karakterprofil.
2. **Kapcsolatrendszer** — egyetlen barátságérték helyett több emberi dimenzió.
3. **Világemlékezet** — tartós események, döntések és találkozások.
4. **NPC-állapotok** — a karakterek aktuális társadalmi és történeti állapota.

## I. Játékosidentitás

A játékos nem kasztot választ. A rendszer a döntésekből és játékstílusból következtet arra, milyen emberré válik.

### Identitástengelyek

- Rend ↔ Szabadság
- Becsület ↔ Opportunizmus
- Könyörület ↔ Kegyetlenség
- Kíváncsiság ↔ Pragmatizmus
- Ambíció ↔ Függetlenség
- Kockázat ↔ Biztonság
- Lojalitás ↔ Önállóság

Az értékek -100 és +100 között mozognak. A játékos ezeket nem látja numerikusan.

### Életút-affinitások

A meglévő statrendszerből öt háttér-affinitás épül:

- Harc
- Árnyék
- Társas
- Kereskedelem
- Tudás

A quest-választások ezekre gyenge vagy közepes jeleket adnak. Egyetlen döntés nem határozza meg a karaktert.

### Anti-gaming szabály

Az identitás nem egyetlen választásból születik. A játékos sok döntésének mintázata számít, ezért a rendszer nem ad közvetlen „jó út / rossz út” optimalizálható számot.

## II. Kapcsolatrendszer

A régi 0–100 kapcsolatérték kompatibilitási célból megmarad, de a háttérben hat külön dimenzió működik:

- **Bizalom**
- **Tisztelet**
- **Vonzalom / személyes kötődés**
- **Félelem**
- **Tartozás**
- **Gyanú**

A régi kapcsolatérték ezekből számított aggregátum.

Ez lehetővé teszi, hogy egy NPC például tiszteljen, de ne bízzon a játékosban; féljen tőle, miközben üzletel vele; vagy tartozzon neki úgy, hogy közben gyanakszik rá.

## III. Világemlékezet

Minden fontos esemény tartós emlékként kerül be a világállapotba.

### Jelenlegi eseménytípusok

- küldetés felvétele
- döntés / következmény
- NPC-találkozás
- régióváltás
- sikeres vagy sikertelen fő küldetés

Minden memória tartalmazhat:

- NPC-t
- régiót
- városnegyedet
- kulcsszavakat
- fontosságot
- időbélyeget
- természetes nyelvű leírást

A memória célja, hogy később NPC-k, side questek és az AI Narrative Director ne csak a játékos jelenlegi állapotát, hanem múltját is felhasználhassák.

## IV. NPC-állapotok

Az NPC-k állapotgépe jelenleg a következő állapotokat támogatja:

- normal
- friendly
- suspicious
- angry
- injured
- traveling
- missing
- disgraced
- promoted

Az aktuális állapotot a kapcsolat, a történeti események és később a dinamikus világállapotok módosíthatják.

### Aktuális kapcsolati állapotlogika

- magas bizalom + tisztelet → Barátságos
- közepes / magas gyanú → Gyanakvó
- nagyon magas gyanú → Haragszik
- egyébként → Nyugodt

Ez az alapállapotgép később képes lesz történeti állapotokkal bővülni.

## V. Nappali / éjszakai emberi jelenlét

A 12 valós órás szervernap megmarad.

Minden régióban legalább két olyan NPC van, aki kifejezetten éjszakai szerepet tölt be:

- Külváros: Miri, Alma
- Aréna: Rusk, Serin
- Kereskedelmi Központ: Niven, Fen
- Belváros: Selene, Corvin
- Palota: Orven, Ysra
- Kikötő: Mira, Sable

Ez azért szükséges, hogy az éjszaka ne jelentse a főjáték megállását. Az NPC-k későbbi side quest-kapui és éjszakai történetei innen építhetők tovább.

## VI. Mentéskompatibilitás

A v1.15 új világállapotot használ, de a korábbi mentéseket migrálja:

- régi relationship érték → kezdeti kapcsolat-facettek
- hiányzó identitás → semleges identitás
- hiányzó memóriák → üres memóriaarchívum
- hiányzó NPC-állapotok → normal állapot

## VII. Második nagy feladat: régiós feltételek + main quest audit

Ez külön fejlesztési fázis.

Nem a rendszer első lépcsőjében oldjuk meg, hanem a 60 main quest auditjával együtt.

Célja:

- mennyit ér egy regionális főív teljesítése?
- milyen reputációt, pénzt, kapcsolatot és tudást ad?
- milyen kombinációval nyitható meg a következő régió?
- mennyire lehet eljutni 1–2 questtel, és hol szükséges valódi történeti fejlődés?
- hogyan biztosítható, hogy a teljes történetet kereső játékosnak mind a hat régióban legyen értelmes munkája?

A későbbi belépési feltételek több dimenzióból álljanak: reputáció, pénz, kapcsolat, információ, korábbi döntések és adott főív állapota.

## VIII–XII. Későbbi fázisok

Ezeket külön-külön tervezzük meg, az első két nagy rendszer lezárása után:

- A Szem szabályrendszere
- Quest DNA
- AI Narrative Director
- AI side quest rendszer
- Artwork
- Végső content polish

## Alapelv

**A térkép a játék lelke.**

A küldetésmenü információt ad.
A Névjegyzék emlékezik.
A tényleges történés a világban, a régiókban, a városnegyedekben és az NPC-k jelenlétében történik.

A későbbi AI-rendszerek kizárólag ebből a kanonikus világállapotból dolgozhatnak.
