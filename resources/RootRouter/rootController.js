export const addContactRequest = async (req, res) => {
	const props = ['name', 'email', 'phoneNumber', 'subject', 'message'];
	const requiredFields = [];

	for (const prop of props) if (!(prop in req.body)) requiredFields.push(prop);

	if (requiredFields.length)
		return res
			.status(400)
			.json({ message: 'Missing required fields.', details: { requiredFields } });

	const Contact = req.contactModel;

	try {
		const contact = await Contact.create({ ...req.body });
		res.status(200).json(contact);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};
