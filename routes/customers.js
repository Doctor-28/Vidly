const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const {
  getAll,
  getOne,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../services/customer');

router.get('/', async (req, res) => {
  const customers = await getAll();
  res.send(customers);
});

router.get('/:id', validateObjectId, async (req, res) => {
  try {
    const customer = await getOne(req.params.id);
    res.send(customer);
  } catch (error) {
    res.status(error.httpStatus);
    res.send(error.message);
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const customer = await createCustomer(req.body);
    res.send(customer);
  } catch (error) {
    res.status(error.httpStatus);
    res.send(error.message);
  }
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {
  try {
    const customer = await updateCustomer(req.params.id, req.body);
    res.send(customer);
  } catch (error) {
    res.status(error.httpStatus);
    res.send(error.message);
  }
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  try {
    const customer = await deleteCustomer(req.params.id);
    res.send(customer);
  } catch (error) {
    res.status(error.httpStatus);
    res.send(error.message);
  }
});

module.exports = router;
