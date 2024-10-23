const express = require('express');
const router = express.Router();
const DashboardControler = require('../features/controllers/dashboard');



// Dashboard Routes
router.get('/stats', DashboardControler.getdashboarddata);

module.exports = router;