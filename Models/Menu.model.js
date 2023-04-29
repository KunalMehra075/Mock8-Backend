const mongoose = require("mongoose");


let menuSchema = mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String
})

const MenuModel = mongoose.model("menu", menuSchema)
module.exports = MenuModel;