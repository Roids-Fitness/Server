// Code for creating and verifying JSON Web Tokens for authentication

const { response } = require("express");
const jwt = require("jsonwebtoken");

const createToken = (user_id) => {
	return jwt.sign(
		{
			user_id: user_id,
		},
		process.env.JWT_SECRET_KEY,
		{ expiresIn: "1d" }
	);
};

const verifyToken = (token) => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET_KEY);
	} catch (error) {
		throw error;
	}
};

module.exports = { createToken, verifyToken };
