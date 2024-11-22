"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, FileText, Mountain, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Stats {
	totalDeals: number;
	totalBrokers: number;
	performance: number;
}

export function StatsCards() {
	const [stats, setStats] = useState<Stats | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchStats() {
			try {
				const response = await fetch("/api/hubspot/stats");
				if (!response.ok) {
					throw new Error("Failed to fetch stats");
				}
				const data = await response.json();
				setStats(data);
			} catch (err) {
				console.error("Error fetching stats:", err);
				setError("Failed to load statistics");
			} finally {
				setLoading(false);
			}
		}

		fetchStats();
	}, []);

	if (loading) {
		return <StatsCardsSkeleton />;
	}

	if (error) {
		return (
			<Card className="border-destructive">
				<CardContent className="pt-6">
					<p className="text-destructive">{error}</p>
				</CardContent>
			</Card>
		);
	}

	const statItems = [
		{
			title: "Total Deals",
			value: stats?.totalDeals.toLocaleString() || "0",
			icon: Building2,
		},
		{
			title: "Active Brokers",
			value: stats?.totalBrokers.toLocaleString() || "0",
			icon: Users,
		},
		{
			title: "Peak Performance",
			value: `${stats?.performance || 0}%`,
			icon: Mountain,
		},
	];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{statItems.map((stat) => {
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
	);
}

function StatsCardsSkeleton() {
	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			{Array(4)
				.fill(0)
				.map((_, i) => (
					<Card
						key={crypto.randomUUID()}
						className="backdrop-blur-sm bg-card/50"
					>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<Skeleton className="h-4 w-[100px]" />
							<Skeleton className="h-4 w-4" />
						</CardHeader>
						<CardContent>
							<Skeleton className="h-8 w-[60px]" />
						</CardContent>
					</Card>
				))}
		</div>
	);
}
