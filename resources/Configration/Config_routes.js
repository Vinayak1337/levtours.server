import { Router } from 'express';
import { Config } from './Config_model';
import {
	addAddress,
	addGST,
	addSocialMedia,
	deleteConfig,
	getConfig,
} from './Config_controller';
import { protect } from '../../util/auth';

const router = Router();

router.route('/gst').post(protect, addGST);
router.route('/social').post(protect, addSocialMedia);
router.route('/address').post(protect, addAddress);
router.route('/').get(getConfig).delete(protect, deleteConfig);

export default router;
