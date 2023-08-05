// MongoDB or Mongo Atlas database connection
const mongoose = require("mongoose");

/**
 * Establish a connection to a MongoDB database.
 * @param {string} databaseURL - The connection URL for the MongoDB database.
 * @throws {Error} - Throws an error if the connection fails.
 */
async function databaseConnector(databaseURL) {
	await mongoose.connect(databaseURL);
}

module.exports = {
	databaseConnector,
};
