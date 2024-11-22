import { StatsCards } from "@/components/stats-cards";

export default function Home() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col space-y-2">
				<h1 className="text-3xl font-bold">Welcome to Pinnacle</h1>
				<p className="text-muted-foreground">
					Your professional deal management platform
				</p>
			</div>

			<StatsCards />
		</div>
	);
}
