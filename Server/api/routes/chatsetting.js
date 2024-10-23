const express = require('express');
const router = express.Router();
const ChatControler = require('../features/controllers/chatsettings');
const path = require('path');
const multer = require('multer');

const upload = multer({ dest: path.join(__dirname, '../recordings') });
// User Routes
router.get('/chat', ChatControler.getSetting);
router.post('/update', upload.fields([
    { name: 'iconfile', maxCount: 1 },
    { name: 'supporticonfile', maxCount: 1 }
  ]), ChatControler.update);

module.exports = router;