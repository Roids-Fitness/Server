const Class = require("../models/class");
const User = require("../models/user");
const moment = require("moment-timezone");

// Retrieve all classes, or classes by a specific trainer if query parameter is provided
const getAllClasses = async (request, response) => {
	try {
		let classes;

		// Check if 'trainer' query parameter exists in the request, then search by trainer
		if ("trainer" in request.query) {
			const trainerName = request.query.trainer;
			classes = await Class.find({ trainer: trainerName });
		} else {
			classes = await Class.find();
		}

		response.send(classes);
	} catch (error) {
		console.error("Error while accessing data:\n" + error);
		response.status(500).json({ error: "Error while retrieving classes" });
	}
};

// Retrieve a class by its ID, with class ID found in URL. 
const getClassByID = async (request, response) => {
	try {
		const foundClass = await Class.findById(request.params.id);
		if (foundClass) {
			response.json(foundClass);
		} else {
			response.status(404);
			response.json({ error: "Class ID not found" });
		}
	} catch (error) {
		console.error("Error while accessing data:\n" + error);
		response.status(500).json({ error: "Internal Server Error" });
	}
};

// Create a new class with given details
const createClass = async (request, response) => {
	try {
		const { title, startTime, endTime, trainer, description } = request.body;

		// Validate necessary fields
		if (!title || !startTime || !endTime) {
			return response
				.status(400)
				.json({
					error: "Missing required fields: title, startTime, endTime.",
				});
		}

		// Validate date format
		const startDate = moment.tz(startTime, "Australia/Brisbane").toDate();
		const endDate = moment.tz(endTime, "Australia/Brisbane").toDate();
		if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
			return response
				.status(400)
				.json({
					error:
						"Invalid date format. startTime and endTime must be valid dates. YYYY-MM-DDTHH:MM:SS. E.g. 2023-08-01T08:30:00",
				});
		}

		// Ensure that the class end time is after the start time
		if (endDate <= startDate) {
			return response
				.status(400)
				.json({ error: "endTime must be after startTime." });
		}

		// Ensure there's no overlap with other classes
		const overlapClass = await Class.findOne({
			$or: [{ startTime: { $lte: endDate }, endTime: { $gte: startDate } }],
		});
		if (overlapClass) {
			return response
				.status(400)
				.json({ error: "Class time overlaps with an existing class." });
		}
		// Create new class instance and save to database
		let newClass = new Class({
			title: title,
			startTime: startDate,
			endTime: endDate,
			trainer: trainer,
			description: description,
			participantList: [],
		});
		await newClass.save();
		response
			.status(201)
			.json({ message: "Class successfully created", class: newClass });
	} catch (error) {
		console.error(error);
		response.status(500).json({ error: "Internal Server Error" });
	}
};

// Update the class details using the given data i.e. Title, Description, Start/End time
// Any field in request.body can be used as only admin users will be able to update classes.
const updateClassDetails = async (request, response) => {
	try {
		const { startTime: startTimeStr, endTime: endTimeStr } = request.body;

		let startTime, endTime;
		if (startTimeStr) {
			startTime = moment.tz(startTimeStr, "Australia/Brisbane").toDate();
			if (isNaN(startTime.getTime())) {
				return response.status(400).json({
					error:
						"Invalid startTime format. It must be a valid date. YYYY-MM-DDTHH:MM:SS. E.g. 2023-08-01T08:30:00",
				});
			}
		}

		if (endTimeStr) {
			endTime = moment.tz(endTimeStr, "Australia/Brisbane").toDate();
			if (isNaN(endTime.getTime())) {
				return response.status(400).json({
					error:
						"Invalid endTime format. It must be a valid date. YYYY-MM-DDTHH:MM:SS. E.g. 2023-08-01T08:30:00",
				});
			}
		}

		// Check if endTime is after startTime if both are provided
		if (startTime && endTime && endTime <= startTime) {
			return response
				.status(400)
				.json({ error: "endTime must be after startTime." });
		}

		// Check for class time overlap only if both startTime and endTime are provided
		if (startTime && endTime) {
			const overlapClass = await Class.findOne({
				$or: [{ startTime: { $lte: endTime }, endTime: { $gte: startTime } }],
			});

			if (overlapClass) {
				return response
					.status(400)
					.json({ error: "Class time overlaps with an existing class." });
			}
		}

		let updatedClass = await Class.findByIdAndUpdate(
			request.params.id,
			request.body,
			{ new: true }
		);

		if (updatedClass) {
			response.json({
				message: "Class successfully updated!",
				class: updatedClass,
			});
		} else {
			response.status(404).json({ error: "Class ID not found" });
		}
	} catch (error) {
		console.error("Error while accessing data:\n" + error);
		response.status(500).json({ error: "Internal Server Error" });
	}
};

// Allow a user to sign up for a class, updating both the user and class records.
const classSignup = async (request, response) => {
	// User ID retrieved from JWT
	let userId = request.user.user_id;
	// Class ID Retrieved from URL
	let classId = request.params.id;

	try {
		// Update user record to include the class ID in their saved classes
		await User.findByIdAndUpdate(userId, {
			$addToSet: { savedClasses: classId },
		});
		// Update class record to include the user ID in its participants list
		await Class.findByIdAndUpdate(classId, {
			$addToSet: { participantList: userId },
		});
		response.json({
			message:
				"Class saved to user profile successfully. Class participant list also updated.",
		});
	} catch (error) {
		console.error("Error while accessing data:\n" + error);
		response.status(500).json({ error: "Failed to save class." });
	}
};

// Delete a class based on the given class ID
const deleteClass = async (request, response) => {
	try {
		const classToDelete = await Class.findByIdAndDelete(request.params.id);

		// If the class is successfully deleted, remove its ID from any user's saved classes list
		if (classToDelete) {
			await User.updateMany(
				{ savedClasses: classToDelete._id },
				{ $pull: { savedClasses: classToDelete._id } }
			);

			response.json("Class deleted");
		} else {
			response.status(404).json({ error: "Class ID not found" });
		}
	} catch (error) {
		console.error("Error while accessing data:\n" + error);
		response.status(500).json({
			error: "An error occurred while deleting the class."
		});
	}
};

module.exports = {
	getAllClasses,
	getClassByID,
	createClass,
	updateClassDetails,
	classSignup,
	deleteClass,
};
