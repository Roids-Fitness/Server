const express = require('express');

const classesRouter = express.Router();

classesRouter.get("/", (request, response) => {
	response.json({
		message: "List of classes goes here"
	})
})

module.exports = classesRouter;