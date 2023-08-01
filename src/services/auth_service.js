const jwt = require("jsonwebtoken")

const createToken = (user_id) => {
	return jwt.sign(
		{
			user_id: user_id,
		},
		process.env.JWT_SECRET_KEY,
		{ expiresIn: '1d' }
	)
}

const verifyToken = (token) => {
	try {
		return jwt.verify(token, process.env.JWT_SECRET_KEY);
	} catch (error) {
		throw new Error("Invalid token")
	}
}

module.exports = {createToken, verifyToken}