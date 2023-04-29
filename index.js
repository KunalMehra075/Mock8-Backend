const express = require("express");
const connection = require("./Config/db");
const RestaurantRouter = require("./Routes/Restaurant.route");
const UserRouter = require("./Routes/User.route");
const OrderRouter = require("./Routes/Order.route");


const app = express();
app.use(express.json());


app.use("/user", UserRouter)
app.use("/orders", OrderRouter)
app.use("/restaurants", RestaurantRouter)


app.get("/", (req, res) => {
    try {
        res.status(200).json({ Message: "Welcome to Food Delivery App" });
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }
});





app.listen(process.env.PORT, async () => {
    try {
        await connection;
        console.log("Connected to DB");
    } catch (err) {
        console.log("Error connecting to DB");
    }
    console.log(`Server is Rocking on port ${process.env.PORT}`);
});
