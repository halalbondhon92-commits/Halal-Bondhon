"use client";

import React, { useState } from "react";
import Link from "next/link";
import HalalBondhonHeader from "@/components/HalalBondhonHeader";
import HalalBondhonFooter from "@/components/HalalBondhonFooter";
import type { Lang } from "@/lib/dictionary";

interface BlogPost {
  id: string;
  category: { bn: string; en: string };
  readTime: { bn: string; en: string };
  title: { bn: string; en: string };
  excerpt: { bn: string; en: string };
  content: { bn: string[]; en: string[] };
}

const blogPosts: BlogPost[] = [
  {
    id: "B-1",
    category: { bn: "বিবাহ ও শালীনতা", en: "Marriage & Modesty" },
    readTime: { bn: "৪ মিনিট পড়া", en: "4 min read" },
    title: {
      bn: "হালালভাবে জীবনসঙ্গী খোঁজার সময় অভিভাবকদের সম্পৃক্ততার গুরুত্ব",
      en: "Importance of Involving Guardians When Seeking a Life Partner",
    },
    excerpt: {
      bn: "ইসলামী আদর্শ ও পারিবারিক সম্মতিতে বিয়ের প্রস্তাব ও কথাবার্তা এগিয়ে নিলে সম্পর্ক হয় স্বচ্ছ ও বরকতময়।",
      en: "Proceeding with marriage proposals through family consent and Islamic values brings clarity and barakah.",
    },
    content: {
      bn: [
        "বিবাহ কেবল দুটি মানুষের চুক্তি নয়; বরং দুটি পরিবারের মাঝে ভালোবাসা, দায়িত্ববোধ ও পারস্পরিক শ্রদ্ধার বন্ধন। শুরু থেকেই অভিভাবকদের সম্পৃক্ত রাখলে অহেতুক ভুল বোঝাবুঝির ঝুঁকি কমে যায়।",
        "বায়োডাটায় শিক্ষা, পেশা, পারিবারিক অবস্থান ও প্রত্যাশার জায়গাগুলো সৎভাবে তুলে ধরলে উভয় পক্ষই বাস্তবসম্মত সিদ্ধান্ত নিতে পারেন।",
      ],
      en: [
        "Marriage is not merely a contract between two individuals; it builds trust, responsibility, and respect between two families.",
        "Presenting education, profession, family background, and expectations honestly helps both sides make informed decisions.",
      ],
    },
  },
  {
    id: "B-2",
    category: { bn: "বায়োডাটা গাইড", en: "Biodata Guide" },
    readTime: { bn: "৩ মিনিট পড়া", en: "3 min read" },
    title: {
      bn: "একটি গোছানো ও কার্যকর বায়োডাটা কীভাবে লিখবেন?",
      en: "How to Write a Clear and Honest Biodata",
    },
    excerpt: {
      bn: "স্পষ্ট তথ্য, বাস্তবসম্মত প্রত্যাশা এবং শালীন উপস্থাপনা কীভাবে সঠিক পাত্র বা পাত্রী খুঁজে পেতে সাহায্য করে।",
      en: "Clear details, realistic expectations, and respectful presentation help connect with compatible matches.",
    },
    content: {
      bn: [
        "বায়োডাটা তৈরির সময় অতিরঞ্জিত তথ্য না দিয়ে বর্তমান অবস্থান, পড়ালেখা, পেশা ও পারিবারিক কাঠামো স্পষ্টভাবে উল্লেখ করুন।",
        "জীবনসঙ্গীর কাছে আপনি কী ধরনের গুণাবলি ও মানসিকতা আশা করেন, তা সংক্ষেপে ও শালীন ভাষায় লিখুন।",
      ],
      en: [
        "State your current status, education, profession, and family structure clearly without exaggeration.",
        "Describe the traits and values you look for in a life partner concisely and respectfully.",
      ],
    },
  },
  {
    id: "B-3",
    category: { bn: "দাম্পত্য জীবন", en: "Married Life" },
    readTime: { bn: "৫ মিনিট পড়া", en: "5 min read" },
    title: {
      bn: "দাম্পত্য জীবনে পারস্পরিক বোঝাপড়া ও ধৈর্যের ভূমিকা",
      en: "Role of Mutual Understanding and Patience in Marriage",
    },
    excerpt: {
      bn: "নতুন পরিবেশে মানিয়ে নেওয়া, খোলামেলা আলোচনা এবং ধৈর্যশীল আচরণ দাম্পত্যকে স্থায়ী ও শান্তিময় করে তোলে।",
      en: "Adapting to a new life, open conversation, and patience nurture lasting peace in marriage.",
    },
    content: {
      bn: [
        "ভিন্ন পরিবেশ থেকে আসা দুজন মানুষের চিন্তা ও অভ্যাসে পার্থক্য থাকা স্বাভাবিক। পারস্পরিক সম্মান ও ধৈর্যই সেই দূরত্ব ঘুচিয়ে দেয়।",
        "ছোটখাটো বিষয় নিয়ে কথা বলে সমাধান করার অভ্যাস গড়ে তুললে দাম্পত্য সম্পর্ক আরও দৃঢ় হয়।",
      ],
      en: [
        "Differences in habits and perspectives are natural when two people come together; mutual respect and patience bridge them.",
        "Resolving small matters through calm dialogue strengthens the bond over time.",
      ],
    },
  },
];

