import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create an account",
  description:
    "Join Srijon Space to book creative studios, list your own space, and connect with creators.",
};

export default function RegisterPage() {
  return (
    <AuthShell
      image="/images/about/about-1.jpg"
      imageAlt="A creative team collaborating in a studio"
      kicker="A community of makers"
      quote="Good spaces bring good people together. That's the whole idea."
      caption="Srijon Space community · New York"
    >
      <RegisterForm />
    </AuthShell>
  );
}
