import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        { message: "ছবি আপলোড করতে আগে লগইন করুন / Please login first." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("photo") as File | null;

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { message: "কোনো ছবি নির্বাচন করা হয়নি / No file selected." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "শুধুমাত্র JPG, PNG বা WebP ছবি আপলোড করুন।" },
        { status: 400 }
      );
    }

    if (file.size > 3 * 1024 * 1024) {
      return NextResponse.json(
        { message: "ছবির সাইজ সর্বোচ্চ ৩ মেগাবাইট হতে পারবে।" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const ext = (file.name.split(".").pop() || "jpg").replace(/[^a-zA-Z0-9]/g, "");
    const fileName = `hb_${session.userId}_${Date.now()}.${ext || "jpg"}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    return NextResponse.json(
      { url: `/uploads/${fileName}` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { message: "ছবি আপলোড ব্যর্থ হয়েছে।" },
      { status: 500 }
    );
  }
}