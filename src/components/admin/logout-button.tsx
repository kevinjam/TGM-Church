"use client";

import { useState } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LogoutButton({
  className,
  variant = "outline",
  showLabel = true,
}: {
  className?: string;
  variant?: "outline" | "ghost";
  showLabel?: boolean;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      window.location.assign("/admin/login");
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      onClick={handleLogout}
      disabled={isSubmitting}
      className={className}
      title="Sign out"
    >
      {isSubmitting ? (
        <Loader2 className={cn("h-4 w-4 animate-spin", showLabel && "mr-2")} />
      ) : (
        <LogOut className={cn("h-4 w-4", showLabel && "mr-2")} />
      )}
      {showLabel ? (isSubmitting ? "Signing out..." : "Sign out") : null}
    </Button>
  );
}
