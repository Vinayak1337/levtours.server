import mongoose from 'mongoose';

const { Schema, model, SchemaTypes } = mongoose;

const EcommerceSchema = new Schema(
	{
		title: String,
		description: String,
		images: [String],
		featuredImage: String,
		tax: { type: SchemaTypes.ObjectId, ref: 'Tax' },
		price: Number,
		sale_price: Number,
		sku: String,
		category: { type: SchemaTypes.ObjectId, ref: 'Category' },
		status: { type: Boolean, default: true },
		userId: { type: SchemaTypes.ObjectId, ref: 'Users' },
	},
	{ timestamps: true },
);

export const Ecommerce = model('Ecommerce', EcommerceSchema);
