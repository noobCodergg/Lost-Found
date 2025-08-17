const express = require("express");
const { uploadPost, getItems, getItemById, submitReport, getReport, deleteItem, postQuestion, getUserQuestions, postAnswer, getAnswers } = require("../controllers/postController");
const upload = require('../middlewares/multer')


const router = express.Router();

router.post('/upload-post',upload.single("image"),uploadPost)
router.get('/get-all-post',getItems)
router.get('/get-item-by-id/:id',getItemById)
router.post('/submit-report',submitReport)
router.get('/get-report',getReport)
router.delete('/delete-item/:itemId',deleteItem)
router.post('/post-question/:reportId',postQuestion)
router.get('/get-question/:userId',getUserQuestions)
router.put('/post-answer/:reportId',postAnswer)
router.get('/get-answer/:reportId',getAnswers)


module.exports = router;