# AIMORPG alpha.16 — eredeti archívumok megőrzési ellenőrzése

Az alpha.16 külön munkapéldányban készült az alpha.15 tényleges checkpointjából. A korábbi checkpoint archívumokhoz nem nyúltam; az eredeti grafikai Pack01, Pack02 és Pack03 ZIP-ek változatlan példánya külön `docs/artwork-sources/` mappába került.

A részletes bájtméret, SHA-256, archívumbejegyzés-szám és ZIP-integritás az `ALPHA16_SOURCE_ARCHIVE_PRESERVATION_HU.json` fájlban található.

| Forrás | SHA-256 | Állapot |
|---|---|---|
| Pack01 — `AIMORPG_Grafikai_Koncepcio_01(1).zip` | `5f33714e62095918e5aa2e872d868aea235b27ed4552c684484dadafddcf30de` | `PASS`, 41 bejegyzés, másolat hash-egyezés |
| Pack02 — `AIMORPG_Grafikai_Koncepcio_02(2).zip` | `f6b2261e6f13d5be6336d8fff7c18ee1aaa901a10f6138daf9b2e1bb6545b390` | `PASS`, 110 bejegyzés, másolat hash-egyezés |
| Pack03 — `AIMORPG_Grafikai_Koncepcio_03(2).zip` | `10c7229a201b022b42e45ea9b9d4c029d44ba91aead37e2f9d32266c576ce073` | `PASS`, 64 bejegyzés, másolat hash-egyezés |

Az alpha.12–alpha.15 checkpoint ZIP-eket nem csomagoltam be egymásba. Eredeti példányaik a munkaterületen külön helyen maradtak; méretüket/azonosítójukat és hash-üket az összefoglaló JSON dokumentálja. A végső alpha.16 ZIP kizárja a `node_modules`, `.next`, `dist`, `coverage`, `.git`, `.env*` és TypeScript build-cache fájlokat.
