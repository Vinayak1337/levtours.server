import { Featured } from './FeaturedProduct_model';

const getFeaturedProducts = async (req, res) => {
	try {
		const getFeatured = await Featured.find();
		if (!getFeatured.length)
			return res.status(404).json({
				message: 'No featured product was found.',
				reason: 'Featured products were not added from admin panel.',
			});

		return res.status(200).json(getFeatured);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

const getFeaturedProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const Product = await Featured.findById(id);

		if (Product) {
			return res.status(200).json({
				status: 'success',
				Product,
			});
		}

		res.status(404).json({
			message: 'No product found with given id',
			reason: 'Either it was deleted or the id is incorrect.',
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};
const postFeaturedProducts = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(400).json({ message: 'User Not Found' });
		}

		if (!req.file || !req.body) {
			return status(400).json({
				status: 'failed',
				message: 'Please fill all the fileds',
			});
		}
		const featuredObj = {
			image: req.file.location,
			name: req.body.name,
			status: req.body.status,
		};

		const featuredProds = await Featured.find({ name: req.body.name });
		if (featuredProds.length > 0) {
			return res.status(400).json({
				status: 'failed',
				message: 'Product Already Added',
			});
		}
		const createFeatured = await Featured.create(featuredObj);

		if (createFeatured) {
			return res.status(200).json({
				status: 'success',
				message: 'Featured Product Added',
			});
		}
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: 'Error Creating Product' });
	}
};

const deleteFeatured = async (req, res) => {
	const { id } = req.params;

	const deleteFeatured = await Featured.findByIdAndDelete({ _id: id });
	if (deleteFeatured) {
		return res.status(200).json({
			status: 'success',
			message: 'Deleted Featured Product Successfully',
		});
	} else {
		return res.status(400).json({
			status: 'failed',
			message: 'No Featured Products Exists With This Id',
		});
	}
};

const editFeaturedProducts = async (req, res) => {
	const { id } = req.params;
	let updateObject = {};
	if (!req.body && !req.file) {
		return res.status(400).json({
			status: 'failed',
			message: 'You Have Updated Nothing',
		});
	}
	console.log(req.body);
	if (req.file) {
		updateObject = {
			image: req.file.location,
		};
	}
	if (req.body.name) {
		updateObject['name'] = req.body.name;
	}
	if (req.body.status) {
		updateObject['status'] = req.body.status;
	}

	const updatedFeatured = await Featured.findByIdAndUpdate(
		{ _id: id },
		updateObject,
		{
			new: true,
		},
	);

	return res.status(200).json({
		status: 'success',
		message: 'Updated Featured Successfully',
	});
};
export {
	getFeaturedProducts,
	getFeaturedProduct,
	postFeaturedProducts,
	deleteFeatured,
	editFeaturedProducts,
};
