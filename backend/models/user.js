import mongoose, { Schema, model, Types } from "mongoose";

const UserSchema = new Schema({
    username: { type: String, required: true },
    clerkId: { type: String, required: true, unique: true }, // Clerk user id
    attendingEvents: [{ type: Types.ObjectId, ref: "Event" }], // optional convenience
}, { timestamps: true });

export const UserModel = model("User", UserSchema);