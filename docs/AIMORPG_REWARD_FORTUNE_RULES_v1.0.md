# AIMORPG – Reward Fortune / Bad-Luck Protection v1.0

## Principle
The player never sees the reward mathematics. The engine tracks an invisible fortune state so long unlucky streaks become gradually less punishing without turning rare rewards into guarantees.

## Hidden counters
- `rareMisses`: consecutive reward rolls below Rare.
- `legendaryMisses`: consecutive reward rolls without Legendary.

## Soft pity
- Rare-family chance receives a hidden +0.25 percentage-point shift per Rare miss, capped at +5 percentage points.
- Legendary chance receives a hidden +0.01 percentage-point shift per non-Legendary roll, capped at +0.5 percentage points.
- The added weight is removed primarily from Common, preserving a normalized 100% probability table.

## Reset rules
- Rare or better resets `rareMisses`.
- Legendary resets both counters.
- Special does not reset Legendary pity.

## Determinism
The reward seed remains deterministic per quest/source. Pity changes the effective rarity table before the final roll, so the same quest cannot be rerolled by changing UI choices or reloading after settlement.

## Player-facing rule
No raw percentages, pity counters or luck values are displayed. The player sees only the resulting reward and concise human-readable reward expectations.
