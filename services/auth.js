const Joi = require('joi');
const bcrypt = require('bcrypt')
const {
    User
} = require('../models/user');
const {
    UnauthorizedError, InvalidInputError
} = require('../exceptions/index');

exports.login = async (userToLogin) => {
    const {
        error
    } = validateUser(userToLogin);
    if (error)
        throw new InvalidInputError(error.details[0].message);

    let user = await User.findOne({
        email: userToLogin.email
    });
    if (!user)
        throw new UnauthorizedError('Invalid email or password.');

    const validPassword = await bcrypt.compare(userToLogin.password, user.password)
    if (!validPassword)
        throw new UnauthorizedError('Invalid email or password.');

    return user;
}

function validateUser(req) {
    const schema = {
        email: Joi.string().min(6).max(50).email().required(),
        password: Joi.string().min(8).max(32).required()
    };
    return Joi.validate(req, schema);
};