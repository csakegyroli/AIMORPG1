# AIMORPG — Reward / Loot / Economy Engine v1.0

## Cél
A jutalmazás, loot, alapár és drop-valószínűség egyetlen determinisztikus gazdasági szerződésben működik. Az AI később csak javasolhat; pénzt, itemet vagy Canon állapotot közvetlenül nem írhat.

## Ritkasági modell
- Közönséges: névleges 15.00% tier-esemény
- Ritka: 1.00%
- Különleges: 0.25%
- Legendás: 0.10%

A források a tier-eket normalizáltan kezelik, így a régiók előrehaladásával a valószínűségi tömeg a ritkább tier-ek felé tolódik, miközben az összeg mindig 100%.

## Régiós erősödés
Külváros a baseline. Aréna, Kereskedelmi Központ, Belváros, Palota és Kikötő fokozatosan növeli a Ritka/Különleges/Legendás tier-ek súlyát, nem egyszerűen nagyobb számokat oszt.

## Determinisztikus reward roll
A roll seedje a forrás + quest + régió. A játékos választása nem tud újradobást kényszeríteni. A kiosztott roll mentésre kerül a quest ID alatt.

## Jutalomrétegek
- garantált quest jutalom (az authored questből)
- dinamikus reward budget (arany, XP, gyémánt esély)
- rarity-alapú bonus loot roll
- opcionális item jutalom

## Gazdasági profil
Minden itemhez számolható:
- névleges drop chance
- price floor
- price ceiling
- diamond floor
- economic class

A meglévő basePrice értékek megmaradnak authored kiindulási árként; a motor ellenőrzi és köréjük gazdasági intervallumot számol.

## Tranzakciós szabály
Quest reward csak atomikusan alkalmazható: követelmény levonás + authored jutalom + dinamikus roll + memória + kapcsolati következmény egyetlen végállapotban.

## Védőkorlátok
- quest item nem kerülhet véletlen loot poolba
- Canon nem írható
- AI nem ad közvetlenül valutát vagy itemet
- ugyanaz a quest roll nem dobható újra választásváltással
- Legendary minimum diamondFloor = 10
