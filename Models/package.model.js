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

        packageType:{
            type: String,
            enum: ["A4 Envelope", "One or two books", "Shoe box", "Moving box"],
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


        status:{ // PENDING, ACCEPTED, OUT_FOR_DEL, DELIVERED
            type: String,
            enum: ["PENDING", "ACCEPTED", "OUT_FOR_DEL", "DELIVERED", "CANCELLED"],
            default: "PENDING"
        },

        ETA: {
            type: Date,
            required: false
        },

        pickLoc: {
            type: mongoose.Schema.ObjectId,
            required: true
        },

        dropLoc: {
            type: mongoose.Schema.ObjectId,
            required: true
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

        assignedAt:{
            type: Date
        },

        deliveredAt: {
            type: Date
        },

        rating: {
            type: Number,
            required: false
        },
        
        photoURL: {
            type: String,
            required: false
        }

    },

    { 
        timestamps: true
    }
);
const Package = mongoose.model("Package", packageSchema);

module.exports = Package;