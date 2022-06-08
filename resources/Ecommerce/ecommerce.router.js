import { Router } from 'express';
import {
	getProducts,
	getProductById,
	addProduct,
	updateProduct,
	deleteProduct,
	getLatest,
	getAllProduct,
	setStatus,
	postFeaturedProducts,
	update,
	updateFeaturedProducts,
	deleteImage,
	deleteFeaturedImage,
} from './Ecommerce_controller';
import { upload } from '../../util/s3-spaces';
import { protect } from '../../util/auth';

const router = Router();
let cpUpload = upload.fields([
	{ name: 'featuredImage', maxCount: 1 },
	{ name: 'images', maxCount: 9 },
]);
router.route('/').get(getProducts).post(protect, cpUpload, addProduct);
router.route('/all').get(getAllProduct);
router.route('/new').get(getLatest);
router
	.route('/addFeature')
	.post(protect, upload.single('image'), postFeaturedProducts);
router.route('/updateFeature/:id').put(updateFeaturedProducts);
router
	.route('/:id')
	.get(getProductById)
	.patch(protect, cpUpload, updateProduct)
	.delete(protect, deleteProduct);
router.route('/setStatus/:id').post(setStatus);
router.route('/updateDocuments').post(update);
router.route('/deleteImage/:id').delete(deleteImage);

router.route('/deleteFeaturedImage/:id').delete(deleteFeaturedImage);
export default router;
