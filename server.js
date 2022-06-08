// packages
import express, { urlencoded, json } from 'express';
import morgan from 'morgan';
import { config } from 'dotenv';
import cors from 'cors';
import expressListRoutes from 'express-list-routes';
// module
import path from 'path';
import { Order } from './resources/Order/Order_model';
import { Cart } from './resources/Cart/cart_model';
import { signup, signin, protect } from './util/auth.js';
import { User } from './resources/user/user.model.js';
import UserRouter from './resources/user/user.router.js';
import CategoryRouter from './resources/Category/Category_routes.js';
import ProductRouter from './resources/Ecommerce/ecommerce.router.js';
import TaxRouter from './resources/Tax/tax_routes.js';
import PageRouter from './resources/Pages/page_routes.js';
import CartRouter from './resources/Cart/cart_routes.js';
import OrderRouter from './resources/Order/Order_router.js';
import ShippingRouter from './resources/Shipping/shipping_routes.js';
import ConfigRouter from './resources/Configration/Config_routes.js';
import FeatureRouter from './resources/Featured/FeaturedProduct_routes.js';
import AddressRouter from './resources/Address/address_routes.js';
import WishListRouter from './resources/Wishlist/wishlist_routes.js';
import ContactRouter from './resources/Contact/contact_routes.js';
import CouponRouter from './resources/Coupon/Coupon_router.js';
import EmailRouter from './resources/EmailTemplates/emailTemplate_routes';
import { connect } from './util/db.js';
import { SECRETS } from './util/config.js';
import { getUserById } from './util/grabUserbyId.js';
import {
	getProducts,
	getProductById
} from './resources/Ecommerce/Ecommerce_controller.js';
import { view as viewCategories } from './resources/Category/Category_controller.js';
import swaggerUi from 'swagger-ui-express';
import specs from './swagger.json';
import { rootRouter } from './resources/RootRouter/rootRouter.js';
import { Contact } from './resources/Contact/contact_model.js';
import blogRouter from './resources/Blog/blog.router';
import passengersRouter from './resources/Passengers/Passengers.router';

config();
const app = express();
const PORT = process.env.PORT || 5000;
export const userModel = (req, _res, next) => {
	req.model = User;
	next();
};

export const rootModel = (req, _res, next) => {
	req.userModel = User;
	req.contactModel = Contact;
	next();
};

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.post('/signup', userModel, signup);
app.post('/signin', userModel, signin);
app.use('/', rootModel, rootRouter);
app.use('/api/user', userModel, protect, UserRouter);
app.get('/products/:username/', getUserById, getProducts);
app.get('/products/:username/:id', getUserById, getProductById);
app.get('/categories/:username', getUserById, viewCategories);
app.use('/api/category', userModel, CategoryRouter);
app.use('/api/product', userModel, ProductRouter);
app.use('/api/cart', userModel, protect, CartRouter);
app.use('/api/wishList', userModel, protect, WishListRouter);
app.use('/api/config', userModel, ConfigRouter);
app.use('/api/featured', userModel, FeatureRouter);
app.use('/api/coupon', userModel, CouponRouter);
app.use('/api/order', userModel, OrderRouter);
app.use('/api/tax', userModel, protect, TaxRouter);
app.use('/api/page', userModel, PageRouter);
app.use('/api/shipping', userModel, protect, ShippingRouter);
app.use('/api/address', userModel, protect, AddressRouter);
app.use('/api/contact', userModel, protect, ContactRouter);
app.use('/api/email', userModel, protect, EmailRouter);
app.use('/api/blogs', userModel, blogRouter);
app.use('/api/passengers', userModel, protect, passengersRouter);

const __dirname = path.resolve();
//We are using request for making an HTTP/HTTPS call to payumoney server
app.post('/payment-success', async (req, res) => {
	console.log(req.body);
	const { txnid, udf1 } = req.body;

	await Order.findOneAndUpdate(
		{ _id: txnid },
		{
			$set: {
				payment: true
			}
		},
		{
			new: true
		}
	);
	await Cart.findOneAndDelete({ user: udf1 });

	res.redirect(`${URL}/payment-success/${txnid}`);
});
app.post('/payment-failure', async (req, res) => {
	console.log(req.body);

	res.sendFile(path.join(__dirname, '/failure.html'));
});

export const start = async () => {
	try {
		await connect();
		app.listen(PORT, () => {
			if (SECRETS.node_env === 'development') {
				expressListRoutes(app);
			}
			console.log(`REST API on http://localhost:${PORT}/`);
		});
	} catch (e) {
		console.error(e);
	}
};
