const User = require('../models/user');


const getUsers = (request, response) => {
	response.json({
		message: "List of users goes here"
	});
};

const signup = async (request, response) => {
	let newUser = new User({
		email: request.body.email,
		password: request.body.password,
		phone: request.body.phone,
		classes: []
	});

	await newUser.save()
				.catch(error => {
					console.log(error.errors);
				});
	
	response.json({
		email: newUser.email,
		password: newUser.password,
		phone: newUser.phone,
	});
};


module.exports = {getUsers, signup};