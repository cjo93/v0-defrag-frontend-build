import { redirect } from 'next/navigation';
import DashboardClient from './dashboard-client';
import { getUserStatus } from '@/lib/me-status';
import { createServerClient } from '@/lib/auth-server';

export default async function DashboardPage() {
  const supabase = await createServerClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/auth/login');  }

  const status = await getUserStatus();

  if (!status || !status.profile_ready) {
    redirect('/onboarding');
  }

  if (status.profile_ready && !status.has_relationships) {
    redirect('/relationships');  }

  return <DashboardClient />;
}
