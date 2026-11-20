import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, email, phone, gender, password } = body;

    if (!fullName || !email || !phone || !gender || !password) {
      return NextResponse.json(
        { message: "সবগুলো তথ্য পূরণ করা আবশ্যক / All fields are required." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          message:
            "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে / Password must be at least 6 characters.",
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json(
        {
          message:
            "এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট খোলা আছে / Email already registered.",
        },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      gender,
      password: hashedPassword,
    });

    await createSession({
      userId: newUser._id.toString(),
      email: newUser.email,
      fullName: newUser.fullName,
      gender: newUser.gender,
      role: newUser.role,
    });

    return NextResponse.json(
      {
        message: "রেজিস্ট্রেশন সফল হয়েছে!",
        user: {
          id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          gender: newUser.gender,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { message: "সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।" },
      { status: 500 }
    );
  }
}