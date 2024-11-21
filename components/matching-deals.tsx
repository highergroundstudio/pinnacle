import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { dealStageOptions } from "@/lib/vars";
import { getHubSpotDealUrl } from "@/lib/hubspot";
import { AlertCircle, ExternalLink } from "lucide-react";

interface Deal {
	id: string;
	name: string;
	address: string;
	amount: number;
	stage: string;
	created: string;
}

interface MatchingDealsProps {
	deals: Deal[];
}

export function MatchingDeals({ deals }: MatchingDealsProps) {
	if (!deals.length) return null;

	return (
		<Card className="border-destructive">
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center text-destructive">
					<AlertCircle className="mr-2 h-4 w-4" />
					Matching Deals Found
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{deals.map((deal) => {
					const stage = dealStageOptions.find(
						(option) => option.value.hubspot === deal.stage,
					);

					return (
						<div
							key={deal.id}
							className="rounded-lg border p-3 text-sm space-y-2"
						>
							<div className="flex items-center justify-between">
								<div className="font-medium">{deal.name}</div>
								<Button
									variant="ghost"
									size="sm"
									className="h-6 px-2"
									onClick={() =>
										window.open(getHubSpotDealUrl(deal.id), "_blank")
									}
								>
									<ExternalLink className="h-3 w-3" />
								</Button>
							</div>
							<div className="text-muted-foreground">{deal.address}</div>
							<div className="flex justify-between text-xs">
								<span>{formatCurrency(Number(deal.amount))}</span>
								<span className="text-primary">
									{stage?.label || "Unknown Stage"}
								</span>
							</div>
							<div className="text-xs text-muted-foreground">
								Created: {new Date(deal.created).toLocaleDateString()}
							</div>
						</div>
					);
				})}
			</CardContent>
		</Card>
	);
}
