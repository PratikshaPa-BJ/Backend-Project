const userModel = require('../models/userModel')

let createUser = async function(req,res){
    let data = req.body;
    let savedData = await userModel.create(data);
    res.send( { msg: savedData })
}
let getUser = async function(req, res){
    let allUsersData = await userModel.find();
    res.send({ data: allUsersData });
}

module.exports.createUser = createUser;
module.exports.getUserData = getUser;