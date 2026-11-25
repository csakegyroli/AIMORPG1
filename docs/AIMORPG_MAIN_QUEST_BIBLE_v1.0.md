# AIMORPG — MAIN QUEST BIBLE v1.0

## 1. Design decision

The main story is the authored spine of the first capital-city arc. It is shared by every player, but it is **not linear at the regional level**.

The world is divided into six main-story regions:

1. Külváros — **A lehetőség ára**
2. Aréna — **A fogadások árnya**
3. Kereskedelmi Központ — **A mérleg nyelve**
4. Belváros — **A fény ára**
5. Királyi Palota — **A korona vizsgálata**
6. Kikötő — **A Fekete Érme tengeri útja**

Each region is one authored story arc containing multiple quest nodes. The player can choose which unlocked regional arc to pursue, but the quests inside a regional arc unfold in order. Completing all six arcs gives the complete first-season picture.

## 2. Core rule: the map is the game

The Quest menu is an information surface, not a teleport hub.

It answers:
- what is complete;
- what is active;
- what is open;
- what is locked;
- which region is relevant;
- which NPC owns the next step.

The player completes and resolves the actual interaction **from the world map**, inside the NPC's local panel. The Névjegyzék remains an archive of discovered people and shared history.

## 3. 60 NPC / 60 main quest nodes

Every currently known NPC owns exactly one main-story quest node. This guarantees that the authored main story doubles as a guided tour of the capital's social fabric.

The NPCs are not interchangeable quest dispensers. Each node uses that character's occupation, worldview, relationships and location to reveal a different piece of the same mystery.

## 4. The Black Coin

The Black Coin is not introduced as a single villain clue. It appears as different phenomena:

- Külváros: missing tax loads, forged seals, altered records, old symbols;
- Aréna: rigged fights and suspicious betting flows;
- Kereskedelmi Központ: ledger manipulation, shipping routes, debt structures;
- Belváros: private debts, clubs, patronage and social influence;
- Palota: official investigation, seals, diplomatic pressure, erased history;
- Kikötő: manifests, ships, contraband and the ocean-going network.

The player gradually realizes that these are not separate incidents.

## 5. Fail-forward philosophy

A failed choice completes the node with a weaker outcome, smaller rewards and a different relationship effect. It does not dead-end the main story.

The story records the method used, not only the binary success/failure state. This gives future side-quest and AI systems data to react to.

## 6. Regional access logic

The current demo keeps all capital regions traversable for testing, but the main quest system already carries regional reputation and entry-cost requirements. In the full campaign these gates become the narrative justification for regional access.

Suggested baseline:

| Region | Suggested reputation | Entry cost | Narrative gate |
|---|---:|---:|---|
| Külváros | 0 | 0 | Starting point |
| Aréna | 8 | 30 | Proof of basic capability |
| Kereskedelmi Központ | 10 | 120 | Economic credibility |
| Belváros | 18 | 750 | Wealth and social competence |
| Királyi Palota | 35 | 2,500 | Political relevance and introductions |
| Kikötő | 15 | 100 | A practical route out of the city |

The Palace and Harbor deliberately diverge: Palace represents upward political access; Harbor represents lateral descent, reinvention and escape.

## 7. Regional arc summaries

### Külváros — A lehetőség ára
The player learns the city's social grammar. The mystery begins as missing tax, broken seals, warehouse discrepancies and street rumors. By the end of the arc, evidence points both upward into institutions and outward toward commerce and the sea.

### Aréna — A fogadások árnya
The player proves themselves, then discovers that the PvP economy is being manipulated. The arc moves from personal combat to public reputation to betting flows and ultimately produces a financial trail.

### Kereskedelmi Központ — A mérleg nyelve
The player learns that the conspiracy is logistical. Ledgers, caravans, guild permissions, rare goods, debt and warehouse seals connect the city's money to the sea.

### Belváros — A fény ára
Money turns into access. The player enters salons, games, credit circles and patronage networks. The mystery becomes social and political rather than purely criminal.

### Palota — A korona vizsgálata
The state begins to investigate. Old seals, diplomatic interests and missing archives reveal that the Black Coin network may predate the current investigation.

### Kikötő — A Fekete Érme tengeri útja
The mystery becomes a transregional threat. Manifests, ships, honest sailors, independent captains and contraband all reveal different ways to live after wealth, status or trust is lost.

## 8. Future side-quest layer

Side quests are intentionally not authored into the 60-node main backbone yet. They will be generated and/or selected by the Game Master / Eye system from NPC state, relationship, previous decisions, current location, availability window and unresolved personal goals.

A side quest can be denied, altered or disappear without damaging the main story.

## 9. NPC dossier requirement

Each NPC now has a story profile with:
- history;
- motivation;
- secret;
- main-story role.

The visual identity pass will build on these profiles instead of inventing artwork in isolation.
