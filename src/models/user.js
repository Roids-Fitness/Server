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
	phone: String,
	isAdmin: Boolean,
	savedClasses: [{type: mongoose.Types.ObjectId, ref: 'Class'}]
});

const User = mongoose.model('User', UserSchema);

module.exports = User;