import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Biodata from "@/models/Biodata";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ biodata: null }, { status: 401 });
    }

    await dbConnect();
    const biodata = await Biodata.findOne({ userId: session.userId });
    return NextResponse.json({ biodata }, { status: 200 });
  } catch (error) {
    console.error("Get Biodata Error:", error);
    return NextResponse.json({ message: "সার্ভার ত্রুটি" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: "বায়োডাটা জমা দিতে আগে লগইন করুন / Please login first." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      biodataType,
      fullName,
      maritalStatus,
      birthYear,
      skinTone,
      height,
      weight,
      education,
      profession,
      district,
      thana,
      village,
      fatherProfession,
      brothersCount,
      sistersCount,
      financialDetails,
      photoUrl,
    } = body;

    if (
      !biodataType ||
      !fullName ||
      !maritalStatus ||
      !birthYear ||
      !skinTone ||
      !height ||
      !weight ||
      !education ||
      !profession ||
      !district ||
      !thana ||
      !village ||
      !fatherProfession ||
      !financialDetails
    ) {
      return NextResponse.json(
        {
          message:
            "অনুগ্রহ করে সকল আবশ্যক তথ্য পূরণ করুন / Please fill all required fields.",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const existing = await Biodata.findOne({ userId: session.userId });
    const biodataCode =
      existing?.biodataCode || `HB-${Math.floor(10000 + Math.random() * 90000)}`;

    const saved = await Biodata.findOneAndUpdate(
      { userId: session.userId },
      {
        userId: session.userId,
        biodataCode,
        biodataType,
        fullName: String(fullName).trim(),
        maritalStatus,
        birthYear: Number(birthYear),
        skinTone: String(skinTone).trim(),
        height: String(height).trim(),
        weight: String(weight).trim(),
        education: String(education).trim(),
        profession: String(profession).trim(),
        district: String(district).trim(),
        thana: String(thana).trim(),
        village: String(village).trim(),
        fatherProfession: String(fatherProfession).trim(),
        brothersCount: Number(brothersCount) || 0,
        sistersCount: Number(sistersCount) || 0,
        financialDetails: String(financialDetails).trim(),
        photoUrl: typeof photoUrl === "string" ? photoUrl.trim() : "",
      },
      { upsert: true, returnDocument: "after", runValidators: true }
    );

    return NextResponse.json(
      {
        message: "আপনার বায়োডাটা সফলভাবে সংরক্ষিত হয়েছে!",
        biodata: saved,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Save Biodata Error:", error);
    return NextResponse.json(
      { message: "বায়োডাটা সংরক্ষণে সমস্যা হয়েছে, আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}