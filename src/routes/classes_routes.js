const express = require('express');
const classesRouter = express.Router();
const {getClasses, createClass, getClassByID} = require('../controllers/classes_controller');

classesRouter.get("/", getClasses);

classesRouter.get("/:id", getClassByID);

classesRouter.post("/", createClass);

module.exports = classesRouter;