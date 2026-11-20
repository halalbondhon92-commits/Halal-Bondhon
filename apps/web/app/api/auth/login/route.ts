import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "ইমেইল এবং পাসওয়ার্ড দিন / Email and password are required." },
        { status: 400 }
      );
    }

    await dbConnect();

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json(
        { message: "ভুল ইমেইল অথবা পাসওয়ার্ড / Invalid email or password." },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "ভুল ইমেইল অথবা পাসওয়ার্ড / Invalid email or password." },
        { status: 401 }
      );
    }

    await createSession({
      userId: user._id.toString(),
      email: user.email,
      fullName: user.fullName,
      gender: user.gender,
      role: user.role,
    });

    return NextResponse.json(
      {
        message: "লগইন সফল হয়েছে!",
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          gender: user.gender,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { message: "সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}