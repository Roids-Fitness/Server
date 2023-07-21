const mongoose = require('mongoose');

const ClassSchema = mongoose.Schema({
	title: String,
	date: Date,
	time: String,
	trainer: String,
	description: String,
	participantList: String
})

const Class = mongoose.model('Class', ClassSchema);

module.exports = Class;