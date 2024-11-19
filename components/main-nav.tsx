"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Building2, FileText, Home, Mountain } from "lucide-react";

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-6">
      <Link href="/" className="flex items-center space-x-2">
        <Mountain className="h-6 w-6 text-primary" />
        <span className="font-bold text-xl">Pinnacle</span>
      </Link>
      <div className="flex items-center space-x-6">
        <Link
          href="/"
          className={cn(
            "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
            pathname === "/" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Home className="h-4 w-4" />
          <span>Dashboard</span>
        </Link>
        <Link
          href="/deals/new"
          className={cn(
            "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
            pathname === "/deals/new" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Building2 className="h-4 w-4" />
          <span>New Deal</span>
        </Link>
        <Link
          href="/pdf-parse"
          className={cn(
            "flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary",
            pathname === "/pdf-parse" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <FileText className="h-4 w-4" />
          <span>PDF Parse</span>
        </Link>
      </div>
    </nav>
  );
}