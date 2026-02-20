'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getConnections, addConnection, createCheckoutSession, mockConnections } from '@/lib/api';
import type { Connection } from '@/lib/types';
import { 
  AppShell, 
  EditorialRail, 
  MicroLabel, 
  H1, 
  H2,
  Body, 
  Spacer, 
  LineInput, 
  TextActionButton,
  LoadingScreen,
  LockedScreen 
} from '@/components/editorial';
import { BuildStamp } from '@/components/build-stamp';

export default function GridClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signOut } = useAuth();
  
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOSActive, setIsOSActive] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Add connection state
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [newConnection, setNewConnection] = useState({
    name: '',
    relationship_type: '',
    dob: '',
    birth_time: '',
    birth_city: '',
  });
  const [isAddingConnection, setIsAddingConnection] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    checkOSStatus();
    
    if (searchParams.get('success') === '1') {
      setTimeout(checkOSStatus, 1000);
    }
  }, [user, searchParams]);

  const checkOSStatus = async () => {
    setIsLoading(true);
    
    try {
      const hasOS = false; // TODO: Replace with actual subscription check
      
      setIsOSActive(hasOS);
      
      if (hasOS) {
        await loadConnections();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to check subscription status');
    } finally {
      setIsLoading(false);
    }
  };

  const loadConnections = async () => {
    try {
      const data = mockConnections;
      setConnections(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load connections');
    }
  };

  const handleUpgrade = async () => {
    setIsCheckingOut(true);
    setError('');
    
    try {
      const { url } = await createCheckoutSession('os');
      window.location.href = url;
    } catch (err: any) {
      setError(err.message || 'Failed to create checkout session');
      setIsCheckingOut(false);
    }
  };

  const handleAddConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingConnection(true);
    
    try {
      await addConnection(newConnection);
      await loadConnections();
      setIsAddingPerson(false);
      setNewConnection({
        name: '',
        relationship_type: '',
        dob: '',
        birth_time: '',
        birth_city: '',
      });
    } catch (err: any) {
      setError(err.message || 'Failed to add connection');
    } finally {
      setIsAddingConnection(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Locked state (no OS)
  if (!isOSActive) {
    return (
      <LockedScreen
        title="Grid locked"
        description="Requires DEFRAG OS to add and view your people."
        productName="DEFRAG OS"
        price="$33"
        priceInterval="month"
        features={[
          'Relational Grid for your network',
          'Connection readouts',
          'Crisis Mode AI support',
          'Network tension mapping'
        ]}
        onUnlock={handleUpgrade}
        isProcessing={isCheckingOut}
        error={error}
      />
    );
  }

  // Active OS Grid
  return (
    <AppShell>
      <EditorialRail width="app">
        <MicroLabel>Grid</MicroLabel>
        <Spacer size="s" />
        <H1>Your people.</H1>
        
        <Spacer size="xl" />

        {/* Connection list */}
        {connections.length === 0 && !isAddingPerson ? (
          <div>
            <Body muted>No connections yet.</Body>
            <Spacer size="m" />
            <TextActionButton onClick={() => setIsAddingPerson(true)}>
              Add your first person
            </TextActionButton>
          </div>
        ) : (
          <div className="space-y-0">
            {connections.map((connection) => (
              <div
                key={connection.id}
                onClick={() => router.push(`/readout/${connection.id}`)}
                className="group flex cursor-pointer items-center gap-4 border-b border-white/10 py-6"
              >
                {/* Tether line */}
                <div className="h-px w-10 bg-white/10" />

                {/* Node dot */}
                <div className="h-1.5 w-1.5 rounded-full bg-white/60" />

                {/* Connection info */}
                <div className="flex-1">
                  <p className="text-[15px] text-white">{connection.name}</p>
                  <p className="text-[12px] text-white/35 uppercase tracking-[0.35em] mt-1">
                    {connection.relationship_type}
                  </p>
                </div>

                {/* State glow */}
                <div className="h-1 w-1 rounded-full bg-white/40" />
              </div>
            ))}
          </div>
        )}

        {/* Add person action */}
        {connections.length > 0 && !isAddingPerson && (
          <>
            <Spacer size="xl" />
            <TextActionButton onClick={() => setIsAddingPerson(true)}>
              Add person
            </TextActionButton>
          </>
        )}

        {/* Add person form (inline expansion) */}
        {isAddingPerson && (
          <>
            <Spacer size="xl" />
            <div className="pt-12 border-t border-white/10">
              <H2>Add person</H2>
              <Spacer size="l" />

              <form onSubmit={handleAddConnection}>
                <div>
                  <MicroLabel>Name</MicroLabel>
                  <Spacer size="xs" />
                  <LineInput
                    value={newConnection.name}
                    onChange={(e) => setNewConnection({ ...newConnection, name: e.target.value })}
                    placeholder="Jane Doe"
                    required
                  />
                </div>

                <Spacer size="l" />

                <div>
                  <MicroLabel>Relationship</MicroLabel>
                  <Spacer size="xs" />
                  <LineInput
                    value={newConnection.relationship_type}
                    onChange={(e) => setNewConnection({ ...newConnection, relationship_type: e.target.value })}
                    placeholder="Partner"
                    required
                  />
                </div>

                <Spacer size="l" />

                <div>
                  <MicroLabel>Date of Birth</MicroLabel>
                  <Spacer size="xs" />
                  <LineInput
                    type="date"
                    value={newConnection.dob}
                    onChange={(e) => setNewConnection({ ...newConnection, dob: e.target.value })}
                    required
                  />
                </div>

                <Spacer size="l" />

                <div>
                  <MicroLabel>Birth Time (optional)</MicroLabel>
                  <Spacer size="xs" />
                  <LineInput
                    type="time"
                    value={newConnection.birth_time}
                    onChange={(e) => setNewConnection({ ...newConnection, birth_time: e.target.value })}
                  />
                </div>

                <Spacer size="l" />

                <div>
                  <MicroLabel>Birth City (optional)</MicroLabel>
                  <Spacer size="xs" />
                  <LineInput
                    value={newConnection.birth_city}
                    onChange={(e) => setNewConnection({ ...newConnection, birth_city: e.target.value })}
                    placeholder="Los Angeles"
                  />
                </div>

                {error && (
                  <>
                    <Spacer size="m" />
                    <Body muted>{error}</Body>
                  </>
                )}

                <Spacer size="xl" />

                <div className="flex gap-6">
                  <TextActionButton type="submit" disabled={isAddingConnection}>
                    {isAddingConnection ? 'Adding...' : 'Add person'}
                  </TextActionButton>
                  <TextActionButton 
                    type="button"
                    onClick={() => {
                      setIsAddingPerson(false);
                      setNewConnection({
                        name: '',
                        relationship_type: '',
                        dob: '',
                        birth_time: '',
                        birth_city: '',
                      });
                    }}
                  >
                    Cancel
                  </TextActionButton>
                </div>
              </form>
            </div>
          </>
        )}
      </EditorialRail>
      
      <BuildStamp />
    </AppShell>
  );
}
