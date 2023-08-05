// MongoDB or Mongo Atlas database connection

const mongoose = require("mongoose");

async function databaseConnector(databaseURL) {
	await mongoose.connect(databaseURL);
}

module.exports = {
	databaseConnector,
};
