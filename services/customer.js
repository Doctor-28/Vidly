const {
    Customer,
    validateCustomer
} = require('../models/customer');
const {
    NotFoundError,
    InvalidInputError
} = require('../exceptions/index');

exports.getAll = async () => {
    const customers = await Customer
        .find()
        .sort('name');
    return customers;
}

exports.getOne = async (customerId) => {
    const customer = await Customer
        .findById(customerId);
    if (!customer)
        throw new NotFoundError();
    return customer;
}

exports.createCustomer = async (customerToCreate) => {
    const {
        error
    } = validateCustomer(customerToCreate);
    if (error)
        throw new InvalidInputError(error.details[0].message);

    const customer = new Customer({
        name: customerToCreate.name,
        phone: customerToCreate.phone,
        isGold: customerToCreate.isGold
    });

    return await customer.save();
}

exports.updateCustomer = async (customerId, customerData) => {
    const {
        error
    } = validateCustomer(customerData);
    if (error)
        throw new InvalidInputError(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(customerId, {
        name: customerData.name,
        phone: customerData.phone,
        isGold: customerData.isGold
    }, {
        new: true
    });

    if (!customer)
        throw new NotFoundError();
    return customer;
}

exports.deleteCustomer = async(customerId) => {
    const customer = await Customer.findByIdAndRemove(customerId);
    if (!customer)
        throw new NotFoundError();
    return customer;
}