import { auth } from "@/auth/auth";
import {
  getUserRoleFromId,
  getUserNameFromId,
  getUserClassNamesFromId,
  getTeacherNameFromUserId,
} from "@/lib/userSettings";
import { Role } from "@prisma/client";
import SettingsForm from "./settingsForm";
import AdminRoleRequests from "./adminRoleRequests";
import type { Metadata } from "next";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "MX Words Words | Settings",
  description: "MX Words Words Settings Page",
};

export default async function Page() {
  const session = await auth();
  const id = session?.user?.id!;

  if (!session) {
    throw new Error("Not authenticated");
  }

  let role: Role = await getUserRoleFromId(id);
  const className = await getUserClassNamesFromId(id);
  const teacherName = (await getTeacherNameFromUserId(id)) ?? "No teacher";
  const userName = await getUserNameFromId(id);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Settings</h1>
      <SettingsForm
        initialName={userName ?? ""}
        initialRole={role}
        className={className[0] ?? "No class"}
        teacherName={teacherName[0]}
        userId={id}
      />
      <Separator className="my-4" />
      {role === "ADMIN" && <AdminRoleRequests />}
    </div>
  );
}
