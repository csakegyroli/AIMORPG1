# AIMORPG v2.0.0-alpha.19 — UI Theme Foundation

Dátum: 2026-10-20

## Kiindulási alap

- Hivatalos forrás: `AIMORPG-v2.0.0-alpha.18-Item-and-NPC-Art-Audit-Checkpoint.zip`
- Elvárt és tényleges SHA-256: `df44b154b64ad3976bc0e9e2d080c662f18fdf93041863cb018d0b0dc235c8a4`
- Forrás ZIP-integritás: PASS (`ZipFile.testzip()` nem jelzett sérült tagot)
- UI designcsomag: `AIMORPG_UI_Arculat_01(2).zip`
- Tényleges SHA-256: `364b861431ab7f3d2ebef71a253fa2631c214c579b294c32aae118617be422f9`
- Design ZIP-integritás: PASS; 16 fájl, négy specifikáció és kilenc vizuális referencia

## Módosítások

- `src/app/globals.css`: a meglévő közös alaptokenek a specifikáció szerinti háttér-, panel-, bronz/arany-, szöveg- és szemantikus színekre állítva; további emelt panel, kék állapotok, fókuszgyűrű, térköz- és saroktokenek hozzáadva.
- `src/app/globals.css`: általános `:focus-visible` billentyűzetes fókuszjelzés hozzáadva, a nem billentyűzetes fókusz külön kezelésével.
- `src/components/GameClient.tsx`: látható verziójelölés `alpha.19`-re frissítve.
- `package.json`, `package-lock.json`: projektverzió `2.0.0-alpha.19`-re frissítve, függőségverziók változtatása nélkül.
- `scripts/visual-ui-smoke.cjs`: alpha.19 verziójelölés és új theme-/fókusztokenek ellenőrzése hozzáadva.

## Hatókör és korlátozások

Ez az első, célzott UI-theme alapozó lépés, nem a teljes UI-design integráció. A teljes navigációs IA és A Szem négy külön nézete még nincs ebben a lépésben implementálva. Nincs adatmodell-, API-, mentésséma-, Canon-, Dynamic Layer- vagy játékmenet-változtatás. Az alpha.18 item/NPC manifestek és auditok változatlanok.

## Ellenőrzések

- `npm test`: PASS (core gameplay/content, TSX smoke, security/password, visual asset és visual UI smoke)
- `npm run lint`: BLOCKED a környezetben hiányzó `next`, `react`, `react/jsx-runtime` és kapcsolódó típusok miatt; az elárasztó JSX/típushibák a hiányzó függőségek következményei, teljes szemantikus lint nem igazolt.
- `npm run build`: BLOCKED, `next: not found` (exit 127).
- Böngészős QA: NOT RUN; a frontend-függőségek nincsenek telepítve, a futó alkalmazás vizuális ellenőrzése nem történt meg.

## Következő lépés

A theme tokenek fokozatos alkalmazása a meglévő komponensekre, majd a tényleges route-okhoz illeszkedő navigáció és A Szem nézeteinek ellenőrzött, valós adatforrásokra kötése. A teljes UI-integrációt csak futó alkalmazásban végzett QA után szabad vizuálisan igazoltnak jelölni.
