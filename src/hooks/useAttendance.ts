import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface AttendanceRecord {
  id: string;
  employee_id: string;
  date: string;
  status: "Present" | "Absent";
  created_at: string;
  employees?: {
    full_name: string;
    employee_id: string;
    department: string;
  };
}

export function useAttendance(filters?: { employeeId?: string; dateFrom?: string; dateTo?: string }) {
  return useQuery({
    queryKey: ["attendance", filters],
    queryFn: async () => {
      let query = supabase
        .from("attendance")
        .select("*, employees(full_name, employee_id, department)")
        .order("date", { ascending: false });

      if (filters?.employeeId) query = query.eq("employee_id", filters.employeeId);
      if (filters?.dateFrom) query = query.gte("date", filters.dateFrom);
      if (filters?.dateTo) query = query.lte("date", filters.dateTo);

      const { data, error } = await query;
      if (error) throw error;
      return data as AttendanceRecord[];
    },
  });
}

export function useMarkAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (record: { employee_id: string; date: string; status: "Present" | "Absent" }) => {
      const { data, error } = await supabase
        .from("attendance")
        .upsert(record, { onConflict: "employee_id,date" })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["attendance"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success("Attendance marked");
    },
    onError: () => {
      toast.error("Failed to mark attendance");
    },
  });
}

export function useAttendanceSummary() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data: employees, error: empErr } = await supabase
        .from("employees")
        .select("id, full_name, department");
      if (empErr) throw empErr;

      const { data: attendance, error: attErr } = await supabase
        .from("attendance")
        .select("employee_id, status");
      if (attErr) throw attErr;

      const totalEmployees = employees?.length || 0;
      const departments = new Set(employees?.map((e) => e.department)).size;
      const presentToday = attendance?.filter(
        (a) => a.status === "Present" && a.employee_id
      ).length || 0;
      const totalRecords = attendance?.length || 0;

      return { totalEmployees, departments, presentToday, totalRecords };
    },
  });
}
