"use client";

import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        closeButton
        duration={4200}
        toastOptions={{ className: "font-sans" }}
      />
    </>
  );
}
