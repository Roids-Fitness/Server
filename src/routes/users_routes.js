const express = require('express');
const usersRouter = express.Router();
const {getUsers, signup, login} = require('../controllers/users_controller');

usersRouter.get("/", getUsers);

usersRouter.post("/signup", signup);

usersRouter.post("/login", login);

module.exports = usersRouter;