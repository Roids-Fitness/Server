const User = require("../models/user");
const Class = require("../models/class");
const bcrypt = require("bcrypt");
const { createToken } = require("../services/auth_service");
const { handleError } = require("../services/utilities");

// Handles the registration process of a new user
const register = async (request, response) => {
	try {
		// Destructure user details from the request
		const {
			firstName,
			lastName,
			email,
			password,
			street,
			suburb,
			state,
			postcode,
			mobile,
		} = request.body;

		// Ensure email and password are provided
		if (!email || !password) {
			return response
				.status(400)
				.json({ error: "Email and password must be provided" });
		}

		// Ensure uniqueness of email
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return response.status(409).json({ error: "Email already registered" });
		}

		// Encrypt the password for security
		const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

		// Create a new user instance and save it to the database
		const newUser = new User({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			street,
			suburb,
			state,
			postcode,
			mobile,
			isAdmin: false,
			savedClasses: [],
		});

		await newUser.save();

		// Generate JWT token for the new user
		const token = createToken(newUser._id);

		// Respond with success message and user details
		response.status(201).json({
			message: "Signup success!",
			user: {
				token: token,
				email: newUser.email,
				firstName: newUser.firstName,
				lastName: newUser.lastName,
				street: newUser.street,
				suburb: newUser.suburb,
				state: newUser.state,
				postcode: newUser.postcode,
				mobile: newUser.mobile,
			},
		});
	} catch (error) {
		handleError(error, response);
	}
};

// Handles user login and token generation
const login = async (request, response) => {
	try {
		const { email, password } = request.body;

		// Check if email and password are provided
		if (!email || !password) {
			return response
				.status(400)
				.json({ error: "Email and password are required to login" });
		}

		const user = await User.findOne({ email });

		if (user && bcrypt.compareSync(password, user.password)) {
			const token = createToken(user._id);
			const returnUser = ({
				_id,
				email,
				firstName,
				lastName,
				savedClasses,
			}) => ({
				id: _id,
				email,
				firstName,
				lastName,
			});
			response.json({
				message: "Login success!",
				user: returnUser(user),
				token: token,
			});
		} else {
			response
				.status(401)
				.json({ error: "Authentication failed. Wrong email or password." });
		}
	} catch (error) {
		handleError(error, response);
	}
};

// Fetches user details based on their ID
const getUserByID = async (request, response) => {
	try {
		// user_id retrieved from user object
		const foundUser = await User.findById(request.user.user_id).select(
			"-isAdmin" // Don't return admin status due to security
		);
		if (foundUser) {
			response.json(foundUser);
		} else {
			response.status(404);
			response.json({ error: "User ID not found" });
		}
	} catch (error) {
		handleError(error, response);
	}
};

// Retrieves classes that the user has signed up for
const getMyClasses = async (request, response) => {
	try {
		// user_id retrieved from user object
		const user = await User.findById(request.user.user_id).populate(
			"savedClasses"
		);
		response.send(user.savedClasses);
	} catch (error) {
		handleError(error, response);
	}
};

// Allows updating a user's details based on their ID
const updateUser = async (request, response) => {
	try {
		// params.id retrieved from search parameter
		const updatedUser = await User.findByIdAndUpdate(
			request.params.id,
			request.body,
			{ new: true }
		);

		if (updatedUser) {
			response.json({
				message: "User updated successfully",
				data: updatedUser,
			});
		} else {
			response.status(404).json({ error: "User ID not found" });
		}
	} catch (error) {
		console.error("Error while accessing data:\n" + error);
		handleError(error, response);
	}
};

// Deletes a user and also removes their association with any classes they signed up for
const deleteUser = async (request, response) => {
	try {
		// params.id retrieved from search parameter
		const userToDelete = await User.findByIdAndDelete(request.params.id);

		// Delete user from class participant lists
		if (userToDelete) {
			await Class.updateMany(
				{ participantList: userToDelete._id },
				{ $pull: { participantList: userToDelete._id } }
			);

			response.json("User deleted");
		} else {
			response.status(404).json({ error: "User ID not found" });
		}
	} catch (error) {
		handleError(error, response);
	}
};

module.exports = {
	register,
	login,
	updateUser,
	deleteUser,
	getUserByID,
	getMyClasses,
};
