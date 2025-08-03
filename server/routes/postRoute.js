const express = require("express");
const { uploadPost, getItems } = require("../controllers/postController");
const upload = require('../middlewares/multer')


const router = express.Router();

router.post('/upload-post',upload.single("image"),uploadPost)
router.get('/get-all-post',getItems)


module.exports = router;