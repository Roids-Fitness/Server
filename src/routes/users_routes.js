const express = require('express');
const usersRouter = express.Router();
const {getUsers, signup, login, updateUser, deleteUser} = require('../controllers/users_controller');
const {validateRequest, validateAdmin} = require('../middlewares/auth_middleware');

// Public routes (No authentication required)
usersRouter.post("/signup", signup);
usersRouter.post("/login", login);

// Routes that require user authentication
usersRouter.use(validateRequest);
usersRouter.put("/:id", updateUser);

// Routes that require both user and admin authentication
usersRouter.use(validateAdmin);
usersRouter.get("/", getUsers);
usersRouter.delete("/:id", deleteUser);

module.exports = usersRouter;