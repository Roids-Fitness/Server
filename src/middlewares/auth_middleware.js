const { verifyToken } = require('../services/auth_service');
const User = require('../models/user');

const validateRequest = async (request, response, next) => {
	try {
	  if (request.headers.authorization) {
		const token = request.headers.authorization.split(' ')[1];
		if (!token) {
		  return response.status(401).json({ error: 'A token is required for authentication' });
		}
		const decoded = await verifyToken(token);
		request.user = decoded;
		next();
	  } else {
		return response.status(401).json({ error: 'Not authenticated for this action. Please provide valid token' });
	  }
	} catch (error) {
		if (error.name === 'JsonWebTokenError' || error instanceof TypeError) {
			return response.status(401).json({ error: 'Invalid token. Please provide a valid token for authentication.' });
			}
	  	next(error);
	}
  };
  

const validateAdmin = async (request, response, next) => {
	try {
	  let validatedUser = await User.findById(request.user.user_id);
	  if (!validatedUser.isAdmin) { 
		return response.status(403).json({ error: 'Not authorized. User is not an admin' });
	  }
	  next();
	} catch (error) {
	  next(error);
	}
  };
  

module.exports = { validateRequest, validateAdmin };
