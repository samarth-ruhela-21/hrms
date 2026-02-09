import AddEmployeeDialog from "@/components/AddEmployeeDialog";
import EmployeeTable from "@/components/EmployeeTable";
import { useEmployees } from "@/hooks/useEmployees";

const Employees = () => {
  const { data, isLoading, error } = useEmployees();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Employees</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your employee records{data?.length ? ` · ${data.length} total` : ""}
          </p>
        </div>
        <AddEmployeeDialog />
      </div>
      <EmployeeTable employees={data} isLoading={isLoading} error={error} />
    </div>
  );
};

export default Employees;
