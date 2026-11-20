import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Biodata from "@/models/Biodata";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const gender = searchParams.get("gender");
    const district = searchParams.get("district");
    const limitParam = Number(searchParams.get("limit") || "0");

    await dbConnect();

    const query: Record<string, string> = {};
    if (gender === "groom" || gender === "bride") {
      query.biodataType = gender;
    }
    if (district && district.trim()) {
      query.district = district.trim();
    }

    let cursor = Biodata.find(query).sort({ createdAt: -1 }).lean();
    if (limitParam > 0) {
      cursor = cursor.limit(limitParam);
    }

    const biodatas = await cursor;

    return NextResponse.json({ biodatas }, { status: 200 });
  } catch (error) {
    console.error("Fetch Biodatas Error:", error);
    return NextResponse.json(
      { message: "বায়োডাটা লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}