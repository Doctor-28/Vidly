const bcrypt = require('bcrypt');
const {
    NotFoundError,
    InvalidInputError
} = require('../exceptions/index');
const {
    User,
    validateUser
} = require('../models/user');

exports.getAll = async () => {
    const users = await User
        .find()
        .sort('name');
    return users;
}

exports.getOne = async (userId) => {
    const user = await User
        .findById(userId);
    if (!user)
        throw new NotFoundError();
    return user;
}

exports.getMe = async (userId) => {
    const user = await User.findById(userId).select('-password');
    return user;
}

exports.createUser = async (userToCreate) => {
    const {
        error
    } = validateUser(userToCreate);
    if (error)
        throw new InvalidInputError(error.details[0].message, 400);

    let user = await User.findOne({
        email: userToCreate.email
    });
    if (user)
        throw new InvalidInputError('User already registered.', 400);

    user = new User(userToCreate);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return await user.save();
}