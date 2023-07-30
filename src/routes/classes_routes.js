const express = require('express');
const classesRouter = express.Router();
const {getClasses, createClass, getClassByID, getClassTimetable, updateClass, deleteAllClasses, deleteClass} = require('../controllers/classes_controller');

classesRouter.get("/timetable", getClassTimetable);

classesRouter.get("/", getClasses);

classesRouter.get("/:id", getClassByID);

classesRouter.post("/", createClass);

classesRouter.put("/:id", updateClass);

classesRouter.delete("/deleteall", deleteAllClasses);

classesRouter.delete("/:id", deleteClass);

module.exports = classesRouter;