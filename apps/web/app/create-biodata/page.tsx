"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import HalalBondhonHeader from "@/components/HalalBondhonHeader";
import HalalBondhonFooter from "@/components/HalalBondhonFooter";
import type { Lang } from "@/lib/dictionary";

const districts = [
  "ঢাকা",
  "খুলনা",
  "চট্টগ্রাম",
  "রাজশাহী",
  "সিলেট",
  "বরিশাল",
  "রংপুর",
  "ময়মনসিংহ",
  "যশোর",
  "সাতক্ষীরা",
  "বাগেরহাট",
  "কুমিল্লা",
  "গাজীপুর",
  "নারায়ণগঞ্জ",
  "বগুড়া",
  "নোয়াখালী",
];

const inputClass =
  "w-full h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm !text-black placeholder:text-stone-500 focus:outline-none focus:border-[#0b5d2b]";

const selectClass =
  "w-full h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm !text-black focus:outline-none focus:border-[#0b5d2b]";

const textareaClass =
  "w-full rounded-lg border border-stone-300 bg-white p-3 text-sm !text-black placeholder:text-stone-500 focus:outline-none focus:border-[#0b5d2b]";

const optionClass = "bg-white text-black";

function CreateBiodataContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isWelcome = searchParams.get("welcome") === "1";

  const [lang, setLang] = useState<Lang>("bn");
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({
    biodataType: "groom",
    fullName: "",
    maritalStatus: "unmarried",
    birthYear: "1998",
    skinTone: "উজ্জ্বল শ্যামলা",
    height: "",
    weight: "",
    education: "",
    profession: "",
    district: "খুলনা",
    thana: "",
    village: "",
    fatherProfession: "",
    brothersCount: "1",
    sistersCount: "1",
    financialDetails: "",
    photoUrl: "",
  });

  // Load user session defaults & existing biodata
  useEffect(() => {
    async function initData() {
      try {
        const meRes = await fetch("/api/auth/me", { cache: "no-store" });
        const meData = await meRes.json();

        if (!meData?.user) {
          router.push("/login");
          return;
        }

        setForm((prev) => ({
          ...prev,
          fullName: prev.fullName || meData.user.fullName || "",
          biodataType: meData.user.gender || prev.biodataType,
        }));

        const bioRes = await fetch("/api/biodata");
        if (bioRes.ok) {
          const bioData = await bioRes.json();
          if (bioData?.biodata) {
            const b = bioData.biodata;
            setForm({
              biodataType: b.biodataType || meData.user.gender || "groom",
              fullName: b.fullName || meData.user.fullName || "",
              maritalStatus: b.maritalStatus || "unmarried",
              birthYear: String(b.birthYear || "1998"),
              skinTone: b.skinTone || "উজ্জ্বল শ্যামলা",
              height: b.height || "",
              weight: b.weight || "",
              education: b.education || "",
              profession: b.profession || "",
              district: b.district || "খুলনা",
              thana: b.thana || "",
              village: b.village || "",
              fatherProfession: b.fatherProfession || "",
              brothersCount: String(b.brothersCount ?? 0),
              sistersCount: String(b.sistersCount ?? 0),
              financialDetails: b.financialDetails || "",
              photoUrl: b.photoUrl || "",
            });
          }
        }
      } catch {
        // ignore network error
      }
    }

    initData();
  }, [router]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("photo", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "ছবি আপলোড ব্যর্থ হয়েছে।");
        return;
      }

      setForm((prev) => ({ ...prev, photoUrl: data.url }));
    } catch {
      setError("ছবি আপলোড করার সময় সমস্যা হয়েছে।");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/biodata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "বায়োডাটা সেভ করা যায়নি।");
        return;
      }

      setSuccess(
        lang === "bn"
          ? `আলহামদুলিল্লাহ! বায়োডাটা সফলভাবে সংরক্ষিত হয়েছে (কোড: ${data.biodata.biodataCode})।`
          : `Biodata saved successfully (Code: ${data.biodata.biodataCode}).`
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("নেটওয়ার্ক সমস্যা হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f9f6] flex flex-col !text-black">
      <HalalBondhonHeader
        lang={lang}
        onToggleLang={() => setLang((p) => (p === "bn" ? "en" : "bn"))}
      />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-10 space-y-5">
        {/* Welcome & Skip Banner after Registration */}
        {isWelcome && (
          <div className="bg-gradient-to-r from-[#0b5d2b] to-[#137a3b] text-white rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-block bg-[#f5d061] text-black text-xs font-extrabold px-2.5 py-0.5 rounded-full">
                {lang === "bn" ? "রেজিস্ট্রেশন সম্পন্ন!" : "Registration Complete!"}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {lang === "bn"
                  ? "হালালবন্ধনে স্বাগতম! এখন আপনার বায়োডাটা তৈরি করুন"
                  : "Welcome to HalalBondhon! Create your biodata now"}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100">
                {lang === "bn"
                  ? "আপনি চাইলে এখনই বায়োডাটা পূরণ করতে পারেন অথবা স্কিপ করে পরেও তৈরি করতে পারবেন।"
                  : "Fill out your biodata now, or skip and complete it anytime later."}
              </p>
            </div>

            <Link
              href="/"
              className="shrink-0 bg-white hover:bg-stone-100 !text-black font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition inline-flex items-center gap-1.5"
            >
              <span>{lang === "bn" ? "এখন স্কিপ করুন" : "Skip for now"}</span>
              <span>→</span>
            </Link>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0b5d2b]">
                {lang === "bn" ? "বায়োডাটা তৈরি / আপডেট করুন" : "Create / Edit Biodata"}
              </h1>
              <p className="text-xs sm:text-sm !text-black mt-1">
                {lang === "bn"
                  ? "সঠিক ও সত্য তথ্য দিয়ে আপনার হালালবন্ধন বায়োডাটাটি পূরণ করুন"
                  : "Fill out your HalalBondhon biodata with accurate information"}
              </p>
            </div>

            <Link
              href="/"
              className="self-start sm:self-center text-xs sm:text-sm font-semibold !text-black hover:text-[#0b5d2b] bg-stone-100 hover:bg-emerald-50 border border-stone-300 px-4 py-2 rounded-lg transition"
            >
              {lang === "bn" ? "স্কিপ করে হোমে যান →" : "Skip to Home →"}
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-emerald-50 border border-emerald-300 text-[#0b5d2b] font-semibold text-sm px-4 py-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span>{success}</span>
              <Link
                href="/"
                className="inline-block bg-[#0b5d2b] text-white text-xs font-bold px-4 py-2 rounded-lg"
              >
                {lang === "bn" ? "হোমপেজে যান →" : "Go to Home →"}
              </Link>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Photo Upload Box */}
            <div className="bg-[#f9fbf9] border border-dashed border-[#0b5d2b]/40 rounded-xl p-5 flex flex-col sm:flex-row items-center gap-5">
              <div className="w-28 h-28 rounded-xl border-2 border-emerald-200 bg-white overflow-hidden flex items-center justify-center shrink-0">
                {form.photoUrl ? (
                  <img
                    src={form.photoUrl}
                    alt="Biodata Preview"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <span className="text-xs !text-black text-center px-2">
                    {lang === "bn" ? "ছবির প্রিভিউ" : "Photo Preview"}
                  </span>
                )}
              </div>

              <div className="space-y-2 text-center sm:text-left">
                <label className="block text-sm font-bold text-[#0b5d2b]">
                  {lang === "bn" ? "বায়োডাটার ছবি আপলোড করুন" : "Upload Biodata Photo"}
                </label>
                <p className="text-xs !text-black">
                  {lang === "bn"
                    ? "শোভন ও স্পষ্ট ছবি দিন (JPG, PNG বা WebP — সর্বোচ্চ ৩ মেগাবাইট)"
                    : "Upload a clear, modest photo (JPG, PNG, WebP — max 3MB)"}
                </p>
                <div className="pt-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    disabled={uploadingPhoto}
                    className="text-xs !text-black file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#0b5d2b] file:text-white hover:file:bg-[#084721] cursor-pointer"
                  />
                </div>
                {uploadingPhoto && (
                  <p className="text-xs font-semibold text-[#0b5d2b]">
                    {lang === "bn" ? "ছবি আপলোড হচ্ছে..." : "Uploading photo..."}
                  </p>
                )}
              </div>
            </div>

            {/* Section 1: Basic Info */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#0b5d2b] border-l-4 border-[#0b5d2b] pl-2.5">
                {lang === "bn" ? "১. সাধারণ ও ব্যক্তিগত তথ্য" : "1. Basic & Personal Info"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold !text-black mb-1">
                    {lang === "bn" ? "বায়োডাটার ধরন *" : "Biodata Type *"}
                  </label>
                  <select
                    value={form.biodataType}
                    onChange={(e) =>
                      setForm({ ...form, biodataType: e.target.value })
                    }
                    className={selectClass}
                  >
                    <option value="groom" className={optionClass}>
                      {lang === "bn" ? "পাত্রের বায়োডাটা" : "Groom's Biodata"}
                    </option>
                    <option value="bride" className={optionClass}>
                      {lang === "bn" ? "পাত্রীর বায়োডাটা" : "Bride's Biodata"}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold !text-black mb-1">
                    {lang === "bn" ? "পূর্ণ নাম *" : "Full Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={(e) =>
                      setForm({ ...form, fullName: e.target.value })
                    }
                    placeholder={lang === "bn" ? "যেমন: মোঃ রিফাত হাসান" : "Full Name"}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold !text-black mb-1">
                    {lang === "bn" ? "বৈবাহিক অবস্থা *" : "Marital Status *"}
                  </label>
                  <select
                    value={form.maritalStatus}
                    onChange={(e) =>
                      setForm({ ...form, maritalStatus: e.target.value })
                    }
                    className={selectClass}
                  >
                    <option value="unmarried" className={optionClass}>
                      {lang === "bn" ? "অবিবাহিত" : "Unmarried"}
                    </option>
                    <option value="divorced" className={optionClass}>
                      {lang === "bn" ? "তালাকপ্রাপ্ত" : "Divorced"}
                    </option>
                    <option value="widowed" className={optionClass}>
                      {lang === "bn" ? "বিধবা / বিপত্নীক" : "Widowed"}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold !text-black mb-1">
                    {lang === "bn" ? "জন্ম সাল *" : "Birth Year *"}
                  </label>
                  <input
                    type="number"
                    required
                    min={1960}
                    max={2010}
                    value={form.birthYear}
                    onChange={(e) =>
                      setForm({ ...form, birthYear: e.target.value })
                    }
                    placeholder="1998"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold !text-black mb-1">
                    {lang === "bn" ? "গায়ের রং *" : "Skin Tone *"}
                  </label>
                  <select
                    value={form.skinTone}
                    onChange={(e) =>
                      setForm({ ...form, skinTone: e.target.value })
                    }
                    className={selectClass}
                  >
                    <option value="উজ্জ্বল ফর্সা" className={optionClass}>
                      উজ্জ্বল ফর্সা
                    </option>
                    <option value="ফর্সা" className={optionClass}>
                      ফর্সা
                    </option>
                    <option value="উজ্জ্বল শ্যামলা" className={optionClass}>
                      উজ্জ্বল শ্যামলা
                    </option>
                    <option value="শ্যামলা" className={optionClass}>
                      শ্যামলা
                    </option>
                    <option value="কালো" className={optionClass}>
                      কালো
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold !text-black mb-1">
                    {lang === "bn" ? "উচ্চতা *" : "Height *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.height}
                    onChange={(e) =>
                      setForm({ ...form, height: e.target.value })
                    }
                    placeholder={lang === "bn" ? "যেমন: ৫ ফুট ৭ ইঞ্চি" : "e.g. 5'7\""}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold !text-black mb-1">
                    {lang === "bn" ? "ওজন *" : "Weight *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.weight}
                    onChange={(e) =>
                      setForm({ ...form, weight: e.target.value })
                    }
                    placeholder={lang === "bn" ? "যেমন: ৬৫ কেজি" : "e.g. 65 kg"}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Education & Profession */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#0b5d2b] border-l-4 border-[#0b5d2b] pl-2.5">
                {lang === "bn" ? "২. শিক্ষাগত যোগ্যতা ও পেশা" : "2. Education & Profession"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold !text-black mb-1">
                    {lang === "bn" ? "পড়ালেখা *" : "Education *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.education}
                    onChange={(e) =>
                      setForm({ ...form, education: e.target.value })
                    }
                    placeholder={
                      lang === "bn"
                        ? "যেমন: ডিপ্লোমা ইন ইঞ্জিনিয়ারিং / অনার্স"
                        : "Education qualification"
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold !text-black mb-1">
                    {lang === "bn" ? "পেশা *" : "Profession *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.profession}
                    onChange={(e) =>
                      setForm({ ...form, profession: e.target.value })
                    }
                    placeholder={
                      lang === "bn"
                        ? "যেমন: ওয়েব ডেভেলপার / শিক্ষক"
                        : "Your profession"
                    }
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Address */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#0b5d2b] border-l-4 border-[#0b5d2b] pl-2.5">
                {lang === "bn" ? "৩. স্থায়ী ঠিকানা" : "3. Permanent Address"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold !text-black mb-1">
                    {lang === "bn" ? "জেলা *" : "District *"}
                  </label>
                  <select
                    value={form.district}
                    onChange={(e) =>
                      setForm({ ...form, district: e.target.value })
                    }
                    className={selectClass}
                  >
                    {districts.map((d) => (
                      <option key={d} value={d} className={optionClass}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold !text-black mb-1">
                    {lang === "bn" ? "থানা / উপজেলা *" : "Thana / Upazila *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.thana}
                    onChange={(e) =>
                      setForm({ ...form, thana: e.target.value })
                    }
                    placeholder={lang === "bn" ? "থানা বা উপজেলার নাম" : "Thana / Upazila"}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold !text-black mb-1">
                    {lang === "bn" ? "গ্রাম / এলাকা *" : "Village / Area *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.village}
                    onChange={(e) =>
                      setForm({ ...form, village: e.target.value })
                    }
                    placeholder={lang === "bn" ? "গ্রামের নাম লিখুন" : "Village / Area"}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Family & Financial Info */}
            <div className="space-y-4">
              <h2 className="text-base font-bold text-[#0b5d2b] border-l-4 border-[#0b5d2b] pl-2.5">
                {lang === "bn"
                  ? "৪. পারিবারিক ও আর্থিক তথ্য"
                  : "4. Family & Financial Information"}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold !text-black mb-1">
                    {lang === "bn" ? "বাবার পেশা *" : "Father's Profession *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={form.fatherProfession}
                    onChange={(e) =>
                      setForm({ ...form, fatherProfession: e.target.value })
                    }
                    placeholder={
                      lang === "bn" ? "যেমন: ব্যবসায়ী / চাকরিজীবী" : "Father's profession"
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold !text-black mb-1">
                    {lang === "bn" ? "ভাই কয়জন *" : "Number of Brothers *"}
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={15}
                    value={form.brothersCount}
                    onChange={(e) =>
                      setForm({ ...form, brothersCount: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold !text-black mb-1">
                    {lang === "bn" ? "বোন কয়জন *" : "Number of Sisters *"}
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    max={15}
                    value={form.sistersCount}
                    onChange={(e) =>
                      setForm({ ...form, sistersCount: e.target.value })
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold !text-black mb-1">
                  {lang === "bn"
                    ? "আর্থিক অবস্থা বিস্তারিত *"
                    : "Financial Status Details *"}
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.financialDetails}
                  onChange={(e) =>
                    setForm({ ...form, financialDetails: e.target.value })
                  }
                  placeholder={
                    lang === "bn"
                      ? "পারিবারিক আর্থিক অবস্থা, নিজস্ব বাড়ি/জমি ও মাসিক আয়ের সংক্ষিপ্ত বিবরণ লিখুন..."
                      : "Describe family financial status, housing, and income details..."
                  }
                  className={textareaClass}
                />
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={loading || uploadingPhoto}
                className="w-full sm:w-auto px-8 h-12 rounded-xl bg-[#0b5d2b] hover:bg-[#084721] text-white font-bold text-sm sm:text-base shadow-sm transition disabled:opacity-60 cursor-pointer"
              >
                {loading
                  ? lang === "bn"
                    ? "সংরক্ষণ হচ্ছে..."
                    : "Saving..."
                  : lang === "bn"
                    ? "বায়োডাটা জমা দিন"
                    : "Submit Biodata"}
              </button>

              <Link
                href="/"
                className="w-full sm:w-auto px-6 h-12 rounded-xl border border-stone-300 bg-stone-100 hover:bg-stone-200 !text-black font-semibold text-sm inline-flex items-center justify-center transition"
              >
                {lang === "bn" ? "এখন স্কিপ করুন (পরে পূরণ করব)" : "Skip for now"}
              </Link>
            </div>
          </form>
        </div>
      </main>

      <HalalBondhonFooter lang={lang} />
    </div>
  );
}

export default function CreateBiodataPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f6f9f6] flex items-center justify-center text-[#0b5d2b] font-semibold">
          লোড হচ্ছে...
        </div>
      }
    >
      <CreateBiodataContent />
    </Suspense>
  );
}