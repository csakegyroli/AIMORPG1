# NPC Dialogue Runtime Rules v1.0

## Cél
Az NPC párbeszéd később nem chatbot lesz, hanem a karakter jelenlegi állapotából, múltjából és a játékossal való kapcsolatból felépített interakció.

## Topic rétegek
1. introduction
2. function
3. backstory
4. motivation
5. secret
6. relationship
7. current_problem
8. main_quest
9. side_story

## Discovery gate
- surface: bemutatkozás, funkció
- background: legalább mérsékelt bizalom vagy tisztelet
- motivation: erősebb bizalom + tisztelet
- secret: nagyon erős bizalom + kötődés

## Állapotfüggés
- gyanú magas szinten korlátozhat bizonyos témákat
- utazó/missing/disgraced NPC nem interaktív
- a szerveridő meghatározza a jelenlétet
- a beszélgetés új emléket és tématörténetet rögzíthet

## Runtime guardok
- topic cooldown: 20 perc
- nincs beszélgetési téma Canon ellenőrzés nélkül
- a dialogue runtime nem módosítja közvetlenül a Canon-t
