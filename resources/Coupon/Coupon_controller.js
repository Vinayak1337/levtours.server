import { Coupon } from './Coupon_model';

const getCoupons = async (req, res) => {
	try {
		let getCoupon = await Coupon.find();

		if (getCoupon.length) {
			return res.status(200).json({
				status: 'success',
				data: getCoupon,
			});
		}

		res
			.status(404)
			.json({ message: 'Coupons were not found', reason: 'No coupons were added' });
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};

const getCoupon = async (req, res) => {
	try {
		const { id } = req.params;

		const coupon = await Coupon.findById(id);

		if (!coupon)
			return res.status(404).json({
				message: 'Coupon was not found with given id',
				reason: 'Either the coupon was deleted or was not added',
			});

		return res.status(200).json({
			status: 'success',
			data: coupon,
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: error.message });
	}
};
const applyCoupon = async (req, res) => {
	try {
		const coupon = await Coupon.findOne({
			couponCode: req.body.couponCode,
			customerLimit: true,
		});
		if (coupon) {
			return res.status(200).json({
				status: 'success',
				data: coupon,
			});
		} else {
			return res.status(200).json({
				status: 'failed',
			});
		}
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};
const addCoupon = async (req, res) => {
	try {
		const {
			name,
			couponCode,
			offPercent,
			amountOff,
			shipping,
			appliesTo,
			limitUser,
			customerLimit,
			startDate,
			endDate,
			status,
		} = req.body;

		console.log(
			name,
			couponCode,
			offPercent,
			amountOff,
			shipping,
			appliesTo,
			limitUser,
			customerLimit,
			startDate,
			endDate,
			status,
		);

		let coupon_Name = await Coupon.find({ name });
		let coupon_Code = await Coupon.find({ couponCode });

		if (coupon_Code.length > 0 && coupon_Name.length > 0) {
			return res.status(400).json({
				status: 'failed',
				message: 'Coupon Code And Coupon Name Already Exists.',
			});
		}
		if (coupon_Code.length > 0) {
			return res.status(400).json({
				status: 'failed',
				message: 'Coupon Code Already Exists.',
			});
		}
		if (coupon_Name.length > 0) {
			return res.status(400).json({
				status: 'failed',
				message: 'Coupon Name Already Exists.',
			});
		}

		let createCoupon = await Coupon.create({
			name,
			couponCode,
			offPercent,
			amountOff,
			shipping,
			appliesTo,
			limitUser,
			customerLimit,
			startDate,
			endDate,
			status,
		});

		if (createCoupon) {
			return res.status(200).json({
				status: 'success',
				message: 'Created New Coupon!',
			});
		}
	} catch (error) {
		console.log(error);
	}
};

const deleteCoupon = async (req, res) => {
	const { id } = req.params;

	try {
		let response = await Coupon.findByIdAndDelete({ _id: id });
		if (response) {
			res.status(200).json({
				status: 'success',
				response,
			});
		}
	} catch (error) {
		res.status(404).json({
			status: 'failed',
			error,
		});
	}
};

const editCoupon = async (req, res) => {
	const { id } = req.params;

	try {
		const update = await Coupon.findByIdAndUpdate({ _id: id }, req.body, {
			new: true,
		});
		if (update) {
			res.status(200).json({
				status: 'success',
				data: update,
			});
		}
	} catch (error) {
		res.status(404).json({
			status: 'success',
			error,
		});
	}
};

export {
	getCoupons,
	addCoupon,
	getCoupon,
	deleteCoupon,
	editCoupon,
	applyCoupon,
};
