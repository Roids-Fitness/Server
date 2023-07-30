const Class = require('../models/class');


const getClasses = (request, response) => {
	response.json({
		message: "List of classes goes here"
	});
};

const createClass = async  (request, response) => {

	let newClass = new Class({
		title: request.body.title,
		date: request.body.date,
		trainer: request.body.trainer,
		description: request.body.description,
		participantList: []
	});
	await newClass.save();
	response.status(201);
	response.json(newClass);
}



module.exports = {getClasses, createClass};