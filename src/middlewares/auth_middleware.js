// Middlewares for validating the JWT for authentication, as well as checking if JWT is from an admin user

const { verifyToken } = require("../services/auth_service");
const User = require("../models/user");


// Middleware to authenticate user based on provided JWT
const validateRequest = async (request, response, next) => {
	try {
		if (request.headers.authorization) {
			// Extract token from the 'Bearer [token]' format in the Authorization header
			const token = request.headers.authorization.split(" ")[1];
			if (!token) {
				return response
					.status(401)
					.json({ error: "A token is required for authentication" });
			}
			// Decode the token to get the user info and assign to the request object
			const decoded = await verifyToken(token);
			request.user = decoded;
			next();
		} else {
			// Handle missing authorization header
			return response
				.status(401)
				.json({
					error:
						"Not authenticated for this action. Please provide valid token",
				});
		}
	} catch (error) {
		// Handle token-related errors
		if (error.name === "JsonWebTokenError" || error instanceof TypeError) {
			return response
				.status(401)
				.json({
					error:
						"Invalid token. Please provide a valid token for authentication.",
				});
		}
		next(error);
	}
};

// Middleware to validate if the authenticated user is an admin
const validateAdmin = async (request, response, next) => {
	try {
		// Fetch the user using the ID obtained from the decoded token
		let validatedUser = await User.findById(request.user.user_id);
		// Check if the user has admin privileges
		if (!validatedUser.isAdmin) {
			return response
				.status(403)
				.json({ error: "Not authorized. User is not an admin" });
		}
		next();
	} catch (error) {
		next(error);
	}
};

module.exports = { validateRequest, validateAdmin };
