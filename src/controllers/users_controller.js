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


const login = async (request, response) => {
	const user = await User.findOne({email: request.body.email});
	
	if (user && user.password === request.body.password){
		response.json({
			email: user.email,
			message: "Login success"
		});
	} else {
		response.json({
			error: "Authentication failed"
		});
	}
};


module.exports = {getUsers, signup, login};