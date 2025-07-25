const publisherModel = require("../models/publisherModel");

const createPublisher = async function(req,res){
    let body = req.body;
    let publisherData = await publisherModel.create(body);
    res.send({ data: publisherData })
}

module.exports.createPublishers = createPublisher

