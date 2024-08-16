const distance = require("../utils/distance.js");
const Package = require("../../Models/package.model.js")
const User = require("../../Models/user.model.js");
const AppError = require("../utils/AppError.js");





const getMaxDate = (arr) => {
    if (arr.length === 0)
        return
    max_date = arr[0].ETA

    for (let i = 1; i < arr.length; i++){
        if (arr[i].ETA > max_date)
            max_date = arr[i].ETA;
    
    }
    max_date.setHours(0, 0, 0, 0)
    return max_date
  };



exports.changeOrder = async (req, res) => {
    const order_id = req.body.id
    const status = req.body.status
    const order = await Package.findById(order_id)
    const pickID = order.pickLoc
    const dropID = order.dropLoc
    const senderID = order.sender
    const user = await User.findById(senderID)

    const dropLocation = user.dropLocations.find(obj => obj._id.equals(dropID));
    const pickLocation = user.pickLocations.find(obj => obj._id.equals(pickID));
    
    
  
    let destination = `${dropLocation.latitude}, ${dropLocation.altitude}`

    let source = `${pickLocation.latitude}, ${pickLocation.altitude}`
    
    console.log(source)
    
    

    const values = await distance(source, destination)
    const order_ETA_min = values["minutes"]
    const distance_KM = values["distance"]
    const packageToPirce = {"A4 Envelope": 1, "One or two books": 1.3, "Shoe box": 1.5, "Moving box":  1.7}
    order.status = status
    let priceCalc = (distance_KM * 50)/20 
    order.shippingPrice = ((priceCalc > 50) ? priceCalc : 50) * packageToPirce[order.packageType]
    

    if (status === "ACCEPTED"){
        
        order.acceptedAt = Date.now()
        await order.save()
        const drivers = await User.find({"isCourier": true})
        let driversClone = [...drivers]
        for (let i = 0; i<drivers.length; i++){
            let driverOrders = await Package.find({"courier": driversClone[i]._id, "status": {"$ne": "DELIVERED"}});
            driversClone[i]["currOrders"] = driverOrders.length;
            driversClone[i]["maxETA"] = getMaxDate(driverOrders)        
        }


        driversClone.sort((a, b) => { return a.maxETA - b.maxETA; });

    
    
    for (let i = 0; i < driversClone.length; i++){
        if (driversClone[i].maxETA === undefined  || Date.now() > driversClone[i].maxETA){
            order.courier = driversClone[i]._id
            let newTime = Date.now() + order_ETA_min * 60000
            let newDate = new Date(newTime)
            order.ETA = newDate.setHours(23, 23, 23, 23)
            order.assignedAt = Date.now();
            await order.save()
            return res.status(200).json({"message": "order assigned", "courierID": driversClone[i]._id})
        }
        else{
            let expectedDate = driversClone[i].maxETA
            expectedDate.setMinutes(driversClone[i].maxETA.getMinutes() + order_ETA_min)
            let todaysDay = new Date (Date.now()).getDay();
            if (expectedDate.getDay() < todaysDay && (todaysDay - expectedDate.getDay()) < 5)
                continue
            else if (expectedDate.getDay() > todaysDay && (expectedDate.getDay() - todaysDay) > 2 )
                continue
            
            order.courier = driversClone[i]._id;
            order.ETA = expectedDate.setHours(23, 23, 23, 23)
            order.assignedAt = Date.now();
            await order.save()
            return res.status(200).json({"message": "order assigned" , "courierID": driversClone[i]._id})
        }
    }
 
}

}


exports.orders = async (req, res) => {
    try {
        const ID = req.params.id
        const order = await Package.findById(ID).populate("sender").select("-__v -createdAt -updatedAt")
        const orderClone = order.toObject();
        
        
    
        
        
        orderClone.pick = orderClone.sender.pickLocations.find(loc => loc._id.equals(orderClone.pickLoc))
        orderClone.drop = orderClone.sender.dropLocations.find(loc => loc._id.equals(orderClone.dropLoc))
        delete orderClone.sender
        delete orderClone.dropLoc
        delete orderClone.pickLoc
        
        return res.status(200).json(orderClone)
    } catch (err) {
        return res.status(400).json(err.message)
        
    }

}


exports.orders = async (req, res) => {
    try {
        
        let status = "PENDING"
        let start = 0
        let offset = 1000
        
        if (req.query.start != undefined)
            start = req.query.start
        if (req.query.offset != undefined)
            offset = req.query.offset
        if (req.query.status != undefined)
            status = req.query.status
        
        const orders = await Package.find({"status": status}).select("packageName packageType status rating sender pickLoc dropLoc").populate("sender").sort({createdAt: -1})
        const ordersClone = orders.map(order => {
            const orderObject = order.toObject();
            return orderObject;
          });

        for (let i = 0; i<ordersClone.length; i++){
            ordersClone[i].pick = ordersClone[i].sender.pickLocations.find(loc => loc._id.equals(orders[i].pickLoc)).city
            ordersClone[i].drop = ordersClone[i].sender.dropLocations.find(loc => loc._id.equals(orders[i].dropLoc)).city
            delete ordersClone[i].sender
            delete ordersClone[i].dropLoc
            delete ordersClone[i].pickLoc
        }
        let paginatedOrders = ordersClone.slice(start, start+offset);
        return res.status(200).json({"orders": paginatedOrders})
    } catch (err) {
        return res.status(400).json(err.message)
        
    }
};



exports.addUser = async (req, res) => {
    try {
        await User.create(req.body, verified = false);
        return res.status(200).json({message: "User created"})
        
    } catch (error) {
        return res.status(400).json({"message": error.message})
    }

}


exports.users = async (req, res) => {
    try {
        let start = 0
        let offset = 1000000
        let type = req.body.type
        if (req.query.start != undefined)
            start = req.query.start
        if (req.query.offset != undefined)
            offset = req.query.offset


        let users = []
        if (type === "user")
            users = await User.find({$and : [{"isAdmin": {$ne: true}}, {"isCourier": {$ne: true}}]}).select("-__v -password -createAt -updateAt -dropLocations -pickLocations").sort({createdAt: -1})
        else if (type === "admin")
            users = await User.find({"isAdmin": true}).select("-__v -password -createAt -updateAt -dropLocations -pickLocations").sort({createdAt: -1})
        else
            users = await User.find({"isCourier": true}).select("-__v -password -createAt -updateAt -dropLocations -pickLocations -driverLocation").sort({createdAt: -1})


        return res.status(200).json({"Users": users})
        
        
    } catch (error) {
        return res.status(400).json({"message": error.message})
    }

}


exports.delUser = async (req, res) =>{
    try {
        const id = req.params.id
        const user = await User.findById(id)
        if (!user)
            throw new AppError("User doesn't exist", 404)

        await User.findByIdAndDelete(id)
        return res.status(200).json({"message": "User deleted"})
        
    } catch (error) {
        return res.status(400).json({"message": error.message})
        
    }
}