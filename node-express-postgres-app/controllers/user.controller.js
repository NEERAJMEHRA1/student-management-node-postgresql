
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';
import {
  createUser, findUserByEmail, findUserById,
  updateUser, deleteUser, listUsers
} from '../models/user.model.js';


/**
 * @Method used for register users
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await findUserByEmail(email);
    if (existing) return res.error(400, 'Email already exists');

    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, hashed);
    res.success({ user }, 'User registered');
  } catch (err) {
    next(err);
  }
};

/**
 * @Method used for login users
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.error(401, 'Invalid email or password');
    };

    delete user.password;

    const token = generateToken(user);
    res.success({ token, data: user }, 'Login successful');
  } catch (err) {
    next(err);
  }
};

/**
 * @Method used for get user detail by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const getUser = async (req, res, next) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) return res.error(404, 'User not found');
    res.success(user);
  } catch (err) {
    next(err);
  }
};


/**
 * @Method used for update user details by id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const update = async (req, res, next) => {
  try {
    const user = await updateUser(req.params.id, req.body.name);
    res.success(user, 'User updated');
  } catch (err) {
    next(err);
  }
};


/**
 * @Method used for delete users
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const remove = async (req, res, next) => {
  try {
    await deleteUser(req.params.id);
    res.success(null, 'User deleted');
  } catch (err) {
    next(err);
  }
};

/**
 * @Method used for users listing
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const list = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);
    const search = req.query.search || '';

    // get user list from DB
    const users = await listUsers(page, limit, search);
    res.success(users);
  } catch (err) {
    next(err);
  }
};
