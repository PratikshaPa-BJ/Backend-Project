const authorModel = require("../models/authorModel");

const createAuthor = async function (req, res) {
  let body = req.body;
  let authorData = await authorModel.create(body);
  res.send({ data: authorData });
};

module.exports.createAuthor = createAuthor;
