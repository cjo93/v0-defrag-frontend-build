import { redirect } from 'next/navigation';
import { getMeStatus } from '@/lib/me-status';
import DashboardClient from './dashboard-client';
import { createServerClient } from '@/lib/auth-server';

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { profile_ready, has_relationships } = await getMeStatus();

  if (!profile_ready) {
    redirect('/onboarding');
  }

  if (has_relationships === false) {
    redirect('/relationships/new');
  }

  return <DashboardClient />;
}
