const Class = require("../models/class");
const User = require("../models/user");
const moment = require("moment-timezone");
const {
	checkForTimeOverlap,
	handleError,
	parseAndValidateDate,
} = require("../services/utilities");

// Retrieve classes. If a trainer name is provided as a query parameter, it filters classes by that trainer.
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
		handleError(error, response);
	}
};

// Fetch a specific class using the class ID provided in the request URL.
const getClassByID = async (request, response) => {
	try {
		if (!request.params || !request.params.id) {
			return response
				.status(400)
				.json({ error: "Class ID parameter is missing" });
		}

		const foundClass = await Class.findById(request.params.id);

		if (foundClass) {
			response.json(foundClass);
		} else {
			response.status(404);
			response.json({ error: "Class ID not found" });
		}
	} catch (error) {
		handleError(error, response);
	}
};

// Create a new class. The function validates date and time, checks for overlaps, and then adds the new class to the database.
const createClass = async (request, response) => {
	try {
		if (!request.body) {
			return response.status(400).json({ error: "Request body is missing" });
		}

		const { title, startTime, endTime, trainer, description } = request.body;

		// Validate necessary fields
		if (!title || !startTime || !endTime) {
			return response.status(400).json({
				error: "Missing required fields: title, startTime, endTime.",
			});
		}

		// Validate and parse dates
		const startDate = parseAndValidateDate(
			startTime,
			"startTime",
			"Australia/Brisbane"
		);
		const endDate = parseAndValidateDate(
			endTime,
			"endTime",
			"Australia/Brisbane"
		);

		// Ensure that the class end time is after the start time
		if (endDate <= startDate) {
			return response
				.status(400)
				.json({ error: "endTime must be after startTime." });
		}

		// Ensure there's no overlap with other classes
		const isOverlap = await checkForTimeOverlap(startDate, endDate);
		if (isOverlap) {
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
		handleError(error, response);
	}
};

// Update details of an existing class identified by its ID. This function supports partial updates,
// so only fields provided in the request body will be updated.
const updateClassDetails = async (request, response) => {
	try {
		const { startTime: startTimeStr, endTime: endTimeStr } = request.body;

		let startTime, endTime;

		// If startTime is provided, validate and parse it.
		if (startTimeStr) {
			startTime = parseAndValidateDate(
				startTimeStr,
				"startTime",
				"Australia/Brisbane"
			);
		}

		// If endTime is provided, validate and parse it.
		if (endTimeStr) {
			endTime = parseAndValidateDate(
				endTimeStr,
				"endTime",
				"Australia/Brisbane"
			);
		}

		// Check if endTime is after startTime if both are provided.
		if (startTime && endTime && endTime <= startTime) {
			return response
				.status(400)
				.json({ error: "endTime must be after startTime." });
		}

		// Check for class time overlap only if both startTime and endTime are provided.
		if (
			startTime &&
			endTime &&
			(await checkForTimeOverlap(startTime, endTime))
		) {
			return response
				.status(400)
				.json({ error: "Class time overlaps with an existing class." });
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
		handleError(error, response);
	}
};

// Allow a user (identified by the JWT) to sign up for a class (identified by its ID).
// This updates both the user's saved classes list and the class's participant list.
const classSignup = async (request, response) => {
	// User ID retrieved from JWT
	let userId = request.user.user_id;
	// Class ID Retrieved from URL
	let classId = request.params.id;

	try {
		// Update user record to include the class ID in their saved classes
		await User.findByIdAndUpdate(userId, {
			$addToSet: { savedClasses: classId }, // If the user is already signed up for a class, addtoSet will prevent duplication
		});
		// Update class record to include the user ID in its participants list
		await Class.findByIdAndUpdate(classId, {
			$addToSet: { participantList: userId }, // If class already has user in participant list, addtoSet will prevent duplication
		});
		response.json({
			message:
				"Class saved to user profile successfully. Class participant list also updated.",
		});
	} catch (error) {
		handleError(error, response);
	}
};

// Delete a class based on its ID and also update all user records to remove this class from their saved lists.
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
		handleError(error, response);
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
