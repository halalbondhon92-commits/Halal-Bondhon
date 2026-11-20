import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";

export async function GET() {
  try {
    await dbConnect();
    return NextResponse.json(
      { ok: true, message: "MongoDB connected to HalalBondhon!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Health DB Error:", error);
    return NextResponse.json(
      { ok: false, message: "MongoDB connection failed" },
      { status: 500 }
    );
  }
}