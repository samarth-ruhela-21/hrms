import { Users, Building2, CalendarCheck, ClipboardList } from "lucide-react";
import StatCard from "@/components/StatCard";
import { useAttendanceSummary } from "@/hooks/useAttendance";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { data, isLoading } = useAttendanceSummary();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Overview of your HR management system</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Employees" value={data?.totalEmployees || 0} icon={Users} description="Active employees" />
          <StatCard title="Departments" value={data?.departments || 0} icon={Building2} description="Unique departments" />
          <StatCard title="Present Days" value={data?.presentToday || 0} icon={CalendarCheck} description="Total present records" />
          <StatCard title="Total Records" value={data?.totalRecords || 0} icon={ClipboardList} description="Attendance entries" />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
