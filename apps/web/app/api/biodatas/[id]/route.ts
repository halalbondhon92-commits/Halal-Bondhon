import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import Biodata from "@/models/Biodata";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();

    let biodata = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      biodata = await Biodata.findById(id).lean();
    }
    if (!biodata) {
      biodata = await Biodata.findOne({ biodataCode: id }).lean();
    }

    if (!biodata) {
      return NextResponse.json(
        { message: "বায়োডাটা পাওয়া যায়নি।" },
        { status: 404 }
      );
    }

    return NextResponse.json({ biodata }, { status: 200 });
  } catch (error) {
    console.error("Single Biodata Error:", error);
    return NextResponse.json(
      { message: "বায়োডাটা লোড করতে সমস্যা হয়েছে।" },
      { status: 500 }
    );
  }
}