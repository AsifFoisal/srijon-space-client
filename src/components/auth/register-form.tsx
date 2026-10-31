"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import type { RegisterInput } from "@/lib/types";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/ui/popover";
import { cn, isValidUrl } from "@/lib/utils";

interface RegisterValues {
  name: string;
  email: string;
  avatar: string;
  password: string;
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h6.47a5.53 5.53 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
      />
      <path
        fill="currentColor"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="currentColor"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="currentColor"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const { register: registerAccount, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [requirementsOpen, setRequirementsOpen] = useState(false);
  const passwordFieldRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    defaultValues: { name: "", email: "", avatar: "", password: "" },
  });

  const password = watch("password") ?? "";
  const name = watch("name") ?? "";
  const avatar = watch("avatar") ?? "";

  const requirements = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "One uppercase letter", met: /[A-Z]/.test(password) },
    { label: "One lowercase letter", met: /[a-z]/.test(password) },
  ];
  const requirementsMet = requirements.filter(
    (requirement) => requirement.met,
  ).length;

  const passwordRegistration = register("password", {
    required: "Choose a password.",
    minLength: {
      value: 6,
      message: "Use at least 6 characters.",
    },
    validate: {
      uppercase: (value) =>
        /[A-Z]/.test(value) || "Include at least one uppercase letter.",
      lowercase: (value) =>
        /[a-z]/.test(value) || "Include at least one lowercase letter.",
    },
  });

  async function onSubmit(values: RegisterValues) {
    try {
      await registerAccount({
        name: values.name,
        email: values.email,
        password: values.password,
        avatar: values.avatar,
      } satisfies RegisterInput);
      toast.success("Account created. Sign in to continue.");
      router.push(`/login?email=${encodeURIComponent(values.email)}`);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We couldn't create your account. Please try again.";
      setError("root", { message });
      toast.error(message);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      const user = await loginWithGoogle();
      toast.success(`Signed in as ${user.name}.`);
      router.push("/dashboard");
    } catch {
      toast.error("Google sign-up is unavailable right now. Try the email form.");
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <div>
      <p className="kicker">Join Srijon Space</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.02] tracking-[-0.04em] sm:text-3xl">
        Join the Creative Community.
      </h1>
      <p className="mt-3 text-sm leading-6 text-stone">
        Create an account to book inspiring spaces, list your own studio, and
        connect with creators across the city.
      </p>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading}
        className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-line bg-paper text-sm font-medium text-ink transition-colors hover:border-ink/30 disabled:opacity-60"
      >
        {googleLoading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </button>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-stone">
          Or register with email
        </span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        <Input
          label="Full name"
          autoComplete="name"
          placeholder="Your name"
          icon={<User className="size-4" />}
          error={errors.name?.message}
          {...register("name", {
            required: "Tell us your name.",
            minLength: {
              value: 2,
              message: "Your name should be at least 2 characters.",
            },
          })}
        />

        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          placeholder="you@studio.com"
          icon={<Mail className="size-4" />}
          error={errors.email?.message}
          {...register("email", {
            required: "Enter your email address.",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email address.",
            },
          })}
        />

        <div>
          <div className="flex items-end gap-3">
            <Input
              label="Profile photo URL"
              containerClassName="min-w-0 flex-1"
              placeholder="https://…"
              hint="Optional — we'll use a default avatar if left blank."
              error={errors.avatar?.message}
              {...register("avatar", {
                validate: (value) =>
                  !value ||
                  isValidUrl(value) ||
                  "Enter a valid image URL starting with http.",
              })}
            />
          </div>
        </div>

        <Popover open={requirementsOpen} onOpenChange={setRequirementsOpen}>
          <PopoverAnchor asChild>
            <div ref={passwordFieldRef}>
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Create a password"
                icon={<Lock className="size-4" />}
                error={errors.password?.message}
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="flex size-9 items-center justify-center rounded-full text-stone transition-colors hover:bg-sand hover:text-ink"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </button>
                }
                {...passwordRegistration}
                onFocus={() => setRequirementsOpen(true)}
                onBlur={(event) => {
                  passwordRegistration.onBlur(event);
                  window.setTimeout(() => {
                    if (
                      !passwordFieldRef.current?.contains(document.activeElement)
                    ) {
                      setRequirementsOpen(false);
                    }
                  }, 0);
                }}
              />
            </div>
          </PopoverAnchor>

          <PopoverContent
            side="top"
            align="start"
            sideOffset={8}
            onOpenAutoFocus={(event) => event.preventDefault()}
            className="w-[min(28rem,calc(100vw-2.5rem))]"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-stone">
                Password needs
              </p>
              <span className="text-[10px] tabular-nums text-stone">
                {requirementsMet}/3
              </span>
            </div>
            <ul aria-live="polite" className="mt-3 space-y-2">
              {requirements.map((requirement) => (
                <li
                  key={requirement.label}
                  className={cn(
                    "flex items-center gap-2 text-xs transition-colors",
                    requirement.met ? "text-ink" : "text-stone",
                  )}
                >
                  {requirement.met ? (
                    <CheckCircle2
                      className="size-3.5 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                  ) : (
                    <Circle className="size-3.5 shrink-0" aria-hidden="true" />
                  )}
                  {requirement.label}
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>

        {errors.root?.message ? (
          <p
            role="alert"
            className="rounded-lg border border-accent/30 bg-accent-soft px-3 py-2.5 text-xs leading-5 text-accent-deep"
          >
            {errors.root.message}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={isSubmitting}
          loadingText="Creating account…"
        >
          Create Account
        </Button>
      </form>

      <p className="mt-4 text-xs leading-5 text-stone">
        By creating an account you agree to our{" "}
        <Link href="/policies#terms" className="underline hover:text-ink">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/policies#privacy" className="underline hover:text-ink">
          Privacy Policy
        </Link>
        .
      </p>

      <p className="mt-6 text-center text-sm text-stone">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-ink underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
