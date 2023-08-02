const express = require('express');
const classesRouter = express.Router();
const {createClass, getClassByID, updateClass, deleteAllClasses, deleteClass, classSignup, getAllClasses} = require('../controllers/classes_controller');
const {validateRequest, validateAdmin} = require('../middlewares/auth_middleware');


// Public routes (No authentication required)
classesRouter.get('/', getAllClasses);
classesRouter.get('/timetable', getAllClasses);
classesRouter.get('/:id', getClassByID);


// Routes that require user authentication
classesRouter.use(validateRequest);
classesRouter.put('/update/:id', validateAdmin, updateClass);
classesRouter.put('/:id', classSignup);

// Routes that require both user and admin authentication
classesRouter.use(validateAdmin);
classesRouter.post('/', createClass);
classesRouter.delete('/deleteall', deleteAllClasses);
classesRouter.delete('/:id', deleteClass);

module.exports = classesRouter;



