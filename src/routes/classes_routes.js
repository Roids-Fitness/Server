const express = require('express');
const classesRouter = express.Router();
const {getClasses} = require('../controllers/classes_controller');

classesRouter.get("/", getClasses);

module.exports = classesRouter;