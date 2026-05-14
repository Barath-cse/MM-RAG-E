const express = require('express');
const router = express.Router();
const systemController = require('../controllers/systemController');

router.get('/stats', systemController.getStats);
router.get('/documents', systemController.getDocuments);
router.delete('/documents/:filename', systemController.deleteDocument);

module.exports = router;
