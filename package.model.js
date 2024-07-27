const mongoose = require("mongoose")



const UserSchema = mongoose.Schema({

        sender: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
            required: true
        },

        courier: {
            type: mongoose.Schema.ObjectId,
            ref: "user",
            required: false
        },

        isFragile: {
            type: Boolean,
            required: true
        },

        inspectable: {
            type: Boolean,
            required: true
        },

        status:{ // PENDING || ACCEPTED || OUT_FOR_DEL || DELIVERED
            type: String,
            required: true
        },

        ETA: {
            type: Date,
            required: false
        },

        photoURL:{
            type: String,
            required: true
        },

        pickLoc: {
            type: {
                latitude : { type: Number, required: true }, 
                altitude: { type : Number, required: true },
                buildingNO: { type: Number, required: true },
                floorNO: {type: Number, required: false},
                flatNO: {type: Number, required: false}
            }
        },

        dropLoc: {
            type: {
                latitude : { type: Number, required: true }, 
                altitude: { type : Number, required: true },
                buildingNO: { type: Number, required: true },
                floorNO: {type: Number, required: false},
                flatNO: {type: Number, required: false}
            }
        },


        isGift: { // false = hta5od el floos 3nd el drop point
            type: Boolean,
            required: true
        },

      
    }
);
const User = mongoose.model("Package", UserSchema);

module.exports = User;