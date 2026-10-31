"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const BARE_ROUTES = ["/login", "/register"];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.includes(pathname);

  return (
    <>
      {!bare ? <Navbar /> : null}
      <main className="flex-1">{children}</main>
      {!bare ? <Footer /> : null}
    </>
  );
}
