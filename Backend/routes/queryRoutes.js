const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');
const upload = require('../middleware/uploadMiddleware'); // Used for voice query uploads

router.post('/text', queryController.handleTextQuery);
router.post('/voice', upload.single('audio'), queryController.handleVoiceQuery);

module.exports = router;
