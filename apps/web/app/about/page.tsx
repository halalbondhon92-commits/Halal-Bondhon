"use client";

import React, { useState } from "react";
import Link from "next/link";
import HalalBondhonHeader from "@/components/HalalBondhonHeader";
import HalalBondhonFooter from "@/components/HalalBondhonFooter";
import type { Lang } from "@/lib/dictionary";

export default function AboutPage() {
  const [lang, setLang] = useState<Lang>("bn");

  return (
    <div className="min-h-screen bg-[#f6f9f6] text-stone-900 flex flex-col">
      <HalalBondhonHeader
        lang={lang}
        onToggleLang={() => setLang((p) => (p === "bn" ? "en" : "bn"))}
      />

      <main className="flex-1">
        <section className="bg-gradient-to-r from-[#0b5d2b] to-[#137a3b] text-white py-12 px-4">
          <div className="max-w-7xl mx-auto text-center space-y-2">
            <span className="inline-block bg-[#f5d061] text-stone-900 text-xs font-extrabold px-3 py-1 rounded-full">
              {lang === "bn" ? "আমাদের সম্পর্কে" : "About Us"}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold">
              {lang === "bn"
                ? "হালালবন্ধন — শালীন ও বিশ্বস্ত জীবনসঙ্গী খোঁজার মাধ্যম"
                : "HalalBondhon — A Respectful Matrimony Platform"}
            </h1>
            <p className="text-xs sm:text-base text-emerald-100 max-w-2xl mx-auto">
              {lang === "bn"
                ? "পরিবারের সম্মতি, গোপনীয়তা এবং ইসলামী শালীনতা বজায় রেখে সঠিক জীবনসঙ্গী খুঁজে পেতে আমরা নিবেদিত।"
                : "Dedicated to helping families and individuals find compatible life partners with modesty, privacy, and trust."}
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-12 space-y-8">
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-xs p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b5d2b]">
              {lang === "bn" ? "আমাদের লক্ষ্য ও উদ্দেশ্য" : "Our Mission & Vision"}
            </h2>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              {lang === "bn"
                ? "হালালবন্ধন এমন একটি ম্যাট্রিমনি প্ল্যাটফর্ম হিসেবে গড়ে তোলা হয়েছে, যেখানে অপ্রয়োজনীয় জটিলতা ছাড়াই স্বচ্ছ বায়োডাটার মাধ্যমে পাত্র বা পাত্রীর তথ্য যাচাই করা যায় এবং অভিভাবকদের মাধ্যমে শালীনভাবে যোগাযোগ স্থাপন করা সম্ভব হয়।"
                : "HalalBondhon is built to make discovering biodatas transparent and straightforward while encouraging respectful, family-involved communication."}
            </p>
            <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
              {lang === "bn"
                ? "আমরা বিশ্বাস করি, সঠিক তথ্যের স্বচ্ছতা ও পারস্পরিক সম্মান একটি সুন্দর ও স্থায়ী দাম্পত্য জীবনের প্রথম ভিত্তি।"
                : "We believe honesty in biodata details and mutual respect form the foundation of a lasting marriage."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-emerald-100 p-6 space-y-2 shadow-xs">
              <div className="text-2xl">🕌</div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#0b5d2b]">
                {lang === "bn" ? "শালীন পরিবেশ" : "Modest Environment"}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {lang === "bn"
                  ? "সম্মানজনক পরিবেশ এবং পারিবারিক সম্পৃক্ততাকে আমরা সর্বোচ্চ অগ্রাধিকার দিই।"
                  : "We prioritize a respectful environment and active involvement of families."}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-emerald-100 p-6 space-y-2 shadow-xs">
              <div className="text-2xl">🔒</div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#0b5d2b]">
                {lang === "bn" ? "তথ্যের গোপনীয়তা" : "Privacy Protection"}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {lang === "bn"
                  ? "সদস্যদের অ্যাকাউন্ট ও বায়োডাটার তথ্য সুরক্ষিত রাখতে আমরা যত্নশীল।"
                  : "We take care to keep user accounts and biodata records protected."}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-emerald-100 p-6 space-y-2 shadow-xs">
              <div className="text-2xl">🤝</div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#0b5d2b]">
                {lang === "bn" ? "সহজ বায়োডাটা সিস্টেম" : "Simple Biodata Flow"}
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                {lang === "bn"
                  ? "সহজ ফর্মের মাধ্যমে দ্রুত বায়োডাটা তৈরি, আপডেট ও অনুসন্ধানের সুবিধা রয়েছে।"
                  : "Create, update, and search biodatas easily with a streamlined workflow."}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-emerald-200 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-extrabold text-[#0b5d2b]">
                {lang === "bn"
                  ? "আপনার বায়োডাটা তৈরি করতে প্রস্তুত?"
                  : "Ready to create your biodata?"}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                {lang === "bn"
                  ? "অ্যাকাউন্ট খুলে আজই আপনার বায়োডাটা যুক্ত করুন।"
                  : "Register and add your biodata today."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/create-biodata"
                className="bg-[#0b5d2b] hover:bg-[#084721] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition"
              >
                {lang === "bn" ? "বায়োডাটা তৈরি করুন →" : "Create Biodata →"}
              </Link>
              <Link
                href="/contact"
                className="bg-emerald-50 hover:bg-emerald-100 text-[#0b5d2b] border border-emerald-200 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition"
              >
                {lang === "bn" ? "যোগাযোগ করুন" : "Contact Us"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <HalalBondhonFooter lang={lang} />
    </div>
  );
}