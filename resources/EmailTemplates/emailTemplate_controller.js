import { Email } from './emailTemplate_model';
export const addEmail = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const email = new Email(req.body);
	try {
		const data = await email.save();
		res.status(200).json({ message: 'Success', data: data });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
export const updateEmail = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const id = req.params.id;
	const queryObj = req.body;

	try {
		const data = await Email.findByIdAndUpdate(id, queryObj, {
			new: true
		});
		res.status(200).json({ message: 'Success', data: data });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
export const suspendEmail = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const id = req.params.id;
	try {
		const data = await Email.findByIdAndUpdate(id, { status: false });
		res.status(200).json({ message: 'Success' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
export const getEmails = async (req, res, next) => {
	// let { page, limit } = req.query;
	// page = page * 1;
	// limit = limit * 1;
	// let limitVal = limit;
	// let skipeValue = (page - 1) * limitVal;
	try {
		const totalRecords = await Email.countDocuments();
		const data = await Email.find().sort({ createdAt: -1 });
		// .limit(limitVal)
		// .skip(skipeValue);
		res
			.status(200)
			.json({ message: 'Success', Email: data, totalRecords: totalRecords });
		next();
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const getEmail = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await Email.findOne({ _id: id }).sort({ createdAt: -1 });
		res.status(200).json({ message: 'Success', Email: data });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
// export const getEmailByUrl = async (req, res) => {
//   try {
//     const data = await Email.findOne({ url: req.body.url });
//     res.status(200).json({ message: "Success", Email: data });
//   } catch (error) {
//     res.status(500).json({ message: error.message,  });
//   }
// };
