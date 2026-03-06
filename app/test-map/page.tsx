"use client";

import RelationshipMap from "@/components/relationship-map/relationship-map";

const testPeople = [
  {
    id: "1",
    name: "Mom",
    relationship_label: "Mother",
    relationship_state: "strained",
    pattern: "pursue_withdraw",
    leverage: {
      type: "timing",
      point: "Wait for the right moment",
      opening: "When the system is open",
      move: "Delay resolution until calm",
      line: "Let's pause. We can figure this out when we're both settled."
    }
  },
  {
    id: "2",
    name: "Dad",
    relationship_label: "Father",
    relationship_state: "cooling",
    pattern: "boundary_setting",
    leverage: {
      type: "boundary_signaling",
      point: "Signal connection before limit",
      opening: "When calm, before a break",
      move: "Affirm bond, then set boundary",
      line: "I care about you. I just need a little space right now."
    }
  },
  {
    id: "3",
    name: "Sister",
    relationship_label: "Sibling",
    relationship_state: "stable",
    pattern: "triangulation",
    leverage: {
      type: "role",
      point: "Step out of the regulator role",
      opening: "When asked to mediate",
      move: "Direct them to each other",
      line: "This sounds like something you two need to discuss directly."
    }
  },
  {
    id: "4",
    name: "Partner",
    relationship_label: "Romantic",
    relationship_state: "improving",
    pattern: "enmeshment",
    leverage: {
      type: "generational",
      point: "Break the inherited repetition",
      opening: "When the cycle starts again",
      move: "Recognize the pattern and pause",
      line: "We're doing that thing again. Let's stop."
    }
  },
  {
    id: "5",
    name: "Boss",
    relationship_label: "Manager",
    relationship_state: "strained",
    pattern: "pursue_withdraw",
    leverage: {
      type: "pursuit_withdrawal",
      point: "Pause during withdrawal phase",
      opening: "After decompression",
      move: "Stop pursuing",
      line: "I'll give us some space. Let's talk later."
    }
  }
];

export default function TestMapPage() {
  return (
    <div className="min-h-screen bg-black text-white p-20 flex items-center justify-center">
      <RelationshipMap people={testPeople as any} />
    </div>
  );
}
