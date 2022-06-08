import mongoose from 'mongoose';

const { Schema, model, SchemaTypes } = mongoose;

const PassengersSchema1 = new Schema(
	{
		parent: {
			type: SchemaTypes.ObjectId,
			ref: 'Passengers',
			required: true
		},
		photo: {
			type: String,
			required: true
		},
		surname: {
			type: String,
			required: true
		},
		otherSurname: {
			type: String,
			required: false
		},
		name: {
			type: String,
			required: true
		},
		dateOfBirth: {
			type: String,
			required: true
		},
		placeOfBirth: {
			type: String,
			required: true
		},
		citizenship: {
			type: String,
			required: true
		},
		gender: {
			type: String,
			required: true
		},
		maritalStatus: {
			type: String,
			required: true
		},
		mealPreference: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

const PassengersSchema2 = new Schema(
	{
		parent: {
			type: SchemaTypes.ObjectId,
			ref: 'Passengers',
			required: true
		},
		contact: {
			type: String,
			required: true
		},
		passportType: {
			type: String,
			required: true
		},
		passportNumber: {
			type: String,
			required: true
		},
		issueDate: {
			type: String,
			required: true
		},
		expiryDate: {
			type: String,
			required: true
		},
		issuedBy: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

const PassengersSchema3 = new Schema(
	{
		parent: {
			type: SchemaTypes.ObjectId,
			ref: 'Passengers',
			required: true
		},
		address: {
			type: String,
			required: true
		},
		email: {
			type: String,
			required: true
		},
		telephoneNumber: {
			type: Number,
			required: true
		}
	},
	{ timestamps: true }
);

const PassengersSchema4 = new Schema(
	{
		parent: {
			type: SchemaTypes.ObjectId,
			ref: 'Passengers',
			required: true
		},
		purposeOfStay: {
			type: String,
			required: true
		},
		entries: {
			type: String,
			required: true
		},
		stayFrom: {
			type: String,
			required: true
		},
		stayUntil: {
			type: String,
			required: true
		},
		returnTicket: {
			type: String,
			required: true
		},
		hotelBooking: {
			type: String,
			required: true
		},
		insurance: {
			type: String,
			required: true
		},
		financial: {
			type: String,
			required: true
		},
		passportFirstPage: {
			type: String,
			required: true
		},
		passportSecondPage: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

const PassengersSchema = new Schema(
	{
		data1: {
			type: SchemaTypes.ObjectId,
			ref: 'PassengersData1'
		},
		data2: {
			type: SchemaTypes.ObjectId,
			ref: 'PassengersData2'
		},
		data3: {
			type: SchemaTypes.ObjectId,
			ref: 'PassengersData3'
		},
		data4: {
			type: SchemaTypes.ObjectId,
			ref: 'PassengersData4'
		},
		dataEntries: {
			type: Number,
			required: true
		}
	},
	{ timestamps: true }
);

export const Passengers1 = model('PassengersData1', PassengersSchema1);
export const Passengers2 = model('PassengersData2', PassengersSchema2);
export const Passengers3 = model('PassengersData3', PassengersSchema3);
export const Passengers4 = model('PassengersData4', PassengersSchema4);
export const Passengers = model('Passengers', PassengersSchema);
