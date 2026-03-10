import type { SupabaseClient } from '@supabase/supabase-js';

export type SystemMapNode = {
  id: string;
  label: string;
  type: string;
  weight?: number;
};

export type SystemMapEdge = {
  source: string;
  target: string;
  weight?: number;
};

export async function buildUserSystemMap(
  supabase: SupabaseClient,
  userId: string,
): Promise<{ nodes: SystemMapNode[]; edges: SystemMapEdge[] }> {
  const [peopleRes, anchorRes] = await Promise.all([
    supabase
      .from('people')
      .select('id, name, relationship_label, relationship_state')
      .eq('owner_user_id', userId)
      .limit(40),
    supabase
      .from('relationship_anchor')
      .select('person_id, occurrence_count')
      .eq('owner_user_id', userId)
      .limit(80),
  ]);

  const people = peopleRes.data ?? [];
  const anchors = anchorRes.data ?? [];

  const anchorByPerson = new Map<string, number>();
  for (const anchor of anchors) {
    if (!anchor.person_id) continue;
    const current = anchorByPerson.get(anchor.person_id) ?? 0;
    anchorByPerson.set(anchor.person_id, Math.max(current, anchor.occurrence_count ?? 1));
  }

  const nodes: SystemMapNode[] = [
    {
      id: 'self',
      label: 'You',
      type: 'self',
      weight: 1,
    },
    ...people.map((person) => ({
      id: person.id,
      label: person.name || 'Unknown',
      type: person.relationship_label || person.relationship_state || 'person',
      weight: Math.max(1, Math.min(5, anchorByPerson.get(person.id) ?? 1)),
    })),
  ];

  const edges: SystemMapEdge[] = people.map((person) => ({
    source: 'self',
    target: person.id,
    weight: Math.max(1, Math.min(5, anchorByPerson.get(person.id) ?? 1)),
  }));

  return { nodes, edges };
}
