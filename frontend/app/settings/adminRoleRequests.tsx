import { getRoleRequests } from "@/lib/roleRequest";
import { approveRoleRequest } from "@/actions/approvingRoleRequestAction";
import { disapproveRoleRequest } from "@/actions/disapprovingRoleRequestAction";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Role } from "@prisma/client";
import { getUserNameFromId } from "@/lib/userSettings";

export default async function AdminRoleRequests() {
  const requests = await getRoleRequests();

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Role Change Requests</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>Requested Role</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.userId}>
              <TableCell>{getUserNameFromId(request.userId)}</TableCell>
              <TableCell>{request.role}</TableCell>
              <TableCell>{request.requestDate.toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <form
                    action={approveRoleRequest.bind(
                      null,
                      request.userId,
                      request.role as Role,
                    )}
                  >
                    <Button type="submit" variant="default">
                      Approve
                    </Button>
                  </form>
                  <form
                    action={disapproveRoleRequest.bind(null, request.userId)}
                  >
                    <Button type="submit" variant="destructive">
                      Disapprove
                    </Button>
                  </form>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
