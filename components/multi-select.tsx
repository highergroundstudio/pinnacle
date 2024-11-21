"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MultiSelectProps {
	selected: string[];
	options: string[];
	onChange: (value: string[]) => void;
	placeholder?: string;
}

export function MultiSelect({
	selected = [], // Provide default empty array
	options = [], // Provide default empty array
	onChange,
	placeholder = "Select options",
}: MultiSelectProps) {
	const [open, setOpen] = React.useState(false);

	const handleUnselect = React.useCallback(
		(item: string) => {
			onChange(selected.filter((i) => i !== item));
		},
		[onChange, selected],
	);

	const handleSelect = React.useCallback(
		(item: string) => {
			if (selected.includes(item)) {
				onChange(selected.filter((i) => i !== item));
			} else {
				onChange([...selected, item]);
			}
		},
		[onChange, selected],
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="w-full justify-between hover:bg-background"
				>
					<div className="flex flex-wrap gap-1">
						{selected.length === 0 && placeholder}
						{selected.map((item) => (
							<Badge
								variant="secondary"
								key={item}
								className="mr-1 flex items-center gap-1"
							>
								{item}
								<div
									role="button"
									tabIndex={0}
									className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 cursor-pointer"
									onClick={(e) => {
										e.stopPropagation();
										handleUnselect(item);
									}}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											handleUnselect(item);
										}
									}}
								>
									<X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
								</div>
							</Badge>
						))}
					</div>
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput
						placeholder={`Search ${placeholder.toLowerCase()}...`}
					/>
					<CommandEmpty>No option found.</CommandEmpty>
					<CommandGroup className="max-h-64 overflow-auto">
						{options.map((option) => (
							<CommandItem
								key={option}
								onSelect={() => handleSelect(option)}
								className={cn(
									"cursor-pointer",
									selected.includes(option) && "bg-secondary",
								)}
							>
								{option}
							</CommandItem>
						))}
					</CommandGroup>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
