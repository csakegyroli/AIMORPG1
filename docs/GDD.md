# AImorpg — Játéktervezési dokumentum (v0.3)

## Rövid vízió

Az AImorpg egy saját arculatú, sűrű felületű fantasy böngészős RPG. A játékos osztályválasztás nélkül a Külvárosban indul; fejlődése, kapcsolatai és döntései vezetik a város magasabb körei felé.

Az első szezon címe **A Fekete Érme**. A királyi adó eltűnése, a hamispénz és az arénai fogadások ugyanahhoz az összeesküvéshez kapcsolódnak.

## V0.3 játékhurok

1. A játékos megismeri a Külvárost és felvesz egy küldetést.
2. Három módszer közül választ; a megfelelő tulajdonság és felszerelés határozza meg a sikert.
3. Aranyat, XP-t, NPC-kapcsolatot és hírnév-összetevőket kap.
4. Az eltűnt adószállítmány megoldása, valamint 10 hírnév után megnyílik a Piac és az Aréna.
5. A Piacon felszerelést szerez, az Arénában a Fekete Érme új nyomára bukkan.

Nincs kötött kaszt és nincs várakozási idő: a játék azonnali döntési körökre épül.

## Tulajdonságok és hírnév

| Csoport | Tulajdonságok |
| --- | --- |
| Harc | Erő, Állóképesség, Fegyverkezelés, Védekezés, Reflex, Akarat |
| Árnyék és utazás | Ügyesség, Lopakodás, Zsebmetszés, Zárnyitás, Észlelés, Túlélés |
| Társas | Beszéd, Karizma, Megfélemlítés, Megtévesztés, Empátia, Vezetés |
| Kereskedelem és mesterség | Kereskedelem, Alku, Értékbecslés, Kovácsolás, Alkímia, Logisztika |
| Tudás és hatás | Intelligencia, Műveltség, Nyomozás, Politika, Navigáció, Mágiaérzék |

Szintlépésenként három fejlesztési pont jár. A hírnév 0–1000 közötti, súlyozott érték: érdemek 30%, döntések 25%, kapcsolatok 20%, gazdasági/közösségi hatás 15%, fejlődés és felszerelés 10%. Az aktivitás legfeljebb 10 pontos, korlátozott bónusz.

## V0.3 régiók és szereplők

- Játszható: Külváros, Kereskedelmi Központ, Aréna.
- Előnézet: Kikötő, Belváros, Királyi Palota, Zárt Erdő.
- Induló NPC-k: Miri, Rovan, Damar, Ilren, Garran, Eldra, Serin.
- Minden küldetés NPC-kapcsolatot és naplóbejegyzést módosíthat.

## Gazdaság és tárgyak

Öt felszerelési hely van: fegyver, pajzs, páncél, kiegészítő és lábbeli. Az NPC-piac árát a helyi kereslet, Ilrenhez fűződő kapcsolat és a felszerelési kedvezmények módosítják; a személyes kedvezmény legfeljebb 5%.

V0.3-ban nincs játékos–játékos piac, valódi pénz vagy prémium funkció. A későbbi monetizáció kizárólag kozmetikai és kényelmi lehet.

## Játékmester és béta architektúra

A v0.3 Játékmester szabályalapú, külön inboxszal és világkrónikával. Nem szabad chat, és nem használ külső API-t.

A szerveres béta célarchitektúrája:

- Next.js kliens
- NestJS API, PostgreSQL és Prisma
- Redis/BullMQ háttérfeladatok
- tranzakciós eseménynapló a játékos-, piaci és világváltozásokhoz
- AI Játékmester kizárólag szerveroldalon, validált `WorldAction` javaslatokkal

Az AI-hoz a Responses API használható; a kezdeti kísérleti modell `gpt-5.6-terra`, közepes reasoning efforttel. A végleges modell a valódi játékhelyzetekre felépített minőség-, késleltetés- és költségmérés után rögzítendő.

## Tesztelési elv

Automatikus teszt ellenőrzi a felszerelési bónuszokat, a hírnév képletét, a piaci kedvezménykorlátot és az értékbecslés hatását. Kézi teszteli a küldetési döntéseket, a régiófeloldást, a helyi mentés visszatöltését és a mobil elrendezést.

## v0.6 — The Eye of the Game Master

The Game Master is now framed as an in-world observing entity: **A Szem**. It is not yet a generative AI service. In the demo it is a deterministic narrative layer that records player actions and communicates consequences.

### Design pillars
- Every NPC is treated as a persistent world actor rather than a menu entry.
- Every region has mechanical consequences, not only lore text.
- NPC shops share the same item/inventory rules as the global market.
- The UI exposes relationship, memory, location and economic context so these concepts can later be moved to the server.
- Locked content is explained diegetically by the world instead of appearing as arbitrary disabled buttons.

### Future AI boundary
The eventual AI Game Master should receive a structured world snapshot and return structured proposals such as `create_event`, `offer_quest`, `update_npc_memory`, `change_market_pressure`, or `unlock_region`. It must not have direct database mutation authority.

## v1.1 — Külváros World Bible / Server Clock

The content-design foundation now treats Külváros as a living social space divided into six thematic quarters. The player-facing Directory is regional and discovery-based: inaccessible NPCs are not globally listed.

The canonical world-clock rule is **12 real hours = 1 Kingdom day**. The demo exposes this authoritative server-time abstraction in the UI; future server implementations must derive it from server time rather than client-controlled state.

See `docs/AIMORPG_KULVAROS_WORLD_BIBLE_v1.0.md` for the full content blueprint.
