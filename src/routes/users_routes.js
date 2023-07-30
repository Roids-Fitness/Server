const express = require('express');
const usersRouter = express.Router();
const {getUsers, signup, login, updateUser, deleteUser} = require('../controllers/users_controller');

usersRouter.get("/", getUsers);

usersRouter.post("/signup", signup);

usersRouter.post("/login", login);

usersRouter.put("/:id", updateUser);

usersRouter.delete("/:id", deleteUser);

module.exports = usersRouter;