"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { dictionary, type Lang } from "@/lib/dictionary";
import HalalBondhonHeader from "@/components/HalalBondhonHeader";
import HalalBondhonFooter from "@/components/HalalBondhonFooter";

interface MemberItem {
  id: string;
  biodataCode?: string;
  gender: "groom" | "bride";
  name: { bn: string; en: string };
  age: number;
  district: { bn: string; en: string };
  profession: { bn: string; en: string };
  professionKey: string;
  image: string;
  verified: boolean;
  isDbBiodata?: boolean;
}

interface DbBiodataItem {
  _id: string;
  biodataCode: string;
  biodataType: "groom" | "bride";
  fullName: string;
  birthYear: number;
  education: string;
  profession: string;
  district: string;
  thana?: string;
  photoUrl?: string;
}

interface StoryItem {
  id: string;
  quote: { bn: string; en: string };
  couple: { bn: string; en: string };
  avatar: string;
}

const fallbackMembers: MemberItem[] = [
  {
    id: "M-1",
    gender: "groom",
    name: { bn: "মোঃ রিফাত হাসান", en: "Md. Rifat Hasan" },
    age: 28,
    district: { bn: "ঢাকা", en: "Dhaka" },
    profession: { bn: "সফটওয়্যার ইঞ্জিনিয়ার", en: "Software Engineer" },
    professionKey: "engineer",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
    verified: true,
  },
  {
    id: "M-2",
    gender: "bride",
    name: { bn: "সুমাইয়া আক্তার", en: "Sumaiya Akter" },
    age: 28,
    district: { bn: "খুলনা", en: "Khulna" },
    profession: { bn: "শিক্ষার্থী", en: "Student" },
    professionKey: "student",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80",
    verified: true,
  },
  {
    id: "M-3",
    gender: "groom",
    name: { bn: "আব্দুল্লাহ আল নোমান", en: "Abdullah Al Noman" },
    age: 30,
    district: { bn: "চট্টগ্রাম", en: "Chattogram" },
    profession: { bn: "ব্যবসায়ী", en: "Businessman" },
    professionKey: "business",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80",
    verified: true,
  },
  {
    id: "M-4",
    gender: "bride",
    name: { bn: "নুসরাত জাহান", en: "Nusrat Jahan" },
    age: 24,
    district: { bn: "রাজশাহী", en: "Rajshahi" },
    profession: { bn: "শিক্ষিকা", en: "Lecturer" },
    professionKey: "teacher",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
    verified: true,
  },
];

