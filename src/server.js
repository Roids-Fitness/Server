const express = require('express');
// const mongoose = require('mongoose');
const app = express();

const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.get("/", (request, response) => {
	response.json({
		message: "Hello world"
	});
});

const classesRouter = require('./routes/classes_routes');
app.use("/classes", classesRouter);

module.exports = {
	app, PORT
};