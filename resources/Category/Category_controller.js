import { Category } from './Category_model';
import { User } from '../user/user.model';
import slugify from 'slugify';

function subCategory(categories, parentId = null) {
	const categoryList = [];
	let category;
	if (parentId == null) {
		category = categories.filter(cat => cat.parentId == undefined);
	} else {
		category = categories.filter(cat => cat.parentId == parentId);
	}
	for (let cate of category) {
		categoryList.push({
			_id: cate._id,
			category: cate.category,
			slug: cate.slug,
			image: cate.image,
			status: cate.status,
			featured: cate.featured,
			subCategory: subCategory(categories, cate._id)
		});
	}

	return categoryList;
}
const add_category = async (req, res) => {
	const { category, parentId } = req.body;

	let categoryObj;
	try {
		if (req.file) {
			categoryObj = {
				category,
				image: req.file.location,
				slug: slugify(category)
			};
		} else {
			categoryObj = {
				category,
				slug: slugify(category)
			};
		}
		if (parentId) {
			categoryObj.parentId = parentId;
		}

		const newCategory = await Category.create(categoryObj);

		// const updateUser = await User.findByIdAndUpdate(
		//   req.user._id,
		//   {
		//     $addToSet: {
		//       categories: newCategory._id,
		//     },
		//   },
		//   { new: true }
		// );

		return res.status(200).json({ category: newCategory });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

const view_category = async (req, res) => {
	try {
		const id = req.params.id;
		if (!id) {
			res
				.status(400)
				.json({
					message: 'Request was rejected.',
					reason: 'Category id is required.'
				});

			return;
		}
		const check = await Category.findById(id).populate('parentId');
		if (!check) {
			res.status(404).json({
				message: 'Category was not found.',
				reason: 'No category was made from the admin panel.'
			});

			return;
		}

		res.status(200).json(check);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: e.message });
	}
};

const view = async (_req, res) => {
	try {
		const category = await Category.find({ status: true });
		const categoryList = subCategory(category);
		if (!categoryList.length)
			return res.status(404).json({ message: 'Category' });
		res.status(200).json(categoryList);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: e.message });
	}
};

export const viewAll = async (_req, res) => {
	try {
		const category = await Category.find({});
		const categoryList = subCategory(category);
		if (!categoryList.length)
			return res.status(404).json({ message: 'Category' });
		res.status(200).json(categoryList);
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: e.message });
	}
};

const update_category = async (req, res) => {
	try {
		const { status, category, parentId, featured } = req.body;
		const id = req.params.id;
		const check = await Category.findById(id);

		if (!check) {
			res.send('no category found!!');
		}
		if (status !== undefined) {
			const update = await Category.findByIdAndUpdate(
				id,

				{
					$set: {
						status
					}
				},
				{
					new: true
				}
			);

			return res.send(update);
		} else if (featured !== undefined) {
			const update = await Category.findByIdAndUpdate(
				id,

				{
					$set: {
						featured
					}
				},
				{
					new: true
				}
			);

			return res.send(update);
		} else if (req.file) {
			const update = await Category.findByIdAndUpdate(
				id,
				{ image: req.file.location, category },
				{
					new: true
				}
			);
			res.send(update);
		} else {
			const update = await Category.findByIdAndUpdate(
				id,
				{ category, parentId },
				{
					new: true
				}
			);
			res.send(update);
		}
	} catch (e) {
		res.send(e.message);
	}
};

const delete_category = async (req, res) => {
	try {
		const id = req.params.id;
		const check = await Category.findById(id);
		if (!check) {
			res.send('no category found!!');
		}
		const subCategory = await Category.find({ parentId: id });
		if (subCategory.length > 0) {
			let subCate_id = subCategory[0]._id;
			let deleteSubcate = await Category.findByIdAndDelete({ _id: subCate_id });
			const deletee = await Category.findByIdAndDelete(id);
			const user = await User.findByIdAndUpdate(req.user._id, {
				$pull: {
					categories: id
				}
			});
			if (deletee && deleteSubcate) {
				return res.send(deletee);
			}
		} else {
			const deletee = await Category.findByIdAndDelete(id);
			const user = await User.findByIdAndUpdate(req.user._id, {
				$pull: {
					categories: id
				}
			});

			if (deletee) {
				res.send(deletee);
			}
		}
	} catch (e) {
		res.send(e.message);
	}
};

const deleteAll = async (req, res) => {
	const deleteCat = await User.updateMany(
		{},
		{
			$set: {
				categories: []
			}
		},
		{ multi: true }
	);

	if (deleteCat) {
		return res.status(204).json({
			message: 'Deleted All categories'
		});
	}
};

export {
	add_category,
	view_category,
	view,
	update_category,
	delete_category,
	deleteAll
};
