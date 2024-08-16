const cloudinary = require("../middlewares/cloudinary");


module.exports = async (files) => {
    
    const urls = [];
    for (const file of files) {
    const path = file.path;
    const newPath = await cloudinary.uploader.upload(path);
    const newUrl = newPath.secure_url
    urls.push(newUrl);
    
    }
    return urls;
};