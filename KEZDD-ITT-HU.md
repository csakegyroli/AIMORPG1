# AImorpg v2.0.0-alpha.1 — Kezdd itt

## Mi ez a változat?

Ez a projekt a korábbi v1.40.1/v1.41 demóból továbbépített fejlesztői alfa. A cél: **single-player először, szerveres mentés és fiókalapok most, multiplayer később, az AI pedig narratív segítő — nem korlátlan világvezérlő**.

## Mi került bele?

- 187 szerzői tárgy, 18 öttagú felszereléskészlet, 5 valódi, statokra ható szinergiacsalád.
- Új anyagokhoz kötött készítési receptek; a történeti relikviák nem gyárthatók le ingyen.
- Fiók- és mentéspanel: regisztráció/bejelentkezés UI, helyi mentés export/import, fiókhoz kötött felhőmentés kezelése, ha a backend fut.
- NestJS API, PostgreSQL és Prisma sémával/migrációval; szerveroldali scrypt jelszóhash, HttpOnly munkamenet-süti, lejárat és visszavonás, kérésforrás-ellenőrzés, korlátozott mentésméret és mentésszám.
- A Szem első generatív végpontja az OpenAI Responses API-n keresztül. A kulcs csak a szerveren van; a modell megfigyelést fogalmaz, de nem adhat tárgyat, nem módosíthat statot és nem írhatja át a kánont.
- A helyi egyjátékos mód fiók, adatbázis és AI nélkül is megmarad.

## Elindítás — csak a helyi játék

Szükséges: Node.js 22 vagy újabb és npm.

```bash
npm ci
npm test
npm run dev
```

Böngésző: `http://localhost:3000`.

## Fiók, adatbázis és AI indítása

1. Második terminálban:

```bash
cd server
cp .env.example .env
```

2. Helyi PostgreSQL indítása Docker Compose-zal:

```bash
docker compose up -d postgres
```

3. Telepítés és migráció:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate:deploy
npm run start:dev
```

4. Az adatbázis ellenőrzése: `http://localhost:4000/api/system/health`.
5. Ha az AI-t is szeretnéd, a `server/.env` fájlban add meg az `OPENAI_API_KEY` értékét. A kulcsot **ne** tedd a böngészőbe, `NEXT_PUBLIC_*` környezeti változóba vagy a forráskódba.

A frontend alapértelmezésben a `http://localhost:4000` címen keresi az API-t. Ha más porton/felületen fut, állítsd be a `NEXT_PUBLIC_API_URL` változót, és a `WEB_ORIGIN` pontosan egyezzen a frontend originjével.

## Ellenőrzések

Ebben a környezetben sikeres:

- `npm test` — tartalom/játékszabály smoke tesztek és futásidejű jelszóhash-teszt.
- `node check_ts.js src` — 23 frontend TypeScript-fájl szintaktikai/transpile-ellenőrzése.
- `node check_ts.js server/src` — 17 backend TypeScript-fájl szintaktikai/transpile-ellenőrzése.

**Fontos korlát:** a fejlesztői környezet npm-regiszter elérési időtúllépése miatt a teljes Next.js/NestJS build és az élő PostgreSQL + AI végpontok end-to-end tesztje itt nem volt hitelesen lefuttatható. A saját gépeden telepítsd a függőségeket, futtasd a migrációt és ellenőrizd ezeket a lépéseket.

## Mi nincs még kész?

Ez nem nyilvános, éles szolgáltatás és nem MMO. E-mail-megerősítés, jelszó-visszaállítás, MFA/passkey, elosztott rate limit, biztonsági audit és automatizált backup még hátravan. A játékmenet döntései és a világállapot jelenleg főként a böngészőben élnek; a teljesen szerveroldali parancs-végrehajtás és multiplayer szinkronizáció későbbi mérföldkő.

A teljes terv: `docs/PROJECT_ROADMAP_2026.md`. Biztonság: `docs/SECURITY_MODEL_ALPHA.md`. A Szem szabályai: `docs/AI_RUNTIME_CONTRACT.md`.
