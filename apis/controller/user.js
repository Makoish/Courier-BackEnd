const bcrypt = require('bcrypt');
const User = require("../../Models/user.model.js");
const Order = require("../../Models/package.model.js");
const SendResetEmail = require("../utils/sendResetEmail.js")
const AppError = require("../utils/AppError.js");
const Package = require('../../Models/package.model.js');


exports.resetPassword = async(req, res) =>{

    try{
    const email = req.body.email
    const user = await User.findOne({"email": email})
    if (!user)
        throw new AppError("User doesn't exist", 404)

    const ID = user._id
    SendResetEmail(ID, email);
}
catch(err) { return res.status(err.code).json({ message: err.message }); }

return res.status(200).json({"message": "reset password email was sent"});

}



exports.changePassword = async(req, res) =>{

    try{
        const _id = req.body.id
        let password = req.body.password
        let user = await User.findById(_id);
        console.log(user)
        if (!user)
            throw new AppError("User doesn't exist", 404)

        password = await bcrypt.hash(password, 10);
        user = await User.findByIdAndUpdate(_id, {"password": password})
        return res.status(200).json({"message": "User password updated"});
    
    }
catch(err) { return res.status(400).json({ message: err.message }); }

}




exports.homePage = async (req, res) =>{
    try{
        const ID = res.locals.id
        const user = await User.findById(ID)
        let retUser = {};
        retUser.name = user.firstName + user.lastName
        retUser.gender = user.gender
        retUser.photoURL = user.photoURL
        return res.status(200).json(retUser)
    }
    catch(err){
        return res.status(err.code).json(err.message);
    }
}



exports.homeOrders = async (req, res) => {
    try {
        const ID = res.locals.id
        const orders = await Order.find({"sender" : ID}).sort({createdAt: -1}).limit(2)
        return res.status(200).json({"orders": orders})

        
    } catch (err) {
        return res.status(err.code).json(err.message);
    }
}


exports.orders = async (req, res) => {
    try {
        const ID = res.locals.id
        let start = 0
        let offset = 1000
        
        
        if (req.query.start != undefined && req.query.offset !=undefined){
            start = req.query.start
            offset = req.query.offset
        }
        const orders = await Order.find({"sender": ID}).sort({createdAt: -1})
        let paginatedOrders = orders.slice(start, start+offset);
        return res.status(200).json({"orders": paginatedOrders})
    } catch (err) {
        return res.status(err.code).json(err.message)
        
    }
}


exports.order = async (req, res) => {
    try {
        const ID = req.params.id
        const order = await Order.findById(ID)
        const plainObject = order.toObject({ virtuals: false, getters: true });
        let orderClone = {...plainObject}
        
        
        
        const dropID = order.dropLoc
        const pickID = order.pickLoc
        const user = await User.findById(order.sender)
        for (let i = 0; i<user.pickLocations.length; i++){
            if (user.pickLocations[i]._id.equals(pickID)){  
                   orderClone.pickLoc = user.pickLocations[i]
                   break; 
                }
        }

        for (let i = 0; i<user.dropLocations.length; i++){
            if (user.dropLocations[i]._id.equals(dropID)){
                  orderClone.dropLoc = user.dropLocations[i]; 
                  break; 
                }
        }
        return res.status(200).json(orderClone)
    } catch (err) {
        return res.status(400).json(err.message)
        
    }
}


exports.createOrder = async (req, res) =>{
    try {

        const order = await Package.create(req.body)
        return res.status(200).json({"message": "order created","id": order._id })

    } catch (err) {
        return res.status(err.code).json(err.message)
        
    }
}


exports.editOrder = async(req, res) =>{
    try {
        const ID = req.params.id
        const order = await Package.findById(ID);
        
        if (order.status !== "PENDING" && req.body.status.toUpperCase() === "CANCELLED")
            throw new AppError(`Can't change status of ${order.status} orders`, 400);
        const _ = await Package.findByIdAndUpdate(ID, req.body)
        return res.status(200).json({"message": "order updated"});
        

    } catch (err) {
        
        return res.status(err.code).json(err.message)
        
    }

}

exports.addLocation = async (req, res) =>{
    try {
        const _id = res.locals.id
        const loc = req.body
        if (req.body.type === "drop")
            await User.findByIdAndUpdate(_id, {$push: {dropLocations: loc}})
        
        else
            await User.findByIdAndUpdate(_id, {$push: {pickLocations: loc}})


        return res.status(200).json({"message": "Added location"})
        
    } catch (err) {
        return res.status(err.code).json(err.message)
    }
}


exports.removeLocation = async (req, res) =>{
    try {
        const _id = res.locals.id
        const loc_id = req.params.id
        if (req.body.type === "drop")
            await User.findByIdAndUpdate(_id, {$pull: {dropLocations: {_id: loc_id}}})
        
        else
            await User.findByIdAndUpdate(_id, {$pull: {pickLocations: {_id: loc_id}}})


        return res.status(200).json({"message": "Removed location"})
        
    } catch (err) {
        return res.status(err.code).json(err.message)
    }
}


exports.getLocation = async (req, res) => {
    try {
        const _id = res.locals.id
        const loc_id = req.params.id
        const user = await User.findById(_id)
        

        for (let i = 0; i<user.pickLocations.length; i++){
            if (user.pickLocations[i]._id == loc_id)
                return res.status(200).json(user.pickLocations[i])
            
        }


        for (let i = 0; i<user.dropLocations.length; i++){
            if (user.dropLocations[i]._id == loc_id)
                return res.status(200).json(user.dropLocations[i])
            
        }
    } catch (err) {
        return res.status(err.code).json(err.message)
        
     
    }
}




exports.getLocations = async (req, res) => {
    try {
        const _id = res.locals.id
        const type = req.params.type
        const user = await User.findById(_id)

        if (type === "pick")
            return res.status(200).json({"locations": user.pickLocations})
        
        else
            return res.status(200).json({"locations": user.dropLocations})
        
    } catch (err) {
        return res.status(err.code).json({"message": err.message})
    }
}


exports.getDriverLocation = async (req, res) =>{
    try {
        const packageID = req.params.packageID
        const package = await Package.findById(packageID)
        const courierID = package.courier._id
        const user = await User.findById(courierID)
        return res.status(200).json({"location": user.driverLocation})
    } catch (err) {
        return res.status(err.code).json({"message": err.message})
    }
}

exports.rateOrder = async (req, res) => {
    try {
        const packageId = req.body.ID
        const rating = req.body.rating
        const package = await Package.findByIdAndUpdate(packageId, {"rating": rating});
        const courierID = package.courier
        const packages = await Package.find({"courier": courierID})
        
        
        let sum = 0
        let count = 0
        for (let i = 0; i < packages.length; i++){
            if (packages[i].rating != undefined){
                sum+=packages[i].rating
                count+=1
            }
        }   
        let avg = 0
        if (count !== 0)
            avg = sum/count

        
        await User.findByIdAndUpdate(courierID, {"driverRating": avg})
        return res.status(200).json({"message": "Rating added"})


       

        
    } catch (err) {
        return res.status(400).json({"message": err.message})
    }
}