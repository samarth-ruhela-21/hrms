import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
}

const StatCard = ({ title, value, icon: Icon, description }: StatCardProps) => (
  <div className="animate-fade-in rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="mt-1 text-3xl font-bold text-foreground">{value}</p>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent">
        <Icon className="h-6 w-6 text-accent-foreground" />
      </div>
    </div>
  </div>
);

export default StatCard;
