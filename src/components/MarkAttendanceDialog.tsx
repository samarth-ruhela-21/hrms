import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarCheck } from "lucide-react";
import { useEmployees } from "@/hooks/useEmployees";
import { useMarkAttendance } from "@/hooks/useAttendance";
import { format } from "date-fns";

const MarkAttendanceDialog = () => {
  const [open, setOpen] = useState(false);
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [status, setStatus] = useState<"Present" | "Absent">("Present");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: employees } = useEmployees();
  const markAttendance = useMarkAttendance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!employeeId) newErrors.employee = "Select an employee";
    if (!date) newErrors.date = "Select a date";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    try {
      await markAttendance.mutateAsync({ employee_id: employeeId, date, status });
      setOpen(false);
      setEmployeeId("");
      setStatus("Present");
    } catch {
      // handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <CalendarCheck className="mr-2 h-4 w-4" />
          Mark Attendance
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Mark Attendance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Employee</Label>
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees?.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.full_name} ({emp.employee_id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employee && <p className="text-xs text-destructive">{errors.employee}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="att-date">Date</Label>
            <Input
              id="att-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && <p className="text-xs text-destructive">{errors.date}</p>}
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as "Present" | "Absent")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Present">Present</SelectItem>
                <SelectItem value="Absent">Absent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={markAttendance.isPending}>
            {markAttendance.isPending ? "Saving..." : "Mark Attendance"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MarkAttendanceDialog;
