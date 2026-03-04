"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, getSession } from "@/lib/supabase";
import { Lock, Plus, X, Copy, Check, UserPlus, Edit3, MessageCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { TopNav } from "@/components/top-nav";
import { ServiceUnavailable } from "@/components/service-unavailable";
import { useToast } from "@/hooks/use-toast";
import RelationshipMap from "@/components/relationship-map/relationship-map";
import Panel from "@/components/panel";
import TodaySummary from "@/components/today-summary";
import DailyInsight from "@/components/dashboard/daily-insight";
import { computeDailyInsight, type DailyInsight as DailyInsightType } from "@/lib/daily-insight";

type UserStatus = {
  plan: 'solo' | 'circle';
  has_relationships: boolean;
};

type Person = {
  id: string;
  name: string;
  relationship_label: string | null;
  birth_date: string;
  birth_time: string | null;
  birth_place: string | null;
  privacy_level: string;
  relationship_state: string | null;
  created_at: string;
};

type Invite = {
  id: string;
  invitee_name: string | null;
  status: string;
  created_at: string;
  expires_at: string | null;
  token: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<UserStatus | null>(null);
  const [people, setPeople] = useState<Person[]>([]);
  const [pendingInvites, setPendingInvites] = useState<Invite[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState<'choose' | 'manual' | 'invite'>('choose');
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [dailyBriefing, setDailyBriefing] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [planActivated, setPlanActivated] = useState(false);
  const [dailyInsight, setDailyInsight] = useState<DailyInsightType | null>(null);

  if (!supabase) return <ServiceUnavailable />;

  useEffect(() => {
    try {
      if (localStorage.getItem('defrag_plan_activated')) {
        setPlanActivated(true);
        localStorage.removeItem('defrag_plan_activated');
      }
    } catch {}
  }, []);

  useEffect(() => {
    async function loadStatus() {
      try {
        const session = await getSession();
        if (!session || !supabase) {
          router.push('/auth/login');
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('plan')
          .eq('user_id', session.user.id)
          .single();

        // Fetch people
        const { data: peopleData } = await supabase
          .from('people')
          .select('*')
          .eq('owner_user_id', session.user.id)
          .order('created_at', { ascending: false });

        setPeople(peopleData || []);

        // Compute daily insight from existing data
        if (peopleData && peopleData.length > 0) {
          const insight = computeDailyInsight({ people: peopleData });
          setDailyInsight(insight);
        }

        // Fetch daily briefing in background
        if (peopleData && peopleData.length > 0) {
          fetch('/api/daily-briefing')
            .then(res => res.json())
            .then(data => {
              if (data.summary) setDailyBriefing(data.summary);
            })
            .catch(() => {});
        }

        // Recompute relationship states in background (fire-and-forget)
        if (peopleData && peopleData.length > 0) {
          fetch('/api/people/recompute-states', { method: 'POST' })
            .then(res => res.json())
            .then(data => {
              if (data.states) {
                // Update people with fresh states
                setPeople(prev => {
                  const updated = prev.map(p => {
                    const fresh = data.states.find((s: { id: string; state: string }) => s.id === p.id);
                    return fresh ? { ...p, relationship_state: fresh.state } : p;
                  });
                  // Recompute insight with fresh states
                  setDailyInsight(computeDailyInsight({ people: updated }));
                  return updated;
                });
              }
            })
            .catch(() => { /* silent — states will be stale but functional */ });
        }

        // Fetch pending invites
        const { data: inviteData } = await supabase
          .from('invites')
          .select('*')
          .eq('inviter_user_id', session.user.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });

        setPendingInvites(inviteData || []);

        setStatus({
          plan: profile?.plan || 'solo',
          has_relationships: (peopleData?.length || 0) > 0,
        });
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, [router]);

  const isCircle = status?.plan === 'circle';

  if (loading) {
    return (
      <div className="min-h-screen text-white font-sans antialiased">
        <TopNav />
        <main className="max-w-[1100px] mx-auto px-6 pt-16 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`border border-white/10 bg-white/[0.02] p-6 space-y-4 ${
                  i % 2 === 1 ? "col-span-12 lg:col-span-7" : "col-span-12 lg:col-span-5"
                }`}
              >
                <div className="h-3 w-24 bg-white/[0.06] rounded animate-pulse" />
                <div className="h-5 w-2/3 bg-white/[0.04] rounded animate-pulse" />
                <div className="h-4 w-full bg-white/[0.04] rounded animate-pulse" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // Build relationship state list for Today panel, sorted by urgency
  const STATE_ORDER: Record<string, number> = {
    strained: 0, cooling: 1, improving: 2, stable: 3, unclear: 4,
  };
  const relationshipStates = people
    .map((p) => ({
      name: p.name,
      state: (p.relationship_state ?? 'unclear') as 'stable' | 'strained' | 'cooling' | 'improving' | 'unclear',
    }))
    .sort((a, b) => (STATE_ORDER[a.state] ?? 4) - (STATE_ORDER[b.state] ?? 4));

  const handleDeletePerson = async (personId: string) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('people')
        .delete()
        .eq('id', personId);
      if (error) throw error;
      setPeople(prev => prev.filter(p => p.id !== personId));
      setConfirmDeleteId(null);
      toast({ title: "Removed", description: "Person has been removed." });
    } catch (err) {
      console.error('Delete error:', err);
      toast({ title: "Error", description: "Could not remove person.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen text-white font-sans antialiased">
      <TopNav />
      <main className="max-w-[1100px] mx-auto px-6 pt-16 pb-24">

        {/* Stripe confirmation banner */}
        {planActivated && (
          <div className="mb-8 flex items-center justify-between border border-green-400/15 bg-green-400/[0.04] px-5 py-3.5 rounded-sm animate-fade-in">
            <p className="text-[14px] text-green-400/80">Your {status?.plan === 'circle' ? 'Circle' : 'Solo'} plan is active.</p>
            <button onClick={() => setPlanActivated(false)} className="text-white/30 hover:text-white/60 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <DailyInsight insight={dailyInsight} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* ─── Panel 1: Today Summary ─── */}
          <div className="col-span-12 lg:col-span-7 animate-fade-in">
            <Panel title="TODAY">
              {people.length === 0 ? (
                <p className="text-[14px] text-white/30 leading-[1.6]">
                  Today favors slower conversations. Add people to see relational state.
                </p>
              ) : (
                <div className="space-y-6">
                  {dailyBriefing && (
                    <p className="text-[14px] text-white/55 leading-[1.7]">
                      {dailyBriefing}
                    </p>
                  )}
                  <TodaySummary states={relationshipStates} />
                </div>
              )}
            </Panel>
          </div>

          {/* ─── Panel 2: Relationship Map ─── */}
          <div className="col-span-12 lg:col-span-5 animate-fade-in delay-50">
            {isCircle ? (
              <Panel title="RELATIONSHIP FIELD">
                {/* Pending invites */}
                {pendingInvites.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {pendingInvites.map((inv) => (
                      <div
                        key={inv.id}
                        className="flex items-center justify-between border border-yellow-400/10 bg-yellow-400/[0.03] px-4 py-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-yellow-400/60 animate-pulse" />
                          <span className="text-[14px] text-white/60">
                            {inv.invitee_name || "Unnamed"}
                          </span>
                          <span className="font-mono text-[10px] text-yellow-400/60 uppercase tracking-[0.15em]">
                            Pending
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <RelationshipMap
                  people={people.map(p => ({
                    id: p.id,
                    name: p.name,
                    relationship_label: p.relationship_label ?? undefined,
                    relationship_state: (p.relationship_state as any) ?? undefined,
                  }))}
                />
              </Panel>
            ) : (
              <Panel title="RELATIONSHIP FIELD">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] text-white/40 leading-[1.6]">
                      Understand group dynamics by adding people you interact with.
                    </p>
                    <Lock className="w-4 h-4 text-white/30 shrink-0 ml-4" />
                  </div>
                  <Link
                    href="/unlock"
                    className="inline-flex items-center justify-center h-[42px] px-5 border border-white/15 text-white/60 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] hover:text-white hover:border-white/35 active:scale-[0.98] transition-all duration-200"
                  >
                    Upgrade to Circle
                  </Link>
                </div>
              </Panel>
            )}
          </div>

          {/* ─── Panel 3: People ─── */}
          <div className="col-span-12 lg:col-span-5 animate-fade-in delay-100">
            <Panel title="PEOPLE">
              {people.length === 0 ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-[14px] text-white/50 leading-[1.6]">
                      Your relational field is empty.
                    </p>
                    <p className="text-[13px] text-white/30 leading-[1.6]">
                      Add someone to begin understanding your relationship dynamics.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setAddMode("choose");
                      setShowAddModal(true);
                    }}
                    className="inline-flex items-center justify-center h-[42px] px-5 border border-white/25 text-white/80 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] hover:text-white hover:border-white/50 active:scale-[0.98] transition-all duration-200"
                  >
                    Add first person
                  </button>
                </div>
              ) : (
                <div className="space-y-0">
                  {people.map((person) => (
                    <div
                      key={person.id}
                      className="group flex justify-between items-center py-2.5 border-b border-white/[0.05] last:border-b-0 hover:bg-white/[0.02] -mx-2 px-2 rounded-sm transition-colors duration-150"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-[14px] text-white/70 truncate">
                          {person.name}
                        </span>
                        <span className="text-[12px] text-white/30 font-mono shrink-0">
                          {person.relationship_label ?? "—"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
                        <Link
                          href={`/chat?person_id=${person.id}`}
                          className="p-1.5 text-white/30 hover:text-white/70 transition-colors"
                          title={`Chat about ${person.name}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </Link>
                        {confirmDeleteId === person.id ? (
                          <div className="flex items-center gap-1.5 animate-fade-in">
                            <button
                              onClick={() => handleDeletePerson(person.id)}
                              className="font-mono text-[10px] text-red-400/80 hover:text-red-400 uppercase tracking-[0.1em] transition-colors"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="font-mono text-[10px] text-white/30 hover:text-white/50 uppercase tracking-[0.1em] transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(person.id)}
                            className="p-1.5 text-white/20 hover:text-red-400/70 transition-colors"
                            title={`Remove ${person.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => {
                      setAddMode("choose");
                      setShowAddModal(true);
                    }}
                    className="mt-4 inline-flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.2em] text-white/40 hover:text-white/70 active:scale-[0.98] transition-all duration-200"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add person
                  </button>
                </div>
              )}
            </Panel>
          </div>

          {/* ─── Panel 4: Ask DEFRAG ─── */}
          <div className="col-span-12 lg:col-span-7 animate-fade-in delay-150">
            <Panel title="ASK DEFRAG">
              <div className="space-y-6">
                  <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    "Something feels tense",
                    "Conversation keeps repeating",
                    "I'm unsure what to say next",
                  ].map((prompt) => (
                    <Link
                      key={prompt}
                      href={`/chat?prompt=${encodeURIComponent(prompt)}`}
                      className="border border-white/10 bg-white/[0.02] px-4 py-3 text-[14px] text-white/55 hover:border-white/20 hover:bg-white/[0.04] hover:text-white/70 active:scale-[0.98] transition-all duration-200"
                    >
                      {prompt}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center h-[42px] px-6 bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] hover:bg-white/90 active:scale-[0.98] transition-all duration-200"
                >
                  Start Chat
                </Link>
              </div>
            </Panel>
          </div>

          {/* ─── Upgrade CTA (Solo only) ─── */}
          {!isCircle && (
            <div className="col-span-12 animate-fade-in delay-200">
              <Link href="/unlock" className="block group">
                <div className="border border-white/10 bg-white/[0.02] p-6 hover:border-white/20 hover:bg-white/[0.04] active:scale-[0.998] transition-all duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-mono text-[11px] uppercase tracking-[0.28em] text-white/40 font-medium mb-2">
                        Upgrade to Circle
                      </div>
                      <p className="text-[14px] text-white/65 leading-[1.6]">
                        Unlock relationship mapping, multi-person dynamics, and priority support.
                      </p>
                    </div>
                    <span className="font-mono text-[14px] font-semibold text-white shrink-0 ml-6">
                      $33/mo →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

        </div>
      </main>

      {/* ─── ADD PERSON MODAL ─── */}
      {showAddModal && (
        <AddPersonModal
          mode={addMode}
          setMode={setAddMode}
          onClose={() => { setShowAddModal(false); setAddMode('choose'); }}
          onPersonAdded={(person: Person) => {
            setPeople(prev => [person, ...prev]);
            setShowAddModal(false);
            setAddMode('choose');
            toast({ title: "Person added", description: `${person.name} has been added to your people.` });
          }}
          onInviteCreated={(invite: any) => {
            setPendingInvites(prev => [invite, ...prev]);
            toast({ title: "Invite sent", description: `Invite link created for ${invite.invitee_name || 'invitee'}.` });
          }}
        />
      )}
    </div>
  );
}

// ─── Privacy Badge ───
function PrivacyBadge({ level }: { level: string }) {
  const config: Record<string, { label: string; color: string }> = {
    full: { label: 'Full', color: 'text-green-400/70 border-green-400/20' },
    partial: { label: 'Partial', color: 'text-yellow-400/70 border-yellow-400/20' },
    minimal: { label: 'Minimal', color: 'text-white/40 border-white/10' },
  };
  const { label, color } = config[level] || config.full;

  return (
    <span className={`font-mono text-[10px] uppercase tracking-[0.15em] border rounded-full px-2.5 py-0.5 ${color}`}>
      {label}
    </span>
  );
}

// ─── Add Person Modal ───
function AddPersonModal({
  mode,
  setMode,
  onClose,
  onPersonAdded,
  onInviteCreated,
}: {
  mode: 'choose' | 'manual' | 'invite';
  setMode: (m: 'choose' | 'manual' | 'invite') => void;
  onClose: () => void;
  onPersonAdded: (person: any) => void;
  onInviteCreated: (invite: any) => void;
}) {
  const [name, setName] = useState('');
  const [label, setLabel] = useState('');
  const [contact, setContact] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleManualSubmit = async () => {
    if (!name.trim() || !birthDate) return;
    setSubmitting(true);

    try {
      const session = await getSession();
      if (!session || !supabase) return;

      // Check for duplicate person (name + relationship_label)
      const { data: existing } = await supabase
        .from('people')
        .select('id')
        .eq('owner_user_id', session.user.id)
        .ilike('name', name.trim())
        .limit(1);

      if (existing && existing.length > 0) {
        toast({ title: "Already exists", description: `${name.trim()} is already in your circle.`, variant: "destructive" });
        setSubmitting(false);
        return;
      }

      const { data, error } = await supabase
        .from('people')
        .insert({
          owner_user_id: session.user.id,
          name: name.trim(),
          relationship_label: label.trim() || null,
          birth_date: birthDate,
          birth_time: birthTime || null,
          birth_place: birthPlace.trim() || null,
          privacy_level: 'full',
        })
        .select('*')
        .single();

      if (error) throw error;
      onPersonAdded(data);
    } catch (err) {
      console.error('Manual add error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInviteSubmit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/invite/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          relationship_label: label.trim() || null,
          contact: contact.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setInviteLink(data.invite.link);
      onInviteCreated({ ...data.invite, invitee_name: name.trim() });
    } catch (err) {
      console.error('Invite create error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast({ title: "Link copied", description: "Invite link copied to clipboard." });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-[440px] border border-white/10 bg-[#0a0a0a] rounded-sm p-6 md:p-8 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Choose mode */}
        {mode === 'choose' && (
          <div className="space-y-5">
            <div className="text-center space-y-1">
              <h2 className="text-[20px] font-normal tracking-[-0.015em] text-white">Add a person</h2>
              <p className="text-[14px] text-white/40">How would you like to add them?</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setMode('manual')}
                className="w-full flex items-center gap-4 border border-white/10 bg-white/[0.02] rounded-sm px-5 py-4 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200 text-left"
              >
                <Edit3 className="w-5 h-5 text-white/40 shrink-0" />
                <div>
                  <p className="text-[14px] text-white font-medium">Add manually</p>
                  <p className="text-[13px] text-white/35">Enter their birth details yourself</p>
                </div>
              </button>

              <button
                onClick={() => setMode('invite')}
                className="w-full flex items-center gap-4 border border-white/10 bg-white/[0.02] rounded-sm px-5 py-4 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200 text-left"
              >
                <UserPlus className="w-5 h-5 text-white/40 shrink-0" />
                <div>
                  <p className="text-[14px] text-white font-medium">Send invite link</p>
                  <p className="text-[13px] text-white/35">They submit their own birth details privately</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Manual entry */}
        {mode === 'manual' && (
          <div className="space-y-5">
            <div>
              <h2 className="text-[20px] font-normal tracking-[-0.015em] text-white">Add manually</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="First name"
                  className="w-full h-[44px] px-4 bg-white/[0.04] border border-white/10 rounded-sm text-[14px] text-white placeholder:text-white/25 outline-none focus:border-white/30 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Relationship</label>
                <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Father, Partner, Friend"
                  className="w-full h-[44px] px-4 bg-white/[0.04] border border-white/10 rounded-sm text-[14px] text-white placeholder:text-white/25 outline-none focus:border-white/30 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Date of birth</label>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full h-[44px] px-4 bg-white/[0.04] border border-white/10 rounded-sm text-[14px] text-white outline-none focus:border-white/30 transition-colors [color-scheme:dark]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Birth time</label>
                  <input type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full h-[44px] px-4 bg-white/[0.04] border border-white/10 rounded-sm text-[14px] text-white outline-none focus:border-white/30 transition-colors [color-scheme:dark]" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Birth place</label>
                  <input type="text" value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} placeholder="City"
                    className="w-full h-[44px] px-4 bg-white/[0.04] border border-white/10 rounded-sm text-[14px] text-white placeholder:text-white/25 outline-none focus:border-white/30 transition-colors" />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setMode('choose')}
                className="flex-1 h-[44px] border border-white/15 text-white/60 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:text-white hover:border-white/30 transition-all duration-200">
                Back
              </button>
              <button onClick={handleManualSubmit} disabled={!name.trim() || !birthDate || submitting}
                className="flex-1 h-[44px] bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200">
                {submitting ? 'Adding…' : 'Add person'}
              </button>
            </div>
          </div>
        )}

        {/* Invite mode */}
        {mode === 'invite' && !inviteLink && (
          <div className="space-y-5">
            <div>
              <h2 className="text-[20px] font-normal tracking-[-0.015em] text-white">Send invite link</h2>
              <p className="text-[14px] text-white/40 mt-1">They&apos;ll submit their own birth details privately.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Their name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="First name"
                  className="w-full h-[44px] px-4 bg-white/[0.04] border border-white/10 rounded-sm text-[14px] text-white placeholder:text-white/25 outline-none focus:border-white/30 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Relationship</label>
                <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Father, Partner, Friend"
                  className="w-full h-[44px] px-4 bg-white/[0.04] border border-white/10 rounded-sm text-[14px] text-white placeholder:text-white/25 outline-none focus:border-white/30 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Email (optional)</label>
                <input type="email" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Their email address"
                  className="w-full h-[44px] px-4 bg-white/[0.04] border border-white/10 rounded-sm text-[14px] text-white placeholder:text-white/25 outline-none focus:border-white/30 transition-colors" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setMode('choose')}
                className="flex-1 h-[44px] border border-white/15 text-white/60 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:text-white hover:border-white/30 transition-all duration-200">
                Back
              </button>
              <button onClick={handleInviteSubmit} disabled={!name.trim() || submitting}
                className="flex-1 h-[44px] bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200">
                {submitting ? 'Creating…' : 'Create invite'}
              </button>
            </div>
          </div>
        )}

        {/* Invite link created */}
        {mode === 'invite' && inviteLink && (
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full border border-green-400/30 bg-green-400/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-[20px] font-normal tracking-[-0.015em] text-white">Invite created</h2>
              <p className="text-[14px] text-white/40">Share this link with {name || 'them'}. Expires in 7 days.</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={inviteLink}
                className="flex-1 h-[44px] px-4 bg-white/[0.04] border border-white/10 rounded-sm text-[13px] text-white/60 font-mono outline-none truncate"
              />
              <button
                onClick={copyLink}
                className="h-[44px] px-4 border border-white/15 rounded-sm text-white/60 hover:text-white hover:border-white/30 transition-all duration-200"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button onClick={onClose}
              className="w-full h-[44px] bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-sm hover:bg-white/90 transition-all duration-200">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}