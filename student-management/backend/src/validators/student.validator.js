const Joi = require('joi');

exports.studentSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  age: Joi.number().integer().min(5).max(100).required()
});