export default function BlogPage() {
  const [lang, setLang] = useState<Lang>("bn");
  const [selectedPost, setSelectedPost] = useState<BlogPost>(blogPosts[0]!);

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
              {lang === "bn" ? "হালালবন্ধন ব্লগ" : "HalalBondhon Blog"}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold">
              {lang === "bn"
                ? "পরামর্শ, গাইডলাইন ও জীবনবোধ"
                : "Guides, Advice & Insights"}
            </h1>
            <p className="text-xs sm:text-base text-emerald-100 max-w-2xl mx-auto">
              {lang === "bn"
                ? "বায়োডাটা তৈরি, অভিভাবক যোগাযোগ এবং সুখী দাম্পত্য জীবন নিয়ে প্রয়োজনীয় লেখা"
                : "Helpful articles on biodata preparation, family communication, and married life"}
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 py-12 space-y-10">
          {/* Featured Article Reader */}
          <div className="bg-white rounded-2xl border border-emerald-200 shadow-xs p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-extrabold text-[#0b5d2b] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                {selectedPost.category[lang]}
              </span>
              <span className="text-stone-500 font-semibold">
                {selectedPost.readTime[lang]}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
              {selectedPost.title[lang]}
            </h2>

            <div className="space-y-3 text-sm sm:text-base text-stone-700 leading-relaxed border-t border-stone-100 pt-4">
              {selectedPost.content[lang].map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>

          {/* All Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogPosts.map((post) => {
              const isActive = selectedPost.id === post.id;
              return (
                <article
                  key={post.id}
                  className={`bg-white rounded-2xl p-6 flex flex-col justify-between gap-4 border transition ${
                    isActive
                      ? "border-[#0b5d2b] ring-2 ring-[#0b5d2b]/15"
                      : "border-stone-200 hover:border-[#0b5d2b]/50"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[#0b5d2b]">
                        {post.category[lang]}
                      </span>
                      <span className="text-stone-500">{post.readTime[lang]}</span>
                    </div>

                    <h3 className="text-base sm:text-lg font-extrabold text-stone-900 leading-snug">
                      {post.title[lang]}
                    </h3>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                      {post.excerpt[lang]}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPost(post);
                      window.scrollTo({ top: 180, behavior: "smooth" });
                    }}
                    className="w-full h-10 rounded-xl bg-emerald-50 hover:bg-[#0b5d2b] text-[#0b5d2b] hover:text-white font-bold text-xs sm:text-sm transition cursor-pointer"
                  >
                    {lang === "bn" ? "সম্পূর্ণ পড়ুন" : "Read Article"}
                  </button>
                </article>
              );
            })}
          </div>

          <div className="text-center pt-2">
            <Link
              href="/biodatas"
              className="inline-flex items-center gap-2 bg-[#0b5d2b] hover:bg-[#084721] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition"
            >
              <span>{lang === "bn" ? "বায়োডাটা খুঁজুন" : "Explore Biodatas"}</span>
              <span>→</span>
            </Link>
          </div>
        </section>
      </main>

      <HalalBondhonFooter lang={lang} />
    </div>
  );
}