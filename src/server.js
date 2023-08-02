const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({extended: true}))


let databaseURL = "";
switch (process.env.NODE_ENV.toLowerCase()) {
	case "production":
		databaseURL = "mongodb://localhost:27017/roids_fitness_db";
		break;
	case "development":
		databaseURL = "mongodb://localhost:27017/roids_fitness_db";
		break;
	case "test":
		databaseURL = "mongodb://localhost:27017/roids_fitness_db";
		break;
	default:
		console.error("Wrong environment mode. Database cannot connect.")
};

const {databaseConnector} = require("./database");

databaseConnector(databaseURL)
.then(() => {
	console.log("Connected to database!")
})
.catch(error => {
	console.log("Could not connect to database...")
	console.log(error)
});


app.get("/", (request, response) => {
	response.json({
		message: "This is the homepage."
	});
});

const classesRouter = require('./routes/classes_routes');
app.use("/class", classesRouter);

const usersRouter = require('./routes/users_routes');
app.use("/user", usersRouter);

module.exports = {
	app, PORT
};