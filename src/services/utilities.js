const Class = require("../models/class");

// Utility function to handle internal server errors.
const handleError = (error, response, message = "Internal Server Error") => {
	console.error("Error while accessing data:\n" + error);
	response.status(500).json({ error: message });
};

// Utility function to check if there is an overlap of class start and end times.
const checkForTimeOverlap = async (startTime, endTime) => {
	try {
		const overlapClass = await Class.findOne({
			$or: [
				{ startTime: { $lte: endTime }, endTime: { $gte: startTime } },
				{ startTime: { $lt: endTime }, endTime: { $gte: endTime } },
				{ startTime: { $lte: startTime }, endTime: { $gt: startTime } },
			],
		});

		return overlapClass ? true : false;
	} catch (error) {
		console.error("Error while checking for class overlap:\n" + error);
		throw new Error("Error while checking for class overlap");
	}
};

// Utility function to parse and validate date strings.
const parseAndValidateDate = (dateStr, label, timezone) => {
	const parsedDate = moment.tz(dateStr, timezone).toDate();
	if (isNaN(parsedDate.getTime())) {
		throw new Error(
			`Invalid ${label} format. It must be a valid date. YYYY-MM-DDTHH:MM:SS. E.g. 2023-08-01T08:30:00`
		);
	}
	return parsedDate;
};



module.exports = {
	checkForTimeOverlap,
	parseAndValidateDate,
	handleError,
};
