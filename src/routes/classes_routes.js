const express = require("express");
const classesRouter = express.Router();
const {
	createClass,
	getClassByID,
	updateClassDetails,
	deleteClass,
	classSignup,
	getAllClasses,
} = require("../controllers/classes_controller");
const {
	validateRequest,
	validateAdmin,
} = require("../middlewares/auth_middleware");

// Public routes (No authentication required)
// Retrieve all classes
classesRouter.get("/", getAllClasses);
// Retrieve a specific class by ID
classesRouter.get("/:id", getClassByID);

// Apply user authentication middleware for the routes that follow (requires user authentication)
classesRouter.use(validateRequest);
// Update class details (requires admin authorization)
classesRouter.put("/update/:id", validateAdmin, updateClassDetails);
// Signup for a class
classesRouter.put("/:id", classSignup);

// Apply admin authentication middleware for the routes that follow (requires admin authorization)
classesRouter.use(validateAdmin);
// Create a new class
classesRouter.post("/", createClass);
// Delete a specific class by ID
classesRouter.delete("/:id", deleteClass);

module.exports = classesRouter;
