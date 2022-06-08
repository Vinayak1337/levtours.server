import { Router } from 'express';
import {
	getPassenger,
	passengerHandler,
	getSpecificPassenger,
	getPassengers
} from './Passengers.controller';
import { upload } from '../../util/s3-spaces';

const passengersRouter = Router();

const uploadFields = upload.fields([
	{ name: 'photo', maxCount: 1 },
	{ name: 'returnTicket', maxCount: 1 },
	{ name: 'hotelBooking', maxCount: 1 },
	{ name: 'insurance', maxCount: 1 },
	{ name: 'financial', maxCount: 1 },
	{ name: 'passportFirstPage', maxCount: 1 },
	{ name: 'passportSecondPage', maxCount: 1 }
]);

passengersRouter
	.route('/')
	.get(getPassenger)
	.post(uploadFields, passengerHandler);

passengersRouter.route('/query', getPassengers);

passengersRouter.route('/:id').get(getSpecificPassenger);

export default passengersRouter;
