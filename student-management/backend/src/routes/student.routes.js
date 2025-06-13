const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const validate = require('../middlewares/validate.middleware');
const { studentSchema } = require('../validators/student.validator');
const { authenticate } = require('../middlewares/auth.middleware');



router.post('/create-student', authenticate, validate(studentSchema), studentController.createStudent);
router.put('/update-student/:id', authenticate, validate(studentSchema), studentController.updateStudent);
router.get('/get-student-list', authenticate, studentController.getAllStudents);
router.get('/get-student/:id', authenticate, studentController.getStudentById);
router.delete('/delete-student/:id', authenticate, studentController.deleteStudent);

module.exports = router;
