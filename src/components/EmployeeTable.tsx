import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Trash2, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { type Employee, useDeleteEmployee } from "@/hooks/useEmployees";

interface Props {
  employees: Employee[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const departmentColors: Record<string, string> = {
  Engineering: "bg-accent text-accent-foreground",
  Design: "bg-accent text-accent-foreground",
  Marketing: "bg-accent text-accent-foreground",
  Sales: "bg-accent text-accent-foreground",
  HR: "bg-accent text-accent-foreground",
  Finance: "bg-accent text-accent-foreground",
  Operations: "bg-accent text-accent-foreground",
};

const EmployeeTable = ({ employees, isLoading, error }: Props) => {
  const deleteEmployee = useDeleteEmployee();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-14 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 py-12">
        <p className="text-sm font-medium text-destructive">Failed to load employees</p>
        <p className="mt-1 text-xs text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (!employees?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <Users className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">No employees yet</p>
        <p className="mt-1 text-xs text-muted-foreground">Add your first employee to get started</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Employee ID</TableHead>
            <TableHead className="font-semibold">Full Name</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Department</TableHead>
            <TableHead className="w-[80px] font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((emp) => (
            <TableRow key={emp.id} className="transition-colors">
              <TableCell className="font-mono text-sm">{emp.employee_id}</TableCell>
              <TableCell className="font-medium">{emp.full_name}</TableCell>
              <TableCell className="text-muted-foreground">{emp.email}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={departmentColors[emp.department] || ""}>
                  {emp.department}
                </Badge>
              </TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Employee</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete <strong>{emp.full_name}</strong>? This will also remove all their attendance records. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteEmployee.mutate(emp.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default EmployeeTable;
