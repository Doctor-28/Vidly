const router = require('express').Router()
const bcrypt = require('bcrypt')
const _ = require('lodash');
const Joi = require('joi');
const PasswordComplexity = require('joi-password-complexity');
const { User, complexityOptions } = require('../models/user');


router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).send('User with this email not found')

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword)
        return res.status(400).send('Invalid password')


    const token = user.generateAuthToken();
    res.send({ token: token })
});

function validateUser(req) {
    const schema = {
        email: Joi.string().min(6).max(50).email().required(),
        password: new PasswordComplexity(complexityOptions)
    };
    return Joi.validate(req, schema);
};


module.exports = router;