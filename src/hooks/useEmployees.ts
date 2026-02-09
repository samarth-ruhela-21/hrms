import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Employee {
  id: string;
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
  created_at: string;
}

export interface NewEmployee {
  employee_id: string;
  full_name: string;
  email: string;
  department: string;
}

export function useEmployees() {
  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Employee[];
    },
  });
}

export function useAddEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (employee: NewEmployee) => {
      const { data, error } = await supabase
        .from("employees")
        .insert(employee)
        .select()
        .single();
      if (error) {
        if (error.code === "23505") {
          if (error.message.includes("employee_id")) throw new Error("Employee ID already exists");
          if (error.message.includes("email")) throw new Error("Email already exists");
        }
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      toast.success("Employee added successfully");
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
}

export function useDeleteEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("employees").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["employees"] });
      qc.invalidateQueries({ queryKey: ["attendance"] });
      toast.success("Employee deleted");
    },
    onError: () => {
      toast.error("Failed to delete employee");
    },
  });
}
