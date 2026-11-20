"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HalalBondhonHeader from "@/components/HalalBondhonHeader";
import HalalBondhonFooter from "@/components/HalalBondhonFooter";
import type { Lang } from "@/lib/dictionary";

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("bn");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(
          data.message ||
            (lang === "bn"
              ? "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।"
              : "Invalid email or password.")
        );
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError(
        lang === "bn"
          ? "সার্ভারের সাথে সংযোগ বিচ্ছিন্ন হয়েছে, আবার চেষ্টা করুন।"
          : "Network error. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f9f6] flex flex-col">
      <HalalBondhonHeader
        lang={lang}
        onToggleLang={() => setLang((p) => (p === "bn" ? "en" : "bn"))}
      />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-extrabold text-[#0b5d2b]">
              {lang === "bn" ? "লগইন করুন" : "Login to Your Account"}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              {lang === "bn"
                ? "আপনার হালালবন্ধন অ্যাকাউন্টে প্রবেশ করুন"
                : "Sign in to access your HalalBondhon dashboard"}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm px-3.5 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-stone-700 mb-1"
              >
                {lang === "bn" ? "ইমেইল ঠিকানা" : "Email Address"}
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full h-10 rounded-lg border border-stone-300 px-3 text-sm text-stone-900 focus:outline-none focus:border-[#0b5d2b]"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold text-stone-700 mb-1"
              >
                {lang === "bn" ? "পাসওয়ার্ড" : "Password"}
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="******"
                  className="w-full h-10 rounded-lg border border-stone-300 pl-3 pr-14 text-sm text-stone-900 focus:outline-none focus:border-[#0b5d2b]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#0b5d2b] hover:underline cursor-pointer"
                >
                  {showPassword
                    ? lang === "bn"
                      ? "লুকান"
                      : "Hide"
                    : lang === "bn"
                      ? "দেখুন"
                      : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-lg bg-[#0b5d2b] hover:bg-[#084721] text-white font-bold text-sm transition disabled:opacity-60 cursor-pointer"
            >
              {loading
                ? lang === "bn"
                  ? "লগইন হচ্ছে..."
                  : "Signing in..."
                : lang === "bn"
                  ? "লগইন করুন"
                  : "Login"}
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-stone-600">
            {lang === "bn" ? "নতুন ইউজার? " : "Don't have an account? "}
            <Link
              href="/register"
              className="font-bold text-[#0b5d2b] hover:underline"
            >
              {lang === "bn" ? "রেজিস্টার করুন" : "Register"}
            </Link>
          </p>
        </div>
      </main>

      <HalalBondhonFooter lang={lang} />
    </div>
  );
}