const studentService = require('../services/student.service');
const { sendResponse } = require('../utils/response');

/**
 * Create student
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.createStudent = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const student = await studentService.createStudent(req.body, userId);
    sendResponse(res, 201, 'Student created successfully', student);
  } catch (err) {
    next(err);
  }
};

/**
 * Get all student 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getAllStudents = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { page = 1, limit = 10 } = req.query;
    const data = await studentService.getAllStudents(parseInt(page), parseInt(limit), userId);
    sendResponse(res, 200, 'Students fetched successfully', data);
  } catch (err) {
    next(err);
  }
};

/**
 * Get student by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.getStudentById = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(parseInt(req.params.id));
    sendResponse(res, 200, 'Student fetched successfully', student);
  } catch (err) {
    next(err);
  }
};

/**
 * Update student by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.updateStudent = async (req, res, next) => {
  try {
    const updated = await studentService.updateStudent(parseInt(req.params.id), req.body);
    sendResponse(res, 200, 'Student updated successfully', updated);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete student by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.deleteStudent = async (req, res, next) => {
  try {
    await studentService.deleteStudent(parseInt(req.params.id));
    sendResponse(res, 200, 'Student deleted successfully');
  } catch (err) {
    next(err);
  }
};
