const Class = require('../models/class');


const getClasses = (request, response) => {
	response.json({
		message: "List of classes goes here"
	});
};
const getClassTimetable = (request, response) => {
	response.json({
		message: "Class timetable page"
	});
}

const getClassByID = async (request, response) => {
    try {
        let foundClass = await Class.findById(request.params.id);
        if (foundClass) {
            response.json(foundClass);
        } else {
            response.json({ error: "Class ID not found" });
			response.status(404);
        }
    } catch (error) {
        console.log("Error while accessing data:\n" + error);
        response.status(404);
    }
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

const updateClass = async (request, response) => {

	let updatedClass = await Class.findByIdAndUpdate(request.params.id, request.body, {new: true})
								.catch(error => {
									console.log("Error while accessing data:\n" + error);
								});
	if (updateClass) {
		response.send(updatedClass);
	} else {
		response.json({error: "Class ID not found"});
		response.status(404);
	}
}

const deleteAllClasses = async (request, response) => {
	await Class.deleteMany({});
	response.json({
		message: "All classes deleted"
	});
};

const deleteClass = async (request, response) => {
	classToDelete = await Class.findByIdAndDelete(request.params.id)
								.catch(error => {
									console.log("Error while accessing data:\n" + error);
								});
	if (classToDelete) {
		response.json("Class deleted");
	} else {
		response.json({error: "Class ID not found"});
	}
};


module.exports = {getClasses, getClassByID, getClassTimetable, createClass, updateClass, deleteAllClasses, deleteClass};