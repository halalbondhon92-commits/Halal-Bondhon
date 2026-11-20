"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import HalalBondhonHeader from "@/components/HalalBondhonHeader";
import HalalBondhonFooter from "@/components/HalalBondhonFooter";
import type { Lang } from "@/lib/dictionary";

interface BiodataDetail {
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
}

const maritalLabel: Record<string, { bn: string; en: string }> = {
  unmarried: { bn: "অবিবাহিত", en: "Unmarried" },
  divorced: { bn: "তালাকপ্রাপ্ত", en: "Divorced" },
  widowed: { bn: "বিধবা / বিপত্নীক", en: "Widowed" },
};

export default function BiodataDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [lang, setLang] = useState<Lang>("bn");
  const [biodata, setBiodata] = useState<BiodataDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let active = true;

    fetch(`/api/biodatas/${encodeURIComponent(id)}`, { cache: "no-store" })
      .then((res) => {
        if (res.status === 404) {
          if (active) {
            setNotFound(true);
            setLoading(false);
          }
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (!active || !data) return;
        setBiodata(data.biodata || null);
        setLoading(false);
      })
      .catch(() => {
        if (active) {
          setNotFound(true);
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

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

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10">
        <div className="mb-5 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0b5d2b] hover:underline"
          >
            <span>←</span>
            <span>{lang === "bn" ? "হোমপেজে ফিরে যান" : "Back to Home"}</span>
          </Link>

          <Link
            href="/biodatas"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-stone-700 hover:text-[#0b5d2b]"
          >
            <span>{lang === "bn" ? "সব বায়োডাটা" : "All Biodatas"}</span>
            <span>→</span>
          </Link>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-emerald-100 p-8 text-center text-sm font-semibold text-[#0b5d2b]">
            {lang === "bn" ? "বায়োডাটা লোড হচ্ছে..." : "Loading biodata..."}
          </div>
        ) : notFound || !biodata ? (
          <div className="bg-white rounded-2xl border border-red-100 p-8 text-center space-y-3">
            <h1 className="text-xl font-extrabold text-red-700">
              {lang === "bn" ? "বায়োডাটা পাওয়া যায়নি" : "Biodata Not Found"}
            </h1>
            <p className="text-sm text-stone-600">
              {lang === "bn"
                ? "এই বায়োডাটাটি ডাটাবেসে বিদ্যমান নেই বা মুছে ফেলা হয়েছে।"
                : "This biodata does not exist in the database."}
            </p>
            <Link
              href="/"
              className="inline-block bg-[#0b5d2b] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl"
            >
              {lang === "bn" ? "হোমে যান" : "Go Home"}
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#0b5d2b] to-[#137a3b] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-[#f5d061] bg-white overflow-hidden flex items-center justify-center shrink-0">
                {biodata.photoUrl ? (
                  <img
                    src={biodata.photoUrl}
                    alt={biodata.fullName}
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <span className="text-4xl font-extrabold text-[#0b5d2b]">
                    {biodata.biodataType === "groom" ? "♂" : "♀"}
                  </span>
                )}
              </div>

              <div className="text-center sm:text-left space-y-1.5">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="bg-[#f5d061] text-stone-900 text-xs font-extrabold px-3 py-0.5 rounded-full">
                    {biodata.biodataCode}
                  </span>
                  <span className="bg-white/15 border border-white/30 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                    {biodata.biodataType === "groom"
                      ? lang === "bn"
                        ? "পাত্রের বায়োডাটা"
                        : "Groom"
                      : lang === "bn"
                        ? "পাত্রীর বায়োডাটা"
                        : "Bride"}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold">
                  {biodata.fullName}
                </h1>
                <p className="text-xs sm:text-sm text-emerald-100">
                  {age ? `${age} ${lang === "bn" ? "বছর" : "years"}` : ""}
                  {biodata.birthYear ? ` (${biodata.birthYear})` : ""} •{" "}
                  {biodata.district}, {biodata.thana}
                </p>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-8">
              <div className="space-y-3">
                <h2 className="text-base font-bold text-[#0b5d2b] border-l-4 border-[#0b5d2b] pl-2.5">
                  {lang === "bn" ? "ব্যক্তিগত তথ্য" : "Personal Information"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-[#f9fbf9] p-3 rounded-lg border border-stone-100 flex justify-between">
                    <span className="text-stone-500">
                      {lang === "bn" ? "বৈবাহিক অবস্থা:" : "Marital Status:"}
                    </span>
                    <span className="font-bold text-stone-900">
                      {maritalLabel[biodata.maritalStatus]?.[lang] ||
                        biodata.maritalStatus}
                    </span>
                  </div>
                  <div className="bg-[#f9fbf9] p-3 rounded-lg border border-stone-100 flex justify-between">
                    <span className="text-stone-500">
                      {lang === "bn" ? "জন্ম সাল:" : "Birth Year:"}
                    </span>
                    <span className="font-bold text-stone-900">
                      {biodata.birthYear}
                    </span>
                  </div>
                  <div className="bg-[#f9fbf9] p-3 rounded-lg border border-stone-100 flex justify-between">
                    <span className="text-stone-500">
                      {lang === "bn" ? "গায়ের রং:" : "Skin Tone:"}
                    </span>
                    <span className="font-bold text-stone-900">
                      {biodata.skinTone}
                    </span>
                  </div>
                  <div className="bg-[#f9fbf9] p-3 rounded-lg border border-stone-100 flex justify-between">
                    <span className="text-stone-500">
                      {lang === "bn" ? "উচ্চতা ও ওজন:" : "Height & Weight:"}
                    </span>
                    <span className="font-bold text-stone-900">
                      {biodata.height} • {biodata.weight}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-base font-bold text-[#0b5d2b] border-l-4 border-[#0b5d2b] pl-2.5">
                  {lang === "bn"
                    ? "শিক্ষা, পেশা ও ঠিকানা"
                    : "Education, Profession & Address"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="bg-[#f9fbf9] p-3 rounded-lg border border-stone-100 flex justify-between gap-2">
                    <span className="text-stone-500">
                      {lang === "bn" ? "পড়ালেখা:" : "Education:"}
                    </span>
                    <span className="font-bold text-stone-900 text-right">
                      {biodata.education}
                    </span>
                  </div>
                  <div className="bg-[#f9fbf9] p-3 rounded-lg border border-stone-100 flex justify-between gap-2">
                    <span className="text-stone-500">
                      {lang === "bn" ? "পেশা:" : "Profession:"}
                    </span>
                    <span className="font-bold text-stone-900 text-right">
                      {biodata.profession}
                    </span>
                  </div>
                  <div className="bg-[#f9fbf9] p-3 rounded-lg border border-stone-100 flex justify-between gap-2">
                    <span className="text-stone-500">
                      {lang === "bn" ? "জেলা / থানা:" : "District / Thana:"}
                    </span>
                    <span className="font-bold text-stone-900 text-right">
                      {biodata.district}, {biodata.thana}
                    </span>
                  </div>
                  <div className="bg-[#f9fbf9] p-3 rounded-lg border border-stone-100 flex justify-between gap-2">
                    <span className="text-stone-500">
                      {lang === "bn" ? "গ্রাম / এলাকা:" : "Village:"}
                    </span>
                    <span className="font-bold text-stone-900 text-right">
                      {biodata.village}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-base font-bold text-[#0b5d2b] border-l-4 border-[#0b5d2b] pl-2.5">
                  {lang === "bn"
                    ? "পারিবারিক ও আর্থিক তথ্য"
                    : "Family & Financial Details"}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                  <div className="bg-[#f9fbf9] p-3 rounded-lg border border-stone-100 flex justify-between">
                    <span className="text-stone-500">
                      {lang === "bn" ? "বাবার পেশা:" : "Father:"}
                    </span>
                    <span className="font-bold text-stone-900">
                      {biodata.fatherProfession}
                    </span>
                  </div>
                  <div className="bg-[#f9fbf9] p-3 rounded-lg border border-stone-100 flex justify-between">
                    <span className="text-stone-500">
                      {lang === "bn" ? "ভাই:" : "Brothers:"}
                    </span>
                    <span className="font-bold text-stone-900">
                      {biodata.brothersCount}
                    </span>
                  </div>
                  <div className="bg-[#f9fbf9] p-3 rounded-lg border border-stone-100 flex justify-between">
                    <span className="text-stone-500">
                      {lang === "bn" ? "বোন:" : "Sisters:"}
                    </span>
                    <span className="font-bold text-stone-900">
                      {biodata.sistersCount}
                    </span>
                  </div>
                </div>

                <div className="bg-[#f9fbf9] p-4 rounded-xl border border-stone-200 text-sm">
                  <p className="text-xs font-bold text-[#0b5d2b] mb-1">
                    {lang === "bn"
                      ? "আর্থিক অবস্থা বিস্তারিত:"
                      : "Financial Status Details:"}
                  </p>
                  <p className="text-stone-800 whitespace-pre-line leading-relaxed">
                    {biodata.financialDetails}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <HalalBondhonFooter lang={lang} />
    </div>
  );
}