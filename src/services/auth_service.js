// Code for creating and verifying JSON Web Tokens for authentication

const jwt = require("jsonwebtoken");

/**
 * Create a new JWT based on the provided user ID.
 * @param {string} user_id - The ID of the user for whom the token is being created.
 * @returns {string} - A JWT that expires in 1 day.
 */
const createToken = (user_id) => {
	return jwt.sign(
		{
			user_id: user_id,
		},
		process.env.JWT_SECRET_KEY,
		{ expiresIn: "1d" }
	);
};

/**
 * Verify the validity of a provided JWT.
 * @param {string} token - The JWT to be verified.
 * @returns {Object} - The decoded JWT payload if the verification is successful.
 * @throws {Error} - Throws an error if the token is not valid or expired.
 */
const verifyToken = (token) => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET_KEY);
	} catch (error) {
		throw error;
	}
};

module.exports = { createToken, verifyToken };
