import mongoose from "mongoose";

const { Schema, model } = mongoose;

const EmailSchema = new Schema(
  {
    title: String,
    content: String,
    subject: String,
    status: {
      type: Boolean,
      default: true,
    },
    firstName: String,
    LastName: String,
    applicationName: String,
  },
  { timestamps: true }
);

export const Email = model("Email", EmailSchema);
