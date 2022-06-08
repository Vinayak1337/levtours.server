import { Language } from './langauge.model';

const getLanguagesList = async (req, res) => {
	try {
		const doc = await Language.find({});
		res.json({ status: 'OK', data: doc });
	} catch (e) {
		console.log(e.message);
		res.status(500).json({ message: e.message });
	}
};

export { getLanguagesList };
