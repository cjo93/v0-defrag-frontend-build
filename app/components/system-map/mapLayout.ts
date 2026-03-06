import { PersonNodeData, CalculatedNode } from './types';

// Structured radial layout algorithm
// 1. Self node at center
// 2. First ring = high intensity or specific roles
// 3. Second ring = lower intensity

export function calculateRadialLayout(
  nodes: PersonNodeData[],
  centerId: string,
  centerX = 50,
  centerY = 50,
  radius1 = 25,
  radius2 = 40
): CalculatedNode[] {
  const calculated: CalculatedNode[] = [];

  const centerNode = nodes.find(n => n.id === centerId);
  const otherNodes = nodes.filter(n => n.id !== centerId);

  if (centerNode) {
    calculated.push({ ...centerNode, x: centerX, y: centerY });
  }

  // Sort by intensity descending to place highest intensity in first ring
  const sortedOthers = [...otherNodes].sort((a, b) => b.intensity - a.intensity);

  // Decide how many go in ring 1 vs ring 2.
  // For a small number, all might go in ring 1.
  const ring1Count = Math.min(sortedOthers.length, 4);
  const ring1Nodes = sortedOthers.slice(0, ring1Count);
  const ring2Nodes = sortedOthers.slice(ring1Count);

  // Position ring 1
  ring1Nodes.forEach((node, i) => {
    const angle = (i / ring1Count) * Math.PI * 2 - Math.PI / 2; // start at top
    calculated.push({
      ...node,
      x: centerX + Math.cos(angle) * radius1,
      y: centerY + Math.sin(angle) * radius1 * 1.2, // slight oval for perspective
    });
  });

  // Position ring 2
  const r2Count = ring2Nodes.length;
  ring2Nodes.forEach((node, i) => {
    // offset angle so they don't perfectly align with ring 1
    const angle = (i / r2Count) * Math.PI * 2 - Math.PI / 2 + (Math.PI / r2Count);
    calculated.push({
      ...node,
      x: centerX + Math.cos(angle) * radius2,
      y: centerY + Math.sin(angle) * radius2 * 1.2,
    });
  });

  return calculated;
}
