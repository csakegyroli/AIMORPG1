# AIMORPG alpha.18 — Forrásmegőrzési jelentés

## A ténylegesen ellenőrzött kiinduló források

- Alpha.17 checkpoint: `AIMORPG-v2.0.0-alpha.17-Item-Art-Integration-Checkpoint.zip`, SHA-256 `a00d7d3cece7049f36fd0487278378c0fa06cd39f1500ff77169189f5ea27884`. Ebből készült a külön `aimorpg-alpha18-work` munkapéldány. Az eredeti ZIP-et nem módosítottuk.
- Pack01: `AIMORPG_Grafikai_Koncepcio_01(1).zip`, SHA-256 `5f33714e62095918e5aa2e872d868aea235b27ed4552c684484dadafddcf30de`, ZIP-integritás PASS.
- Pack02: `AIMORPG_Grafikai_Koncepcio_02(2).zip`, SHA-256 `f6b2261e6f13d5be6336d8fff7c18ee1aaa901a10f6138daf9b2e1bb6545b390`, ZIP-integritás PASS.
- Pack03: `AIMORPG_Grafikai_Koncepcio_03(2).zip`, SHA-256 `10c7229a201b022b42e45ea9b9d4c029d44ba91aead37e2f9d32266c576ce073`, ZIP-integritás PASS.

A munkapéldányban lévő Pack01–03 eredeti ZIP-másolatok hash-e egyezik a forrásfájlok hash-értékével. Az alpha.12–alpha.16 korábbi checkpointokhoz nem nyúltunk; az alpha.18 nem tartalmaz régi checkpoint ZIP-et a ZIP belsejében. A korábbi checkpointok a korábbi fájltárbeli állományokként megmaradnak.

## Koncepcióleltár validálása

A `ARTWORK_CONCEPT_INTEGRATION_MANIFEST_ALPHA18.csv` 125 sora (az előző 122 pack-koncepció és 3 javított forráslapkivágás) mind létező forrásfájlt és egyező source SHA-256-ot tartalmaz. Az elsődleges 1254×1254-es item art forráslap eredeti PNG-je változatlanul megmaradt.

## Módosítások határa

Módosult három runtime WebP-kivágás és a hozzájuk tartozó crop receipt, a fő vizuális manifest, a 187 soros item audit, a 69 soros NPC audit, a grafikai briefek/backlog, a verziómetadata (alpha.18) és az alpha.18 smoke-tesztelvárások. A stabil játékazonosítók és játékmeneti adatstruktúrák nem változtak. Új kép nem készült.
