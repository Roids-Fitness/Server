const express = require('express');
const classesRouter = express.Router();
const {getClasses, createClass, getClassByID, getClassTimetable} = require('../controllers/classes_controller');

classesRouter.get("/timetable", getClassTimetable);

classesRouter.get("/", getClasses);

classesRouter.get("/:id", getClassByID);

classesRouter.post("/", createClass);

module.exports = classesRouter;