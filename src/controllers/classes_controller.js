const Class = require('../models/class');
const User = require('../models/user');
const moment = require('moment-timezone');

const getAllClasses = async (request, response) => {
	try {
	  let classes;

	  // Check if 'trainer' query parameter exists in the request, then search by trainer
	  if ('trainer' in request.query) {
		const trainerName = request.query.trainer;
		classes = await Class.find({ trainer: trainerName });
	  } else {
		classes = await Class.find();
	  }
  
	  response.send(classes);
	} catch (error) {
	  console.error('Error while accessing data:', error.message);
	  response.status(500).json({ error: 'Error while retrieving classes' });
	}
  };
  


  


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

// const createClass = async  (request, response) => {

// 	let newClass = new Class({
// 		title: request.body.title,
// 		startTime: request.body.startTime,
// 		endTime: request.body.endTime,
// 		trainer: request.body.trainer,
// 		description: request.body.description,
// 		participantList: []
// 	});
// 	await newClass.save();
// 	response.status(201);
// 	response.json(newClass);
// }


const createClass = async (request, response) => {
    try {
        const { title, startTime, endTime, trainer, description } = request.body;
        
        // Validate necessary fields
        if (!title || !startTime || !endTime) {
            return response.status(400).json({ message: 'Missing required fields: title, startTime, endTime.' });
        }

        // Validate date format
        const startDate = moment.tz(startTime, 'Australia/Brisbane').toDate();
        const endDate = moment.tz(endTime, 'Australia/Brisbane').toDate();
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return response.status(400).json({ message: 'Invalid date format. startTime and endTime must be valid dates. YYYY-MM-DDTHH:MM:SS. E.g. 2023-08-01T08:30:00' });
        }

        // Check if endTime is after startTime
        if (endDate <= startDate) {
            return response.status(400).json({ message: 'endTime must be after startTime.' });
        }
        
        // Check for class time overlap
        const overlapClass = await Class.findOne({
            $or: [
                { startTime: { $lte: endDate }, endTime: { $gte: startDate } }
            ]
        });
        if (overlapClass) {
            return response.status(400).json({ message: 'Class time overlaps with an existing class.' });
        }
        
        let newClass = new Class({
            title: title,
            startTime: startDate,
            endTime: endDate,
            trainer: trainer,
            description: description,
            participantList: []
        });
        await newClass.save();
		response.status(201).json({ message: 'Class successfully created', class: newClass });
    } catch (error) {
        console.error(error);
        response.status(500).json({ message: 'Server Error' });
    }
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
	let classId = request.params.id;

	try {
		await User.findByIdAndUpdate(userId, { $addToSet: { savedClasses: classId } });
		await Class.findByIdAndUpdate(classId, { $addToSet: { participantList: userId } });
		response.status(201)
		response.json({ message: "Class saved to user profile successfully. Class participant list also updated."});
	} catch (error) {
		response.status(500)
		response.json({ error: "Failed to save class."});
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


module.exports = {getAllClasses, getClassByID, createClass, updateClass, classSignup, deleteAllClasses, deleteClass};