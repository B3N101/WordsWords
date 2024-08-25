"use client";

import { useState } from "react";
import { Role } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateSettings } from "@/actions/updateSettingsActions";
import { useToast } from "@/components/ui/use-toast";

export default function SettingsForm({
  initialName,
  initialRole,
  className,
  teacherName,
  userId,
}: {
  initialName: string;
  initialRole: Role;
  className: string;
  teacherName: string;
  userId: string;
}) {
  const [name, setName] = useState(initialName);
  const [requestedRole, setRequestedRole] = useState<Role>(initialRole);
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    const result = await updateSettings(formData);
    if (result.success) {
      toast({
        title: "Settings updated",
        description: "Your settings have been successfully updated.",
      });
    } else {
      toast({
        title: "Error",
        description: "There was an error updating your settings.",
        variant: "destructive",
      });
    }
  };

  return (
    <form action={handleSubmit} className="space-y-4">
      <input type="hidden" name="userId" value={userId} />
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <Input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700"
        >
          Request Role
        </label>
        <Select
          name="requestedRole"
          onValueChange={(value) => setRequestedRole(value as Role)}
          defaultValue={initialRole}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="STUDENT">Student</SelectItem>
            <SelectItem value="TEACHER">Teacher</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <strong>Current Role:</strong> {initialRole}
      </div>
      <div>
        <strong>Class:</strong> {className}
      </div>
      <div>
        <strong>Teacher:</strong> {teacherName}
      </div>
      <Button type="submit">Update Settings</Button>
    </form>
  );
}
// "use client";

// import { useState } from "react";
// import { Role } from "@prisma/client";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { updateUserName } from "@/lib/userSettings";
// import { createRoleRequest } from "@/lib/roleRequest";

// export default function SettingsForm({
//   initialName,
//   initialRole,
//   className,
//   teacherName,
//   userId,
// }: {
//   initialName: string;
//   initialRole: Role;
//   className: string;
//   teacherName: string;
//   userId: string;
// }) {
//   const [name, setName] = useState(initialName);
//   const [requestedRole, setRequestedRole] = useState<Role>(initialRole);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     await updateUserName(userId, name);
//     if (requestedRole !== initialRole) {
//       await createRoleRequest(userId, requestedRole);
//     }
//     // You might want to add some feedback to the user here
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//           Name
//         </label>
//         <Input
//           type="text"
//           id="name"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="mt-1"
//         />
//       </div>
//       <div>
//         <label htmlFor="role" className="block text-sm font-medium text-gray-700">
//           Request Role
//         </label>
//         <Select onValueChange={(value) => setRequestedRole(value as Role)} defaultValue={initialRole}>
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Select a role" />
//           </SelectTrigger>
//           <SelectContent>
//             <SelectItem value="STUDENT">Student</SelectItem>
//             <SelectItem value="TEACHER">Teacher</SelectItem>
//             <SelectItem value="ADMIN">Admin</SelectItem>
//           </SelectContent>
//         </Select>
//       </div>
//       <div>
//         <strong>Current Role:</strong> {initialRole}
//       </div>
//       <div>
//         <strong>Class:</strong> {className}
//       </div>
//       <div>
//         <strong>Teacher:</strong> {teacherName}
//       </div>
//       <Button type="submit">Update Settings</Button>
//     </form>
//   );
// }
