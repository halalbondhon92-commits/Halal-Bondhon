"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Stats {
  totalUsers: number;
  premiumUsers: number;
  totalBiodatas: number;
  pendingBiodatas: number;
  approvedBiodatas: number;
}

interface AdminUser {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  gender?: "groom" | "bride";
  role?: "user" | "admin";
  isVerified?: boolean;
  isPremium?: boolean;
  createdAt?: string;
}

interface AdminBiodata {
  _id: string;
  biodataCode?: string;
  biodataType?: "groom" | "bride";
  fullName?: string;
  birthYear?: number;
  district?: string;
  thana?: string;
  profession?: string;
  photoUrl?: string;
  status?: "pending" | "approved" | "rejected";
  isFeatured?: boolean;
  createdAt?: string;
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"biodatas" | "users">("biodatas");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    premiumUsers: 0,
    totalBiodatas: 0,
    pendingBiodatas: 0,
    approvedBiodatas: 0,
  });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [biodatas, setBiodatas] = useState<AdminBiodata[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin");
      if (res.status === 403 || res.status === 401) {
        setError(
          "আপনার অ্যাডমিন অ্যাক্সেস নেই। অনুগ্রহ করে অ্যাডমিন অ্যাকাউন্ট দিয়ে লগইন করুন।"
        );
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load admin data");

      setStats(data.stats);
      setUsers(data.users || []);
      setBiodatas(data.biodatas || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "ডাটা লোড করতে সমস্যা হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdate = async (
    targetType: "biodata" | "user",
    id: string,
    updates: Record<string, unknown>
  ) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetType, id, updates }),
      });
      if (res.ok) {
        await fetchAdminData();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (targetType: "biodata" | "user", id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এটি স্থায়ীভাবে মুছে ফেলতে চান?")) return;
    setActionLoading(id);
    try {
      const res = await fetch(`/api/admin?targetType=${targetType}&id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchAdminData();
      }
    } finally {
      setActionLoading(null);
    }
  };

  const filteredBiodatas = biodatas.filter((b) => {
    const currentStatus = b.status || "pending";
    const matchesStatus = statusFilter === "all" || currentStatus === statusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      (b.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.district || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.profession || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.biodataCode || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    return (
      (u.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 border-4 border-[#084d22] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-stone-600 font-medium">অ্যাডমিন ড্যাশবোর্ড লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-md border border-red-200 p-6 text-center space-y-4">
          <h2 className="text-xl font-bold text-red-700">অ্যাক্সেস অনুমোদিত নয়</h2>
          <p className="text-sm text-stone-600">{error}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 rounded-lg bg-[#084d22] text-white text-sm font-semibold hover:bg-[#063e1b] cursor-pointer"
            >
              লগইন করুন
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-sm font-semibold hover:bg-stone-100"
            >
              হোমপেজ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Top Admin Header */}
      <header className="bg-gradient-to-r from-[#084d22] to-[#042d13] text-white border-b border-[#e5be54]/40">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#e5be54] font-semibold">
              HalalBondhon Control Panel
            </span>
            <h1 className="text-2xl font-extrabold">অ্যাডমিন ড্যাশবোর্ড</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/biodatas"
              className="px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-medium transition"
            >
              পাবলিক বায়োডাটা দেখুন
            </Link>
            <Link
              href="/"
              className="px-3.5 py-2 rounded-lg bg-[#e5be54] text-[#042d13] hover:bg-[#d8af43] text-sm font-bold transition"
            >
              হোমপেজ
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
            <p className="text-xs text-stone-500 font-medium">মোট ইউজার</p>
            <p className="text-2xl font-extrabold text-stone-900 mt-1">
              {stats.totalUsers}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-sm">
            <p className="text-xs text-amber-700 font-medium">প্রিমিয়াম মেম্বার</p>
            <p className="text-2xl font-extrabold text-amber-700 mt-1">
              {stats.premiumUsers}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm">
            <p className="text-xs text-stone-500 font-medium">মোট বায়োডাটা</p>
            <p className="text-2xl font-extrabold text-stone-900 mt-1">
              {stats.totalBiodatas}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-orange-200 shadow-sm">
            <p className="text-xs text-orange-700 font-medium">পেন্ডিং বায়োডাটা</p>
            <p className="text-2xl font-extrabold text-orange-600 mt-1">
              {stats.pendingBiodatas}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-sm col-span-2 lg:col-span-1">
            <p className="text-xs text-emerald-700 font-medium">অ্যাপ্রুভড বায়োডাটা</p>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">
              {stats.approvedBiodatas}
            </p>
          </div>
        </section>

        {/* Tabs & Search */}
        <section className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-stone-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab("biodatas")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                  activeTab === "biodatas"
                    ? "bg-[#084d22] text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                বায়োডাটা ম্যানেজমেন্ট ({biodatas.length})
              </button>
              <button
                onClick={() => setActiveTab("users")}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition cursor-pointer ${
                  activeTab === "users"
                    ? "bg-[#084d22] text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
              >
                ইউজার ও প্রিমিয়াম ({users.length})
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              {activeTab === "biodatas" && (
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-10 rounded-lg border border-stone-300 px-3 text-sm bg-white text-stone-800"
                >
                  <option value="all">সব স্ট্যাটাস</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              )}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="নাম, কোড, পেশা, জেলা বা ইমেইল দিয়ে খুঁজুন..."
                className="h-10 rounded-lg border border-stone-300 px-3.5 text-sm w-full sm:w-64"
              />
            </div>
          </div>

          {/* Biodatas Table */}
          {activeTab === "biodatas" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 text-xs uppercase border-b border-stone-200">
                    <th className="py-3 px-4">নাম ও কোড</th>
                    <th className="py-3 px-4">ধরন / ঠিকানা</th>
                    <th className="py-3 px-4">পেশা</th>
                    <th className="py-3 px-4">স্ট্যাটাস</th>
                    <th className="py-3 px-4">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-sm">
                  {filteredBiodatas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-stone-500">
                        কোনো বায়োডাটা পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredBiodatas.map((b) => {
                      const st = b.status || "pending";
                      return (
                        <tr key={b._id} className="hover:bg-stone-50">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              {b.photoUrl ? (
                                <img
                                  src={b.photoUrl}
                                  alt={b.fullName || "Biodata"}
                                  className="w-10 h-10 rounded-full object-cover border border-stone-200 shrink-0"
                                />
                              ) : null}
                              <div>
                                <div className="font-bold text-stone-900">
                                  {b.fullName || "নামহীন বায়োডাটা"}
                                </div>
                                <div className="text-xs text-stone-500">
                                  {b.biodataCode || b._id.slice(-6)}
                                  {b.birthYear ? ` • জন্ম: ${b.birthYear}` : ""}
                                  {b.isFeatured && (
                                    <span className="ml-2 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                                      Featured
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-stone-700">
                            <div>
                              {b.biodataType === "groom"
                                ? "পাত্র"
                                : b.biodataType === "bride"
                                ? "পাত্রী"
                                : "-"}
                            </div>
                            <div className="text-xs text-stone-500">
                              {b.district || "-"}
                              {b.thana ? `, ${b.thana}` : ""}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-stone-700">
                            {b.profession || "-"}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                st === "approved"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : st === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {st.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {st !== "approved" && (
                                <button
                                  disabled={actionLoading === b._id}
                                  onClick={() =>
                                    handleUpdate("biodata", b._id, {
                                      status: "approved",
                                    })
                                  }
                                  className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                                >
                                  Approve
                                </button>
                              )}
                              {st !== "rejected" && (
                                <button
                                  disabled={actionLoading === b._id}
                                  onClick={() =>
                                    handleUpdate("biodata", b._id, {
                                      status: "rejected",
                                    })
                                  }
                                  className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer"
                                >
                                  Reject
                                </button>
                              )}
                              <button
                                disabled={actionLoading === b._id}
                                onClick={() =>
                                  handleUpdate("biodata", b._id, {
                                    isFeatured: !b.isFeatured,
                                  })
                                }
                                className="px-2.5 py-1 rounded border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold cursor-pointer"
                              >
                                {b.isFeatured ? "Unfeature" : "Feature"}
                              </button>
                              <Link
                                href={`/biodatas/${b._id}`}
                                className="px-2.5 py-1 rounded border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-semibold"
                              >
                                View
                              </Link>
                              <button
                                disabled={actionLoading === b._id}
                                onClick={() => handleDelete("biodata", b._id)}
                                className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Users Table */}
          {activeTab === "users" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-stone-100 text-stone-700 text-xs uppercase border-b border-stone-200">
                    <th className="py-3 px-4">নাম ও ফোন</th>
                    <th className="py-3 px-4">ইমেইল</th>
                    <th className="py-3 px-4">রোল</th>
                    <th className="py-3 px-4">মেম্বারশিপ ও ভেরিফিকেশন</th>
                    <th className="py-3 px-4">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 text-sm">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-stone-500">
                        কোনো ইউজার পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u._id} className="hover:bg-stone-50">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900">{u.fullName}</div>
                          <div className="text-xs text-stone-500">
                            {u.phone || "-"} •{" "}
                            {u.gender === "groom" ? "পাত্র" : "পাত্রী"}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-stone-700">{u.email}</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              u.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-stone-100 text-stone-700"
                            }`}
                          >
                            {(u.role || "user").toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 space-x-1">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              u.isPremium
                                ? "bg-amber-100 text-amber-800"
                                : "bg-stone-100 text-stone-600"
                            }`}
                          >
                            {u.isPremium ? "PREMIUM" : "FREE"}
                          </span>
                          {u.isVerified && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-700">
                              VERIFIED
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <button
                              disabled={actionLoading === u._id}
                              onClick={() =>
                                handleUpdate("user", u._id, {
                                  isPremium: !u.isPremium,
                                })
                              }
                              className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold cursor-pointer"
                            >
                              {u.isPremium ? "Remove Premium" : "Make Premium"}
                            </button>
                            <button
                              disabled={actionLoading === u._id}
                              onClick={() =>
                                handleUpdate("user", u._id, {
                                  isVerified: !u.isVerified,
                                })
                              }
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                            >
                              {u.isVerified ? "Unverify" : "Verify"}
                            </button>
                            <button
                              disabled={actionLoading === u._id}
                              onClick={() =>
                                handleUpdate("user", u._id, {
                                  role: u.role === "admin" ? "user" : "admin",
                                })
                              }
                              className="px-2.5 py-1 rounded border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold cursor-pointer"
                            >
                              {u.role === "admin" ? "Demote User" : "Make Admin"}
                            </button>
                            <button
                              disabled={actionLoading === u._id}
                              onClick={() => handleDelete("user", u._id)}
                              className="px-2.5 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-semibold cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}