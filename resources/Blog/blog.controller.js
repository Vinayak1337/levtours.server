import { Blog } from './blog.model';

export const getAllBlogs = async (req, res) => {
	let { page, limit } = req.query;
	if (!(page || limit))
		return res
			.status(400)
			.json({ message: 'Both page and limit are required' });

	page = page * 1;
	limit = limit * 1;
	let limitVal = limit;
	let skipeValue = (page - 1) * limitVal;

	try {
		const totalBlogs = await Blog.countDocuments();
		const blogs = await Blog.find()
			.limit(limitVal)
			.sort({ createdAt: -1 })
			.skip(skipeValue);

		if (!totalBlogs)
			return res.status(404).json({
				message: 'No blogs found.',
				reason: 'Blogs were not added from the admin panel.'
			});

		res.status(200).json({
			totalBlogs,
			pageResult: page,
			blogs
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: e.message });
	}
};

export const addBlog = async (req, res) => {
	if (!req.user)
		return res.status(401).json({ message: 'User Not Authorized' });

	const requireds = ['title', 'content'];
	const missing = [];

	for (const required of requireds)
		if (!required in req.body) missing.push(required);

	if (!req.file.location)
		return res.status(400).json({
			message: 'Request was rejected.',
			reason: 'Thumbnail field missing.'
		});

	if (missing.length)
		return res.status(400).json({
			message: 'Request was rejected.',
			reason: 'Required fields missing.',
			detail: {
				missing
			}
		});

	try {
		const blog = await Blog.create({
			...req.body,
			thumbnail: req.file.location
		});
		res.status(200).json(blog);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: e.message });
	}
};

export const getBlog = async (req, res) => {
	let { id } = req.params;
	if (!id) return res.status(400).json({ message: 'Id is required.' });

	try {
		const blog = await Blog.findById(id);
		if (!blog)
			return res.status(404).json({
				message: 'No blog found by given id.',
				reason: 'Either it is deleted or the id is incorrect.'
			});

		res.status(200).json(blog);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: e.message });
	}
};

export const deleteBlog = async (req, res) => {
	let { id } = req.params;
	if (!id) return res.status(400).json({ message: 'Id is required.' });

	try {
		const blog = await Blog.findByIdAndDelete(id);
		if (!blog)
			return res.status(404).json({
				message: 'No blog found by given id.',
				reason: 'Either it is deleted or the id is incorrect.'
			});

		res.status(200).json(blog);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: e.message });
	}
};

export const updateBlog = async (req, res) => {
	let { id } = req.params;
	if (!id) return res.status(400).json({ message: 'Id is required.' });

	const { title, content } = req.body;

	const updateBody = {};
	if (title) updateBody.title = title;
	if (content) updateBody.content = content;
	if (req.file?.location) updateBody['thumbnail'] = req.file.location;

	try {
		const blog = await Blog.findByIdAndUpdate(id, updateBody);
		if (!blog)
			return res.status(404).json({
				message: 'No blog found by given id.',
				reason: 'Either it is deleted or the id is incorrect.'
			});

		res.status(200).json(blog);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: e.message });
	}
};
