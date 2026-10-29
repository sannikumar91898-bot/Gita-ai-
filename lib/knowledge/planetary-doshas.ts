
import type { PlanetaryDoshaEntry } from "./planetary-doshas.types";
import { PLANETARY_DOSHAS_001 } from "./planetary-doshas-001";
import { PLANETARY_DOSHAS_002 } from "./planetary-doshas-002";
import { PLANETARY_DOSHAS_003 } from "./planetary-doshas-003";

export * from "./planetary-doshas.types";
export { DOSHA_DISCLAIMER, DOSHA_STYLE } from "./planetary-doshas-shared";

export const PLANETARY_DOSHAS: PlanetaryDoshaEntry[] = [
  ...PLANETARY_DOSHAS_001,
  ...PLANETARY_DOSHAS_002,
  ...PLANETARY_DOSHAS_003,
];

export function getPlanetaryDoshaEntries(): PlanetaryDoshaEntry[] {
  return PLANETARY_DOSHAS;
}

export function findPlanetaryDoshaById(
  id: string,
): PlanetaryDoshaEntry | undefined {
  return PLANETARY_DOSHAS.find((entry) => entry.id === id);
}
