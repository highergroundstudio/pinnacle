import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, Mountain, Users } from "lucide-react";

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
    title: "Peak Performance",
    value: "100%",
    icon: Mountain,
  },
];

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Welcome to Pinnacle</h1>
        <p className="text-muted-foreground">
          Your professional deal management platform
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="backdrop-blur-sm bg-card/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-primary" />
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