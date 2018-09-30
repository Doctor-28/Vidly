const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
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
});

const Customer = mongoose.model('Customer', customerSchema);

let validateCustomer = (customer) => {
    const schema = {
        name: Joi.string().min(5).max(150).required(),
        phone: Joi.string().min(9).max(20).required(),
        isGold: Joi.boolean()
    };
    return Joi.validate(customer, schema);
};

module.exports.customerSchema = customerSchema;
module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;