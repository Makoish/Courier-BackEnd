const cloudinary = require("cloudinary").v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: "dipaaeta6",
    api_key: "987686453233256",
    api_secret: "Ejo-TriWUn6uIhgVktD6ZUUpDWI",
});

module.exports = cloudinary;