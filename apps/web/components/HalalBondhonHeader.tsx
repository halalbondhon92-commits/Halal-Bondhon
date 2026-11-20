"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { dictionary, type Lang } from "../lib/dictionary";

interface HalalBondhonHeaderProps {
  lang: Lang;
  onToggleLang: () => void;
}

interface SessionUser {
  userId: string;
  email: string;
  fullName: string;
  role: string;
}

export default function HalalBondhonHeader({
  lang,
  onToggleLang,
}: HalalBondhonHeaderProps) {
  const router = useRouter();
  const t = dictionary[lang];
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setUser(data.user || null);
          setCheckingAuth(false);
        }
      })
      .catch(() => {
        if (isMounted) setCheckingAuth(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setOpenUserMenu(false);
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="w-full sticky top-0 z-30 shadow-sm">
      {/* Top Green Bar */}
      <div className="bg-[#0b5d2b] text-white text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-2">
          {/* Left: Trust & Tagline */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <svg
                className="w-4 h-4 text-[#f5d061] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              {t.trustBadge}
            </span>
            <span className="text-white/40 hidden sm:inline">|</span>
            <span className="text-white/95 hidden md:inline">{t.tagline}</span>
          </div>

          {/* Right: Help Phone, Auth/User Icon, Language Switch */}
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="tel:01477014011"
              className="hidden sm:inline-flex items-center gap-1.5 hover:text-[#f5d061] transition"
            >
              <span>{t.needHelp}</span>
              <span className="font-semibold text-[#f5d061]">{t.phone}</span>
            </a>

            <span className="text-white/30 hidden sm:inline">|</span>

            {!checkingAuth && user ? (
              /* Logged-in User Icon & Dropdown */
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setOpenUserMenu((prev) => !prev)}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-[#f5d061]/50 text-white px-3 py-1 rounded-full transition cursor-pointer"
                >
                  <span className="w-6 h-6 rounded-full bg-[#f5d061] text-[#0b5d2b] flex items-center justify-center shrink-0">
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.3"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <span className="font-semibold text-xs sm:text-sm max-w-[120px] truncate">
                    {user.fullName}
                  </span>
                  <svg
                    className="w-3.5 h-3.5 text-[#f5d061]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {openUserMenu && (
                  <div className="absolute right-0 mt-2 w-52 bg-white text-stone-800 border border-stone-200 rounded-lg shadow-lg py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-stone-100">
                      <p className="text-xs font-bold text-[#0b5d2b] truncate">
                        {user.fullName}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setOpenUserMenu(false)}
                      className="block px-4 py-2 text-xs sm:text-sm hover:bg-emerald-50 hover:text-[#0b5d2b]"
                    >
                      {lang === "bn" ? "আমার ড্যাশবোর্ড" : "My Dashboard"}
                    </Link>

                    <Link
                      href="/create-biodata"
                      onClick={() => setOpenUserMenu(false)}
                      className="block px-4 py-2 text-xs sm:text-sm hover:bg-emerald-50 hover:text-[#0b5d2b]"
                    >
                      {lang === "bn" ? "বায়োডাটা তৈরি / এডিট" : "Create / Edit Biodata"}
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs sm:text-sm text-red-600 font-semibold hover:bg-red-50 border-t border-stone-100 cursor-pointer"
                    >
                      {lang === "bn" ? "লগআউট" : "Logout"}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Login & Register Buttons */
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1 font-medium hover:text-[#f5d061] transition"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  {t.login}
                </Link>

                <Link
                  href="/register"
                  className="bg-[#f5d061] text-[#111827] font-bold px-3.5 py-1 rounded-full hover:bg-[#eab308] transition"
                >
                  {t.register}
                </Link>
              </>
            )}

            <button
              type="button"
              onClick={onToggleLang}
              className="border border-white/30 text-white px-2.5 py-0.5 rounded text-xs font-medium hover:bg-white/10 transition cursor-pointer"
            >
              {t.switchLang}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="bg-[#faf8f2] border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-11 h-11 rounded-full border-2 border-[#0b5d2b] flex items-center justify-center bg-white">
              <svg
                className="w-6 h-6 text-[#0b5d2b]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-xl sm:text-2xl font-extrabold text-[#0b5d2b] tracking-tight">
                {t.brand}
              </div>
              <div className="text-xs font-medium text-[#b45309]">
                {t.brandSub}
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3 text-sm font-semibold text-stone-800">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 bg-[#0b5d2b] text-white px-4 py-2 rounded-md hover:bg-[#084721] transition"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              {t.home}
            </Link>

            {/* Dropdown: সদস্য খুঁজুন */}
            <div
              className="relative"
              onMouseEnter={() => setOpenDropdown(true)}
              onMouseLeave={() => setOpenDropdown(false)}
            >
              <button
                type="button"
                onClick={() => setOpenDropdown((prev) => !prev)}
                className="inline-flex items-center gap-1 px-3 py-2 rounded-md hover:text-[#0b5d2b] hover:bg-stone-100 transition cursor-pointer"
              >
                {t.findMembers}
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {openDropdown && (
                <div className="absolute left-0 top-full w-48 bg-white border border-stone-200 rounded-md shadow-md py-1.5 z-40">
                  <Link
                    href="/biodatas"
                    className="block px-4 py-2 text-sm text-stone-700 hover:bg-[#0b5d2b]/10 hover:text-[#0b5d2b]"
                  >
                    {t.allBiodatas}
                  </Link>
                  <Link
                    href="/biodatas?gender=groom"
                    className="block px-4 py-2 text-sm text-stone-700 hover:bg-[#0b5d2b]/10 hover:text-[#0b5d2b]"
                  >
                    {t.groomBiodatas}
                  </Link>
                  <Link
                    href="/biodatas?gender=bride"
                    className="block px-4 py-2 text-sm text-stone-700 hover:bg-[#0b5d2b]/10 hover:text-[#0b5d2b]"
                  >
                    {t.brideBiodatas}
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/success-stories"
              className="px-3 py-2 rounded-md hover:text-[#0b5d2b] hover:bg-stone-100 transition"
            >
              {t.successStories}
            </Link>

            <Link
              href="/premium"
              className="px-3 py-2 rounded-md hover:text-[#0b5d2b] hover:bg-stone-100 transition"
            >
              {t.premiumMembership}
            </Link>

            <Link
              href="/blog"
              className="px-3 py-2 rounded-md hover:text-[#0b5d2b] hover:bg-stone-100 transition"
            >
              {t.blog}
            </Link>

            <Link
              href="/about"
              className="px-3 py-2 rounded-md hover:text-[#0b5d2b] hover:bg-stone-100 transition"
            >
              {t.aboutUs}
            </Link>

            <Link
              href="/contact"
              className="px-3 py-2 rounded-md hover:text-[#0b5d2b] hover:bg-stone-100 transition"
            >
              {t.contact}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}