import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";
import { useAddEmployee } from "@/hooks/useEmployees";
import { z } from "zod";

const departments = ["Engineering", "Design", "Marketing", "Sales", "HR", "Finance", "Operations"];

const schema = z.object({
  employee_id: z.string().trim().min(1, "Employee ID is required").max(20, "Max 20 characters"),
  full_name: z.string().trim().min(1, "Full name is required").max(100, "Max 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Max 255 characters"),
  department: z.string().min(1, "Department is required"),
});

const AddEmployeeDialog = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ employee_id: "", full_name: "", email: "", department: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const addEmployee = useAddEmployee();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    try {
      await addEmployee.mutateAsync(result.data as { employee_id: string; full_name: string; email: string; department: string });
      setForm({ employee_id: "", full_name: "", email: "", department: "" });
      setOpen(false);
    } catch {
      // error handled by hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee_id">Employee ID</Label>
            <Input
              id="employee_id"
              placeholder="e.g. EMP001"
              value={form.employee_id}
              onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
            />
            {errors.employee_id && <p className="text-xs text-destructive">{errors.employee_id}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              placeholder="e.g. John Smith"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
            {errors.full_name && <p className="text-xs text-destructive">{errors.full_name}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="e.g. john@company.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <Label>Department</Label>
            <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && <p className="text-xs text-destructive">{errors.department}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={addEmployee.isPending}>
            {addEmployee.isPending ? "Adding..." : "Add Employee"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeDialog;
