const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogController")
const commonMW = require("../middleware/auth");

router.post("/authors", authorController.createAuthor);
router.post('/login', authorController.createLogin)
router.post("/blogs", commonMW.authentication , blogController.createBlogs );
router.get('/blogs', commonMW.authentication, blogController.getBlogData);
router.put('/blogs/:blogId', commonMW.authentication, commonMW.authorisationById, blogController.updateBlogData);
router.delete('/blogs/:blogId', commonMW.authentication, commonMW.authorisationById, blogController.deleteBlogById);
router.delete('/deleteblog', commonMW.authentication, commonMW.authorisationByQuery, blogController.deleteBlogByQuery)

//-------------------------Alternative logic for delete by query blog API-----------------------------------------------

router.delete('/deleteBlogs', commonMW.authentication, blogController.deleteBlogByQueryParamsAlternative );
router.delete('/blogs', commonMW.authentication, blogController.deleteBlogByQueryParams );


module.exports = router;
