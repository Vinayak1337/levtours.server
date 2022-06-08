import {
	Passengers,
	Passengers1,
	Passengers2,
	Passengers3,
	Passengers4
} from './Passengers.model';

export const passengerHandler = (req, res) => {
	if (!req.user)
		return res.status(401).json({ message: 'User is not authorized' });

	const { parent, data, isNew = 'false' } = req.query;
	if (!data || !Number(data))
		return res.status(400).send({ error: 'Data is required query field' });

	if (Number(data) > 4 || Number(data) < 1)
		return res
			.status(400)
			.send({ error: 'Data query field must be between 1 and 4' });

	if (!parent || parent === 'null')
		return createPassenger(req, res, Number(data));

	return updatePassenger(req, res, Number(data), parent, isNew);
};

const createPassenger = async (req, res, data) => {
	try {
		const passenger = await Passengers.create({ dataEntries: 0 });
		let passengerData;

		switch (data) {
			case 1:
				passengerData = await Passengers1.create({
					parent: passenger._id,
					...req.body,
					photo: req.files?.photo?.map(file => file?.location)[0]
				});
				break;

			case 2:
				passengerData = await Passengers2.create({
					parent: passenger._id,
					...req.body
				});
				break;

			case 3:
				passengerData = await Passengers3.create({
					parent: passenger._id,
					...req.body
				});
				break;

			case 4:
				passengerData = await Passengers4.create({
					parent: passenger._id,
					...req.body,
					returnTicket: req.files?.returnTicket?.map(file => file?.location)[0],
					hotelBooking: req.files?.hotelBooking?.map(file => file?.location)[0],
					insurance: req.files?.insurance?.map(file => file?.location)[0],
					financial: req.files?.financial?.map(file => file?.location)[0],
					passportFirstPage: req.files?.passportFirstPage?.map(
						file => file?.location
					)[0],
					passportSecondPage: req.files?.passportSecondPage?.map(
						file => file?.location
					)[0]
				});
				break;
		}
		passenger[`data${data}`] = passengerData._id;
		passenger.dataEntries += 1;
		await passenger.save();

		res.status(200).send(passengerData);
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: error.message });
	}
};

const updatePassenger = async (req, res, data, parent, isNew) => {
	isNew = isNew === 'true';

	try {
		const passengers = await Passengers.findById(parent);
		let passengerData;

		switch (data) {
			case 1:
				{
					if (isNew) {
						passengerData = await Passengers1.create({
							parent,
							...req.body,
							photo: req.files?.photo?.map(file => file?.location)[0]
						});
						break;
					}
					const updateObj = { ...req.body };
					const photo = req.files?.photo?.map(file => file?.location)[0];
					if (photo) updateObj.photo = photo;

					passengerData = await Passengers1.findByIdAndUpdate(
						passengers.data1,
						updateObj
					);
				}
				break;

			case 2:
				{
					if (isNew) {
						passengerData = await Passengers2.create({
							parent,
							...req.body
						});
						break;
					}
					passengerData = await Passengers2.findByIdAndUpdate(
						passengers.data2,
						{
							...req.body
						}
					);
				}
				break;

			case 3:
				{
					if (isNew) {
						passengerData = await Passengers3.create({
							parent,
							...req.body
						});
						break;
					}
					passengerData = await Passengers3.findByIdAndUpdate(
						passengers.data3,
						{
							...req.body
						}
					);
				}
				break;

			case 4:
				{
					if (isNew) {
						passengerData = await Passengers4.create({
							parent,
							...req.body,
							returnTicket: req.files?.returnTicket?.map(
								file => file?.location
							)[0],
							hotelBooking: req.files?.hotelBooking?.map(
								file => file?.location
							)[0],
							insurance: req.files?.insurance?.map(file => file?.location)[0],
							financial: req.files?.financial?.map(file => file?.location)[0],
							passportFirstPage: req.files?.passportFirstPage?.map(
								file => file?.location
							)[0],
							passportSecondPage: req.files?.passportSecondPage?.map(
								file => file?.location
							)[0]
						});
						break;
					}
					const updateObj = { ...req.body };

					const properties = [
						'returnTicket',
						'hotelBooking',
						'insurance',
						'financial',
						'passportFirstPage',
						'passportSecondPage'
					];
					for (const property of properties) {
						const file = req.files?.[property]?.map(file => file?.location)[0];
						if (file) updateObj[property] = file;
					}

					passengerData = await Passengers4.findByIdAndUpdate(
						passengers.data1,
						updateObj
					);
				}
				break;
		}

		if (isNew)
			await Passengers.findByIdAndUpdate(parent, {
				[`data${data}`]: passengerData._id,
				$inc: { dataEntries: 1 }
			});

		res.status(200).send(passengerData);
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: error.message });
	}
};

export const getPassenger = async (req, res) => {
	try {
		if (!req.user)
			return res.status(401).json({ message: 'User is not authorized' });

		let { data, parent } = req.query;
		data = Number(data);

		if (!data)
			return res.status(400).json({ message: 'Data field is required.' });

		if (data > 4 || data < 1)
			return res
				.status(400)
				.send({ error: 'Data query field must be between 1 and 4' });

		if (!parent)
			return res.status(400).json({ message: 'Parent field is required.' });

		const passenger = await Passengers.findById(parent).populate(`data${data}`);
		if (!passenger)
			return res
				.status(404)
				.json({ message: 'Passenger not found by given parent id' });

		res.status(200).send(passenger[`data${data}`]);
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: error.message });
	}
};

export const getSpecificPassenger = async (req, res) => {
	try {
		if (!req.user)
			return res.status(401).json({ message: 'User is not authorized' });

		const { id } = req.params;

		if (!id) return res.status(400).json({ message: 'Id field is required.' });

		const passenger = await Passengers.findById(id)
			.populate('data1')
			.populate('data2')
			.populate('data3')
			.populate('data4');

		if (!passenger)
			return res
				.status(404)
				.json({ message: 'Passenger not found by given parent id' });

		res.status(200).send(passenger);
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: error.message });
	}
};

export const getPassengers = async (req, res) => {
	let { page, limit } = req.query;

	if (!(page || limit))
		return res.status(400).json({
			message: 'Request was reject.',
			reason: 'Both page and limit are required fields.'
		});

	page = page * 1;
	limit = limit * 1;
	let limitVal = limit;
	let skipValue = (page - 1) * limitVal;

	try {
		const totalPassengers = await Passengers.countDocuments();
		const passengers = await Passengers.find()
			.limit(limitVal)
			.sort({ createdAt: -1 })
			.skip(skipValue);

		if (!totalPassengers)
			return res.status(404).json({
				message: 'No products found.',
				reason: 'Products were not added from the admin panel.'
			});

		res.status(200).json({
			totalPassengers,
			pageResult: products.length,
			passengers
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({ message: e.message });
	}
};
