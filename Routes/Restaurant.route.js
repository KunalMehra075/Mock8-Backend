const Authentication = require("../Middlewares/Authentication.middleware");
const MenuModel = require("../Models/Menu.model");
const RestaurantModel = require("../Models/Restaurant.model");

const RestaurantRouter = require("express").Router();


//! GET ALL RESTAURANTS
RestaurantRouter.get("/", async (req, res) => {
    try {
        const Restaurants = await RestaurantModel.find();
        res.status(200).json({ Message: "Here Are All the Restraunts", Restaurants });
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }
});

//! POST A NEW RESTAURANT
RestaurantRouter.post("/", Authentication, async (req, res) => {
    let restraunt = req.body
    let menu = req.body.menu
    try {
        const Existings = await RestaurantModel.find({ name: restraunt.name });
        if (Existings.length > 0) {
            res.status(200).json({ Message: "Restraunt Already Available" });
        } else {
            let menuItems = []
            for (let i = 0; i < menu.length; i++) {
                let item = new MenuModel(menu[i])
                menuItems.push(item)
            }
            restraunt.menu = menuItems
            let instance = new RestaurantModel(restraunt)
            await instance.save()
            res.status(200).json({ Message: "New Restaurant Created", instance });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }
});

//! GET RESTAURANTS BY ID
RestaurantRouter.get("/:id", async (req, res) => {
    let id = req.params.id
    try {
        const Restaurant = await RestaurantModel.findOne({ _id: id });
        res.status(200).json({ Message: "Get Restraunt by ID", Restaurant });
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }
});

//! GET MENU OF THE RESTAURANT BY ID
RestaurantRouter.get("/:id/menu", async (req, res) => {
    let id = req.params.id
    try {
        const Restaurant = await RestaurantModel.findOne({ _id: id });
        const Menu = Restaurant.menu
        res.status(200).json({ Message: `Here is the menu of the ${Restaurant.name} restraunt`, Menu });
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }
});

//! POST A NEW MENUITEM IN RESTRAUNT BY ID
RestaurantRouter.post("/:id/menu", Authentication, async (req, res) => {
    let id = req.params.id
    const menuitem = req.body
    try {
        const Restaurant = await RestaurantModel.findOne({ _id: id });
        const NewItem = new MenuModel(menuitem)
        Restaurant.menu.push(NewItem)
        const Posted = await RestaurantModel.findByIdAndUpdate({ _id: id }, Restaurant)
        res.status(200).json({ Message: "New Item Added to the Restaurant Menu", Posted });
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }
});

//! DELETE A MENUITEM IN RESTRAUNT BY ID
RestaurantRouter.delete("/:rid/menu/:mid", Authentication, async (req, res) => {
    const rid = req.params.rid
    const mid = req.params.mid
    try {
        const Restaurant = await RestaurantModel.findOne({ _id: rid });
        const Menu = Restaurant.menu
        let newMenu = Menu.filter((item) => item._id != mid)
        Restaurant.menu = newMenu
        const Updated = await RestaurantModel.findByIdAndUpdate({ _id: rid }, Restaurant)
        res.status(200).json({ Message: "One Menu Item Deleted from the Restraunt", Updated });
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }
});

module.exports = RestaurantRouter;