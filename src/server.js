const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = process.env.PORT 

app.use(express.json());
app.use(express.urlencoded({extended: true}))


let databaseURL = "";
switch (process.env.NODE_ENV.toLowerCase()) {
	case "production":
		databaseURL = process.env.DATABASE_URL;
		break;
	case "development":
		databaseURL = "mongodb://localhost:27017/roids_fitness_db";
		break;
	case "test":
		databaseURL = "mongodb://localhost:27017/roids_fitness_db_test";
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


app.get("/databaseHealth", (request, response) => {
    let databaseState = mongoose.connection.readyState;
    let databaseName = mongoose.connection.name;
    let databaseModels = mongoose.connection.modelNames();
    let databaseHost = mongoose.connection.host;

    response.json({
        readyState: databaseState,
        dbName: databaseName,
        dbModels: databaseModels,
        dbHost: databaseHost
    })
});

const classesRouter = require('./routes/classes_routes');
app.use("/class", classesRouter);

const usersRouter = require('./routes/users_routes');
app.use("/user", usersRouter);

module.exports = {
	app, PORT
};