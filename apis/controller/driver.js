const bcrypt = require('bcrypt');
const User = require("../../Models/user.model.js");
const Order = require("../../Models/package.model.js");
const SendResetEmail = require("../utils/sendResetEmail.js")
const AppError = require("../utils/AppError.js");
const Package = require('../../Models/package.model.js');




exports.homePage = async (req, res) =>{
    try{
        const ID = res.locals.id
        const user = await User.findById(ID)
        let retUser = {};
        retUser.name = user.firstName + user.lastName
        retUser.gender = user.gender
        retUser.photoURL = user.photoURL
        retUser.currLocation = user.driverLocation
        retUser.rating = user.driverRating
        return res.status(200).json(retUser)
    }
    catch(err){
        return res.status(err.code).json(err.message);
    }
}



 
exports.changeStatus = async (req, res) => {
    try {
        const packageID = req.body.id
        const status = req.body.status
        if (status === "DELIVERED")
            await Package.findByIdAndUpdate(packageID, {"deliveredAt": Date.now()})

        await Package.findByIdAndUpdate(packageID, {"status": status})
        
    } catch (err) {
        return res.status(err.code).json(err.message);
    }
}



exports.salary = async (req, res) =>{
    try {
        const _id = res.locals.id
        const period = req.query.period
        const packages = await Package.find({"courier": _id})
        let obj = new Date(); 
        let day = obj.getDate(); 
        let month = obj.getMonth() + 1;  
        let salary = 0
        if (period === "total"){
            for (let i = 0; i<packages.length; i++)
                salary+=packages[i].shippingPrice; 
        }
        else if (period === "month"){
            for (let i = 0; i<packages.length; i++){
                if (packages[i].createdAt.getMonth()+1 == month && packages[i].status == "DELIVERED")
                    salary+= packages[i].shippingPrice
            }
        }

        else if (period == "day"){
            for (let i = 0; i<packages.length; i++){
                if (packages[i].createdAt.getDate() == day && packages[i].status == "DELIVERED")
                    salary+= packages[i].shippingPrice
            }

        }


        return res.status(200).json({"salary": salary});
            
        


        
    } catch (error) {
        return res.status(error.code).json({"message": error.message});
    }
}