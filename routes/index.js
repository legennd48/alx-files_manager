const express = require('express');

const router = express.Router();
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
const AuthController = require('../controllers/AuthController');
import FilesController from '../controllers/FilesController';

// Endpoint: GET /status
router.get('/status', AppController.getStatus);

// Endpoint: GET /stats
router.get('/stats', AppController.getStats);

// Endpoint: POST /users
router.post('/users', UsersController.postNew);

// Auth endpoints
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);

// Files endpoint
router.post('/files', FilesController.postUpload);

module.exports = router;
