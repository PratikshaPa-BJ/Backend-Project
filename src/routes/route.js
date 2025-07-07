const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel.js');
const userController = require('../controllers/userController')

router.get('/test-me', function(req,res){
    res.send("My First Node JS Application");
})

router.post('/createUser', userController.createUser );

router.get('/getUser', userController.getUserData );
 module.exports = router;