# AIMORPG v2.0.0-alpha.18 — Változásnapló

## Tényleges forrásmódosítások
- Három hibás képkivágás javítva az eredeti 1254×1254-es grafikai forráslapból: `courierRunners`, `royalRapier`, `harborAegis`; a stabil mapping URL-ek nem változtak.
- `crop-receipts.json` frissítve pontos pixelkoordinátával, forráshash-sel, kimeneti SHA-256-tal, byte-számmal és 512×512 metadata-val.
- `VISUAL_ASSET_INTEGRATION_MANIFEST.csv` frissítve a három javított asset méreteivel/hash ellenőrzési státuszával; Alpha18 néven külön másolat is készült.
- `package.json`, `package-lock.json` és látható játékfejléc verziója alpha.18-ra emelve; függőségi verziók nem változtak.
- A smoke tesztek verzióelvárásai frissültek; a három korrekcióra konkrét útvonal-, koordináta-, SHA-, byte-, WebP- és méretellenőrzés került.
- Teljes, 187 soros tárgyleltár; 69 soros NPC-leltár; 119 tételes egyedi grafikai brieflista; 24 tételes priorizált backlog; 125 soros kiegészített koncepciómanifest készült.

## Nem módosult
- Tárgy-, NPC-, régió- és küldetésazonosítók; item statisztikák, árak és ritkaságok; NPC-adatok, dialógusok, napirendek; mentés/adatmodell/szerveroldali szerződések.
- Korábbi checkpointok, valamint az eredeti Pack01–03 ZIP-ek.
- Nem generáltunk új képeket. Az új képeket igénylő rekordok csak briefet kaptak.
