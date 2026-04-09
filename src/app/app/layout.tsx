import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/server/auth";

export default async function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();

  return <AppShell>{children}</AppShell>;
}
