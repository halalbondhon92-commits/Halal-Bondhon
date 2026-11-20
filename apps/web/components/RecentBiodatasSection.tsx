"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { Lang } from "@/lib/dictionary";

interface BiodataItem {
  _id: string;
  biodataCode: string;
  biodataType: "groom" | "bride";
  fullName: string;
  maritalStatus: string;
  birthYear: number;
  skinTone: string;
  height: string;
  weight: string;
  education: string;
  profession: string;
  district: string;
  thana: string;
  photoUrl?: string;
}

interface RecentBiodatasSectionProps {
  lang: Lang;
}

export default function RecentBiodatasSection({
  lang,
}: RecentBiodatasSectionProps) {
  const [biodatas, setBiodatas] = useState<BiodataItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/biodatas?limit=6", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setBiodatas(Array.isArray(data?.biodatas) ? data.biodatas : []);
        setLoading(false);
      })
      .catch(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#b45309] bg-amber-50 border border-amber-200 px-3 py-1 rounded-full mb-2">
            {lang === "bn" ? "সর্বশেষ যুক্ত হওয়া প্রোফাইল" : "Latest Profiles"}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b5d2b]">
            {lang === "bn" ? "সাম্প্রতিক বায়োডাটা সমূহ" : "Recent Biodatas"}
          </h2>
        </div>

        <Link
          href="/biodatas"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0b5d2b] hover:text-[#084721] underline underline-offset-4"
        >
          <span>{lang === "bn" ? "সব বায়োডাটা দেখুন" : "View All Biodatas"}</span>
          <span>→</span>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-72 rounded-2xl bg-white border border-stone-200 p-5 animate-pulse space-y-4"
            >
              <div className="w-20 h-20 rounded-full bg-stone-200 mx-auto" />
              <div className="h-4 bg-stone-200 rounded w-2/3 mx-auto" />
              <div className="h-3 bg-stone-200 rounded w-full" />
              <div className="h-3 bg-stone-200 rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : biodatas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-emerald-100 p-8 text-center space-y-3">
          <p className="text-sm sm:text-base font-semibold text-stone-700">
            {lang === "bn"
              ? "এখনো কোনো বায়োডাটা প্রকাশিত হয়নি।"
              : "No biodatas published yet."}
          </p>
          <Link
            href="/create-biodata"
            className="inline-block bg-[#0b5d2b] hover:bg-[#084721] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition"
          >
            {lang === "bn" ? "প্রথম বায়োডাটা তৈরি করুন" : "Create First Biodata"}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {biodatas.map((item) => {
            const age =
              item.birthYear && item.birthYear > 1950
                ? currentYear - item.birthYear
                : null;

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-emerald-100 hover:border-[#0b5d2b]/40 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between gap-4"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-[#0b5d2b] bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                      {item.biodataCode}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        item.biodataType === "groom"
                          ? "bg-sky-50 text-sky-800 border border-sky-200"
                          : "bg-rose-50 text-rose-800 border border-rose-200"
                      }`}
                    >
                      {item.biodataType === "groom"
                        ? lang === "bn"
                          ? "পাত্রের বায়োডাটা"
                          : "Groom"
                        : lang === "bn"
                          ? "পাত্রীর বায়োডাটা"
                          : "Bride"}
                    </span>
                  </div>

                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-16 rounded-full border-2 border-emerald-200 bg-emerald-50 overflow-hidden flex items-center justify-center shrink-0">
                      {item.photoUrl ? (
                        <img
                          src={item.photoUrl}
                          alt={item.fullName}
                          className="w-full h-full object-cover object-top"
                        />
                      ) : (
                        <span className="text-xl font-extrabold text-[#0b5d2b]">
                          {item.biodataType === "groom" ? "♂" : "♀"}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-base font-extrabold text-stone-900 truncate">
                        {item.fullName}
                      </h3>
                      <p className="text-xs text-stone-600 font-medium">
                        {age ? `${age} ${lang === "bn" ? "বছর" : "yrs"}` : ""}
                        {item.birthYear ? ` (${item.birthYear})` : ""}
                      </p>
                      <p className="text-xs font-semibold text-[#0b5d2b] truncate">
                        {item.district}
                        {item.thana ? `, ${item.thana}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-stone-100 pt-3 space-y-1.5 text-xs text-stone-700">
                    <div className="flex justify-between gap-2">
                      <span className="text-stone-500">
                        {lang === "bn" ? "পড়ালেখা:" : "Education:"}
                      </span>
                      <span className="font-semibold text-right truncate max-w-[65%]">
                        {item.education}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-stone-500">
                        {lang === "bn" ? "পেশা:" : "Profession:"}
                      </span>
                      <span className="font-semibold text-right truncate max-w-[65%]">
                        {item.profession}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-stone-500">
                        {lang === "bn" ? "উচ্চতা:" : "Height:"}
                      </span>
                      <span className="font-semibold">{item.height}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/biodatas/${item._id}`}
                  className="w-full h-10 rounded-xl bg-[#0b5d2b] hover:bg-[#084721] text-white text-xs sm:text-sm font-bold flex items-center justify-center transition"
                >
                  {lang === "bn" ? "বিস্তারিত বায়োডাটা দেখুন" : "View Full Biodata"}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}