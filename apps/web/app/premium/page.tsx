"use client";

import React, { useState } from "react";
import Link from "next/link";
import HalalBondhonHeader from "@/components/HalalBondhonHeader";
import HalalBondhonFooter from "@/components/HalalBondhonFooter";
import type { Lang } from "@/lib/dictionary";

interface PlanItem {
  id: "basic" | "standard" | "guardian";
  name: { bn: string; en: string };
  price: { bn: string; en: string };
  duration: { bn: string; en: string };
  badge?: { bn: string; en: string };
  highlighted?: boolean;
  features: { bn: string; en: string }[];
}

const plans: PlanItem[] = [
  {
    id: "basic",
    name: { bn: "স্টার্টার প্যাক", en: "Starter Pack" },
    price: { bn: "৳৪৯৯", en: "৳499" },
    duration: { bn: "৩০ দিনের মেয়াদ", en: "30 Days Validity" },
    features: {
      bn: [
        "১০টি বায়োডাটার অভিভাবক যোগাযোগ নম্বর দেখা",
        "পছন্দের বায়োডাটা শর্টলিস্ট ও সেভ সুবিধা",
        "জেলা ও পেশা অনুযায়ী অ্যাডভান্সড ফিল্টার",
        "সাধারণ সাপোর্ট সুবিধা",
      ],
      en: [
        "View guardian contact numbers for 10 biodatas",
        "Shortlist and save preferred biodatas",
        "Advanced filters by district & profession",
        "Standard support access",
      ],
    } as unknown as { bn: string; en: string }[],
  },
  {
    id: "standard",
    name: { bn: "প্লাস মেম্বারশিপ", en: "Plus Membership" },
    price: { bn: "৳৯৯৯", en: "৳999" },
    duration: { bn: "৯০ দিনের মেয়াদ", en: "90 Days Validity" },
    badge: { bn: "সবচেয়ে জনপ্রিয়", en: "Most Popular" },
    highlighted: true,
    features: {
      bn: [
        "৩০টি বায়োডাটার অভিভাবক যোগাযোগ নম্বর দেখা",
        "আপনার বায়োডাটাকে প্রাধান্য দিয়ে হাইলাইট করা",
        "পাত্র/পাত্রীর পরিবারের সাথে শালীন যোগাযোগ সমন্বয়",
        "দ্রুত কাস্টমার কেয়ার সাপোর্ট",
      ],
      en: [
        "View guardian contact numbers for 30 biodatas",
        "Highlighted visibility for your biodata",
        "Respectful family-led match coordination",
        "Priority customer support",
      ],
    } as unknown as { bn: string; en: string }[],
  },
  {
    id: "guardian",
    name: { bn: "ফ্যামিলি / গার্ডিয়ান প্যাক", en: "Family / Guardian Pack" },
    price: { bn: "৳১,৭৯৯", en: "৳1,799" },
    duration: { bn: "১৮০ দিনের মেয়াদ", en: "180 Days Validity" },
    features: {
      bn: [
        "৬০টি বায়োডাটার অভিভাবক যোগাযোগ নম্বর দেখা",
        "অভিভাবক ও ওয়ালির মাধ্যমে সরাসরি কথা বলার গাইডলাইন",
        "সকল বায়োডাটায় আনলিমিটেড শর্টলিস্ট সুবিধা",
        "ডেডিকেটেড সাপোর্ট ও সহায়তা",
      ],
      en: [
        "View guardian contact numbers for 60 biodatas",
        "Guidance for direct guardian & wali communication",
        "Unlimited shortlist across all biodatas",
        "Dedicated support assistance",
      ],
    } as unknown as { bn: string; en: string }[],
  },
];

