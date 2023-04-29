const mongoose = require("mongoose");
const OrderSchema = mongoose.Schema({
    user: { type: mongoose.ObjectId, ref: 'User' },
    restaurant: { type: mongoose.ObjectId, ref: 'Restaurant' },
    items: [{
        name: String,
        price: Number,
        quantity: Number
    }],
    totalPrice: Number,
    deliveryAddress: {
        street: String,
        city: String,
        state: String,
        country: String,
        zip: String
    },
    status: { type: String, enum: ["placed", "preparing", "on the way", "delivered"], default: "preparing" }
})
const OrderModel = mongoose.model("orders", OrderSchema)
module.exports = OrderModel;