const successStories: StoryItem[] = [
  {
    id: "S-1",
    quote: {
      bn: "“হালালবন্ধনের মাধ্যমে আমরা একে অপরকে পেয়েছি। আল্লাহর রহমতে আমাদের জীবন এখন অনেক সুন্দর।”",
      en: "“Through HalalBondhon we found each other. By Allah’s grace, our life is now so blessed.”",
    },
    couple: {
      bn: "— নাফিস ও তানিয়া, ঢাকা",
      en: "— Nafis & Tania, Dhaka",
    },
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
  },
  {
    id: "S-2",
    quote: {
      bn: "“পরিবারের সম্মতি ও সুন্দর পরিবেশে আমরা আমাদের জীবনসঙ্গী খুঁজে পেয়েছি। হালালবন্ধনকে ধন্যবাদ।”",
      en: "“With family consent and a respectful environment, we found our life partner. Thanks to HalalBondhon.”",
    },
    couple: {
      bn: "— সাকিব ও নাদিয়া, খুলনা",
      en: "— Sakib & Nadia, Khulna",
    },
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
  },
];

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("bn");
  const t = dictionary[lang];

  const [members, setMembers] = useState<MemberItem[]>(fallbackMembers);
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [professionFilter, setProfessionFilter] = useState<string>("all");
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [activeStoryIndex, setActiveStoryIndex] = useState<number>(0);

  useEffect(() => {
    let active = true;
    const currentYear = new Date().getFullYear();

    fetch("/api/biodatas?limit=8", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        const dbList: DbBiodataItem[] = Array.isArray(data?.biodatas)
          ? data.biodatas
          : [];

        if (dbList.length > 0) {
          const mapped: MemberItem[] = dbList.map((b) => {
            const calculatedAge =
              b.birthYear && b.birthYear > 1950
                ? Math.max(18, currentYear - b.birthYear)
                : 25;

            return {
              id: b._id,
              biodataCode: b.biodataCode,
              gender: b.biodataType === "bride" ? "bride" : "groom",
              name: { bn: b.fullName, en: b.fullName },
              age: calculatedAge,
              district: { bn: b.district, en: b.district },
              profession: { bn: b.profession, en: b.profession },
              professionKey: b.profession.toLowerCase(),
              image:
                b.photoUrl && b.photoUrl.trim() !== ""
                  ? b.photoUrl
                  : b.biodataType === "bride"
                    ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80"
                    : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80",
              verified: true,
              isDbBiodata: true,
            };
          });
          setMembers(mapped);
        } else {
          setMembers(fallbackMembers);
        }
      })
      .catch(() => {
        if (active) setMembers(fallbackMembers);
      });

    return () => {
      active = false;
    };
  }, []);

  const toggleLang = () => {
    setLang((prev) => (prev === "bn" ? "en" : "bn"));
  };

  const filteredMembers = members.filter((m) => {
    const matchGender = genderFilter === "all" || m.gender === genderFilter;
    const matchProfession =
      professionFilter === "all" ||
      m.professionKey.includes(professionFilter.toLowerCase());
    const matchDistrict =
      districtFilter === "all" ||
      m.district.en.toLowerCase().includes(districtFilter.toLowerCase()) ||
      m.district.bn.includes(districtFilter);

    let matchAge = true;
    if (ageFilter === "18-24") matchAge = m.age >= 18 && m.age <= 24;
    if (ageFilter === "25-30") matchAge = m.age >= 25 && m.age <= 30;
    if (ageFilter === "31-38") matchAge = m.age >= 31 && m.age <= 38;

    return matchGender && matchAge && matchProfession && matchDistrict;
  });

  const currentStory = successStories[activeStoryIndex] ?? successStories[0]!;

  return (
    <div className="min-h-screen bg-[#f6f9f6] text-stone-900 flex flex-col">
      {/* Top & Main Header */}
      <HalalBondhonHeader lang={lang} onToggleLang={toggleLang} />

      <div className="flex-1">
        {/* 1. Hero Banner Section */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#dff2e5] via-[#eef8f1] to-[#cbe8d5] border-b border-emerald-200/70">
          <div
            aria-hidden="true"
            className="pointer-events-none hidden md:block absolute right-6 bottom-0 w-80 h-64 opacity-20"
          >
            <svg viewBox="0 0 320 260" className="w-full h-full fill-[#0b5d2b]">
              <path d="M40 260V125C40 70 80 35 125 35C170 35 210 70 210 125V260H40Z" />
              <path d="M180 260V150C180 108 210 82 245 82C280 82 305 108 305 150V260H180Z" />
              <circle cx="125" cy="18" r="10" />
            </svg>
          </div>

          <div className="max-w-7xl mx-auto px-4 pt-8 pb-20 md:pt-10 md:pb-24 relative z-10">
            <div className="mb-6">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#0b5d2b]">
                {t.brand}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-[#156f37]">
                {t.heroSlogan}
              </div>
            </div>

            <div className="max-w-xl space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-[42px] font-extrabold leading-[1.25] text-[#0c4a22]">
                <span className="block">{t.heroLine1}</span>
                <span className="block text-[#0b5d2b]">{t.heroLine2}</span>
              </h1>

              <p className="text-sm sm:text-base text-stone-700 leading-relaxed max-w-md">
                {t.heroDesc}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-[#0b5d2b] hover:bg-[#084721] text-white font-semibold px-6 py-3 rounded-lg shadow-sm transition"
                >
                  <span>{t.startNow}</span>
                  <span>→</span>
                </Link>

                <Link
                  href="/create-biodata"
                  className="inline-flex items-center gap-2 bg-white hover:bg-emerald-50 text-[#0b5d2b] border border-[#0b5d2b]/30 font-semibold px-5 py-3 rounded-lg transition"
                >
                  <span>
                    {lang === "bn" ? "বায়োডাটা তৈরি করুন" : "Create Biodata"}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Search Filter Bar */}
        <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
          <div className="bg-white rounded-xl shadow-md border border-emerald-100 p-4 sm:p-5">
            <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-bold text-[#0b5d2b] mb-4">
              <span>🔍</span>
              <h2>{t.searchBoxTitle}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
              <select
                aria-label={t.selectGender}
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="h-10 w-full rounded-md border border-stone-300 bg-[#f9fbf9] px-3 text-sm text-stone-800 focus:outline-none focus:border-[#0b5d2b]"
              >
                <option value="all">{t.selectGender}</option>
                <option value="groom">{t.groom}</option>
                <option value="bride">{t.bride}</option>
              </select>

              <select
                aria-label={t.ageFilter}
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
                className="h-10 w-full rounded-md border border-stone-300 bg-[#f9fbf9] px-3 text-sm text-stone-800 focus:outline-none focus:border-[#0b5d2b]"
              >
                <option value="all">{t.ageFilter}</option>
                <option value="18-24">{t.age18_24}</option>
                <option value="25-30">{t.age25_30}</option>
                <option value="31-38">{t.age31_38}</option>
              </select>

              <select
                aria-label={t.selectProfession}
                value={professionFilter}
                onChange={(e) => setProfessionFilter(e.target.value)}
                className="h-10 w-full rounded-md border border-stone-300 bg-[#f9fbf9] px-3 text-sm text-stone-800 focus:outline-none focus:border-[#0b5d2b]"
              >
                <option value="all">{t.selectProfession}</option>
                <option value="engineer">
                  {lang === "bn" ? "সফটওয়্যার ইঞ্জিনিয়ার" : "Software Engineer"}
                </option>
                <option value="student">
                  {lang === "bn" ? "শিক্ষার্থী" : "Student"}
                </option>
                <option value="business">
                  {lang === "bn" ? "ব্যবসায়ী" : "Businessman"}
                </option>
                <option value="teacher">
                  {lang === "bn" ? "শিক্ষিকা" : "Lecturer"}
                </option>
              </select>

              <select
                aria-label={t.selectDistrict}
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                className="h-10 w-full rounded-md border border-stone-300 bg-[#f9fbf9] px-3 text-sm text-stone-800 focus:outline-none focus:border-[#0b5d2b]"
              >
                <option value="all">{t.selectDistrict}</option>
                <option value="Dhaka">{lang === "bn" ? "ঢাকা" : "Dhaka"}</option>
                <option value="Khulna">
                  {lang === "bn" ? "খুলনা" : "Khulna"}
                </option>
                <option value="Chattogram">
                  {lang === "bn" ? "চট্টগ্রাম" : "Chattogram"}
                </option>
                <option value="Rajshahi">
                  {lang === "bn" ? "রাজশাহী" : "Rajshahi"}
                </option>
              </select>

              <button
                type="button"
                className="h-10 w-full rounded-md bg-[#0b5d2b] hover:bg-[#084721] text-white font-semibold text-sm inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>🔍</span>
                <span>{t.searchBtn}</span>
              </button>
            </div>
          </div>
        </section>

        {/* 3. Trust Highlights Strip */}
        <section className="max-w-7xl mx-auto px-4 pt-6">
          <div className="bg-white rounded-xl border border-stone-200/80 shadow-xs py-5 px-4 grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-stone-200">
            <div className="flex items-center justify-center gap-3 pt-2 lg:pt-0">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#0b5d2b] flex items-center justify-center font-bold shrink-0">
                ✓
              </div>
              <div className="text-xs sm:text-sm leading-snug">
                <div className="font-bold text-[#0b5d2b]">{t.trust1Title}</div>
                <div className="text-stone-600">{t.trust1Sub}</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4 lg:pt-0 lg:pl-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#0b5d2b] flex items-center justify-center text-base shrink-0">
                🕌
              </div>
              <div className="text-xs sm:text-sm leading-snug">
                <div className="font-bold text-[#0b5d2b]">{t.trust2Title}</div>
                <div className="text-stone-600">{t.trust2Sub}</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4 lg:pt-0 lg:pl-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#0b5d2b] flex items-center justify-center text-base shrink-0">
                🤝
              </div>
              <div className="text-xs sm:text-sm leading-snug">
                <div className="font-bold text-[#0b5d2b]">{t.trust3Title}</div>
                <div className="text-stone-600">{t.trust3Sub}</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4 lg:pt-0 lg:pl-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-[#0b5d2b] flex items-center justify-center text-base shrink-0">
                🎧
              </div>
              <div className="text-xs sm:text-sm leading-snug">
                <div className="font-bold text-[#0b5d2b]">{t.trust4Title}</div>
                <div className="text-stone-600">{t.trust4Sub}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Recent Members / Biodatas Profile Grid */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="relative flex items-center justify-center mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0b5d2b] text-center">
              {t.recentTitle}
            </h2>
            <Link
              href="/biodatas"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-[#0b5d2b] bg-white border border-emerald-200 hover:bg-emerald-50 px-3.5 py-1.5 rounded-full shadow-2xs transition absolute right-0"
            >
              <span>{t.seeMore}</span>
              <span>→</span>
            </Link>
          </div>

          {filteredMembers.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-600 text-sm">
              {t.noResult}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredMembers.map((member) => (
                <Link
                  key={member.id}
                  href={`/biodatas/${member.id}`}
                  className="bg-white rounded-xl border border-stone-200/90 hover:border-[#0b5d2b] shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100 relative">
                      <img
                        src={member.image}
                        alt={member.name[lang]}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                      />
                      {member.biodataCode && (
                        <span className="absolute top-2.5 left-2.5 bg-[#0b5d2b] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-xs">
                          {member.biodataCode}
                        </span>
                      )}
                    </div>

                    <div className="p-4 text-center space-y-1.5">
                      <h3 className="font-bold text-stone-900 group-hover:text-[#0b5d2b] transition text-base">
                        {member.name[lang]}
                      </h3>
                      <p className="text-xs text-stone-600">
                        {member.age} {t.years} | {member.district[lang]}
                      </p>
                      <p className="text-xs font-medium text-stone-700">
                        {member.profession[lang]}
                      </p>

                      {member.verified && (
                        <div className="pt-1.5 flex justify-center">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0b5d2b] bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                            <span>✔</span>
                            <span>{t.verified}</span>
                          </span>
                        </div>
                      )}

                      <div className="pt-2">
                        <span className="inline-flex items-center justify-center w-full h-9 rounded-lg bg-[#0b5d2b] group-hover:bg-[#084721] text-white text-xs font-bold transition">
                          {lang === "bn"
                            ? "বিস্তারিত বায়োডাটা দেখুন"
                            : "View Biodata"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/biodatas"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0b5d2b] bg-white border border-emerald-200 px-4 py-2 rounded-full"
            >
              <span>{t.seeMore}</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* 5. How It Works Section */}
        <section className="bg-white border-y border-stone-200/80 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0b5d2b] text-center mb-10">
              {t.howTitle}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
              <div className="relative flex flex-col items-center text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-[#0b5d2b] text-white flex items-center justify-center text-xl shadow-sm">
                  👤+
                </div>
                <h3 className="font-bold text-[#0b5d2b] text-sm sm:text-base">
                  {t.step1Title}
                </h3>
                <p className="text-xs text-stone-600">{t.step1Desc}</p>
                <span className="hidden lg:block absolute -right-5 top-4 text-stone-400 text-lg">
                  →
                </span>
              </div>

              <div className="relative flex flex-col items-center text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-[#0b5d2b] text-white flex items-center justify-center text-xl shadow-sm">
                  🔍
                </div>
                <h3 className="font-bold text-[#0b5d2b] text-sm sm:text-base">
                  {t.step2Title}
                </h3>
                <p className="text-xs text-stone-600">{t.step2Desc}</p>
                <span className="hidden lg:block absolute -right-5 top-4 text-stone-400 text-lg">
                  →
                </span>
              </div>

              <div className="relative flex flex-col items-center text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-[#0b5d2b] text-white flex items-center justify-center text-xl shadow-sm">
                  💬
                </div>
                <h3 className="font-bold text-[#0b5d2b] text-sm sm:text-base">
                  {t.step3Title}
                </h3>
                <p className="text-xs text-stone-600">{t.step3Desc}</p>
                <span className="hidden lg:block absolute -right-5 top-4 text-stone-400 text-lg">
                  →
                </span>
              </div>

              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-14 h-14 rounded-full bg-[#0b5d2b] text-white flex items-center justify-center text-xl shadow-sm">
                  🤝
                </div>
                <h3 className="font-bold text-[#0b5d2b] text-sm sm:text-base">
                  {t.step4Title}
                </h3>
                <p className="text-xs text-stone-600">{t.step4Desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Success Stories & Premium Membership Split Section */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200/90 shadow-xs p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <h2 className="text-lg sm:text-xl font-bold text-[#0b5d2b]">
                    {t.storyTitle}
                  </h2>
                  <Link
                    href="/success-stories"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#0b5d2b] border border-emerald-200 hover:bg-emerald-50 px-3 py-1 rounded-full transition"
                  >
                    <span>{t.viewAllStories}</span>
                    <span>→</span>
                  </Link>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5 py-2">
                  <img
                    src={currentStory.avatar}
                    alt={currentStory.couple[lang]}
                    className="w-20 h-20 rounded-full object-cover object-top border-2 border-emerald-100 shrink-0"
                  />

                  <div className="space-y-2 text-center sm:text-left">
                    <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                      {currentStory.quote[lang]}
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-stone-900">
                      {currentStory.couple[lang]}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 pt-5">
                {successStories.map((story, idx) => (
                  <button
                    key={story.id}
                    type="button"
                    aria-label={`Story ${idx + 1}`}
                    onClick={() => setActiveStoryIndex(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === activeStoryIndex
                        ? "w-5 bg-[#0b5d2b]"
                        : "w-2.5 bg-stone-300 hover:bg-stone-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 rounded-xl bg-gradient-to-br from-[#0e6b31] via-[#095325] to-[#063818] text-white p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-4 relative z-10">
                <div className="flex items-start gap-3">
                  <span className="text-2xl text-[#f5d061] shrink-0">👑</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#f5d061]">
                      {t.premiumTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-emerald-100 mt-0.5">
                      {t.premiumSub}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2.5 text-sm text-white pt-1">
                  <li className="flex items-center gap-2.5">
                    <span className="text-[#f5d061] font-bold">✔</span>
                    <span>{t.benefit1}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-[#f5d061] font-bold">✔</span>
                    <span>{t.benefit2}</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="text-[#f5d061] font-bold">✔</span>
                    <span>{t.benefit3}</span>
                  </li>
                </ul>
              </div>

              <div className="pt-6 relative z-10">
                <Link
                  href="/premium"
                  className="inline-flex items-center gap-2 bg-[#f5d061] hover:bg-[#eab308] text-stone-900 font-bold text-sm px-5 py-2.5 rounded-lg shadow-xs transition"
                >
                  <span>{t.subscribeNow}</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* HalalBondhon Footer */}
      <HalalBondhonFooter lang={lang} />
    </div>
  );
}