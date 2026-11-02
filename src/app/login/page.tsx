import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Sign in to Srijon Space to book creative spaces and manage your listings.",
};

export default function LoginPage() {
  return (
    <AuthShell
      image="/images/hero/hero-2.jpg"
      imageAlt="A bright creative loft with a large window"
      kicker="Create without limits"
      quote="The room made the shoot. We booked it again before we left."
      caption="Priya Nair · Portrait photographer"
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
