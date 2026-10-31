"use client";

import { Toaster } from "sonner";
import { AuthProvider } from "@/context/auth-context";
import { MarketplaceProvider } from "@/context/marketplace-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MarketplaceProvider>
        {children}
        <Toaster
          position="top-center"
          closeButton
          duration={4200}
          toastOptions={{ className: "font-sans" }}
        />
      </MarketplaceProvider>
    </AuthProvider>
  );
}
