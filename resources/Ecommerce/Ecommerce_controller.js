import { Ecommerce } from './ecomerce_model';
import Mongoose from 'mongoose';

const getProducts = async (req, res) => {
	let { page, limit } = req.query;

	if (!(page || limit))
		return res.status(400).json({
			message: 'Request was reject.',
			reason: 'Both page and limit are required fields.'
		});

	page = page * 1;
	limit = limit * 1;
	let limitVal = limit;
	let skipeValue = (page - 1) * limitVal;

	try {
		const totalProducts = await Ecommerce.countDocuments();
		const products = await Ecommerce.find()
			.limit(limitVal)
			.sort({ createdAt: -1 })
			.skip(skipeValue);

		if (!totalProducts)
			return res.status(404).json({
				message: 'No products found.',
				reason: 'Products were not added from the admin panel.'
			});

		res.status(200).json({
			totalProducts,
			pageResult: products.length,
			products
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: e.message });
	}
};

const getProductById = async (req, res) => {
	try {
		const id = req.params.id;
		if (!id) {
			return res.status(400).json({
				message: 'Request was rejected.',
				reason: 'Product id is required.'
			});
		}
		const product = await Ecommerce.findById(id)
			.populate('tax')
			.populate('category');
		res.json(product);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: e.message });
	}
};

const getAllProduct = async (req, res) => {
	try {
		const product = await Ecommerce.find();
		if (product.length) {
			res.status(200).json(product);
			return;
		}

		res.status(404).json({
			message: 'No products found.',
			reason: 'Products were not added from the admin panel.'
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

const addProduct = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(400).json({ message: 'User Not Found' });
		}

		let productImages = [];
		let featuredImage;

		if (req.files.featuredImage && req.files.images) {
			req.files.images.map(image => {
				productImages.push(image.location);
			});
			featuredImage = req.files.featuredImage[0].location;
			const updateObject = {
				...req.body,
				images: productImages,
				featuredImage,
				userId: req.user._id
			};

			const product = await Ecommerce.create(updateObject);
			return res.status(200).json(product);
		} else {
			const updateObject = {
				...req.body,
				featuredImage: req.files.featuredImage[0].location,
				userID: req.user._id
			};
			const product = await Ecommerce.create(updateObject);
			return res.status(200).json(product);
		}
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
};

const updateProduct = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(400).json({ message: 'User Not Found' });
		}
		const id = req.params.id;
		if (!id) {
			return res.status(400).json({ message: 'id is required' });
		}

		const updateObject = { ...req.body };
		delete updateObject.featuredImage;
		delete updateObject.images;

		if (
			req.files?.featuredImage?.length &&
			req.files?.featuredImage[0]?.location
		)
			updateObject.featuredImage = req.files.featuredImage[0].location;

		if (
			req.files?.images?.length &&
			!req.files?.images?.some(image => image?.location != null)
		)
			updateObject['$push'] = {
				images: req.files.images.map(image => image.location)
			};

		const product = await Ecommerce.findByIdAndUpdate(id, updateObject, {
			new: true
		});

		if (product) return res.status(200).json(product);

		res
			.status(404)
			.json({ message: 'Product was not found with the given id.' });
	} catch (e) {
		res.status(500).json({ message: e.message });
	}
};

const deleteProduct = async (req, res) => {
	try {
		const id = req.params.id;
		if (!id) {
			return res.status(400).json({ message: 'id not required' });
		}
		await Ecommerce.findByIdAndDelete(id);
		res.json({ status: 'OK', message: 'Product Deleted Successfully' });
	} catch (e) {
		res.json({ message: 'Error deleting product' });
	}
};

const getLatest = async (req, res) => {
	try {
		const latest = await Ecommerce.find().sort({ _id: -1 }).limit(8);
		if (latest.length) {
			res.status(200).json(latest);
			return;
		}

		res.status(404).json({
			message: 'No products found.',
			reason: 'Products were not added from the admin panel.'
		});
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const setStatus = async (req, res) => {
	let updateObj;
	if (req.body.status === false) {
		updateObj = {
			status: false
		};
	} else {
		updateObj = {
			status: true
		};
	}
	console.log(updateObj);
	try {
		const latest = await Ecommerce.findByIdAndUpdate(req.params.id, updateObj);
		if (latest) {
			res.status(200).json({
				status: 'success',
				latest
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 'failed',
			error
		});
	}
};
const updateFeaturedProducts = async (req, res) => {
	try {
		const latest = await Ecommerce.findByIdAndUpdate(req.params.id, {
			$set: {
				featured: {
					status: false
				}
			}
		});
		if (latest) {
			res.status(200).json({
				status: 'success',
				latest
			});
		}
	} catch (error) {
		res.status(500).json({
			status: 'failed',
			error
		});
	}
};

const postFeaturedProducts = async (req, res) => {
	try {
		if (!req.user) {
			return res.status(400).json({ message: 'User Not Found' });
		}

		if (!req.file || !req.body) {
			return res.status(400).json({
				status: 'failed',
				message: 'Please fill all the fileds'
			});
		}
		const featuredObj = {
			image: req.file.location,
			name: req.body.name,
			status: req.body.status
		};

		const featuredProds = await Ecommerce.find({ name: req.body.name });
		if (featuredProds.length > 0) {
			return res.status(400).json({
				status: 'failed',
				message: 'Product Already Added'
			});
		}
		const createFeatured = await Ecommerce.findByIdAndUpdate(
			req.body.productId,
			{
				featured: featuredObj
			}
		);

		if (createFeatured) {
			return res.status(200).json({
				status: 'success',
				message: 'Featured Product Added'
			});
		}
	} catch (error) {
		console.log(error.message);
		res.status(500).json({ message: e.message });
	}
};
const update = async (req, res) => {
	try {
		await Mongoose.model('Ecommerce').updateMany(
			{},
			{ $set: { featured: { status: false } } },
			{ upsert: false, multi: true }
		);
		return res.json({ message: 'ok' });
	} catch (error) {
		return res.json({ message: error.message });
	}
};
const deleteImage = async (req, res) => {
	try {
		await Ecommerce.findByIdAndUpdate(req.params.id, {
			$pull: {
				image: req.query.url
			}
		});

		return res.status(200).json({
			status: 'success'
		});
	} catch (error) {
		res.status(500).json({
			message: error.message
		});
	}
};
const deleteFeaturedImage = async (req, res) => {
	try {
		await Ecommerce.findByIdAndUpdate(req.params.id, {
			$unset: {
				featuredImage: ''
			}
		});

		return res.status(200).json({
			status: 'success'
		});
	} catch (error) {
		res.status(500).json({
			status: 'failed',
			error
		});
	}
};

export {
	getProducts,
	getProductById,
	getAllProduct,
	addProduct,
	updateProduct,
	deleteProduct,
	getLatest,
	setStatus,
	postFeaturedProducts,
	updateFeaturedProducts,
	update,
	deleteImage,
	deleteFeaturedImage
};
