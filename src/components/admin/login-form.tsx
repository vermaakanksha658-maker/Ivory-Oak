"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { loginAction, type LoginState } from "@/app/admin/login/actions";

const initialState: LoginState = {};

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={formAction} className="mt-8">
      {next && <input type="hidden" name="next" value={next} />}

      <div>
        <label htmlFor="email" className="admin-label">
          Email address
        </label>
        <div className="relative">
          <Mail
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-taupe"
            strokeWidth={1.5}
          />
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@ivoryandoak.in"
            className="admin-field pl-10"
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="password" className="admin-label">
          Password
        </label>
        <div className="relative">
          <Lock
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-taupe"
            strokeWidth={1.5}
          />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="admin-field px-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center text-charcoal/35 hover:text-charcoal"
          >
            {showPassword ? (
              <EyeOff className="size-4" strokeWidth={1.5} />
            ) : (
              <Eye className="size-4" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {state.error && (
        <p
          role="alert"
          className="mt-5 border-l-2 border-[#9b3d2e] bg-[#9b3d2e]/5 px-4 py-3 text-[0.75rem] leading-5 text-[#7a2f23]"
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="group mt-7 flex h-12 w-full items-center justify-center gap-2 bg-charcoal px-6 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:bg-ink disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 className="size-4 animate-spin" strokeWidth={1.6} />
            Signing in
          </>
        ) : (
          <>
            Sign in to the studio
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-1"
              strokeWidth={1.5}
            />
          </>
        )}
      </button>
    </form>
  );
}
