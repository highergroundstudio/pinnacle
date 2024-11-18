import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, Settings, Users } from "lucide-react";

const stats = [
  {
    title: "Total Deals",
    value: "0",
    icon: Building2,
  },
  {
    title: "Active Brokers",
    value: "0",
    icon: Users,
  },
  {
    title: "Documents Processed",
    value: "0",
    icon: FileText,
  },
  {
    title: "System Status",
    value: "Online",
    icon: Settings,
  },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}