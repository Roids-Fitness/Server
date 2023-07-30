const express = require('express');
const classesRouter = express.Router();
const {getClasses, createClass} = require('../controllers/classes_controller');

classesRouter.get("/", getClasses);

classesRouter.post("/", createClass);

module.exports = classesRouter;