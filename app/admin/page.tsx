import { auth } from "@/auth/auth";
import { getUserRoleFromId } from "@/lib/userSettings";
import { redirect } from "next/navigation";
import UserManagement from "@/app/admin/management";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MX Words Words | User Management",
  description: "Admin User Management Page",
};

export default async function AdminUsersPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/login");
  }

  const userRole = await getUserRoleFromId(userId);

  if (userRole !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User Management</h1>
      <UserManagement />
    </div>
  );
}
