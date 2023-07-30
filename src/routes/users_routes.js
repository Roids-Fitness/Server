const express = require('express');
const usersRouter = express.Router();
const {getUsers} = require('../controllers/users_controller');

usersRouter.get("/", getUsers);

module.exports = usersRouter;