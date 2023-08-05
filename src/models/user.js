const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
	firstName: String,
	lastName: String,
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	street: String,
	suburb: String,
	state: String,
	postcode: String,
	mobile: String,
	isAdmin: Boolean,
	// List of classes the user has signed up for. Each class is referenced by its ID
	savedClasses: [{ type: mongoose.Types.ObjectId, ref: "Class" }],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
