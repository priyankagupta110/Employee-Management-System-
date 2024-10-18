// server/routes/employees.js
const express = require('express');
const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware for authentication
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// CRUD operations
router.get('/', authenticateToken, async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

router.post('/', authenticateToken, async (req, res) => {
  const newEmployee = new Employee(req.body);
  await newEmployee.save();
  res.json(newEmployee);
});

router.put('/:id', authenticateToken, async (req, res) => {
  const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedEmployee);
});

router.delete('/:id', authenticateToken, async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: 'Employee deleted' });
});

module.exports = router;
