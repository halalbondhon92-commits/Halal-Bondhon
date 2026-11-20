"use client";

import React, { useState } from "react";
import Link from "next/link";
import HalalBondhonHeader from "@/components/HalalBondhonHeader";
import HalalBondhonFooter from "@/components/HalalBondhonFooter";
import type { Lang } from "@/lib/dictionary";

interface SuccessStory {
  id: string;
  couple: { bn: string; en: string };
  location: { bn: string; en: string };
  marriedYear: string;
  quote: { bn: string; en: string };
  story: { bn: string; en: string };
  avatar: string;
}

const stories: SuccessStory[] = [
  {
    id: "ST-1",
    couple: { bn: "নাফিস ও তানিয়া", en: "Nafis & Tania" },
    location: { bn: "ঢাকা", en: "Dhaka" },
    marriedYear: "২০২৫",
    quote: {
      bn: "“হালালবন্ধনের মাধ্যমে আমরা একে অপরকে পেয়েছি। আল্লাহর রহমতে আমাদের জীবন এখন অনেক সুন্দর।”",
      en: "“Through HalalBondhon we found each other. By Allah’s grace, our life is now so blessed.”",
    },
    story: {
      bn: "আমাদের দুই পরিবারের সম্মতি ও শালীন যোগাযোগের মাধ্যমে পরিচয় থেকে শুরু করে খুব অল্প সময়েই বিয়ের আকদ সম্পন্ন হয়। হালালবন্ধনের স্বচ্ছ বায়োডাটা সিস্টেম আমাদের অনেক সাহায্য করেছে।",
      en: "With the consent of both families and respectful communication, our nikah was completed smoothly. HalalBondhon’s clear biodata system helped us greatly.",
    },
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "ST-2",
    couple: { bn: "সাকিব ও নাদিয়া", en: "Sakib & Nadia" },
    location: { bn: "খুলনা", en: "Khulna" },
    marriedYear: "২০২৫",
    quote: {
      bn: "“পরিবারের সম্মতি ও সুন্দর পরিবেশে আমরা আমাদের জীবনসঙ্গী খুঁজে পেয়েছি। হালালবন্ধনকে ধন্যবাদ।”",
      en: "“With family consent and a respectful environment, we found our life partner. Thanks to HalalBondhon.”",
    },
    story: {
      bn: "খুলনার ভেতরেই দ্বীনদার ও মানানসই পরিবার খুঁজছিলাম। হালালবন্ধনে বায়োডাটা দেখে অভিভাবকদের মাধ্যমে কথা বলে আলহামদুলিল্লাহ আমাদের বিয়ে সম্পন্ন হয়েছে।",
      en: "We were looking for a righteous and compatible family in Khulna. After finding a matching biodata on HalalBondhon, our families connected and our marriage was blessed.",
    },
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "ST-3",
    couple: { bn: "রায়হান ও ফারজানা", en: "Rayhan & Farzana" },
    location: { bn: "চট্টগ্রাম", en: "Chattogram" },
    marriedYear: "২০২৬",
    quote: {
      bn: "“অযথা সময় নষ্ট না করে সরাসরি পরিবারের মাধ্যমে হালালভাবে জীবনসঙ্গী পাওয়ার সেরা মাধ্যম হালালবন্ধন।”",
      en: "“HalalBondhon is a great place to find a life partner halal-way through families without wasting time.”",
    },
    story: {
      bn: "শিক্ষাগত যোগ্যতা, পেশা ও পারিবারিক মূল্যবোধের মিল থাকায় প্রথম দেখাতেই পরিবারগুলো সিদ্ধান্ত নিতে পেরেছিল। এখন আমরা বেশ সুখে ও শান্তিতে আছি।",
      en: "Because of shared education, profession, and family values, both families decided quickly. We are living a peaceful and happy married life.",
    },
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "ST-4",
    couple: { bn: "মাহমুদ ও সাদিয়া", en: "Mahmud & Sadia" },
    location: { bn: "রাজশাহী", en: "Rajshahi" },
    marriedYear: "২০২৬",
    quote: {
      bn: "“আল্লাহর শুকরিয়া জানাই যে সঠিক পথে জীবনসঙ্গী খুঁজে পাওয়ার সুযোগ হয়েছে।”",
      en: "“Alhamdulillah for finding a life partner on the right path.”",
    },
    story: {
      bn: "বায়োডাটার বিস্তারিত তথ্য ও পর্দাশীল পরিবেশ বজায় রেখে অভিভাবকদের মধ্যস্থতায় আমাদের বিয়ে সম্পন্ন হয়। দোয়া করবেন আমাদের জন্য।",
      en: "With detailed biodatas and a modest family-led process, our marriage was completed. Please keep us in your prayers.",
    },
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
  },
];

