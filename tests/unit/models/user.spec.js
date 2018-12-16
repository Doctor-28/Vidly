const {
    User,
    validateUser
} = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('validateUser function', () => {
    it('should return a validated user', () => {
        const data = {
            name: 'Leonardo',
            email: 'hiatto@gmail.com',
            password: 'Grand7h37Auto'
        };
        const res = validateUser(data);
        expect(res.value).toMatchObject(data);
    });
    it('should throw an error when missing property', () => {
        const data = {
            name: 'Leonardo',
        };
        const res = validateUser(data);
        expect(res.error.message).toMatch('email');
    });
});

describe('generateAuthToken funtion', () => {
    it('should return a valid JWT', () => {
        const definition = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const user = new User(definition);
        const token = user.generateAuthToken();
        expect(token).toContain('.')
    });

    it('should return a valid JWT ande decode it', () => {
        const definition = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const user = new User(definition);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject(definition);
    });
});