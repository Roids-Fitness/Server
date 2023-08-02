const Class = require('../models/class');
const User = require('../models/user');


const getClasses = async (request, response) => {
	let classes;

	// Check if 'trainer' query paramter exists in the request, then search by trainer
	if ('trainer' in request.query) {
		const trainerName = request.query.trainer;
		classes = await Class.find({ trainer: trainerName });
	} else {
		classes = await Class.find();
	}

	response.send(classes);
};

const getMyClasses = async (request, response) => {
	let user = await User.findOne({email: request.body.email}).populate('classes');
	request.send(user.classes);
}

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
		startTime: request.body.startTime,
		endTime: request.body.endTime,
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
};


// Save class ID to user and update class participant list
const classSignup = async (request, response) => {
	let userId = request.user.user_id;
	let classId = request.params.classId;

	try {
		await User.findByIdAndUpdate(userId, { $addToSet: { savedClasses: classId } });
		response.status(201)
		.json({ message: "Class saved to user profile successfully."});
	} catch (error) {
		response.status(500)
		.json({ error: "Failed to save class."});
	}
};


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


module.exports = {getClasses, getMyClasses, getClassByID, getClassTimetable, createClass, updateClass, classSignup, deleteAllClasses, deleteClass};