export default function SuccessStoriesPage() {
  const [lang, setLang] = useState<Lang>("bn");

  return (
    <div className="min-h-screen bg-[#f6f9f6] text-stone-900 flex flex-col">
      <HalalBondhonHeader
        lang={lang}
        onToggleLang={() => setLang((p) => (p === "bn" ? "en" : "bn"))}
      />

      <main className="flex-1">
        {/* Hero Header */}
        <section className="bg-gradient-to-r from-[#0b5d2b] to-[#137a3b] text-white py-12 px-4">
          <div className="max-w-7xl mx-auto text-center space-y-3">
            <span className="inline-block bg-[#f5d061] text-stone-900 text-xs font-extrabold px-3.5 py-1 rounded-full">
              {lang === "bn" ? "আলহামদুলিল্লাহ" : "Alhamdulillah"}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold">
              {lang === "bn"
                ? "সফল বিবাহের গল্পসমূহ"
                : "Success Stories"}
            </h1>
            <p className="text-xs sm:text-base text-emerald-100 max-w-2xl mx-auto">
              {lang === "bn"
                ? "হালালবন্ধনের মাধ্যমে পরিবার ও দ্বীনের আলোয় জীবনসঙ্গী খুঁজে পাওয়া সম্মানিত দম্পতিদের অভিজ্ঞতা"
                : "Real stories of couples who found their life partners respectfully through HalalBondhon"}
            </p>
          </div>
        </section>

        {/* Stories Grid */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stories.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-2xl border border-emerald-100 shadow-xs hover:shadow-md transition p-6 flex flex-col justify-between gap-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={item.avatar}
                        alt={item.couple[lang]}
                        className="w-14 h-14 rounded-full object-cover object-top border-2 border-emerald-200 shrink-0"
                      />
                      <div>
                        <h2 className="text-base sm:text-lg font-extrabold text-[#0b5d2b]">
                          {item.couple[lang]}
                        </h2>
                        <p className="text-xs text-stone-600">
                          {item.location[lang]} •{" "}
                          {lang === "bn"
                            ? `বিবাহ: ${item.marriedYear}`
                            : `Married: ${item.marriedYear}`}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-[#b45309] bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md shrink-0">
                      {item.id}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base font-semibold text-stone-900 italic leading-relaxed">
                    {item.quote[lang]}
                  </p>

                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                    {item.story[lang]}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-stone-500 border-t border-stone-100">
                  <span className="inline-flex items-center gap-1 font-semibold text-[#0b5d2b]">
                    <span>✔</span>
                    <span>
                      {lang === "bn"
                        ? "যাচাইকৃত সফল জুটি"
                        : "Verified Couple"}
                    </span>
                  </span>
                  <Link
                    href="/biodatas"
                    className="font-bold text-[#0b5d2b] hover:underline"
                  >
                    {lang === "bn" ? "বায়োডাটা দেখুন →" : "Browse Biodatas →"}
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* CTA Box */}
          <div className="mt-12 bg-white rounded-2xl border border-emerald-200 p-6 sm:p-8 text-center space-y-4 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b5d2b]">
              {lang === "bn"
                ? "আপনার জীবনসঙ্গী খুঁজতে আজই বায়োডাটা তৈরি করুন"
                : "Start Your Journey by Creating Your Biodata Today"}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl mx-auto">
              {lang === "bn"
                ? "সহজ ধাপে আপনার বায়োডাটা তৈরি করুন এবং সঠিক পাত্র বা পাত্রীর সন্ধান শুরু করুন।"
                : "Create your biodata in simple steps and connect with compatible matches."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <Link
                href="/create-biodata"
                className="bg-[#0b5d2b] hover:bg-[#084721] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition"
              >
                {lang === "bn" ? "বায়োডাটা তৈরি করুন →" : "Create Biodata →"}
              </Link>
              <Link
                href="/register"
                className="bg-[#f5d061] hover:bg-[#eab308] text-stone-900 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition"
              >
                {lang === "bn" ? "নতুন অ্যাকাউন্ট খুলুন" : "Register Now"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <HalalBondhonFooter lang={lang} />
    </div>
  );
}