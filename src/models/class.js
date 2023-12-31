const mongoose = require("mongoose");

const ClassSchema = mongoose.Schema({
	title: String,
	description: String,
	startTime: Date,
	endTime: Date,
	trainer: String,
	// List of participants registered for the class. Each participant is referenced by their User ID
	participantList: [{ type: mongoose.Types.ObjectId, ref: "User" }], 
});

const Class = mongoose.model("Class", ClassSchema);

module.exports = Class;
