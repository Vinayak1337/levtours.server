import { Contact } from './contact_model';
export const addContact = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const contact = new Contact({
		...req.body,
		status: true
	});
	try {
		const data = await contact.save();
		res.status(200).json({ message: 'Success', data: data });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const deleteContact = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	const id = req.params.id;
	try {
		const data = await Contact.findByIdAndDelete(id);
		res.status(200).json({ message: 'Success' });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
export const getContacts = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}
	let { page, limit } = req.query;
	page = page * 1;
	limit = limit * 1;
	let limitVal = limit;
	let skipeValue = (page - 1) * limitVal;
	try {
		const totalRecords = await Contact.countDocuments();
		const data = await Contact.find()
			.sort({ createdAt: -1 })
			.limit(limitVal)
			.skip(skipeValue);
		res
			.status(200)
			.json({ message: 'Success', Contact: data, totalRecords: totalRecords });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
export const getPaticularContact = async (req, res) => {
	if (!req.user) {
		return res.status(400).json({ message: 'User Not Found' });
	}

	try {
		const data = await Contact.findById(req.params.id);
		res.status(200).json({ message: 'Success', Contact: data });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
