# Grafikai koncepcióarchívumok — leltár és integrációs eltérések

| Archívum | Méret (byte) | ZIP fájlbejegyzés | SHA-256 | Integritás |
|---|---:|---:|---|---|
| AIMORPG_Grafikai_Koncepcio_01(1).zip | 17717262 | 41 | `5f33714e62095918e5aa2e872d868aea235b27ed4552c684484dadafddcf30de` | PASS |
| AIMORPG_Grafikai_Koncepcio_02(2).zip | 26294364 | 110 | `f6b2261e6f13d5be6336d8fff7c18ee1aaa901a10f6138daf9b2e1bb6545b390` | PASS |

## Önálló koncepcióforrások
- Pack 01: 12 tárgykép, 16 NPC-portré és 6 környezetkép = 34 önálló asset.
- Pack 02: 22 tárgykép, 4 NPC-portré és 6 környezetkép = 32 önálló asset.
- Együttesen: 34 tárgy, 20 NPC-portré és 12 városrész-/régiókoncepció = 66 önálló kép.

## Kontaktlap–manifest eltérés (Pack 02)
A vizuális kontaktlap 24 tárgyat és 6 NPC-t mutat, viszont a CSV-manifest és a különálló kivágások 22 tárgyat és 4 NPC-t tartalmaznak. A kontaktlapról hiányzó különálló képkivágásként szerepel az utazóköpeny és rubingyűrű, valamint a rejtélyes tudós és a második kovács. Ezek nem szerepelnek az önálló koncepciók 66 soros listájában, nem kerültek játékbeli assetként bekötésre, és nem tekinthetők integráltnak.

A korábbi checkpointok (alpha.12/13/14) aktív fájljairól készült SHA-256 leltár az alpha.15 összegzés JSON-ban található; archívumaik változatlanul külön maradtak.
