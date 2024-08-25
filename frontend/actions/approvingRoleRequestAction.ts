"use server";

import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { approveRoleRequest as approveRoleRequestDB } from "@/lib/roleRequest";

export async function approveRoleRequest(userId: string, role: Role) {
  await approveRoleRequestDB(userId, role);
  revalidatePath("/settings");
}
