import { auth } from "@/auth/auth";
import {
  getUserRoleFromId,
  getUserNameFromId,
  getUserClassNamesFromId,
  getTeacherNameFromUserId,
} from "@/lib/userSettings";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import SettingsForm from "./settingsForm";
import AdminRoleRequests from "./adminRoleRequests";
import type { Metadata } from "next";

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
      {role === "ADMIN" ? (
        <AdminRoleRequests />
      ) : (
        <SettingsForm
          initialName={userName ?? ""}
          initialRole={role}
          className={className[0] ?? "No class"}
          teacherName={teacherName[0]}
          userId={id}
        />
      )}
    </div>
  );
}

// import { auth } from "@/auth/auth";
// import {
//   changeRoleToAdmin,
//   changeRoleToStudent,
//   changeRoleToTeacher,
//   getUserRoleFromId,
//   getUserNameFromId,
//   getUserClassNamesFromId,
//   getTeacherNameFromUserId,
// } from "@/lib/userSettings";
// import { Role } from "@prisma/client";
// import { revalidatePath } from "next/cache";
// import RoleButton from "./roleButton";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "MX Words Words | Settings",
//   description: "MX Words Words Settings Page",
// };

// export default async function Page() {
//   const session = await auth();
//   const id = session?.user?.id!;

//   let role: Role = await getUserRoleFromId(id);
//   const className = await getUserClassNamesFromId(id);
//   const teacherName = (await getTeacherNameFromUserId(id)) ?? "No teacher";
//   const userName = await getUserNameFromId(id);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">User Information</h1>
//       <p>
//         <strong>Role:</strong> {role}
//       </p>
//       <p>
//         <strong>Class:</strong> {className ?? "No class"}
//       </p>
//       <p>
//         <strong>Teacher:</strong> {teacherName}
//       </p>
//       <p>
//         <strong>Name:</strong> {userName}
//       </p>

//       <h2 className="text-xl font-semibold mt-6 mb-2">Change Role</h2>
//       <div className="space-y-2">
//         <RoleButton
//           action={async () => {
//             "use server";
//             await changeRoleToTeacher(id);
//             revalidatePath("/settings");
//           }}
//           label="Change Role To Teacher"
//         />
//         <RoleButton
//           action={async () => {
//             "use server";
//             await changeRoleToStudent(id);
//             revalidatePath("/settings");
//           }}
//           label="Change Role To Student"
//         />
//         <RoleButton
//           action={async () => {
//             "use server";
//             await changeRoleToAdmin(id);
//             revalidatePath("/settings");
//           }}
//           label="Change Role To Admin"
//         />
//       </div>
//     </div>
//   );
// }
