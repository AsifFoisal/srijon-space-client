"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface LoginValues {
  email: string;
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

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const nextParam = searchParams.get("next");
  const nextPath =
    nextParam && nextParam.startsWith("/") && !nextParam.startsWith("//")
      ? nextParam
      : "/";
  const emailParam = searchParams.get("email") ?? "";

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    defaultValues: { email: emailParam, password: "" },
  });

  async function onSubmit(values: LoginValues) {
    try {
      const user = await login(values.email, values.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}.`);
      router.push(nextPath);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We couldn't sign you in. Please try again.";
      setError("root", { message });
      toast.error(message);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    try {
      await loginWithGoogle(nextPath);
    } catch {
      toast.error("Google sign-in is unavailable right now. Try signing in with email.");
      setGoogleLoading(false);
    }
  }

  return (
    <div>
      <p className="kicker">Welcome back</p>
      <h1 className="mt-3 font-display text-4xl leading-[1.02] tracking-[-0.04em] sm:text-5xl">
        Welcome Back.
      </h1>
      <p className="mt-3 text-sm leading-6 text-stone">
        Sign in to book creative spaces, manage your listings, and keep track
        of every session.
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
          Or continue with email
        </span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
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

        <Input
          label="Password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          placeholder="Your password"
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
          {...register("password", {
            required: "Enter your password.",
          })}
        />

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
          loadingText="Signing in…"
        >
          Log In
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-stone">
        New to Srijon Space?{" "}
        <Link
          href="/register"
          className={cn("font-medium text-ink underline-offset-4 hover:underline")}
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
