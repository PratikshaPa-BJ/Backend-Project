const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController")
const commonMW = require("../middleware/auth");

router.post("/authors", authorController.createAuthor);
router.post('/login', authorController.createLogin)
router.post("/blogs", commonMW.tokenValidation , blogController.createBlogs );
router.get('/blogs', commonMW.tokenValidation, blogController.getBlogData);
router.put('/blogs/:blogId', commonMW.tokenValidation,  blogController.updateBlogData);
router.delete('/blogs/:blogId', commonMW.tokenValidation, blogController.deleteBlogById);
router.delete('/blogs', commonMW.tokenValidation, blogController.deleteBlogByQueryParams );
router.delete('/deleteBlogs', commonMW.tokenValidation, blogController.deleteBlogByQueryParamsAlternative );



module.exports = router;
