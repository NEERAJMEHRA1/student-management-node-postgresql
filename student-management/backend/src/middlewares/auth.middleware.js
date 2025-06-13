const jwt = require('jsonwebtoken');

/**
 * JWT token
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.authenticate = (
    req,
    res,
    next
) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        throw new Error('Authentication required',);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        throw new Error('Invalid token');
    }
};