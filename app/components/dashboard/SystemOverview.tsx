import { SystemMap } from '../system-map/SystemMap';
import { PersonNodeData, RelationshipEdgeData } from '../system-map/types';

export function SystemOverview() {
  // Static placeholder data for dashboard implementation in Phase 3
  const nodes: PersonNodeData[] = [
    { id: 'you', name: 'You', role: 'self', intensity: 1, state: 'stable' },
    { id: 'partner', name: 'Partner', role: 'partner', intensity: 0.9, state: 'reactive', isLeverage: true },
    { id: 'parent', name: 'Parent', role: 'parent', intensity: 0.4, state: 'distanced' }
  ];

  const edges: RelationshipEdgeData[] = [
    { id: 'e1', source: 'you', target: 'partner', pattern: 'push-pull', intensity: 0.8, isLeverage: true },
    { id: 'e2', source: 'you', target: 'parent', pattern: 'avoidant', intensity: 0.3 }
  ];

  return (
    <div className="w-full h-[300px] border border-white/10 rounded-2xl bg-[#09090b] relative overflow-hidden flex flex-col items-center justify-center p-6">
       <div className="absolute top-4 left-4 z-10">
          <h3 className="text-[13px] text-white/50 uppercase tracking-[0.1em] font-semibold mb-1">System Overview</h3>
          <p className="text-[15px] text-white/90">Push / withdraw loop</p>
       </div>
       <div className="w-full h-full">
         <SystemMap nodes={nodes} edges={edges} centerId="you" />
       </div>
    </div>
  );
}
