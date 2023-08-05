const express = require("express");
const usersRouter = express.Router();
const {
	login,
	updateUser,
	deleteUser,
	register,
	getUserByID,
	getMyClasses,
} = require("../controllers/users_controller");
const {
	validateRequest,
	validateAdmin,
} = require("../middlewares/auth_middleware");

// Public routes (No authentication required)
// Register a new user
usersRouter.post("/register", register);
// User login
usersRouter.post("/login", login);

// Apply user authentication middleware for the routes that follow
usersRouter.use(validateRequest);
// Retrieve details of the authenticated user
usersRouter.get("/myaccount", getUserByID);
// Retrieve classes saved by the authenticated user
usersRouter.get("/myclasses", getMyClasses);
// Update the authenticated user's details
usersRouter.put("/:id", updateUser);

// Apply admin authentication middleware for the routes that follow
usersRouter.use(validateAdmin);
// Delete a user by ID (requires admin authorization)
usersRouter.delete("/:id", deleteUser);

module.exports = usersRouter;
