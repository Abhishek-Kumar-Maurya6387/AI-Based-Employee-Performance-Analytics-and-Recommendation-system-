const express = require('express');
const {
  addEmployee,
  getEmployees,
  searchEmployees,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/search', protect, searchEmployees);
router.route('/').get(protect, getEmployees).post(protect, addEmployee);
router.route('/:id').put(protect, updateEmployee).delete(protect, deleteEmployee);

module.exports = router;

