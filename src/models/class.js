const mongoose = require('mongoose');

const ClassSchema = mongoose.Schema({
	title: String,
	date: Date,
	trainer: String,
	description: String,
	participantList: [{type: mongoose.Types.ObjectId, ref: 'User'}]
})

const Class = mongoose.model('Class', ClassSchema);

module.exports = Class;