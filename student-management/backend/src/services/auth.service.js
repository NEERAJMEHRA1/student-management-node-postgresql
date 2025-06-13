const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


/**
 * @method save user after checking
 * @param {*} username 
 * @param {*} password 
 * @returns 
 */
exports.registerUser = async (username, password) => {
    const existingUser = await prisma.user.findUnique({
        where: { username },
    });

    if (existingUser) {
        throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
        },
    });

    return user;
};

/**
 * @method get user and login
 * @param {*} username 
 * @param {*} password 
 * @returns 
 */
exports.loginUser = async (username, password) => {
    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user) {
        throw new Erro('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    return { token };
};