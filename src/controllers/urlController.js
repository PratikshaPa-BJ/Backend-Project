const urlModel = require("../models/urlModel");
const valid = require("../validation/validator");
const { redisClient } = require("../cache");
const axios = require("axios");
let nanoid;
(async () => {
  ({ nanoid } = await import("nanoid"));
})();

const createShortUrl = async function (req, res) {
  try {
    if (!req.body || !valid.isValidReqBody(req.body)) {
      return res.status(400).send({ status: false, msg: "Please enter data in req body.." });
    }

    let { longUrl } = req.body;

//---------------------longurl validation ------------------------------------------------------------------------
    if (!valid.isValid(longUrl)) {
      return res.status(400).send({
        status: false,
        msg: "longUrl should be in string and not empty..",
      });
    }
    longUrl = longUrl.trim();
    if (!valid.isValidUrl(longUrl)) {
      return res.status(400).send({ status: false, msg: "Please provide a valid URL.." });
    }

    //---------------------------- check cache------------------------------------------------------------------------
    const cacheData = await redisClient.get(longUrl);
    if (cacheData) {
      //  await redisClient.del(longUrl)
      const cacheUrl = JSON.parse(cacheData);
      return res.status(200).send({
          status: true,
          msg: "longUrl Data coming from cache..",
          data: cacheUrl,
        });
    }
    //-------------- not present check in db----------------------------------------------------------------------------
    const dataDb = await urlModel.findOne({ longUrl }).select({ _id: 0, longUrl: 1, urlCode: 1, shortUrl: 1 });
    if (dataDb) {
      await redisClient.setEx(longUrl, 3600, JSON.stringify(dataDb));
      return res.status(200).send({
        status: true,
        msg: "longUrl already present in db..",
        data: dataDb,
      });
    }
    // -----------------------check if url exist-----------------------------------------------------------------------------
    try {
      await axios.get(longUrl);
    } catch (err) {
      return res.status(404).send({ status: false, msg: "longurl Link not reachable.." });
    }
    
    //-----------------------generate new shortUrl-------------------------------------------------------------------------
    const baseUrl = process.env.BASE_URL;
    const urlCode = nanoid(7).toLowerCase();
    const shortUrl = baseUrl + urlCode;

    const newUrl = await urlModel.create({ longUrl, urlCode, shortUrl });

    //------------------cache new url---------------------------------------------------------------------------------------
     await redisClient.setEx(longUrl, 3600, JSON.stringify(newUrl));
     await redisClient.setEx(urlCode, 3600, JSON.stringify(newUrl));

    return res.status(201).send({ status: true, msg: "Data created successfully..", data: newUrl });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const getUrl = async function (req, res) {
  try {
    let urlCodeinreq = req.params.urlCode;
    if(!urlCodeinreq){
      return res.status(400).send({ status:false, msg: "urlCode is required.."})
    }
    urlCodeinreq = urlCodeinreq.toLowerCase();
    if(!valid.isValidUrlCode(urlCodeinreq)){
      return res.status(400).send({ status:false, msg: "Invalid urlCode format.."})
    }

    const cacheData = await redisClient.get(urlCodeinreq);

    if (cacheData) {
      //  await redisClient.del(urlCodeinreq)

      let cacheUrlcode = JSON.parse(cacheData);
      return res.redirect(302, cacheUrlcode.longUrl);
    }

    const urlCodeDb = await urlModel.findOne({ urlCode: urlCodeinreq });
    if (!urlCodeDb) {
      return res.status(404).send({ status: false, msg: "No data found with this urlcode.." });
    }

    await redisClient.setEx(urlCodeinreq, 3600, JSON.stringify(urlCodeDb));
    res.redirect(302, urlCodeDb.longUrl);
  } catch (err) {
    return res.status(500).send({ status: false, msg: err.message });
  }
};

module.exports = { createShortUrl, getUrl };
