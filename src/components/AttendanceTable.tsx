import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CalendarCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { type AttendanceRecord } from "@/hooks/useAttendance";
import { format, parseISO } from "date-fns";

interface Props {
  records: AttendanceRecord[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

const AttendanceTable = ({ records, isLoading, error }: Props) => {
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
        <p className="text-sm font-medium text-destructive">Failed to load attendance records</p>
        <p className="mt-1 text-xs text-muted-foreground">{error.message}</p>
      </div>
    );
  }

  if (!records?.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <CalendarCheck className="h-7 w-7 text-muted-foreground" />
        </div>
        <p className="mt-4 text-sm font-medium text-foreground">No attendance records</p>
        <p className="mt-1 text-xs text-muted-foreground">Start marking attendance for employees</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Employee</TableHead>
            <TableHead className="font-semibold">Employee ID</TableHead>
            <TableHead className="font-semibold">Department</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((rec) => (
            <TableRow key={rec.id} className="transition-colors">
              <TableCell className="font-medium">{rec.employees?.full_name || "—"}</TableCell>
              <TableCell className="font-mono text-sm">{rec.employees?.employee_id || "—"}</TableCell>
              <TableCell className="text-muted-foreground">{rec.employees?.department || "—"}</TableCell>
              <TableCell>{format(parseISO(rec.date), "MMM d, yyyy")}</TableCell>
              <TableCell>
                <Badge
                  variant={rec.status === "Present" ? "default" : "destructive"}
                  className={rec.status === "Present" ? "bg-success text-success-foreground" : ""}
                >
                  {rec.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceTable;
