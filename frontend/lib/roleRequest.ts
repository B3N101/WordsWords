import prisma from "@/prisma/prisma";
import { Role, RoleRequest } from "@prisma/client";

export async function createRoleRequest(userId: string, role: Role) {
  return await prisma.roleRequest.create({
    data: {
      userId,
      role,
    },
  });
}

export async function approveRoleRequest(userId: string, role: Role) {
  await prisma.roleRequest.delete({
    where: {
      userId,
    },
  });

  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
  });
}

export async function getRoleRequests(): Promise<RoleRequest[]> {
  // sort by request date (most recent first)
  return await prisma.roleRequest.findMany({
    orderBy: {
      requestDate: "desc",
    },
  });
}
