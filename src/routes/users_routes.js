const express = require('express');
const usersRouter = express.Router();
const {getUsers, signup, login, updateUser, deleteUser} = require('../controllers/users_controller');


usersRouter.post("/signup", signup);
usersRouter.post("/login", login);


// Requires authentication but NOT admin
usersRouter.put("/:id", updateUser);


// Below routes require auth AND admin
usersRouter.get("/", getUsers);
usersRouter.delete("/:id", deleteUser);


module.exports = usersRouter;