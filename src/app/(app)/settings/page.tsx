import { auth } from "@/auth";
import { SettingsPanel } from "@/components/settings-panel";
import { getUserWorkspace } from "@/lib/data";

export default async function SettingsPage() {
  const session = await auth();
  const workspace = await getUserWorkspace(session!.user!.id);

  return <SettingsPanel user={workspace.user} categories={workspace.categories} />;
}
