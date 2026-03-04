"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, getSession } from "@/lib/supabase";
import { Lock, MessageCircle, Users, Calendar, Headphones, Plus, X, Copy, Check, UserPlus, Edit3, Shield } from "lucide-react";
import Link from "next/link";
import { TopNav } from "@/components/top-nav";
import { ServiceUnavailable } from "@/components/service-unavailable";
import { useToast } from "@/hooks/use-toast";
import RelationshipMap from "@/components/relationship-map";

type UserStatus = {
  plan: 'solo' | 'plus';
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

  if (!supabase) return <ServiceUnavailable />;

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

  const isPlus = status?.plan === 'plus';

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-sans antialiased">
        <TopNav />
        <main className="px-6 md:px-8 pt-12 pb-24 flex flex-col items-center">
          <div className="w-full max-w-[920px]">
            <div className="animate-pulse space-y-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="border border-white/10 bg-white/[0.02] rounded-xl p-6 md:p-8 space-y-4">
                  <div className="h-3 w-24 bg-white/[0.06] rounded" />
                  <div className="h-5 w-2/3 bg-white/[0.04] rounded" />
                  <div className="h-4 w-full bg-white/[0.04] rounded" />
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      <TopNav />
      <main className="px-6 md:px-8 pt-12 pb-24 flex flex-col items-center">
        <div className="w-full max-w-[920px] space-y-6">

          {/* ─── TODAY ─── */}
          <section className="border border-white/10 bg-white/[0.02] rounded-xl p-6 md:p-8 space-y-6 hover:border-white/20 hover:bg-white/[0.04] hover:translate-y-[-1px] transition-all duration-200 ease-out animate-fade-in">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-white/50" />
              <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">Today</h2>
            </div>

            <p className="text-[17px] md:text-[20px] leading-[1.6] text-white/70">
              Today favors slower conversations. Pressure may rise if discussions become defensive.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Pressure', value: 'Calm', color: 'text-green-400/80' },
                { label: 'Timing', value: 'Favorable', color: 'text-white' },
                { label: 'Best For', value: 'Listening', color: 'text-white' },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <span className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/45">{item.label}</span>
                  <p className={`text-[15px] md:text-[16px] font-medium ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ─── RELATIONAL MAP ─── */}
          {isPlus ? (
            <section className="border border-white/10 bg-white/[0.02] rounded-xl p-6 md:p-8 space-y-5 hover:border-white/20 hover:bg-white/[0.04] hover:translate-y-[-1px] transition-all duration-200 ease-out animate-fade-in delay-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-white/50" />
                  <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">Relational Field</h2>
                </div>
                <button
                  onClick={() => { setAddMode('choose'); setShowAddModal(true); }}
                  className="flex items-center gap-1.5 font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 hover:text-white/80 transition-colors duration-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add person
                </button>
              </div>

              {/* Pending invites */}
              {pendingInvites.length > 0 && (
                <div className="space-y-2">
                  {pendingInvites.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between border border-yellow-400/10 bg-yellow-400/[0.03] rounded-lg px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-yellow-400/60 animate-pulse" />
                        <span className="text-[14px] text-white/60">{inv.invitee_name || 'Unnamed'}</span>
                        <span className="font-mono text-[10px] text-yellow-400/60 uppercase tracking-[0.15em]">Pending</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Relationship Map */}
              <RelationshipMap
                people={people}
                onAddPerson={() => { setAddMode('choose'); setShowAddModal(true); }}
              />
            </section>
          ) : (
            <section className="border border-white/[0.06] bg-white/[0.01] rounded-xl p-6 md:p-8 space-y-4 animate-fade-in delay-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-white/30" />
                  <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/30">Relational Field</h2>
                </div>
                <Lock className="w-4 h-4 text-white/30" />
              </div>
              <p className="text-[15px] md:text-[16px] text-white/40 leading-[1.6]">
                Understand group dynamics by adding people you interact with.
              </p>
              <Link
                href="/unlock"
                className="inline-flex items-center justify-center h-[44px] px-6 border border-white/15 text-white/60 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/35 hover:shadow-[0_0_12px_rgba(255,255,255,0.08)] active:scale-[0.98] transition-all duration-200 ease-out"
              >
                Upgrade to Plus
              </Link>
            </section>
          )}

          {/* ─── ASK DEFRAG ─── */}
          <Link href="/chat" className="block group">
            <section className="border border-white/10 bg-white/[0.02] rounded-xl p-6 md:p-8 space-y-5 group-hover:border-white/20 group-hover:bg-white/[0.04] group-hover:translate-y-[-1px] transition-all duration-200 ease-out animate-fade-in delay-100">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-white/50" />
                <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">Ask DEFRAG</h2>
              </div>

              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  "Why does my dad push so hard?",
                  "Why can't my sister see my perspective?",
                  "How do I say this without escalation?",
                ].map((prompt, i) => (
                  <div key={i} className="border border-white/[0.06] bg-white/[0.02] rounded-lg px-4 py-3 text-[14px] md:text-[15px] text-white/55 hover:border-white/20 hover:text-white/70 transition-all duration-200">
                    {prompt}
                  </div>
                ))}
              </div>

              <span className="inline-flex items-center justify-center h-[44px] px-6 bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl group-hover:bg-white/90 transition-colors duration-200">
                Start Chat
              </span>
            </section>
          </Link>

          {/* ─── DAILY BRIEF ─── */}
          <section className="border border-white/10 bg-white/[0.02] rounded-xl p-6 md:p-8 space-y-5 hover:border-white/20 hover:bg-white/[0.04] hover:translate-y-[-1px] transition-all duration-200 ease-out animate-fade-in delay-150">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-white/50" />
              <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50">Daily Brief</h2>
            </div>

            <p className="text-[15px] md:text-[16px] text-white/65 leading-[1.6]">
              Daily overview of relational dynamics, timing windows, and communication patterns.
            </p>

            <div className="border border-white/[0.06] bg-white/[0.02] rounded-lg px-5 py-4 flex items-center justify-center">
              <span className="font-mono text-[11px] md:text-[12px] text-white/35 tracking-[0.2em] uppercase">Coming soon</span>
            </div>
          </section>

          {/* ─── UPGRADE (Solo only) ─── */}
          {!isPlus && (
            <Link href="/unlock" className="block group">
              <section className="border border-white/10 bg-white/[0.02] rounded-xl p-6 md:p-8 group-hover:border-white/20 group-hover:bg-white/[0.04] group-hover:translate-y-[-1px] transition-all duration-200 ease-out animate-fade-in delay-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.2em] text-white/50 mb-3">Upgrade to Plus</h2>
                    <p className="text-[15px] md:text-[16px] text-white/65 leading-[1.6]">
                      Unlock relationship mapping, multi-person dynamics, and priority support.
                    </p>
                  </div>
                  <span className="font-mono text-[15px] md:text-[16px] font-semibold text-white shrink-0 ml-6">
                    $33/mo →
                  </span>
                </div>
              </section>
            </Link>
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

  const handleManualSubmit = async () => {
    if (!name.trim() || !birthDate) return;
    setSubmitting(true);

    try {
      const session = await getSession();
      if (!session || !supabase) return;

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
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-[440px] border border-white/10 bg-[#0a0a0a] rounded-xl p-6 md:p-8 space-y-6 relative">
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
                className="w-full flex items-center gap-4 border border-white/[0.08] bg-white/[0.02] rounded-xl px-5 py-4 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200 text-left"
              >
                <Edit3 className="w-5 h-5 text-white/40 shrink-0" />
                <div>
                  <p className="text-[15px] text-white font-medium">Add manually</p>
                  <p className="text-[13px] text-white/35">Enter their birth details yourself</p>
                </div>
              </button>

              <button
                onClick={() => setMode('invite')}
                className="w-full flex items-center gap-4 border border-white/[0.08] bg-white/[0.02] rounded-xl px-5 py-4 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200 text-left"
              >
                <UserPlus className="w-5 h-5 text-white/40 shrink-0" />
                <div>
                  <p className="text-[15px] text-white font-medium">Send invite link</p>
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
                  className="w-full h-[44px] px-4 bg-white/[0.04] border border-white/10 rounded-xl text-[15px] text-white placeholder:text-white/25 outline-none focus:border-white/30 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Relationship</label>
                <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Father, Partner, Friend"
                  className="w-full h-[44px] px-4 bg-white/[0.04] border border-white/10 rounded-xl text-[15px] text-white placeholder:text-white/25 outline-none focus:border-white/30 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Date of birth</label>
                <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full h-[44px] px-4 bg-white/[0.04] border border-white/10 rounded-xl text-[15px] text-white outline-none focus:border-white/30 transition-colors [color-scheme:dark]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Birth time</label>
                  <input type="time" value={birthTime} onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full h-[44px] px-4 bg-white/[0.04] border border-white/10 rounded-xl text-[15px] text-white outline-none focus:border-white/30 transition-colors [color-scheme:dark]" />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Birth place</label>
                  <input type="text" value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} placeholder="City"
                    className="w-full h-[44px] px-4 bg-white/[0.04] border border-white/10 rounded-xl text-[15px] text-white placeholder:text-white/25 outline-none focus:border-white/30 transition-colors" />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setMode('choose')}
                className="flex-1 h-[44px] border border-white/15 text-white/60 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/30 transition-all duration-200">
                Back
              </button>
              <button onClick={handleManualSubmit} disabled={!name.trim() || !birthDate || submitting}
                className="flex-1 h-[44px] bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200">
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
                  className="w-full h-[44px] px-4 bg-white/[0.04] border border-white/10 rounded-xl text-[15px] text-white placeholder:text-white/25 outline-none focus:border-white/30 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Relationship</label>
                <input type="text" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Father, Partner, Friend"
                  className="w-full h-[44px] px-4 bg-white/[0.04] border border-white/10 rounded-xl text-[15px] text-white placeholder:text-white/25 outline-none focus:border-white/30 transition-colors" />
              </div>
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">Email (optional)</label>
                <input type="email" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="Their email address"
                  className="w-full h-[44px] px-4 bg-white/[0.04] border border-white/10 rounded-xl text-[15px] text-white placeholder:text-white/25 outline-none focus:border-white/30 transition-colors" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setMode('choose')}
                className="flex-1 h-[44px] border border-white/15 text-white/60 text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:text-white hover:border-white/30 transition-all duration-200">
                Back
              </button>
              <button onClick={handleInviteSubmit} disabled={!name.trim() || submitting}
                className="flex-1 h-[44px] bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200">
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
                className="flex-1 h-[44px] px-4 bg-white/[0.04] border border-white/10 rounded-xl text-[13px] text-white/60 font-mono outline-none truncate"
              />
              <button
                onClick={copyLink}
                className="h-[44px] px-4 border border-white/15 rounded-xl text-white/60 hover:text-white hover:border-white/30 transition-all duration-200"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <button onClick={onClose}
              className="w-full h-[44px] bg-white text-black text-[13px] font-mono font-semibold uppercase tracking-[0.08em] rounded-xl hover:bg-white/90 transition-all duration-200">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}