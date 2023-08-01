const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	firstName: String,
	lastName: String,
	mobile: String,
	street: String,
	suburb: String,
	state: String,
	postcode: String,
	isAdmin: Boolean,
	savedClasses: [{type: mongoose.Types.ObjectId, ref: 'Class'}]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;