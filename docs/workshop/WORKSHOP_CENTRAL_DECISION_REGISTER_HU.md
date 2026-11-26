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
