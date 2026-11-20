"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import HalalBondhonHeader from "@/components/HalalBondhonHeader";
import HalalBondhonFooter from "@/components/HalalBondhonFooter";
import type { Lang } from "@/lib/dictionary";

interface BiodataListItem {
  _id: string;
  biodataCode: string;
  biodataType: "groom" | "bride";
  fullName: string;
  birthYear: number;
  education: string;
  profession: string;
  district: string;
  thana: string;
  height: string;
  photoUrl?: string;
}

function BiodatasListContent() {
  const searchParams = useSearchParams();
  const initialGender = searchParams.get("gender") || "all";

  const [lang, setLang] = useState<Lang>("bn");
  const [genderFilter, setGenderFilter] = useState<string>(initialGender);
  const [biodatas, setBiodatas] = useState<BiodataListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setGenderFilter(initialGender);
  }, [initialGender]);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const query =
      genderFilter === "groom" || genderFilter === "bride"
        ? `?gender=${encodeURIComponent(genderFilter)}`
        : "";

    fetch(`/api/biodatas${query}`, { cache: "no-store" })
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
  }, [genderFilter]);

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#f6f9f6] text-stone-900 flex flex-col">
      <HalalBondhonHeader
        lang={lang}
        onToggleLang={() => setLang((p) => (p === "bn" ? "en" : "bn"))}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b5d2b]">
              {lang === "bn" ? "সকল বায়োডাটা সমূহ" : "All Biodatas"}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              {lang === "bn"
                ? "যেকোনো বায়োডাটার ওপর ক্লিক করে বিস্তারিত তথ্য দেখুন"
                : "Click any biodata card to view full details"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {(["all", "groom", "bride"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setGenderFilter(type)}
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition cursor-pointer ${
                  genderFilter === type
                    ? "bg-[#0b5d2b] text-white"
                    : "bg-white text-stone-700 border border-stone-300 hover:bg-emerald-50"
                }`}
              >
                {type === "all"
                  ? lang === "bn"
                    ? "সব"
                    : "All"
                  : type === "groom"
                    ? lang === "bn"
                      ? "পাত্র"
                      : "Groom"
                    : lang === "bn"
                      ? "পাত্রী"
                      : "Bride"}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-emerald-100 p-8 text-center text-sm font-semibold text-[#0b5d2b]">
            {lang === "bn" ? "বায়োডাটা লোড হচ্ছে..." : "Loading biodatas..."}
          </div>
        ) : biodatas.length === 0 ? (
          <div className="bg-white rounded-2xl border border-emerald-100 p-8 text-center space-y-3">
            <p className="text-sm text-stone-700 font-semibold">
              {lang === "bn"
                ? "কোনো বায়োডাটা পাওয়া যায়নি।"
                : "No biodatas found."}
            </p>
            <Link
              href="/create-biodata"
              className="inline-block bg-[#0b5d2b] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl"
            >
              {lang === "bn" ? "বায়োডাটা তৈরি করুন" : "Create Biodata"}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {biodatas.map((item) => {
              const age =
                item.birthYear && item.birthYear > 1950
                  ? Math.max(18, currentYear - item.birthYear)
                  : null;

              return (
                <Link
                  key={item._id}
                  href={`/biodatas/${item._id}`}
                  className="bg-white rounded-xl border border-stone-200 hover:border-[#0b5d2b] shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className="aspect-[4/3] w-full overflow-hidden bg-stone-100 relative">
                      <img
                        src={
                          item.photoUrl && item.photoUrl.trim() !== ""
                            ? item.photoUrl
                            : item.biodataType === "bride"
                              ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80"
                              : "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80"
                        }
                        alt={item.fullName}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-[#0b5d2b] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-md">
                        {item.biodataCode}
                      </span>
                    </div>

                    <div className="p-4 text-center space-y-1">
                      <h2 className="font-bold text-stone-900 text-base group-hover:text-[#0b5d2b] transition">
                        {item.fullName}
                      </h2>
                      <p className="text-xs text-stone-600">
                        {age ? `${age} ${lang === "bn" ? "বছর" : "yrs"}` : ""} |{" "}
                        {item.district}
                      </p>
                      <p className="text-xs font-medium text-stone-700">
                        {item.profession}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      <HalalBondhonFooter lang={lang} />
    </div>
  );
}

export default function BiodatasPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f6f9f6] flex items-center justify-center text-[#0b5d2b] font-semibold">
          লোড হচ্ছে...
        </div>
      }
    >
      <BiodatasListContent />
    </Suspense>
  );
}