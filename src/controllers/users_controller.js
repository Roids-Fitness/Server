const User = require("../models/user");
const Class = require("../models/class");
const bcrypt = require("bcrypt");
const { createToken } = require("../services/auth_service");
const { handleError } = require("../services/utilities");

const register = async (request, response) => {
	try {
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

		// Check if email and password are provided
		if (!email || !password) {
			return response
				.status(400)
				.json({ message: "Email and password must be provided" });
		}

		// Check if the email is already registered
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return response.status(409).json({ message: "Email already registered" });
		}

		// Hash the password before saving
		const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

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

		const token = createToken(newUser._id);

		response.json({
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
		handleError(error, response)
	}
};

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
		handleError(error, response)
	}
};


const getUserByID = async (request, response) => {
	try {
		// user_id retrieved from user object
		const foundUser = await User.findById(request.user.user_id).select(
			"-isAdmin"
		);
		if (foundUser) {
			response.json(foundUser);
		} else {
			response.status(404);
			response.json({ error: "User ID not found" });
		}
	} catch (error) {
		handleError(error, response)
	}
};

const getMyClasses = async (request, response) => {
	try {
		// user_id retrieved from user object
		const user = await User.findById(request.user.user_id).populate(
			"savedClasses"
		);
		response.send(user.savedClasses);
	} catch (error) {
		handleError(error, response)
	}
};

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
		handleError(error, response)
	};
};

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
		handleError(error, response)
	}
};

module.exports = {
	getAllUsers,
	register,
	login,
	updateUser,
	deleteUser,
	getUserByID,
	getMyClasses,
};
