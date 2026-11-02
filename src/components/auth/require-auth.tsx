"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

/**
 * Guards private pages. The root preloader covers the first page load, so this
 * component can stay invisible while the auth state is read or a redirect runs.
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isReady } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isReady && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isReady, user, router, pathname]);

  if (!isReady || !user) return null;

  return <>{children}</>;
}
