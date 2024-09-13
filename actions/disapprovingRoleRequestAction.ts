"use server";

import prisma from "@/prisma/prisma";
import { revalidatePath } from "next/cache";

export async function disapproveRoleRequest(userId: string) {
  try {
    // Delete the role request
    await prisma.roleRequest.delete({
      where: { userId: userId },
    });

    // Revalidate the relevant paths
    revalidatePath("/settings");

    // Optionally, you could add logic here to notify the user that their request was disapproved

    return { success: true };
  } catch (error) {
    console.error("Error disapproving role request:", error);
    return { success: false, error: "Failed to disapprove role request" };
  }
}
