"use server";

import { createRoleRequest } from "@/lib/roleRequest";
import { updateUserName, getUserRoleFromId } from "@/lib/userSettings";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateSettings(formData: FormData) {
  const userId = formData.get("userId") as string;
  const name = formData.get("name") as string;
  const requestedRole = formData.get("requestedRole") as Role;

  try {
    await updateUserName(userId, name);

    const currentRole = await getUserRoleFromId(userId);
    if (requestedRole !== currentRole) {
      await createRoleRequest(userId, requestedRole);
    }

    revalidatePath("/settings");

    return { success: true };
  } catch (error) {
    console.error("Error updating settings:", error);
    return { success: false };
  }
}
