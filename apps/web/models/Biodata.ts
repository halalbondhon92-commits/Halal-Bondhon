import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBiodata extends Document {
  userId: mongoose.Types.ObjectId;
  biodataCode: string;
  biodataType: "groom" | "bride";
  fullName: string;
  maritalStatus: "unmarried" | "divorced" | "widowed";
  birthYear: number;
  skinTone: string;
  height: string;
  weight: string;
  education: string;
  profession: string;
  district: string;
  thana: string;
  village: string;
  fatherProfession: string;
  brothersCount: number;
  sistersCount: number;
  financialDetails: string;
  photoUrl: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const BiodataSchema = new Schema<IBiodata>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    biodataCode: { type: String, required: true, unique: true },
    biodataType: { type: String, enum: ["groom", "bride"], required: true },
    fullName: { type: String, required: true, trim: true },
    maritalStatus: {
      type: String,
      enum: ["unmarried", "divorced", "widowed"],
      required: true,
    },
    birthYear: { type: Number, required: true },
    skinTone: { type: String, required: true, trim: true },
    height: { type: String, required: true, trim: true },
    weight: { type: String, required: true, trim: true },
    education: { type: String, required: true, trim: true },
    profession: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    thana: { type: String, required: true, trim: true },
    village: { type: String, required: true, trim: true },
    fatherProfession: { type: String, required: true, trim: true },
    brothersCount: { type: Number, required: true, default: 0 },
    sistersCount: { type: Number, required: true, default: 0 },
    financialDetails: { type: String, required: true, trim: true },
    photoUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
  },
  { timestamps: true }
);

const Biodata: Model<IBiodata> =
  mongoose.models.Biodata || mongoose.model<IBiodata>("Biodata", BiodataSchema);

export default Biodata;