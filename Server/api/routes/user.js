const express = require('express');
const router = express.Router();
const UserControler = require('../features/users/user');

// User Routes
router.get('/all', UserControler.getAll);
router.post('/create', UserControler.create);
router.get('/single/:userId', UserControler.getById);
router.get('/chat/:userId', UserControler.getUserChat);
router.get('/chatuserslist', UserControler.getChatuserslist);
router.post('/status/:userId', UserControler.UpdateUserstatus);
router.post('/admin/passwordchange', UserControler.changePassword);


module.exports = router;