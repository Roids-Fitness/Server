const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();

const PORT = process.env.PORT;

// Configure Cross-Origin Resource Sharing (CORS) settings
const cors = require("cors");
let corsOptions = {
	origin: ["http://localhost:3000", "https://roids-fitness.netlify.app"],
	optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Setup security-related HTTP headers using Helmet.js
const helmet = require("helmet");
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["self"],
		},
	})
);

// Middleware to parse incoming requests with JSON payloads
app.use(express.json());
// Middleware to parse incoming requests with URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// Determine the appropriate database URL based on the environment
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
		console.error("Wrong environment mode. Database cannot connect.");
}

// Import and use the database connection utility
const { databaseConnector } = require("./database");
databaseConnector(databaseURL)
	.then(() => {
		console.log("Connected to database!");
	})
	.catch((error) => {
		console.log("Could not connect to database...");
		console.log(error);
	});

// Root route for the API
app.get("/", (request, response) => {
	response.json({
		message: "This is the homepage.",
	});
});

// Health-check route to get the status of the database
app.get("/databaseHealth", (request, response) => {
	let databaseState = mongoose.connection.readyState;
	let databaseName = mongoose.connection.name;
	let databaseModels = mongoose.connection.modelNames();
	let databaseHost = mongoose.connection.host;

	response.json({
		readyState: databaseState,
		dbName: databaseName,
		dbModels: databaseModels,
		dbHost: databaseHost,
	});
});

// Import and use routes for handling classes and users
const classesRouter = require("./routes/classes_routes");
app.use("/class", classesRouter);
const usersRouter = require("./routes/users_routes");
app.use("/user", usersRouter);

module.exports = {
	app,
	PORT,
};
