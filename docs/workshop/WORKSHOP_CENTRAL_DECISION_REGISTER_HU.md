# Műhelynegyed — központi döntési regiszter
## Projektgazdai jóváhagyás és nyomon követés

A döntések részletes leírása: CENTRAL_DECISIONS_WORKSHOP_HU.md.  
A függőségi térkép és tesztterv: DEPENDENCIES_AND_TEST_PLAN_HU.md.

| ID | Döntés | Tulajdonos | Státusz | Implementációs következmény |
|---|---|---|---|---|
| WD-01 | +1–+9 itemfejlesztés | Projektgazda | PENDING | Nincs enhancement mező vagy resolver |
| WD-02 | Durability / condition | Projektgazda | PENDING | Nincs condition mező |
| WD-03 | Repair | Projektgazda | PENDING | Nincs tényleges repair handler |
| WD-04 | Profession mastery | Projektgazda | PENDING | Nincs külön mastery/profession XP |
| WD-05 | Recipe/output központi tulajdonosa | Projektgazda | PENDING | A régióalapú közös helper marad |
| WD-06 | Sikertelen craft következménye | Projektgazda | PENDING | Craft determinisztikus, validation failure no-op |
| WD-07 | Alapanyagveszteség és dismantle yield | Projektgazda | PENDING | A jelenlegi helper fél recipe / min 1 |
| WD-08 | Tranzakció, idempotency, duplikációvédelem | Projektgazda | PENDING | Client-side store nem server-authoritative |

## NPC-specifikus döntési kérdések

| NPC | Kérdés | Tulajdonos | Státusz |
|---|---|---|---|
| Borin | Mely slotok tartoznak ténylegesen a fegyverkovács felelősségéhez, tekintve, hogy a funkcióleírás fegyvert, pajzsot, vértet és csizmát sorol? | Projektgazda | PENDING |
| Velka | Milyen egyedi páncélfunkciója legyen, és hol húzódjon a határ Borin generic forge szolgáltatásához képest? | Projektgazda | PENDING |
| Velka | A „Páncélt javíttatok” UI/service megnevezés maradjon-e repair runtime nélkül? | Projektgazda | PENDING |
| Nara | Van-e jóváhagyott bőr input item és recept/output, vagy csak a jelenlegi tannersWax generic recipe használható? | Projektgazda | PENDING |
| Nara | Milyen item ID-k tekinthetők bőrterméknek? lurkerGloves/paddedArmor leírása bőrre utal; travelerBoots anyaga nincs megadva. | Projektgazda | PENDING |
| Tomen | Tanonc szerepéből következően tanulótárs/diagnoszta legyen, vagy a jelenlegi runtime szerint a játékost képző NPC? | Projektgazda | PENDING |
| Tomen | Mi történjen, ha a smithing már 50 és a 15 aranyas képzést megpróbálja megvenni a játékos? | Projektgazda | PENDING |

**Szabály:** PENDING döntés nem tekinthető jóváhagyásnak, és nem ad forráskód-módosítási jogosultságot.



---

## PHASE 2 — pontosított döntési regiszter

| ID | Döntés | Tulajdonos | Státusz | Implementációs következmény |
|---|---|---|---|---|
| WD-01 | +1–+9 enhancement / item instance | Projektgazda | PENDING | Nincs enhancement mező; InventoryItem változatlan |
| WD-02 | Durability / condition | Projektgazda | PENDING | Nincs condition mező vagy kopási resolver |
| WD-03 | Repair | Projektgazda | PENDING | Nincs mechanikai repair handler |
| WD-04 | Profession mastery és karakter XP elkülönítése | Projektgazda | PENDING | Nincs profession mastery vagy szakmai XP |
| WD-05 | Recipe input/output központi tulajdonosa | Projektgazda | PENDING | Generikus regionális helper; nincs NPC recipe registry |
| WD-06 | Crafting eredmény / sikertelen craft | Projektgazda | PENDING | Determinisztikus craft; nincs quality/failure outcome |
| WD-07 | Anyagveszteség és dismantle yield | Projektgazda | PENDING | Fél-recipe/minimum-1 dismantle; capacity/protected-item kockázat |
| WD-08 | Tranzakció, idempotencia, duplikációvédelem | Projektgazda | PENDING | Client-side store; nincs server-authoritative transaction |
| WD-09 | Borin–Velka termékkör és szerephatár | Projektgazda | PENDING | Nincs NPC-specifikus termékkör-szűrés |
| WD-10 | Nara anyag- és receptkatalógus | Projektgazda | PENDING | Nincs jóváhagyott bőranyaglánc; leatherwork UI hiányzik |
| WD-11 | Tomen szerep és 15 gold legacy training | Projektgazda | PENDING | Jelenlegi apprentice handler változatlan; mastery nincs |

### NPC státuszok a célzott kiegészítés után

| NPC | Dokumentációs státusz | Nyitott döntés |
|---|---|---|
| Borin | SPECIFICATION COMPLETE — BLOCKED | WD-09; közös WD-01–08 |
| Velka | SPECIFICATION COMPLETE — BLOCKED | WD-09; WD-02/03 |
| Nara | SPECIFICATION COMPLETE — BLOCKED | WD-10; leatherwork UI; közös WD-01–08 |
| Tomen | SPECIFICATION COMPLETE — BLOCKED | WD-11; WD-04 progression/mastery |

**Jóváhagyási szabály:** minden WD pont külön projektgazdai döntést igényel. PENDING nem implementációs engedély. A külön workshop/phase-1-crafting-specialization branch ettől a munkától független marad.
