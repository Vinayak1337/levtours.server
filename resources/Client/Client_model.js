import mongoose from "mongoose";

const { Schema, model } = mongoose;

const ClientSchema = new Schema({
  firstName: {
    type: String,
    required: [true, "User Must Have A First Name"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "User Must Have A Last Name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "User Must Have A Email"],
    trim: true,
  },
  joindate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Boolean,
    default: true,
  },
});

export const Client = model("Client", ClientSchema);