export default function PremiumPage() {
  const [lang, setLang] = useState<Lang>("bn");
  const [selectedPlan, setSelectedPlan] = useState<PlanItem>(plans[1]!);
  const [paymentMethod, setPaymentMethod] = useState<"bkash" | "nagad" | "bank">(
    "bkash"
  );
  const [senderPhone, setSenderPhone] = useState("");
  const [trxId, setTrxId] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmittedMessage(null);

    if (!senderPhone.trim() || !trxId.trim()) {
      setErrorMessage(
        lang === "bn"
          ? "অনুগ্রহ করে পেমেন্ট নম্বর এবং Transaction ID (TrxID) লিখুন।"
          : "Please enter your payment phone number and Transaction ID (TrxID)."
      );
      return;
    }

    setSubmittedMessage(
      lang === "bn"
        ? `জাযাকাল্লাহ খায়ের! "${selectedPlan.name.bn}" (${selectedPlan.price.bn}) প্যাকেজের জন্য আপনার রিকোয়েস্ট গ্রহণ করা হয়েছে (TrxID: ${trxId.trim()})। যাচাই শেষে অ্যাকাউন্ট আপডেট করা হবে।`
        : `Request received for "${selectedPlan.name.en}" (${selectedPlan.price.en}) with TrxID: ${trxId.trim()}. Your account will be updated after verification.`
    );
    setSenderPhone("");
    setTrxId("");
  };

  const getPlanFeatures = (plan: PlanItem): string[] => {
    const raw = plan.features as unknown as { bn: string[]; en: string[] };
    return raw[lang] || raw.bn;
  };

  return (
    <div className="min-h-screen bg-[#f6f9f6] text-stone-900 flex flex-col">
      <HalalBondhonHeader
        lang={lang}
        onToggleLang={() => setLang((p) => (p === "bn" ? "en" : "bn"))}
      />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-gradient-to-r from-[#0b5d2b] via-[#0e6b31] to-[#063818] text-white py-12 px-4">
          <div className="max-w-7xl mx-auto text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 bg-[#f5d061] text-stone-900 text-xs font-extrabold px-3.5 py-1 rounded-full">
              <span>👑</span>
              <span>
                {lang === "bn"
                  ? "হালালবন্ধন প্রিমিয়াম মেম্বারশিপ"
                  : "HalalBondhon Premium Membership"}
              </span>
            </span>

            <h1 className="text-2xl sm:text-4xl font-extrabold">
              {lang === "bn"
                ? "অভিভাবকদের সাথে সরাসরি ও শালীনভাবে যোগাযোগ করুন"
                : "Connect Respectfully Through Guardians"}
            </h1>

            <p className="text-xs sm:text-base text-emerald-100 max-w-2xl mx-auto">
              {lang === "bn"
                ? "সঠিক জীবনসঙ্গী খুঁজে পেতে আপনার প্রয়োজন অনুযায়ী প্রিমিয়াম প্যাকেজ নির্বাচন করুন।"
                : "Choose a membership plan that fits your search for a compatible life partner."}
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="max-w-7xl mx-auto px-4 py-12 space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
            {plans.map((plan) => {
              const isSelected = selectedPlan.id === plan.id;
              const features = getPlanFeatures(plan);

              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition relative ${
                    plan.highlighted
                      ? "bg-white border-2 border-[#0b5d2b] shadow-md"
                      : "bg-white border border-stone-200 shadow-xs hover:border-[#0b5d2b]/50"
                  }`}
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-lg sm:text-xl font-extrabold text-[#0b5d2b]">
                        {plan.name[lang]}
                      </h2>
                      {plan.badge && (
                        <span className="bg-[#f5d061] text-stone-900 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full">
                          {plan.badge[lang]}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-3xl font-extrabold text-stone-900">
                        {plan.price[lang]}
                      </div>
                      <p className="text-xs text-stone-600 font-medium mt-0.5">
                        {plan.duration[lang]}
                      </p>
                    </div>

                    <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700 border-t border-stone-100 pt-4">
                      {features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-[#0b5d2b] font-bold shrink-0">
                            ✔
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlan(plan);
                        setSubmittedMessage(null);
                      }}
                      className={`w-full h-11 rounded-xl font-bold text-xs sm:text-sm transition cursor-pointer ${
                        isSelected
                          ? "bg-[#0b5d2b] text-white shadow-xs"
                          : "bg-emerald-50 hover:bg-[#0b5d2b] text-[#0b5d2b] hover:text-white border border-[#0b5d2b]/30"
                      }`}
                    >
                      {isSelected
                        ? lang === "bn"
                          ? "✓ প্যাকেজ সিলেক্ট করা আছে"
                          : "✓ Selected Plan"
                        : lang === "bn"
                          ? "এই প্যাকেজ নির্বাচন করুন"
                          : "Select Plan"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Payment / Activation Request Box */}
          <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="border-b border-stone-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-extrabold text-[#0b5d2b]">
                  {lang === "bn"
                    ? "মেম্বারশিপ সক্রিয়করণ ফর্ম"
                    : "Membership Activation Request"}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                  {lang === "bn"
                    ? `নির্বাচিত প্যাকেজ: ${selectedPlan.name.bn} (${selectedPlan.price.bn})`
                    : `Selected Plan: ${selectedPlan.name.en} (${selectedPlan.price.en})`}
                </p>
              </div>

              <Link
                href="/biodatas"
                className="text-xs font-bold text-[#0b5d2b] hover:underline"
              >
                {lang === "bn" ? "বায়োডাটা দেখুন →" : "Browse Biodatas →"}
              </Link>
            </div>

            <div className="bg-[#f9fbf9] rounded-xl border border-stone-200 p-4 text-xs sm:text-sm text-stone-700 space-y-1">
              <p className="font-bold text-[#0b5d2b]">
                {lang === "bn"
                  ? "পেমেন্ট নির্দেশনা (Send Money):"
                  : "Payment Instructions (Send Money):"}
              </p>
              <p>
                {lang === "bn"
                  ? "বিকাশ / নগদ পার্সোনাল নম্বর: 01477014011 — নির্দিষ্ট প্যাকেজের টাকা সেন্ড মানি করে নিচে আপনার নম্বর ও TrxID দিন।"
                  : "bKash / Nagad Personal: 01477014011 — Send the selected plan amount and submit your number & TrxID below."}
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm px-4 py-3 rounded-lg">
                {errorMessage}
              </div>
            )}

            {submittedMessage && (
              <div className="bg-emerald-50 border border-emerald-300 text-[#0b5d2b] font-semibold text-xs sm:text-sm px-4 py-3 rounded-lg">
                {submittedMessage}
              </div>
            )}

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {lang === "bn" ? "পেমেন্ট মাধ্যম" : "Payment Method"}
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(
                        e.target.value as "bkash" | "nagad" | "bank"
                      )
                    }
                    className="w-full h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm text-black focus:outline-none focus:border-[#0b5d2b]"
                  >
                    <option value="bkash">bKash (বিকাশ)</option>
                    <option value="nagad">Nagad (নগদ)</option>
                    <option value="bank">Bank / Mobile Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {lang === "bn"
                      ? "যে নম্বর থেকে টাকা পাঠিয়েছেন *"
                      : "Sender Phone Number *"}
                  </label>
                  <input
                    type="tel"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm text-black placeholder:text-stone-500 focus:outline-none focus:border-[#0b5d2b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {lang === "bn" ? "Transaction ID (TrxID) *" : "Transaction ID *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="e.g. 9XK4L2M8P"
                    className="w-full h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm text-black placeholder:text-stone-500 focus:outline-none focus:border-[#0b5d2b]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 h-11 rounded-xl bg-[#0b5d2b] hover:bg-[#084721] text-white font-bold text-sm transition cursor-pointer"
              >
                {lang === "bn"
                  ? "মেম্বারশিপ রিকোয়েস্ট জমা দিন"
                  : "Submit Membership Request"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <HalalBondhonFooter lang={lang} />
    </div>
  );
}