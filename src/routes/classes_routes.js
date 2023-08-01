const express = require('express');
const classesRouter = express.Router();
const {getClasses, createClass, getClassByID, getClassTimetable, updateClass, deleteAllClasses, deleteClass, getMyClasses, saveClassToUser} = require('../controllers/classes_controller');

const {validateRequest, validateAdmin} = require('../middlewares/auth_middleware');



// router.post('/notes', validateRequest, (req, res) => {
//   // Handle POST /notes route with authentication validation
//   // ...
// });



classesRouter.get("/timetable", getClassTimetable);

classesRouter.get("/", getClasses);

classesRouter.get("/:id", getClassByID);


// Below routes require user authentication
classesRouter.put("/save/:id", saveClassToUser);
classesRouter.get("/myclasses", getMyClasses);

// Below routes require authentication AND admin
classesRouter.post("/", createClass);
classesRouter.put("/:id", updateClass);
classesRouter.delete("/deleteall", validateRequest, validateAdmin, deleteAllClasses);
classesRouter.delete("/:id", deleteClass);

module.exports = classesRouter;