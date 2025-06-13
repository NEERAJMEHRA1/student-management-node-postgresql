const authService = require('../services/auth.service');

/**
 * @method used for register user
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(200).send({
                success: false,
                message: "Bad request!"
            });
        }
        await authService.registerUser(username, password);

        return res.status(200).send({
            success: true,
            message: 'User registered successfully',
        });
    } catch (error) {
        console.log("register : Error==>> ", error);
        return res.status(200).send({
            success: false,
            message: error.message
        });
    };
};

/**
 * @method used for login user
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const { token } = await authService.loginUser(username, password);

        return res.status(200).send({
            success: true,
            message: 'Logged in successfully',
            data: { token },
        });
    } catch (error) {
        console.log("login : Error==>> ", error);
        return res.status(200).send({
            success: false,
            message: error.message
        });
    };
};