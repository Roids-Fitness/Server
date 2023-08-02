const express = require('express');
const usersRouter = express.Router();
const {getAllUsers, login, updateUser, deleteUser, register} = require('../controllers/users_controller');
const {validateRequest, validateAdmin} = require('../middlewares/auth_middleware');

// Public routes (No authentication required)
usersRouter.post("/register", register);
usersRouter.post("/login", login);

// Routes that require user authentication
usersRouter.use(validateRequest);
usersRouter.put("/:id", updateUser);

// Routes that require both user and admin authentication
usersRouter.use(validateAdmin);
usersRouter.get("/", getAllUsers);
usersRouter.delete("/:id", deleteUser);

module.exports = usersRouter;