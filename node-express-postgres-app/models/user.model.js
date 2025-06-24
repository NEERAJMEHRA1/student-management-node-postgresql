
import pool from '../config/db.js';


/**
 * @Method used for create user in DB
 * @param {*} name 
 * @param {*} email 
 * @param {*} password 
 * @returns 
 */
export const createUser = async (name, email, password) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *`,
    [name, email, password]
  );
  return result.rows[0];
};

/**
 * @Method used for find user in DB by email
 * @param {*} email 
 * @returns 
 */
export const findUserByEmail = async (email) => {
  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);
  return result.rows[0];
};

/**
 * @Method used for find user by id
 * @param {*} id 
 * @returns 
 */
export const findUserById = async (id) => {
  const result = await pool.query(`SELECT id, name, email FROM users WHERE id = $1`, [id]);
  return result.rows[0];
};

/**
 * @Method used for user in DB
 * @param {*} id 
 * @param {*} name 
 * @returns 
 */
export const updateUser = async (id, name) => {
  const result = await pool.query(`UPDATE users SET name = $1 WHERE id = $2 RETURNING *`, [name, id]);
  return result.rows[0];
};

/**
 * @Method used for delete user from DB
 * @param {*} id 
 */
export const deleteUser = async (id) => {
  await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
};

/**
 * @Method used for get list of user from DB
 * @param {*} page 
 * @param {*} limit 
 * @param {*} search 
 * @returns 
 */
export const listUsers = async (page, limit, search) => {
  const offset = (page - 1) * limit;
  const result = await pool.query(
    `SELECT id, name, email FROM users WHERE name ILIKE $1 ORDER BY id DESC LIMIT $2 OFFSET $3`,
    [`%${search}%`, limit, offset]
  );
  return result.rows;
};
