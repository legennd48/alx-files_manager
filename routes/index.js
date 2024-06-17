const express = require('express');

const router = express.Router();
const AppController = require('../controllers/AppController');
const AppController = require('../controllers/UsersController');

// Endpoint: GET /status
router.get('/status', AppController.getStatus);

// Endpoint: GET /stats
router.get('/stats', AppController.getStats);

// endpontL POST/users
router.post('/users', UsersController.postNew);

module.exports = router;
