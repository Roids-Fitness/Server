const express = require('express');
const usersRouter = express.Router();
const {getUsers, signup} = require('../controllers/users_controller');

usersRouter.get("/", getUsers);

usersRouter.post("/signup", signup);

module.exports = usersRouter;