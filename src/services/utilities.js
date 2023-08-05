const Class = require("../models/class");
const moment = require("moment-timezone");
/**
 * Handle internal server errors by logging the error and sending a response.
 * @param {Error} error - The error object.
 * @param {Object} response - The Express response object.
 * @param {string} [message="Internal Server Error"] - Custom error message to send in the response.
 */
const handleError = (error, response, message = "Internal Server Error") => {
	console.error("Error while accessing data:\n" + error);
	response.status(500).json({ error: message });
};

/**
 * Check if there is an overlap of class start and end times.
 * @param {Date} startTime - Start time of the class.
 * @param {Date} endTime - End time of the class.
 * @returns {boolean} - Returns true if an overlapping class is found, false otherwise.
 * @throws {Error} - Throws an error if there's an issue during the check.
 */
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

/**
 * Parse and validate date strings using a specific timezone.
 * @param {string} dateStr - The date string to be parsed.
 * @param {string} label - Label to use in error messages for clarity.
 * @param {string} timezone - The timezone for date parsing.
 * @returns {Date} - Returns a JavaScript Date object.
 * @throws {Error} - Throws an error if the date string is not valid.
 */
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
