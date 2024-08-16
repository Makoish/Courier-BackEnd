
const bcrypt = require('bcrypt');
const User = require("../../Models/user.model.js");
const sendVerificationEmail = require("../utils/sendVerfEmail.js");
var jwt = require("jsonwebtoken");
require('dotenv').config()
const AppError = require("../utils/AppError.js");
const { jwtDecode } = require("jwt-decode");
const path = require("path");
const uploadImg = require("../utils/umploadImg.js")


var fs = require('fs');
var Verifytemplate = fs.readFileSync(path.join(process.cwd(), './apis/htmls/userVerified.html'), { encoding: 'utf-8' });
var CantVerifytemplate = fs.readFileSync(path.join(process.cwd(), './apis/htmls/cantVerify.html'), { encoding: 'utf-8' });

exports.SignUp = async(req, res) =>{
   
    let urls = null;    
    if(req.files) urls = await uploadImg(req.files);
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const exist = await User.find({"email": req.body.email});
    

    console.log(exists)
    if (exist.length > 0)          
        {  throw new AppError("user does already exist", 409);  };
    
    const user = await User.create(req.body, verified = false);
    if (urls){
        user.photoURL = urls[0]
        await user.save()
    }
    const ID = user._id;
    await sendVerificationEmail(ID, req.body.email, req.body.firstName, req.body.surName);
    res.status(200).json({message: "Email was sucessfuly sent"});
        

    
    
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
        googleID = req.body.ID;
        const user = await User.findOne(
            { googleID:  googleID}
        
        )

        let token = null
       
        if (user){
            const img_url = user.imgURL
            token = jwt.sign({
                id: user._id,
                exp: Math.floor(Date.now() / 1000) + 86400
            }, "secret1337");
            return res.status(200).json({"token": token, "img": img_url});
        }
        else{
            const ID = req.body.ID
            const img_url = req.body.imgURL
            const given_name = req.body.firstName
            const family_name = req.body.lastName
            const email = req.body.email 
            const phoneNO = req.body.phoneNO
            const gender = req.body.gender
            
            let user = {
                "email": email,
                "firstName": given_name,
                "lastName": family_name,
                "googleID": ID,
                "imgURL": img_url,
                "phoneNO": phoneNO,
                "gender": gender,
            }
            
           
      
        const _ = await User.create(user);
        token = jwt.sign({
            id: user._id,
            exp: Math.floor(Date.now() / 1000) + 86400
        }, "secret1337");
        
        return res.status(201).json({"message": "user created", "token": token, "img": img_url});

        }
}
catch(err){
    res.status(400).json({"message": err.message});
}

};

