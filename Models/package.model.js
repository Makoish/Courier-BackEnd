const mongoose = require("mongoose")



const packageSchema = mongoose.Schema({

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

        packageName:{
            type: String,
            required: true
        },

        isFragile: {
            type: Boolean,
            required: false,
            default: false
        },

        inspectable: {
            type: Boolean,
            required: false,
            default: false
        },


        status:{ // PENDING || ACCEPTED || OUT_FOR_DEL || DELIVERED
            type: String,
            enum: "PENDING" || "ACCEPTED" || "OUT_FOR_DEL" || "DELIVERED" || "CANCELLED",
            default: "PENDING"
        },

        ETA: {
            type: Date,
            required: false
        },

        pickLoc: {
            type: mongoose.Schema.ObjectId
        },

        dropLoc: {
            type: mongoose.Schema.ObjectId
        },

        shippingPrice: {
            type: Number,
            required: false
        },

        packagePrice: {
            type: Number,
            required: true
        },

        packageDescription: {
            type: String,
            required: false
        },


        isGift: { // false = hta5od el floos 3nd el drop point
            type: Boolean,
            required: true
        },

        acceptedAt: {
            type: Date
        },

        deliveredAt: {
            type: Date
        },

        rating: {
            type: Number,
            required: false
        }

    },

    { 
        timestamps: true
    }
);
const Package = mongoose.model("Package", packageSchema);

module.exports = Package;