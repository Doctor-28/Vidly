const _ = require('lodash');
const auth = require('../middleware/auth');
const router = require('express').Router();
const {
    getAll,
    getOne,
    getMe,
    createUser
} = require('../services/user');

router.get('/', async (req, res) => {
    const users = await getAll();
    res.send(users);
});

router.get('/:id', async (req, res) => {
    try {
        const user = await getOne(req.params.id);
        res.send(user);
    } catch (error) {        
        res.status(error.httpStatus)
        res.send(error.message)
    }
});

router.get('/me', auth, async (req, res) => {
    const user = await getMe(req.user._id);
    res.send(user);
});

router.post('/', async (req, res) => {
    try {
        const user = await createUser(req.body);
        const token = user.generateAuthToken();
        res.header('Authorization', token);
        res.send(_.pick(user, ['name', 'email']));
    } catch (error) {
        res.status(error.httpStatus)
        res.send(error.message)
    }
});

module.exports = router;