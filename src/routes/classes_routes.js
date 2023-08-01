const express = require('express');
const classesRouter = express.Router();
const {getClasses, createClass, getClassByID, getClassTimetable, updateClass, deleteAllClasses, deleteClass, getMyClasses, saveClassToUser} = require('../controllers/classes_controller');
const {validateRequest, validateAdmin} = require('../middlewares/auth_middleware');


// Public routes (No authentication required)
classesRouter.get('/timetable', getClassTimetable);
classesRouter.get('/', getClasses);
classesRouter.get('/:id', getClassByID);

// Routes that require user authentication
classesRouter.use(validateRequest);
classesRouter.put('/save/:id', saveClassToUser);
classesRouter.get('/myclasses', getMyClasses);

// Routes that require both user and admin authentication
classesRouter.use(validateAdmin);
classesRouter.post('/', createClass);
classesRouter.put('/:id', updateClass);
classesRouter.delete('/deleteall', deleteAllClasses);
classesRouter.delete('/:id', deleteClass);

module.exports = classesRouter;