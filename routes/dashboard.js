const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Dashboard Views
router.get('/student', dashboardController.getStudentDashboard);
router.get('/driver', dashboardController.getDriverDashboard);
router.get('/operator', dashboardController.getOperatorDashboard);

// Operator-specific views
router.get('/operator/students', dashboardController.getStudentList);
router.get('/operator/drivers', dashboardController.getDriverList);
router.get('/operator/user/:id', dashboardController.getUserProfile);


module.exports = router;