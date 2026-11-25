# AIMORPG — Narrative Runtime Specification v1.0

## Cél
A v1.35 a side quest, NPC dialogue és world event rendszerek determinisztikus runtime alapját építi meg. Generatív AI nincs bekapcsolva.

## Alapelv
A runtime nem előre megírt questlistából választ. A már meglevő világállapotból történeti lehetőségeket vezet le, majd ezeket korlátozott, menthető runtime-állapotként kezeli.

**Lánc:**
World State → Opportunity Detection → Runtime Eligibility → Story Blueprint → Runtime State → Memory/Consequence hooks → később AI Narrative Director.

## Bemenetek
- játékos identitás és affinitások
- kapcsolat-facettek
- világemlékezet
- NPC runtime állapotok
- szerveridő
- régió és kerület
- aktív main quest
- A Szem megfigyelései
- létező itemek, NPC-funkciók és helyszínek

## Kemény korlátok
- Canon nem módosítható csendben.
- Side quest nem zárhat le vagy írhat át main questet.
- Nem létező NPC, item, kerület vagy helyszín nem hozható létre.
- Nincs teleport.
- A runtime nem teljesít küldetést a játékos helyett.
- Offline idő miatt nem jár automatikus büntetés.
- Minden történeti egységnek kell legalább egy NPC-motiváció és legalább egy világ-horgony.
- Tartós emlék vagy világállapot-következmény nélkül nincs érdemi side quest.
