import { useState } from "react";
import MarkAttendanceDialog from "@/components/MarkAttendanceDialog";
import AttendanceTable from "@/components/AttendanceTable";
import { useAttendance } from "@/hooks/useAttendance";
import { useEmployees } from "@/hooks/useEmployees";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const Attendance = () => {
  const [employeeId, setEmployeeId] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: employees } = useEmployees();
  const { data, isLoading, error } = useAttendance({
    employeeId: employeeId || undefined,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
  });

  const hasFilters = employeeId || dateFrom || dateTo;
  const clearFilters = () => {
    setEmployeeId("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Attendance</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track employee attendance{data?.length ? ` · ${data.length} records` : ""}
          </p>
        </div>
        <MarkAttendanceDialog />
      </div>

      {/* Filters */}
      <div className="animate-fade-in flex flex-wrap items-end gap-4 rounded-xl border bg-card p-4">
        <div className="min-w-[180px] space-y-1.5">
          <Label className="text-xs text-muted-foreground">Employee</Label>
          <Select value={employeeId} onValueChange={setEmployeeId}>
            <SelectTrigger>
              <SelectValue placeholder="All employees" />
            </SelectTrigger>
            <SelectContent>
              {employees?.map((emp) => (
                <SelectItem key={emp.id} value={emp.id}>
                  {emp.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">From</Label>
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-[160px]" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">To</Label>
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-[160px]" />
        </div>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
            <X className="mr-1 h-3 w-3" /> Clear
          </Button>
        )}
      </div>

      <AttendanceTable records={data} isLoading={isLoading} error={error} />
    </div>
  );
};

export default Attendance;
