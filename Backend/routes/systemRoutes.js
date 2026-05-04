const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');

router.get('/stats', systemController.getStats);

module.exports = router;
