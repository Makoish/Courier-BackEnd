
const bcrypt = require('bcrypt');
const User = require("../../Models/user.model.js");
const sendVerificationEmail = require("../utils/sendVerfEmail.js");
var jwt = require("jsonwebtoken");
require('dotenv').config()
const AppError = require("../utils/AppError.js");
const { jwtDecode } = require("jwt-decode");
const path = require("path");

var fs = require('fs');
var Verifytemplate = fs.readFileSync(path.join(process.cwd(), './apis/htmls/userVerified.html'), { encoding: 'utf-8' });
var CantVerifytemplate = fs.readFileSync(path.join(process.cwd(), './apis/htmls/cantVerify.html'), { encoding: 'utf-8' });

exports.SignUp = async(req, res) =>{
    try{
    
    
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const exist = await User.find({"email": req.body.email});
    console.log(exist)
    if (exist.length > 0)          
        {  throw new AppError("user does already exist", 409);  };
    
    const user = await User.create(req.body, verified = false);
    const ID = user._id;
    await sendVerificationEmail(ID, req.body.email, req.body.firstName, req.body.surName);
    res.status(200).json({message: "Email was sucessfuly sent"});
        

    }  catch(err){
        res.status(err.code).json({"message": err.message});
    }
    
};



exports.Verify = async (req, res) => {
    try {
        let token = req.query.token;
        const decoded = jwtDecode(token);
        if (Date.now() >= decoded.exp * 1000) {
                const modifiedHtml = CantVerifytemplate.replace('__REDIRECT_URL__', process.env.URL);
                return res.send(modifiedHtml);
        }
          
        let user = await User.findById(decoded.id);
        
        if (!user)
            throw new AppError("user doesn't exist", 404);


        console.log("here")
        user = await User.findByIdAndUpdate(decoded.id, {"isVerified": true});

        const modifiedHtml = Verifytemplate.replace('__REDIRECT_URL__', process.env.URL);
        return res.send(modifiedHtml);
        

    } catch(err){
        if (!err.statusCode)
            res.status(404).json({"message": err.message});
        res.status(err.statusCode).json({"message": err.message});
    }
};



exports.Login = async (req, res) => {
    try {
        
        const email = req.body.email;
        const password = req.body.password;

        user = await User.findOne({"email": email});

        if (!user)
            throw new AppError("user doesn't exist", 404);


        const hashedPassword = user.password;
        const match = await bcrypt.compare(password, hashedPassword);

        if (!match)
            throw new AppError("user doesn't exist", 400);

        
        const token = jwt.sign({
            id: user._id,
            exp: Math.floor(Date.now() / 1000) + 86400
          }, "secret1337");
          

        const imgURL = user.imgURL

        return res.status(200).json({"token": token, "img": imgURL});
        

    } catch(err){
        res.status(err.code).json({"message": err.message});
    }
  
};


exports.google_facebook = async (req, res) =>{


    try{
        google_or_facebook_id = req.body.ID;
        const user = await User.findOne({$or: [
            { facebookID:  google_or_facebook_id},
            { googleID: google_or_facebook_id }
        ]})

        let token = null
        const img_url = user.imgURL

        if (user){
            token = jwt.sign({
                id: user._id,
                exp: Math.floor(Date.now() / 1000) + 86400
            }, "secret1337");
            return res.status(200).json({"token": token, "img": img_url});
        }
        else{
            const ID = req.body.ID
            const img_url = req.body.imgURL
            const signType = req.body.signType //Facebook or google?
            const given_name = req.body.firstName
            const family_name = req.body.surName
            const email = req.body.email 
            let user = null
            if (signType === "google"){
                user = {
                    "email": email,
                    "firstName": given_name,
                    "surName": family_name,
                    "googleID": ID
                }
            }
            else{
                user = {
                    "email": email,
                    "firstName": given_name,
                    "surName": family_name,
                    "facebookID": ID
                }
            }
        
        const _user = await User.create(user);
        token = jwt.sign({
            id: user._id,
            exp: Math.floor(Date.now() / 1000) + 86400
        }, "secret1337");
        
        return res.status(201).json({"message": "user created", "token": token, "img": img_url});

        }
}
catch(err){
    res.status(err.statusCode).json({"message": err.message});
}

};

