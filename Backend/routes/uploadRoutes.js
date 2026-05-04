const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const uploadController = require('../controllers/uploadController');

router.post('/file', upload.single('file'), uploadController.handleUpload);
router.delete('/clear', uploadController.handleClear);

module.exports = router;
