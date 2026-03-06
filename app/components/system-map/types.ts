export type PersonRole = 'self' | 'partner' | 'parent' | 'child' | 'friend' | 'colleague' | 'ex' | 'sibling' | 'boss';
export type PersonState = 'stable' | 'reactive' | 'distanced' | 'repairing';
export type RelationalPattern = 'stable' | 'push-pull' | 'avoidant' | 'entangled';

export type PersonNodeData = {
  id: string;
  name: string;
  role: PersonRole;
  intensity: number; // 0 to 1
  state: PersonState;
  isLeverage?: boolean;
};

export type RelationshipEdgeData = {
  id: string;
  source: string;
  target: string;
  pattern: RelationalPattern;
  intensity: number; // 0 to 1
  isLeverage?: boolean;
};

export type CalculatedNode = PersonNodeData & {
  x: number;
  y: number;
};
