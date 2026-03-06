import React from 'react';
import { motion } from 'framer-motion';
import { RelationshipEdgeData, CalculatedNode } from './types';

type Props = {
  edge: RelationshipEdgeData;
  sourceNode: CalculatedNode;
  targetNode: CalculatedNode;
  delay?: number;
};

export const RelationshipEdge = React.memo(function RelationshipEdge({ edge, sourceNode, targetNode, delay = 0 }: Props) {
  const isLeverage = edge.isLeverage;
  const pattern = edge.pattern;

  // Decide stroke style based on pattern
  const strokeColor = isLeverage ? 'url(#edgeActiveTension)' : pattern === 'push-pull' ? 'url(#edgeTension)' : pattern === 'avoidant' ? 'url(#edgeNeutral)' : 'url(#edgeAligned)';
  const strokeWidth = isLeverage ? '0.4' : pattern === 'push-pull' ? '0.25' : '0.15';

  // Dash array to show different patterns
  const strokeDasharray =
    pattern === 'avoidant' ? '2 3' :
    isLeverage ? '2 2' :
    pattern === 'push-pull' ? '1.5 1.5' :
    undefined;

  return (
    <motion.line
      x1={sourceNode.x} y1={sourceNode.y} x2={targetNode.x} y2={targetNode.y}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeDasharray={strokeDasharray}
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: edge.intensity }}
      transition={{ duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] }}
      style={isLeverage ? {
        strokeDashoffset: 100,
        animation: 'df-dash-flow 4s linear infinite'
      } : {}}
    />
  );
});
