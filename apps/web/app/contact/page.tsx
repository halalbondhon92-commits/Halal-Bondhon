"use client";

import React, { useState } from "react";
import HalalBondhonHeader from "@/components/HalalBondhonHeader";
import HalalBondhonFooter from "@/components/HalalBondhonFooter";
import type { Lang } from "@/lib/dictionary";

export default function ContactPage() {
  const [lang, setLang] = useState<Lang>("bn");
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !emailOrPhone.trim() || !message.trim()) return;

    setSubmitted(
      lang === "bn"
        ? "জাযাকাল্লাহ খায়ের! আপনার বার্তাটি গ্রহণ করা হয়েছে। আমাদের সাপোর্ট টিম শীঘ্রই যোগাযোগ করবে।"
        : "Thank you! Your message has been received. Our support team will get back to you soon."
    );
    setName("");
    setEmailOrPhone("");
    setSubject("");
    setMessage("");
  };

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
              {lang === "bn" ? "যোগাযোগ ও সহায়তা" : "Contact & Support"}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold">
              {lang === "bn" ? "আমাদের সাথে যোগাযোগ করুন" : "Get in Touch With Us"}
            </h1>
            <p className="text-xs sm:text-base text-emerald-100 max-w-2xl mx-auto">
              {lang === "bn"
                ? "বায়োডাটা তৈরি, অ্যাকাউন্ট বা মেম্বারশিপ সংক্রান্ত যেকোনো প্রশ্ন বা সহায়তায় মেসেজ পাঠান।"
                : "Send us a message for help with biodatas, your account, or membership plans."}
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-xs space-y-1">
              <p className="text-xs font-bold text-[#0b5d2b]">
                {lang === "bn" ? "ইমেইল ঠিকানা" : "Email Address"}
              </p>
              <p className="text-sm sm:text-base font-extrabold text-stone-900">
                support@halalbondhon.com
              </p>
              <p className="text-xs text-stone-600">
                {lang === "bn"
                  ? "সাধারণ জিজ্ঞাসা ও সাপোর্টের জন্য ইমেইল করুন"
                  : "Email us for inquiries and support"}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-xs space-y-1">
              <p className="text-xs font-bold text-[#0b5d2b]">
                {lang === "bn" ? "হেল্পলাইন / মোবাইল" : "Phone / Helpline"}
              </p>
              <p className="text-sm sm:text-base font-extrabold text-stone-900">
                +880 1477-014011
              </p>
              <p className="text-xs text-stone-600">
                {lang === "bn"
                  ? "প্রতিদিন সকাল ১০টা – রাত ১০টা"
                  : "Daily 10:00 AM – 10:00 PM"}
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-emerald-100 p-6 shadow-xs space-y-1">
              <p className="text-xs font-bold text-[#0b5d2b]">
                {lang === "bn" ? "কার্যক্রম অঞ্চল" : "Service Coverage"}
              </p>
              <p className="text-sm sm:text-base font-extrabold text-stone-900">
                {lang === "bn" ? "সারা বাংলাদেশ" : "All Over Bangladesh"}
              </p>
              <p className="text-xs text-stone-600">
                {lang === "bn"
                  ? "খুলনা, ঢাকা, চট্টগ্রাম, রাজশাহীসহ সকল জেলা"
                  : "Khulna, Dhaka, Chattogram, Rajshahi & all districts"}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-emerald-100 p-6 sm:p-8 shadow-xs space-y-5">
            <div>
              <h2 className="text-xl font-extrabold text-[#0b5d2b]">
                {lang === "bn" ? "বার্তা পাঠান" : "Send a Message"}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                {lang === "bn"
                  ? "নিচের ফর্মটি পূরণ করে আপনার প্রশ্ন বা মতামত জানান"
                  : "Fill out the form below to share your question or feedback"}
              </p>
            </div>

            {submitted && (
              <div className="bg-emerald-50 border border-emerald-300 text-[#0b5d2b] font-semibold text-xs sm:text-sm px-4 py-3 rounded-lg">
                {submitted}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {lang === "bn" ? "আপনার নাম *" : "Your Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={
                      lang === "bn" ? "আপনার নাম লিখুন" : "Enter your name"
                    }
                    className="w-full h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm text-black placeholder:text-stone-500 focus:outline-none focus:border-[#0b5d2b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {lang === "bn"
                      ? "ইমেইল বা মোবাইল নম্বর *"
                      : "Email or Phone *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="example@gmail.com / 01XXXXXXXXX"
                    className="w-full h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm text-black placeholder:text-stone-500 focus:outline-none focus:border-[#0b5d2b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {lang === "bn" ? "বিষয়" : "Subject"}
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={
                    lang === "bn"
                      ? "যেমন: বায়োডাটা সংশোধন / মেম্বারশিপ"
                      : "e.g. Biodata update / Membership"
                  }
                  className="w-full h-10 rounded-lg border border-stone-300 bg-white px-3 text-sm text-black placeholder:text-stone-500 focus:outline-none focus:border-[#0b5d2b]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {lang === "bn" ? "বার্তা *" : "Message *"}
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    lang === "bn"
                      ? "বিস্তারিত লিখুন..."
                      : "Write your message here..."
                  }
                  className="w-full rounded-lg border border-stone-300 bg-white p-3 text-sm text-black placeholder:text-stone-500 focus:outline-none focus:border-[#0b5d2b]"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 h-11 rounded-xl bg-[#0b5d2b] hover:bg-[#084721] text-white font-bold text-sm transition cursor-pointer"
              >
                {lang === "bn" ? "বার্তা পাঠান" : "Send Message"}
              </button>
            </form>
          </div>
        </section>
      </main>

      <HalalBondhonFooter lang={lang} />
    </div>
  );
}