const User = require('../models/user');


const getUsers = (request, response) => {
	response.json({
		message: "List of users goes here"
	});
};


module.exports = {getUsers};