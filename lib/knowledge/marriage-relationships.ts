
import type { MarriageRelationshipEntry } from "./marriage-relationships.types";
import { MARRIAGE_RELATIONSHIPS_001 } from "./marriage-relationships-001";
import { MARRIAGE_RELATIONSHIPS_002 } from "./marriage-relationships-002";
import { MARRIAGE_RELATIONSHIPS_003 } from "./marriage-relationships-003";

export const MARRIAGE_RELATIONSHIPS: MarriageRelationshipEntry[] = [
  ...MARRIAGE_RELATIONSHIPS_001,
  ...MARRIAGE_RELATIONSHIPS_002,
  ...MARRIAGE_RELATIONSHIPS_003,
];

export * from "./marriage-relationships.types";
