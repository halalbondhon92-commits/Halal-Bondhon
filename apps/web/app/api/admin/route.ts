import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Biodata from "@/models/Biodata";

interface JwtPayload {
  userId: string;
  email: string;
  role?: string;
}

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) return null;

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    const decoded = jwt.verify(token, secret) as JwtPayload;
    await dbConnect();

    const adminUser = await User.findById(decoded.userId).lean();
    if (!adminUser || (adminUser as { role?: string }).role !== "admin") {
      return null;
    }

    return adminUser;
  } catch {
    return null;
  }
}

export async function GET() {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized: Admin access required" },
      { status: 403 }
    );
  }

  const [users, biodatas] = await Promise.all([
    User.find({}).select("-password").sort({ createdAt: -1 }).lean(),
    Biodata.find({}).sort({ createdAt: -1 }).lean(),
  ]);

  const stats = {
    totalUsers: users.length,
    premiumUsers: users.filter((u: { isPremium?: boolean }) => Boolean(u.isPremium))
      .length,
    totalBiodatas: biodatas.length,
    pendingBiodatas: biodatas.filter(
      (b: { status?: string }) => (b.status || "pending") === "pending"
    ).length,
    approvedBiodatas: biodatas.filter(
      (b: { status?: string }) => b.status === "approved"
    ).length,
  };

  return NextResponse.json({ stats, users, biodatas });
}

export async function PATCH(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { targetType, id, updates } = body;

    if (!targetType || !id || !updates || typeof updates !== "object") {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    if (targetType === "biodata") {
      const updated = await Biodata.findByIdAndUpdate(id, updates, {
        new: true,
      }).lean();
      if (!updated) {
        return NextResponse.json({ error: "Biodata not found" }, { status: 404 });
      }
      return NextResponse.json({ message: "Biodata updated", item: updated });
    }

    if (targetType === "user") {
      const updated = await User.findByIdAndUpdate(id, updates, {
        new: true,
      })
        .select("-password")
        .lean();
      if (!updated) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      return NextResponse.json({ message: "User updated", item: updated });
    }

    return NextResponse.json({ error: "Unknown targetType" }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Update failed" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const targetType = searchParams.get("targetType");
    const id = searchParams.get("id");

    if (!targetType || !id) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    if (targetType === "biodata") {
      await Biodata.findByIdAndDelete(id);
      return NextResponse.json({ message: "Biodata deleted" });
    }

    if (targetType === "user") {
      await User.findByIdAndDelete(id);
      return NextResponse.json({ message: "User deleted" });
    }

    return NextResponse.json({ error: "Invalid targetType" }, { status: 400 });
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Delete failed" },
      { status: 500 }
    );
  }
}