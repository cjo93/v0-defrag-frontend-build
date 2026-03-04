import { getMeStatus } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const status = await getMeStatus();

  if (!status.profile_ready) {
    redirect("/onboarding");
  }

  if (!status.has_relationships) {
    redirect("/relationships");
  }

  return <>{children}</>;
}
