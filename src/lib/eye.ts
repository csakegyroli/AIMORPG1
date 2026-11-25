import type { GmMessage } from "./types";
import type { IdentityAxis, PlayerIdentityState, RelationshipFacets } from "./simulation";

/**
 * The Eye is an authored observation layer. It does not choose outcomes,
 * rewrite quests, invent canon, or override player agency.
 */
export const EYE_RULES = Object.freeze({
  observes: [
    "meaningful player choices",
    "quest completion and failure",
    "first arrival to a region",
    "material changes in important NPC relationships",
    "repeated behavioral patterns",
    "major world-state changes"
  ],
  remembers: [
    "important choices",
    "important quest outcomes",
    "NPC relationship milestones",
    "major travel discoveries",
    "canon world-state changes"
  ],
  speaksWhen: [
    "a meaningful pattern becomes visible",
    "a major personal consequence lands",
    "a new region or story layer opens",
    "a failure itself is narratively significant"
  ],
  neverDoes: [
    "reveal hidden numerical scores",
    "force or undo a player decision",
    "teleport the player",
    "invent facts outside the canon",
    "punish the player merely for being offline",
    "speak after every trivial action"
  ]
});

export type EyeObservation = Pick<GmMessage, "title" | "body" | "tone">;

const AXIS_LANGUAGE: Record<IdentityAxis, [string, string]> = {
  orderFreedom: ["a rendhez", "a szabadsághoz"],
  honorOpportunism: ["a becsülethez", "a lehetőségek kihasználásához"],
  mercyCruelty: ["a könyörülethez", "a könyörtelenséghez"],
  curiosityPragmatism: ["a kíváncsisághoz", "a gyakorlati megoldásokhoz"],
  ambitionIndependence: ["az emelkedéshez", "a függetlenséghez"],
  riskSafety: ["a kockázathoz", "a biztonsághoz"],
  loyaltyAutonomy: ["a hűséghez", "az önálló úthoz"]
};

function dominantAxisDelta(before: PlayerIdentityState, after: PlayerIdentityState) {
  let best: { axis: IdentityAxis; delta: number } | null = null;
  for (const axis of Object.keys(before.axes) as IdentityAxis[]) {
    const delta = (after.axes[axis] ?? 0) - (before.axes[axis] ?? 0);
    if (!best || Math.abs(delta) > Math.abs(best.delta)) best = { axis, delta };
  }
  return best;
}

export function eyeIdentityObservation(before: PlayerIdentityState, after: PlayerIdentityState): EyeObservation | null {
  const best = dominantAxisDelta(before, after);
  if (!best || Math.abs(best.delta) < 10) return null;
  const magnitude = Math.abs(after.axes[best.axis] ?? 0);
  if (magnitude < 18) return null;
  const direction = best.delta > 0 ? AXIS_LANGUAGE[best.axis][0] : AXIS_LANGUAGE[best.axis][1];
  return {
    title: "A Szem mintát lát",
    body: `Az utóbbi döntéseid egyre határozottabban ${direction} visznek. A Szem ezt nem ítéletként jegyzi fel — csak mintázatként.`,
    tone: "personal"
  };
}

export function eyeRelationshipObservation(previous: RelationshipFacets, next: RelationshipFacets): EyeObservation | null {
  const previousTrust = previous.trust + previous.respect + previous.affection;
  const nextTrust = next.trust + next.respect + next.affection;
  const previousThreat = previous.fear + previous.suspicion;
  const nextThreat = next.fear + next.suspicion;
  if (nextThreat - previousThreat >= 18) {
    return { title: "A viszony megváltozott", body: "A Szem észrevette, hogy ez az ember már óvatosabban tekint rád.", tone: "warning" };
  }
  if (nextTrust - previousTrust >= 24) {
    return { title: "Bizalom épül", body: "A Szem szerint ez a kapcsolat már több egyszerű ismeretségnél.", tone: "personal" };
  }
  return null;
}

export function eyeQuestObservation(title: string, success: boolean, firstQuestInRegion: boolean): EyeObservation | null {
  if (firstQuestInRegion) {
    return { title: "A Szem feljegyezte a lépést", body: `A(z) ${title} új fejezetet nyitott a történetedben.`, tone: "world" };
  }
  if (!success) {
    return { title: "A kudarc is adat", body: "A világ nem felejtette el, hogyan próbáltad megoldani a helyzetet.", tone: "warning" };
  }
  return null;
}

export function eyeTravelObservation(regionName: string, firstVisit: boolean): EyeObservation | null {
  if (!firstVisit) return null;
  return {
    title: "A Szem új helyet jegyzett meg",
    body: `Mostantól ${regionName} is része annak a világnak, amelyhez emlékeid kötnek.`,
    tone: "world"
  };
}
