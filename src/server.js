const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.get("/", (request, response) => {
	response.json({
		message: "Homepage"
	});
});

const classesRouter = require('./routes/classes_routes');
app.use("/classes", classesRouter);

const usersRouter = require('./routes/users_routes');
app.use("/users", usersRouter);

module.exports = {
	app, PORT
};