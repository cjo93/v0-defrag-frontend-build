import { redirect } from "next/navigation";
import { getUserStatus, getRedirectPath } from "@/lib/me-status";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const status = await getUserStatus();
  
  // Not authenticated
  if (!status) {
    redirect('/auth/login');
  }

  // No birthline → onboarding
  if (!status.has_birthline) {
    redirect('/onboarding');
  }

  // Not unlocked → unlock screen
  if (!status.is_basic_unlocked) {
    redirect('/unlock');
  }

  // User is authenticated and unlocked
  return (
    <div className="min-h-screen bg-black">
      {children}
    </div>
  );
}
