"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HalalBondhonHeader from "@/components/HalalBondhonHeader";
import HalalBondhonFooter from "@/components/HalalBondhonFooter";
import type { Lang } from "@/lib/dictionary";

interface SessionUser {
  userId: string;
  email: string;
  fullName: string;
  gender?: "groom" | "bride";
  role: string;
}

interface UserBiodata {
  _id: string;
  biodataCode: string;
  biodataType: "groom" | "bride";
  fullName: string;
  maritalStatus: "unmarried" | "divorced" | "widowed";
  birthYear: number;
  skinTone: string;
  height: string;
  weight: string;
  education: string;
  profession: string;
  district: string;
  thana: string;
  village: string;
  fatherProfession: string;
  brothersCount: number;
  sistersCount: number;
  financialDetails: string;
  photoUrl?: string;
  status?: string;
}

const maritalLabel: Record<string, { bn: string; en: string }> = {
  unmarried: { bn: "অবিবাহিত", en: "Unmarried" },
  divorced: { bn: "তালাকপ্রাপ্ত", en: "Divorced" },
  widowed: { bn: "বিধবা / বিপত্নীক", en: "Widowed" },
};

export default function DashboardPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("bn");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [biodata, setBiodata] = useState<UserBiodata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const meRes = await fetch("/api/auth/me", { cache: "no-store" });
        const meData = await meRes.json();

        if (!meData?.user) {
          router.push("/login");
          return;
        }

        if (active) setUser(meData.user);

        const bioRes = await fetch("/api/biodata", { cache: "no-store" });
        if (bioRes.ok) {
          const bioData = await bioRes.json();
          if (active) setBiodata(bioData?.biodata || null);
        }
      } catch {
        // ignore network error
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      active = false;
    };
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  const currentYear = new Date().getFullYear();
  const age =
    biodata?.birthYear && biodata.birthYear > 1950
      ? Math.max(18, currentYear - biodata.birthYear)
      : null;

  return (
    <div className="min-h-screen bg-[#f6f9f6] text-stone-900 flex flex-col">
      <HalalBondhonHeader
        lang={lang}
        onToggleLang={() => setLang((p) => (p === "bn" ? "en" : "bn"))}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 space-y-8">
        {loading ? (
          <div className="bg-white rounded-2xl border border-emerald-100 p-10 text-center text-sm font-semibold text-[#0b5d2b]">
            {lang === "bn" ? "ড্যাশবোর্ড লোড হচ্ছে..." : "Loading dashboard..."}
          </div>
        ) : !user ? null : (
          <>
            {/* Top Welcome Banner */}
            <div className="bg-gradient-to-r from-[#0b5d2b] to-[#137a3b] text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-2 border-[#f5d061] bg-white overflow-hidden flex items-center justify-center shrink-0">
                  {biodata?.photoUrl ? (
                    <img
                      src={biodata.photoUrl}
                      alt={user.fullName}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#0b5d2b]">
                      {user.fullName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="inline-block bg-[#f5d061] text-stone-900 text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                    {lang === "bn" ? "সদস্য ড্যাশবোর্ড" : "Member Dashboard"}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-extrabold">
                    {lang === "bn"
                      ? `আসসালামু আলাইকুম, ${user.fullName}`
                      : `Assalamu Alaikum, ${user.fullName}`}
                  </h1>
                  <p className="text-xs sm:text-sm text-emerald-100">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/create-biodata"
                  className="bg-[#f5d061] hover:bg-[#eab308] text-stone-900 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition"
                >
                  {biodata
                    ? lang === "bn"
                      ? "বায়োডাটা এডিট করুন"
                      : "Edit Biodata"
                    : lang === "bn"
                      ? "+ বায়োডাটা তৈরি করুন"
                      : "+ Create Biodata"}
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="bg-white/15 hover:bg-red-600 border border-white/30 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition cursor-pointer"
                >
                  {lang === "bn" ? "লগআউট" : "Logout"}
                </button>
              </div>
            </div>

            {/* Stats & Quick Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-emerald-100 p-5 shadow-xs space-y-1">
                <p className="text-xs font-semibold text-stone-500">
                  {lang === "bn" ? "বায়োডাটা স্ট্যাটাস" : "Biodata Status"}
                </p>
                <p className="text-lg font-extrabold text-[#0b5d2b]">
                  {biodata
                    ? lang === "bn"
                      ? "প্রকাশিত (Active)"
                      : "Active"
                    : lang === "bn"
                      ? "তৈরি করা হয়নি"
                      : "Not Created"}
                </p>
                <p className="text-xs text-stone-600">
                  {biodata
                    ? `${lang === "bn" ? "কোড:" : "Code:"} ${biodata.biodataCode}`
                    : lang === "bn"
                      ? "এখনই বায়োডাটা যুক্ত করুন"
                      : "Add your biodata now"}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-emerald-100 p-5 shadow-xs space-y-1">
                <p className="text-xs font-semibold text-stone-500">
                  {lang === "bn" ? "অ্যাকাউন্টের ধরন" : "Account Type"}
                </p>
                <p className="text-lg font-extrabold text-stone-900">
                  {(biodata?.biodataType || user.gender) === "bride"
                    ? lang === "bn"
                      ? "পাত্রী (Bride)"
                      : "Bride"
                    : lang === "bn"
                      ? "পাত্র (Groom)"
                      : "Groom"}
                </p>
                <p className="text-xs text-stone-600">
                  {lang === "bn" ? "সাধারণ সদস্য" : "Standard Member"}
                </p>
              </div>

              <Link
                href="/biodatas"
                className="bg-white rounded-xl border border-emerald-100 hover:border-[#0b5d2b] p-5 shadow-xs transition flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-stone-500">
                    {lang === "bn" ? "পাত্র / পাত্রী খুঁজুন" : "Find Matches"}
                  </p>
                  <p className="text-lg font-extrabold text-[#0b5d2b]">
                    {lang === "bn" ? "সকল বায়োডাটা →" : "All Biodatas →"}
                  </p>
                </div>
                <p className="text-xs text-stone-600 pt-2">
                  {lang === "bn"
                    ? "সবার বায়োডাটা ব্রাউজ করুন"
                    : "Browse available profiles"}
                </p>
              </Link>

              <Link
                href="/premium"
                className="bg-gradient-to-br from-[#0e6b31] to-[#063818] text-white rounded-xl p-5 shadow-xs hover:opacity-95 transition flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-emerald-200">
                    {lang === "bn" ? "আপগ্রেড করুন" : "Upgrade Plan"}
                  </p>
                  <p className="text-lg font-extrabold text-[#f5d061]">
                    {lang === "bn" ? "প্রিমিয়াম মেম্বারশিপ →" : "Go Premium →"}
                  </p>
                </div>
                <p className="text-xs text-emerald-100 pt-2">
                  {lang === "bn"
                    ? "অভিভাবক যোগাযোগ সুবিধা নিন"
                    : "Unlock guardian contacts"}
                </p>
              </Link>
            </div>

            {/* User Biodata Summary Section */}
            <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-extrabold text-[#0b5d2b]">
                    {lang === "bn" ? "আমার বায়োডাটা সারসংক্ষেপ" : "My Biodata Summary"}
                  </h2>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {lang === "bn"
                      ? "অন্যান্য সদস্যরা আপনার বায়োডাটায় যে তথ্যগুলো দেখতে পাবেন"
                      : "Information visible to other members on your biodata"}
                  </p>
                </div>

                {biodata && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/biodatas/${biodata._id}`}
                      className="text-xs font-bold text-[#0b5d2b] bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 px-3.5 py-2 rounded-lg transition"
                    >
                      {lang === "bn" ? "পাবলিক ভিউ দেখুন" : "Public Preview"}
                    </Link>
                    <Link
                      href="/create-biodata"
                      className="text-xs font-bold text-white bg-[#0b5d2b] hover:bg-[#084721] px-3.5 py-2 rounded-lg transition"
                    >
                      {lang === "bn" ? "তথ্য পরিবর্তন করুন" : "Edit Info"}
                    </Link>
                  </div>
                )}
              </div>

              {!biodata ? (
                <div className="text-center py-10 space-y-3">
                  <p className="text-sm sm:text-base font-bold text-stone-800">
                    {lang === "bn"
                      ? "আপনি এখনো কোনো বায়োডাটা তৈরি করেননি।"
                      : "You have not created a biodata yet."}
                  </p>
                  <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
                    {lang === "bn"
                      ? "নিচের বাটনে ক্লিক করে আপনার ব্যক্তিগত, শিক্ষাগত ও পারিবারিক তথ্য দিয়ে বায়োডাটা তৈরি করুন।"
                      : "Click the button below to fill out your personal, educational, and family details."}
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/create-biodata"
                      className="inline-block bg-[#0b5d2b] hover:bg-[#084721] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition"
                    >
                      {lang === "bn"
                        ? "এখনই বায়োডাটা তৈরি করুন →"
                        : "Create Biodata Now →"}
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    <div className="bg-[#f9fbf9] p-3.5 rounded-xl border border-stone-100">
                      <span className="block text-xs text-stone-500">
                        {lang === "bn" ? "নাম ও বায়োডাটা কোড" : "Name & Code"}
                      </span>
                      <span className="font-bold text-stone-900">
                        {biodata.fullName} ({biodata.biodataCode})
                      </span>
                    </div>

                    <div className="bg-[#f9fbf9] p-3.5 rounded-xl border border-stone-100">
                      <span className="block text-xs text-stone-500">
                        {lang === "bn" ? "বৈবাহিক অবস্থা ও জন্ম সাল" : "Status & Birth Year"}
                      </span>
                      <span className="font-bold text-stone-900">
                        {maritalLabel[biodata.maritalStatus]?.[lang] ||
                          biodata.maritalStatus}{" "}
                        • {biodata.birthYear}
                        {age ? ` (${age} ${lang === "bn" ? "বছর" : "yrs"})` : ""}
                      </span>
                    </div>

                    <div className="bg-[#f9fbf9] p-3.5 rounded-xl border border-stone-100">
                      <span className="block text-xs text-stone-500">
                        {lang === "bn" ? "গায়ের রং, উচ্চতা ও ওজন" : "Appearance"}
                      </span>
                      <span className="font-bold text-stone-900">
                        {biodata.skinTone} • {biodata.height} • {biodata.weight}
                      </span>
                    </div>

                    <div className="bg-[#f9fbf9] p-3.5 rounded-xl border border-stone-100">
                      <span className="block text-xs text-stone-500">
                        {lang === "bn" ? "পড়ালেখা" : "Education"}
                      </span>
                      <span className="font-bold text-stone-900">
                        {biodata.education}
                      </span>
                    </div>

                    <div className="bg-[#f9fbf9] p-3.5 rounded-xl border border-stone-100">
                      <span className="block text-xs text-stone-500">
                        {lang === "bn" ? "পেশা" : "Profession"}
                      </span>
                      <span className="font-bold text-stone-900">
                        {biodata.profession}
                      </span>
                    </div>

                    <div className="bg-[#f9fbf9] p-3.5 rounded-xl border border-stone-100">
                      <span className="block text-xs text-stone-500">
                        {lang === "bn" ? "স্থায়ী ঠিকানা" : "Permanent Address"}
                      </span>
                      <span className="font-bold text-stone-900">
                        {biodata.village}, {biodata.thana}, {biodata.district}
                      </span>
                    </div>

                    <div className="bg-[#f9fbf9] p-3.5 rounded-xl border border-stone-100">
                      <span className="block text-xs text-stone-500">
                        {lang === "bn" ? "বাবার পেশা" : "Father's Profession"}
                      </span>
                      <span className="font-bold text-stone-900">
                        {biodata.fatherProfession}
                      </span>
                    </div>

                    <div className="bg-[#f9fbf9] p-3.5 rounded-xl border border-stone-100">
                      <span className="block text-xs text-stone-500">
                        {lang === "bn" ? "ভাই ও বোন" : "Siblings"}
                      </span>
                      <span className="font-bold text-stone-900">
                        {lang === "bn"
                          ? `ভাই: ${biodata.brothersCount} জন, বোন: ${biodata.sistersCount} জন`
                          : `Brothers: ${biodata.brothersCount}, Sisters: ${biodata.sistersCount}`}
                      </span>
                    </div>
                  </div>

                  <div className="bg-[#f9fbf9] p-4 rounded-xl border border-stone-200 text-sm">
                    <span className="block text-xs font-bold text-[#0b5d2b] mb-1">
                      {lang === "bn"
                        ? "আর্থিক অবস্থা বিস্তারিত:"
                        : "Financial Status Details:"}
                    </span>
                    <p className="text-stone-800 whitespace-pre-line leading-relaxed">
                      {biodata.financialDetails}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <HalalBondhonFooter lang={lang} />
    </div>
  );
}