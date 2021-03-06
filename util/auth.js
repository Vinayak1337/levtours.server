import { newToken, verifyToken } from './jwt';
import { Email } from './sendGrid';

const signup = async (req, res, next) => {
	const Model = req.model;
	if (
		!req.body.email ||
		!req.body.password ||
		!req.body.firstName ||
		!req.body.lastName
	) {
		return res.status(400).send({
			message: 'Required fields missing'
		});
	}
	const user = await Model.findOne({ email: req.body.email });
	if (user)
		return res
			.status(400)
			.send({ status: 'failed', message: 'Email is already in use' });
	else {
		try {
			const user = await Model.create(req.body);
			const token = newToken(user);
			Email(user.email, 'New User');

			return res.status(200).send({ status: 'ok', token: token });
		} catch (e) {
			console.log(e.message);
			if (e.toString().includes('E11000 duplicate key error collection')) {
				return res.status(400).send({
					status: `${
						collectionName === 'users' ? 'User' : 'Client'
					} Already Exists`
				});
			}
			return res
				.status(400)
				.send({ status: 'Error Communicating with server' });
		}
	}
};

const signin = async (req, res) => {
	const Model = req.model;

	if (!req.body.email || !req.body.password)
		return res.status(400).send({ message: 'Email and password required' });
	const user = await Model.findOne({ email: req.body.email }).exec();
	if (!user) {
		return res.status(400).send({ message: 'Invalid Email or Password' });
	}

	try {
		const match = await user.checkPassword(req.body.password);
		if (!match) {
			return res.status(401).send({ message: 'Invalid Credentials' });
		}
		const token = newToken(user);

		return res.status(200).send({ status: 'ok', token: token });
	} catch (e) {
		console.log(e);
		return res.status(401).send({ message: 'Not Authorized' });
	}
};

const protect = async (req, res, next) => {
	const Model = req.model;
	if (!req.headers.authorization) {
		return res.status(401).send({ message: 'User not authorized' });
	}
	let token = req.headers.authorization.split('Bearer ')[1];
	if (!token) {
		return res.status(401).send({ message: 'Token not found' });
	}
	try {
		const payload = await verifyToken(token);
		console.log(payload);
		const user = await Model.findById(payload.id)
			.populate({ path: 'subjects', select: '-addedBy -__v' })
			.populate({ path: 'languages', select: 'name' })
			.select('-password -identities')
			.lean()
			.exec();
		req.user = user;
		next();
	} catch (e) {
		console.log(e);
		return res.status(401).end();
	}
};

export { signup, signin, protect };
