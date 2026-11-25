# World Event Runtime Rules v1.0

## Cél
A város ne csak akkor éljen, amikor a játékos aktívan questet hajt végre.

## Event candidate források
- éjszakai élet
- korábbi fontos emlék visszhangja
- erős kapcsolati nyomás

## Életciklus
`candidate → scheduled/active → resolved | expired`

## Korlátok
- régiónként egy aktív esemény
- maximum 40 runtime esemény a mentésben
- alapértelmezett eseményablak: 90 perc
- ugyanaz a resolved event nem aktiválható újra változás nélkül

## Játékosautonómia
A world event nem teleportál. Nem zárhatja le a main questet. Nem büntethet pusztán azért, mert a játékos offline volt.

## Későbbi bővítés
Az AI a candidate-ből választhat és készíthet konkrét dinamikus eseményt, de csak a Dynamic layerben.
