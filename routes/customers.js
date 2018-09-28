const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Joi = require('joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 150
    },
    isGold: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        minlength: 9,
        required: true,
        maxlength: 20
    }
}));

router.get('/', async (req, res) => {
    const customers = await Customer
        .find()
        .sort('name');
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer)  //404
        return res.status(404).send('Not found.');

    res.send(customer);
});

router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error)   //400 Bad Request
        return res.status(400).send(error.details[0].message);

    let customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    });

    customer = await customer.save();
    res.send(customer);
});

router.put('/:id', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error)   //400 Bad Request
        return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(req.params.id, { name: req.body.name, phone: req.body.phone }, { new: true });

    if (!customer)  //404
        return res.status(404).send('Not found.');

    res.send(customer);
});

router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
    if (!customer)  //404
        return res.status(404).send('Not found.');

    res.send(customer);
});

let validateCustomer = (customer) => {
    const schema = {
        name: Joi.string().min(5).max(150).required(),
        phone: Joi.string().min(9).max(20).required(),
        isGold: Joi.boolean()
    };
    return Joi.validate(customer, schema);
};

module.exports = router;