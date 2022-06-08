import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const BlogSchema = new Schema(
	{
		title: {
			type: String,
			required: [true, 'Title of the blog is required.']
		},
		content: {
			type: String,
			required: [true, 'Content of the blog is required.']
		},
		thumbnail: {
			type: String,
			required: [true, 'Thumbnail of the blog is required.']
		}
	},
	{ timestamps: true }
);

export const Blog = model('Blog', BlogSchema);
