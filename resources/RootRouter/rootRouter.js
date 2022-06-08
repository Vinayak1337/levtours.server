import { Router } from 'express';
import { addContactRequest } from './rootController';

export const rootRouter = Router();

rootRouter.route('/').get((_req, res) => {
	res.json('Server is Running');
});

rootRouter.route('/contact').post(addContactRequest);
