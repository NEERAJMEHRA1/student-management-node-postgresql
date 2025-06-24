import pool from './db.js';
import { createUserTable } from '../tables/user.table.js';
import { createAddressTable } from '../tables/address.table.js';

export const initDB = async () => {
    try {
        // Order matters: users first, then addresses
        await pool.query(createUserTable);
        await pool.query(createAddressTable);
        console.log("Tables created (users, addresses)");
    } catch (err) {
        console.error("Table creation failed:", err);
    }
};
