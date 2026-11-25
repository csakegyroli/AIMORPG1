# Alpha.15 — tényleges párosítások és nyitott koncepciók

## 10 tárgykép → stabil item-ID
| Forráskép | Item-ID | Kimenet | Forrásellenőrzés |
|---|---|---|---|
| `item_concept_02_canal_dagger.png` | `canalKnife` | `/assets/items/canalKnife.webp` | `SOURCE VERIFIED` — source/output SHA-256 receipt egyezik |
| `item_concept_01_fractured_seal_ring.png` | `brokenSealRing` | `/assets/items/brokenSealRing.webp` | `SOURCE VERIFIED` — source/output SHA-256 receipt egyezik |
| `item_concept_10_stormglass_bow.png` | `stormglassBow` | `/assets/items/stormglassBow.webp` | `SOURCE VERIFIED` — source/output SHA-256 receipt egyezik |
| `item_concept_08_sailors_knife.png` | `sailorsKnife` | `/assets/items/sailorsKnife.webp` | `SOURCE VERIFIED` — source/output SHA-256 receipt egyezik |
| `item_concept_05_duelist_cloak.png` | `duelistCape` | `/assets/items/duelistCape.webp` | `SOURCE VERIFIED` — source/output SHA-256 receipt egyezik |
| `item_concept_06_witness_lens.png` | `firstWitnessLens` | `/assets/items/firstWitnessLens.webp` | `SOURCE VERIFIED` — source/output SHA-256 receipt egyezik |
| `item_concept_09_storm_knot.png` | `stormKnot` | `/assets/items/stormKnot.webp` | `SOURCE VERIFIED` — source/output SHA-256 receipt egyezik |
| `item_concept_03_caravan_compass.png` | `caravanCompass` | `/assets/items/caravanCompass.webp` | `SOURCE VERIFIED` — source/output SHA-256 receipt egyezik |
| `item_concept_04_champion_medal.png` | `championRibbon` | `/assets/items/championRibbon.webp` | `SOURCE VERIFIED` — source/output SHA-256 receipt egyezik |
| `item_concept_07_quiet_bell.png` | `quietBell` | `/assets/items/quietBell.webp` | `SOURCE VERIFIED` — source/output SHA-256 receipt egyezik |

## 6 NPC-portré → stabil NPC-ID
| Forráskép | NPC-ID | Megfelelési indok | Korlát |
|---|---|---|---|
| `npc_concept_15_armored_female_captain.png` | `arenaSena` | Armored female captain concept compared against “Beléptető bíró”, the trial-gate role and wandering fighter history; role-level match selected, but final art approval remains open. | Kanonikus arcazonosság és valódi UI-render még nincs vizuálisan igazolva. |
| `concept02_npc_03_harbor_captain.png` | `harborKael` | Harbor captain concept compared against NPC role “Kikötőkapitány”; exact role match; canon face not established. | Kanonikus arcazonosság és valódi UI-render még nincs vizuálisan igazolva. |
| `npc_concept_04_bespectacled_archivist.png` | `palaceOrven` | Bespectacled archivist concept compared against royal investigator from an archivist family whose main story concerns missing documents; strong narrative/setting match; canon face not established. | Kanonikus arcazonosság és valódi UI-render még nincs vizuálisan igazolva. |
| `concept02_npc_01_city_commander.png` | `rovan` | City commander concept compared against NPC role “Városi őrkapitány”; strong role-level match; canon face not established. | Kanonikus arcazonosság és valódi UI-render még nincs vizuálisan igazolva. |
| `concept02_npc_04_alchemist.png` | `eldra` | Alchemist concept compared against NPC role “Alkimista”; exact role match; canon face not established. | Kanonikus arcazonosság és valódi UI-render még nincs vizuálisan igazolva. |
| `npc_concept_10_rugged_workshop_smith.png` | `garran` | Rugged workshop smith concept compared against NPC role “Fegyverkovács”; exact profession match; canon face not established. | Kanonikus arcazonosság és valódi UI-render még nincs vizuálisan igazolva. |

## 6 region-kép → meglévő `REGION_ART` ID
| Címkézett koncepció | Region-ID | Runtime asset |
|---|---|---|
| `concept02_district_01_palace_district.png` | `palace` | `/assets/world/concept02-region-palace-district.webp` |
| `concept02_district_02_trade_center.png` | `market` | `/assets/world/concept02-region-trade-center.webp` |
| `concept02_district_03_harbor.png` | `harbor` | `/assets/world/concept02-region-harbor.webp` |
| `concept02_district_04_arena.png` | `arena` | `/assets/world/concept02-region-arena.webp` |
| `concept02_district_05_inner_city.png` | `inner` | `/assets/world/concept02-region-inner-city.webp` |
| `concept02_district_06_outer_district.png` | `outskirts` | `/assets/world/concept02-region-outer-district.webp` |

## `NEEDS_REVIEW`
A `docs/ARTWORK_CONCEPT_INTEGRATION_MANIFEST_ALPHA15.csv` mind a 44 nyitott sort önállóan tartalmazza a stabil `concept_id`, forrásútvonal, SHA-256, méret, indoklás és következő lépés mezőkkel: 24 item, 14 NPC, 6 alternatív környezetkép. A 24 itemhez nincs igazolt pontos item-ID egyezés; 14 portrénál a képi vagy narratív bizonyíték nem választ el egy egyedi NPC-t megbízhatóan; a 6 Pack 01 környezetképhez nincs bizonyított egy-az-egyhez részletes körzet-ID.
