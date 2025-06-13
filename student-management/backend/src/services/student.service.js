const { PrismaClient } = require('@prisma/client');
const AppError = require('../utils/error');

const prisma = new PrismaClient();

/**
 * @method save student data with marks
 * @param {*} studentData 
 * @returns 
 */
exports.createStudent = async (studentData, userId) => {
  const { name, email, age, marks } = studentData;

  const existingStudent = await prisma.student.findUnique({
    where: { email },
  });

  if (existingStudent) {
    throw new Error('Student with this email already exists');
  }

  const student = await prisma.student.create({
    data: {
      userId,
      name,
      email,
      age,
      marks: {
        create: marks,
      },
    },
    include: {
      marks: true,
    },
  });

  return student;
};

/**
 * @method get all student with marks
 * @param {*} page 
 * @param {*} limit 
 * @returns 
 */
exports.getAllStudents = async (page = 1, limit = 10, userId) => {
  const skip = (page - 1) * limit;
  const [students, total] = await Promise.all([
    prisma.student.findMany({
      where: { userId },
      skip,
      take: limit,
      include: {
        marks: true,
      },
    }),
    prisma.student.count(),
  ]);

  return {
    students,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * Get student by id
 * @param {*} id 
 * @returns 
 */
exports.getStudentById = async (id) => {
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      marks: true,
    },
  });

  if (!student) {
    throw new Error('Student not found');
  }

  return student;
};

/**
 * update student with marks
 * @param {*} id 
 * @param {*} studentData 
 * @returns 
 */
exports.updateStudent = async (id, studentData) => {
  const { name, email, age, marks } = studentData;

  const student = await prisma.student.findUnique({
    where: { id },
  });

  if (!student) {
    throw new Error('Student not found');
  }

  if (email && email !== student.email) {
    const existingStudent = await prisma.student.findUnique({
      where: { email },
    });

    if (existingStudent) {
      throw new Error('Student with this email already exists');
    }
  }

  // Delete existing marks and create new ones
  await prisma.mark.deleteMany({
    where: { studentId: id },
  });

  const updatedStudent = await prisma.student.update({
    where: { id },
    data: {
      name,
      email,
      age,
      marks: {
        create: marks,
      },
    },
    include: {
      marks: true,
    },
  });

  return updatedStudent;
};

/**
 * Delete student with marks
 * @param {*} id 
 */
exports.deleteStudent = async (id) => {
  const student = await prisma.student.findUnique({
    where: { id },
  });

  if (!student) {
    throw new Error('Student not found');
  }

  // Delete marks first due to foreign key constraint
  await prisma.mark.deleteMany({
    where: { studentId: id },
  });

  await prisma.student.delete({
    where: { id },
  });
};
