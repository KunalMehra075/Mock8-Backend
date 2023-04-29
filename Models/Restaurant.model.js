const mongoose = require("mongoose");
const RestaurantSchema = mongoose.Schema({
    name: String,
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zip: String
    },
    menu: [{
        _id: mongoose.ObjectId,
        name: String,
        description: String,
        price: Number,
        image: String
    }]
}
)

const RestaurantModel = mongoose.model("restaurants", RestaurantSchema)
module.exports = RestaurantModel;