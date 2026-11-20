"use client";

import React, { useState } from "react";
import Link from "next/link";
import { dictionary, type Lang } from "../lib/dictionary";

interface HalalBondhonFooterProps {
  lang: Lang;
}

export default function HalalBondhonFooter({ lang }: HalalBondhonFooterProps) {
  const t = dictionary[lang];
  const f = t.footer;

  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      setIsError(true);
      setStatusMessage(f.invalidEmailMsg);
      return;
    }
    setIsError(false);
    setStatusMessage(f.subscribedMsg);
    setEmail("");
  };

  return (
    <footer className="bg-gradient-to-b from-[#084d22] via-[#063e1b] to-[#042d13] text-white border-t border-[#166534]/50">
      {/* Main Footer Columns */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
          {/* Column 1: Brand & Slogan */}
          <div className="lg:col-span-4 space-y-2.5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              {/* Golden Heart Emblem */}
              <div className="w-14 h-12 flex items-center justify-center shrink-0">
                <svg
                  viewBox="0 0 64 56"
                  className="w-full h-full text-[#e5be54]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                >
                  <path
                    d="M32 50C32 50 8 34.5 8 18.5C8 11.5 13.5 6 20.5 6C25.2 6 29.4 8.5 32 12.3C34.6 8.5 38.8 6 43.5 6C50.5 6 56 11.5 56 18.5C56 34.5 32 50 32 50Z"
                    fill="rgba(229, 190, 84, 0.08)"
                  />
                  <path
                    d="M32 39C32 39 20 31.2 20 23.2C20 19.7 22.8 17 26.2 17C28.6 17 30.7 18.3 32 20.2C33.3 18.3 35.4 17 37.8 17C41.2 17 44 19.7 44 23.2C44 31.2 32 39 32 39Z"
                  />
                  <path d="M22 6L20 2M42 6L44 2" strokeLinecap="round" />
                </svg>
              </div>

              <div>
                <div className="text-3xl font-extrabold tracking-tight text-white leading-none">
                  {t.brand}
                </div>
                <div className="text-sm font-semibold text-[#e5be54] mt-1">
                  {t.brandSub}
                </div>
              </div>
            </Link>

            <p className="text-sm text-emerald-100/95 font-medium pt-0.5">
              {t.heroSlogan}
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2 lg:border-l lg:border-[#e5be54]/40 lg:pl-6 space-y-3">
            <h3 className="text-base font-bold text-white">{f.quickLinksTitle}</h3>
            <ul className="space-y-2 text-sm text-emerald-100/90">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#e5be54] transition inline-block"
                >
                  {f.home}
                </Link>
              </li>
              <li>
                <Link
                  href="/biodatas"
                  className="hover:text-[#e5be54] transition inline-block"
                >
                  {f.findMembers}
                </Link>
              </li>
              <li>
                <Link
                  href="/success-stories"
                  className="hover:text-[#e5be54] transition inline-block"
                >
                  {f.successStories}
                </Link>
              </li>
              <li>
                <Link
                  href="/premium"
                  className="hover:text-[#e5be54] transition inline-block"
                >
                  {f.premiumMembership}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="lg:col-span-2 lg:border-l lg:border-[#e5be54]/40 lg:pl-6 space-y-3">
            <h3 className="text-base font-bold text-white">{f.helpTitle}</h3>
            <ul className="space-y-2 text-sm text-emerald-100/90">
              <li>
                <Link
                  href="/faq"
                  className="hover:text-[#e5be54] transition inline-block"
                >
                  {f.faq}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#e5be54] transition inline-block"
                >
                  {f.contact}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-[#e5be54] transition inline-block"
                >
                  {f.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-[#e5be54] transition inline-block"
                >
                  {f.terms}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Social & Newsletter */}
          <div className="lg:col-span-4 lg:border-l lg:border-[#e5be54]/40 lg:pl-6 space-y-4">
            <div className="space-y-2.5">
              <h3 className="text-base font-bold text-white">{f.stayWithUs}</h3>
              <div className="flex items-center gap-2.5">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-full bg-[#1877f2] text-white flex items-center justify-center font-bold text-sm hover:scale-105 transition"
                >
                  f
                </a>
                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full bg-[#ff0000] text-white flex items-center justify-center text-xs hover:scale-105 transition"
                >
                  ▶
                </a>
                {/* Telegram */}
                <a
                  href="https://telegram.org"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Telegram"
                  className="w-8 h-8 rounded-full bg-[#26a5e4] text-white flex items-center justify-center text-xs font-bold hover:scale-105 transition"
                >
                  ✈
                </a>
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white flex items-center justify-center text-xs font-bold hover:scale-105 transition"
                >
                  ◎
                </a>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <label
                htmlFor="footer-email"
                className="block text-sm font-semibold text-white"
              >
                {f.getUpdates}
              </label>

              <div className="flex items-center gap-2.5">
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={f.emailPlaceholder}
                  className="h-10 flex-1 min-w-0 rounded-md bg-white text-stone-900 placeholder:text-stone-400 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e5be54]"
                />
                <button
                  type="submit"
                  className="h-10 shrink-0 rounded-md bg-[#127337] hover:bg-[#168842] text-white font-semibold text-sm px-4 border border-[#34a85a]/50 transition cursor-pointer"
                >
                  {f.subscribe}
                </button>
              </div>

              {statusMessage && (
                <p
                  className={`text-xs ${
                    isError ? "text-amber-300" : "text-emerald-200"
                  }`}
                >
                  {statusMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-[#e5be54]/45 bg-[#032410]">
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs sm:text-sm text-emerald-100/95 text-center md:text-left">
          <span>{f.copyright}</span>
          <span className="font-medium text-white">{f.footerCenter}</span>
          <span>{f.designedBy}</span>
        </div>
      </div>
    </footer>
  );
}