const express = require('express');
const classesRouter = express.Router();
const {getClasses, createClass, getClassByID, getClassTimetable, updateClass, deleteAllClasses, deleteClass, getMyClasses, classSignup} = require('../controllers/classes_controller');
const {validateRequest, validateAdmin} = require('../middlewares/auth_middleware');


// Public routes (No authentication required)
classesRouter.get('/', getClasses);
classesRouter.get('/timetable', getClassTimetable);
classesRouter.get('/:id', getClassByID);

// Routes that require user authentication
classesRouter.use(validateRequest);
classesRouter.put('/:id', classSignup);
classesRouter.get('/myclasses', getMyClasses);

// Routes that require both user and admin authentication
classesRouter.use(validateAdmin);
classesRouter.post('/', createClass);
classesRouter.put('/update/:id', updateClass);
classesRouter.delete('/deleteall', deleteAllClasses);
classesRouter.delete('/:id', deleteClass);

module.exports = classesRouter;