const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('index', {
        title: 'Testing Pug',
        message: 'Hello World!'
    });
});

module.exports = router;