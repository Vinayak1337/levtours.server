import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const CategorySchema = new Schema(
	{
		category: {
			type: String,
			sparse: true,
		},
		status: {
			type: Boolean,
			default: true,
		},
		image: {
			type: String,
		},
		featured: {
			type: Boolean,
			default: false,
		},
	},
	{ timestamps: true },
);

export const Category = model('Category', CategorySchema);
