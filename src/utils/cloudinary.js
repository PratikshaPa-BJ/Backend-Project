const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});


const uploadToCloudinary = async (file, folder = "college_logos") => {

  return new Promise((resolve, reject) => {
    if(!file || !file.buffer){
      return reject(new Error("File is required for upload"))
    }
    cloudinary.uploader.upload_stream({ folder, resource_type: "image"}, (err, result) => {
      if (err) return reject(err);
      resolve(result.secure_url);
    }).end(file.buffer);
  });
};


module.exports =  uploadToCloudinary ;