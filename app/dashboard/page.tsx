import { redirect } from 'next/navigation';
import DashboardClient from './dashboard-client';
import { getMeStatus } from '@/lib/me-status';
import { createServerClient } from '@/lib/auth-server';

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  const status = await getMeStatus();

  if (!status.profile_ready) {
    redirect('/onboarding');
  }

  if (status.profile_ready && !status.has_relationships) {
    redirect('/relationships/new');
  }

  return <DashboardClient />;
}
