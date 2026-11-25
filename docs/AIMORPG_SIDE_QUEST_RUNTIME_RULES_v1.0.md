# Side Quest Runtime Rules v1.0

## Életciklus
`candidate → offered → active → completed | failed | declined | expired`

## Korlátok
- maximum 3 kínálható side quest régiónként
- maximum 4 aktív side quest összesen
- maximum 1 aktív side quest ugyanattól az NPC-től
- NPC új történeti ajánlata után 6 valós órás cooldown
- ugyanaz a lehetőség 12 órán belül nem ajánlható újra
- rövid micro ajánlat: 12 óra; local: 24 óra; character arc: 48 óra lejárati idő

## Eligibility
A lehetőség csak akkor válhat kínálattá, ha:
1. a giver létező NPC;
2. az NPC a jelenlegi régióban van;
3. az NPC a szerveridő szerint jelen van;
4. nincs aktív ütköző side quest;
5. nincs cooldown;
6. az opportunity nem ismétlődő;
7. az aktív main quest nem teszi narratívan tiltottá az ajánlatot.

## Források
- kapcsolat
- helyi probléma
- éjszakai lehetőség
- világemlék visszhangja
- játékosidentitás tükrözése

## Blueprint követelmények
Minden runtime side questhez kötelező:
- giver
- region/district
- intent
- concrete objective
- létező item-horgony, ha item kell
- legalább 3 megoldási mód
- kapcsolatkövetkezmény
- világemlék
- opcionális NPC-állapot és világflag
- expiry

## Fail-forward
A runtime nem használ kemény game-over jellegű mellékágat. A kudarc állapotot és emléket hagy, majd új történeti lehetőséget teremthet.
