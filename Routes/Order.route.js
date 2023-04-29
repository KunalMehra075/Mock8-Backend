const Authentication = require("../Middlewares/Authentication.middleware");
const OrderModel = require("../Models/Order.model");

const OrderRouter = require("express").Router();

//! GET ALL ORDERS
OrderRouter.get("/", async (req, res) => {
    try {
        const Orders = await OrderModel.find();
        res.status(200).json({ Message: "Here are All the Orders", Orders });
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }
});

//! POST A NEW ORDER
OrderRouter.post("/", Authentication, async (req, res) => {
    const order = req.body
    try {
        const instance = new OrderModel(order);
        await instance.save()
        res.status(200).json({ Orders: "New Order Placed", instance });
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }
});

//!  GET ORDER BY ID
OrderRouter.get("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const Order = await OrderModel.findOne({ _id: id });
        res.status(200).json({ Message: "Get Order By ID", Order });
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }
});

//!  PATCH ORDER BY ID
OrderRouter.patch("/:id", Authentication, async (req, res) => {
    const id = req.params.id
    const payload = req.body
    try {
        const Updated = await OrderModel.findByIdAndUpdate({ _id: id }, payload);
        res.status(200).json({ Message: "Order with id" + id + "Updated", Updated });
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }
});

module.exports = OrderRouter;