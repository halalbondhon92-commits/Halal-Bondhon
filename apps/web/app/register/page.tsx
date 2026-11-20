"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HalalBondhonHeader from "@/components/HalalBondhonHeader";
import HalalBondhonFooter from "@/components/HalalBondhonFooter";
import type { Lang } from "@/lib/dictionary";

export default function RegisterPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("bn");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "groom",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে।");
        return;
      }

      router.push("/create-biodata?welcome=1");
      router.refresh();
    } catch {
      setError(
        lang === "bn"
          ? "নেটওয়ার্ক সমস্যা হয়েছে, আবার চেষ্টা করুন।"
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
              {lang === "bn" ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "Create an Account"}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600">
              {lang === "bn"
                ? "হালালবন্ধনে আপনার বায়োডাটা তৈরি করতে রেজিস্ট্রেশন করুন"
                : "Register to create your biodata on HalalBondhon"}
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
                htmlFor="reg-name"
                className="block text-xs font-semibold text-stone-700 mb-1"
              >
                {lang === "bn" ? "পূর্ণ নাম" : "Full Name"}
              </label>
              <input
                id="reg-name"
                type="text"
                required
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder={
                  lang === "bn" ? "আপনার পূর্ণ নাম লিখুন" : "Enter full name"
                }
                className="w-full h-10 rounded-lg border border-stone-300 px-3 text-sm text-stone-900 focus:outline-none focus:border-[#0b5d2b]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="reg-gender"
                  className="block text-xs font-semibold text-stone-700 mb-1"
                >
                  {lang === "bn" ? "অ্যাকাউন্টের ধরন" : "Biodata For"}
                </label>
                <select
                  id="reg-gender"
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                  className="w-full h-10 rounded-lg border border-stone-300 px-3 text-sm text-stone-900 bg-white focus:outline-none focus:border-[#0b5d2b]"
                >
                  <option value="groom">
                    {lang === "bn" ? "পাত্র (Groom)" : "Groom"}
                  </option>
                  <option value="bride">
                    {lang === "bn" ? "পাত্রী (Bride)" : "Bride"}
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="reg-phone"
                  className="block text-xs font-semibold text-stone-700 mb-1"
                >
                  {lang === "bn" ? "মোবাইল নম্বর" : "Phone Number"}
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="01XXXXXXXXX"
                  className="w-full h-10 rounded-lg border border-stone-300 px-3 text-sm text-stone-900 focus:outline-none focus:border-[#0b5d2b]"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="reg-email"
                className="block text-xs font-semibold text-stone-700 mb-1"
              >
                {lang === "bn" ? "ইমেইল ঠিকানা" : "Email Address"}
              </label>
              <input
                id="reg-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="example@gmail.com"
                className="w-full h-10 rounded-lg border border-stone-300 px-3 text-sm text-stone-900 focus:outline-none focus:border-[#0b5d2b]"
              />
            </div>

            <div>
              <label
                htmlFor="reg-password"
                className="block text-xs font-semibold text-stone-700 mb-1"
              >
                {lang === "bn" ? "পাসওয়ার্ড" : "Password"}
              </label>
              <div className="relative">
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
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
                  ? "অপেক্ষা করুন..."
                  : "Creating..."
                : lang === "bn"
                  ? "রেজিস্টার করুন"
                  : "Register"}
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-stone-600">
            {lang === "bn" ? "ইতিমধ্যে অ্যাকাউন্ট আছে? " : "Already have an account? "}
            <Link
              href="/login"
              className="font-bold text-[#0b5d2b] hover:underline"
            >
              {lang === "bn" ? "লগইন করুন" : "Login"}
            </Link>
          </p>
        </div>
      </main>

      <HalalBondhonFooter lang={lang} />
    </div>
  );
}