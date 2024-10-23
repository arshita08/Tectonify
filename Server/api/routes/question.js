const express = require('express');
const router = express.Router();
const QuestionController = require('../features/controllers/questions/index');

// Plans Routes
router.get('/all', QuestionController.getAll);
router.post('/create', QuestionController.create);
router.post('/addquestion', QuestionController.addmultiplequestion);
router.post('/addanswer', QuestionController.addmultipleanswer);
router.delete('/delete/:id', QuestionController.deletequestion);

module.exports = router;