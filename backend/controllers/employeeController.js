const Employee = require('../models/Employee');

const addEmployee = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      createdBy: req.user?._id,
    };

    const employee = await Employee.create(payload);
    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
};

const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1, createdAt: -1 });
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

const searchEmployees = async (req, res, next) => {
  try {
    const { department, name } = req.query;
    const query = {};

    if (department) query.department = { $regex: department, $options: 'i' };
    if (name) query.name = { $regex: name, $options: 'i' };

    const employees = await Employee.find(query).sort({ performanceScore: -1, createdAt: -1 });
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addEmployee,
  getEmployees,
  searchEmployees,
  updateEmployee,
  deleteEmployee,
};

