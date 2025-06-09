const express = require('express');
const router = express.Router();

router.get('/test-me', function(req,res){
    res.send("My First Node JS Application");
})

router.get('/test-you', function(req,res){
    res.send("My Second API ")
})
 module.exports = router;