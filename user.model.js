const mongoose = require("mongoose")



const UserSchema = mongoose.Schema(
    {
        
        firstName: {
            type: String,
            required: true
        },

        lastName: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String
        },

        phoneNO: {
            type: String,
            required: true,
            unique: true
        },

        gender: {
            type: String,
            required: true
        },

        photoURL: {
            type: String,
            required: false
        },

        isCourier: {
            type: Boolean,
            default: false
        },

        isAdmin: {
            type: Boolean,
            default: false
        },


        driverRating: {
            type: Number,
            required: false
        },

        driverStatus: {
            type: String,
            required: false
        },

        dropLocations:{
            type: [ { latitude : { type: Number, required: true }, 
                      altitude: { type : Number, required: true },
                      buildingNO: { type: Number, required: true },
                      floorNO: {type: Number, required: false},
                      flatNO: {type: Number, required: false} } ],
            required: false
        },

        pickLocations:{
            type: [ { latitude : { type: Number, required: true }, 
                      altitude: { type : Number, required: true },
                      buildingNO: { type: Number, required: true },
                      floorNO: {type: Number, required: false},
                      flatNO: {type: Number, required: false} } ],
            required: false
        },

        driverLocation: { // currLoc
            type: {
                latitude : { type: Number, required: true }, 
                altitude: { type : Number, required: true }
            },
            required: false
        }
    }
);
const User = mongoose.model("User", UserSchema);

module.exports = User;