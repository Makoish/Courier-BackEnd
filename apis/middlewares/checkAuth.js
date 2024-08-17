const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError")
const User = require("../../Models/user.model.js");

exports.userAuth = async (req, res, next) => {


    try{

    
    
    const token = req.headers.authorization.split(" ")[1]
    

    if (!token){
        throw new AppError("Unauthorized", 401);
    }

    const decoded_token = jwt.verify(token, "secret1337")

    const id = decoded_token.id

    const user = await User.findById(id);

    if (!user)
        throw new AppError("User doesn't exist", 404);


    if (Date.now() >= decoded_token.exp * 1000) 
        {throw new AppError("Token expired", 409);}


    res.locals.id = decoded_token.id; // pass the userID to the next function/middleware
   
    

    }
    catch(err){
        return res.status(400).json({"message": err.message});
    }

    next();

    
    
};



exports.adminAuth = async (req, res, next) => {


    try{

    const token = req.headers.authorization.split(" ")[1]

    if (!token){
        throw new AppError("Unauthorized", 401);
    }

    const decoded_token = jwt.verify(token, "secret1337")

    const id = decoded_token.id

    const user = await User.findById(id);

    if (user.isAdmin === false){
        throw new AppError("Unauthorized", 401);
    }
    
    if (!user)
        throw new AppError("User doesn't exist", 404);


    if (Date.now() >= decoded_token.exp * 1000) 
        {throw new AppError("Token expired", 409);}


    res.locals.id = decoded_token.id; // pass the userID to the next function/middleware
    next();

    

    }
    catch(err){
        res.status(400).json({"message": err.message});
    }
    
};