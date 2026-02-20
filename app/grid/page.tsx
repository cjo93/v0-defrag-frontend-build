'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation } from '@/components/navigation';
import { BuildStamp } from '@/components/build-stamp';
import { CTAButton } from '@/components/cta-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth-context';
import { getConnections, addConnection, createCheckoutSession, mockConnections } from '@/lib/api';
import type { Connection } from '@/lib/types';
import { Plus } from 'lucide-react';

export default function GridPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, signOut } = useAuth();
  
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOSActive, setIsOSActive] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  // Add connection modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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
    
    // Check for success parameter (returned from Stripe)
    if (searchParams.get('success') === '1') {
      setTimeout(checkOSStatus, 1000);
    }
  }, [user, searchParams]);

  const checkOSStatus = async () => {
    setIsLoading(true);
    
    try {
      // TODO: Replace with actual subscription check
      // For now, simulate OS status - set to false to show upgrade screen
      const hasOS = false;
      
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
      // TODO: Replace with actual API call
      // const data = await getConnections();
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
      setIsAddModalOpen(false);
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
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation isAuthenticated={true} onSignOut={signOut} />
        <main className="flex flex-1 items-center justify-center safe-top safe-bottom">
          <p className="text-muted-foreground">Loading...</p>
        </main>
        <BuildStamp />
      </div>
    );
  }

  // Locked state (no OS)
  if (!isOSActive) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navigation isAuthenticated={true} onSignOut={signOut} />
        
        <main className="flex flex-1 flex-col items-center justify-center px-6 safe-top safe-bottom">
          <div className="flex max-w-md flex-col gap-6 text-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold">Upgrade Required</h1>
              <p className="text-sm text-muted-foreground">
                The Grid requires DEFRAG OS
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-lg border border-border bg-muted/20 p-6">
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold">DEFRAG OS</h2>
                <p className="text-sm text-muted-foreground">
                  Full access to Grid, Crisis Mode, and connection analysis
                </p>
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">$33</span>
                <span className="text-muted-foreground">/month</span>
              </div>

              <ul className="flex flex-col gap-2 text-left text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-foreground">•</span>
                  <span>Relational Grid for your network</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground">•</span>
                  <span>Connection readouts for your people</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground">•</span>
                  <span>Crisis Mode AI support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-foreground">•</span>
                  <span>Network tension mapping</span>
                </li>
              </ul>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <CTAButton 
                onClick={handleUpgrade} 
                disabled={isCheckingOut}
                className="w-full"
              >
                {isCheckingOut ? 'Redirecting...' : 'Upgrade to DEFRAG OS'}
              </CTAButton>
            </div>
          </div>
        </main>
        
        <BuildStamp />
      </div>
    );
  }

  // Active OS Grid
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navigation isAuthenticated={true} onSignOut={signOut} />
      
      <main className="flex flex-1 flex-col px-6 py-16 safe-top safe-bottom">
        <div className="mx-auto w-full max-w-2xl">
          {/* Header */}
          <div className="mb-12 flex items-center justify-between">
            <h1 className="text-3xl font-bold">Grid</h1>
            
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add person
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add person</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleAddConnection} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={newConnection.name}
                      onChange={(e) => setNewConnection({ ...newConnection, name: e.target.value })}
                      required
                      className="bg-muted"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="relationship">Relationship</Label>
                    <Select
                      value={newConnection.relationship_type}
                      onValueChange={(value) => setNewConnection({ ...newConnection, relationship_type: value })}
                    >
                      <SelectTrigger className="bg-muted">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Partner">Partner</SelectItem>
                        <SelectItem value="Parent">Parent</SelectItem>
                        <SelectItem value="Child">Child</SelectItem>
                        <SelectItem value="Sibling">Sibling</SelectItem>
                        <SelectItem value="Friend">Friend</SelectItem>
                        <SelectItem value="Colleague">Colleague</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={newConnection.dob}
                      onChange={(e) => setNewConnection({ ...newConnection, dob: e.target.value })}
                      required
                      className="bg-muted"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="birth_time">Birth Time (optional)</Label>
                    <Input
                      id="birth_time"
                      type="time"
                      value={newConnection.birth_time}
                      onChange={(e) => setNewConnection({ ...newConnection, birth_time: e.target.value })}
                      className="bg-muted"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="birth_city">Birth City (optional)</Label>
                    <Input
                      id="birth_city"
                      value={newConnection.birth_city}
                      onChange={(e) => setNewConnection({ ...newConnection, birth_city: e.target.value })}
                      className="bg-muted"
                    />
                  </div>

                  {error && <p className="text-sm text-destructive">{error}</p>}

                  <CTAButton type="submit" disabled={isAddingConnection} className="w-full">
                    {isAddingConnection ? 'Adding...' : 'Add person'}
                  </CTAButton>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Empty state */}
          {connections.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="text-muted-foreground">No connections yet</p>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Add your first person
              </Button>
            </div>
          ) : (
            /* Connection grid */
            <div className="flex flex-col gap-0">
              <AnimatePresence mode="popLayout">
                {connections.map((connection, index) => (
                  <motion.div
                    key={connection.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ 
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: [0.22, 1, 0.36, 1]
                    }}
                    layoutId={connection.id}
                    onClick={() => router.push(`/readout/${connection.id}`)}
                    className="group relative flex cursor-pointer items-center gap-4 border-b border-border py-6 transition-colors hover:bg-muted/20"
                  >
                    {/* Tether line */}
                    <div className="relative h-px w-12 overflow-hidden bg-border">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{
                          x: ['-100%', '200%'],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    </div>

                    {/* Node dot */}
                    <div className="h-2 w-2 rounded-full bg-white" />

                    {/* Connection info */}
                    <div className="flex flex-1 flex-col gap-1">
                      <p className="font-semibold">{connection.name}</p>
                      <p className="text-sm text-muted-foreground">{connection.relationship_type}</p>
                    </div>

                    {/* State glow (subtle, not labeled) */}
                    <div className="h-1 w-1 rounded-full bg-white/60" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
      
      <BuildStamp />
    </div>
  );
}
