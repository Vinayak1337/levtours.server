import { Page } from './page_model';
export const addPage = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const page = new Page({
		title: req.body.title,
		content: req.body.content,
		url: req.body.url
	});
	try {
		const data = await page.save();
		res.status(200).json({ message: 'Success', data: data });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
export const updatePage = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const id = req.params.id;
	const queryObj = req.body;

	try {
		const data = await Page.findByIdAndUpdate(id, queryObj, {
			new: true
		});
		res.status(200).json({ message: 'Success', data: data });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
export const deletePage = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const id = req.params.id;
	try {
		const data = await Page.findByIdAndDelete(id);
		res.status(200).json({ message: 'Success' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
export const getPages = async (req, res) => {
	let { page, limit } = req.query;

	if (!(page || limit))
		return res.status(400).json({
			message: 'Request was rejected.',
			reason: 'Both page and limit are required fields.'
		});

	page = page * 1;
	limit = limit * 1;
	let limitVal = limit;
	let skipeValue = (page - 1) * limitVal;
	try {
		const totalRecords = await Page.countDocuments();
		const pages = await Page.find()
			.sort({ createdAt: -1 })
			.limit(limitVal)
			.skip(skipeValue);

		if (!totalRecords)
			return res.status(404).json({
				message: 'No pages were found.',
				reason: 'There was not added any from admin panel.'
			});

		res.status(200).json({ pages, totalRecords });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

export const getPage = async (req, res) => {
	const { id } = req.params;

	if (!id)
		return res.status(400).json({
			message: 'Request was rejected.',
			reason: 'Page id is required field.'
		});

	try {
		const data = await Page.findOne({ _id: id }).sort({ createdAt: -1 });

		if (!data)
			return res.status(404).json({
				message: 'Page was not found by given id.',
				reason: 'Either it was deleted or the id is invalid.'
			});

		res.status(200).json(data);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};
export const getPageByUrl = async (req, res) => {
	try {
		const data = await Page.findOne({ url: req.body.url });
		res.status(200).json({ message: 'Success', Page: data });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
