const Class = require('../models/class');


const getClasses = (request, response) => {
	response.json({
		message: "List of classes goes here"
	});
};


module.exports = {getClasses};