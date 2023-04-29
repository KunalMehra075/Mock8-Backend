const Authentication = require("../Middlewares/Authentication.middleware");
const UserModel = require("../Models/User.model");

const UserRouter = require("express").Router();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

UserRouter.get("/", async (req, res) => {
    try {
        const Users = await UserModel.find();
        res.status(200).json({ Users });
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }
});
// ! Register Route
UserRouter.post("/register", async (req, res) => {
    let { email, password } = req.body
    let user = req.body
    try {
        const users = await UserModel.find({ email });
        if (users.length > 0) {
            res.status(200).json({ Message: "You Have Already Registered, Please Login", success: false, exist: true });
        } else {
            bcrypt.hash(password, 10, async (err, hash) => {
                if (hash) {
                    user.password = hash
                    let instance = new UserModel(user)
                    await instance.save()
                    res.status(201).json({ Message: "Signup Successful", success: true, exist: false, instance });
                } else {
                    res.status(400).json({ Message: "Bcrypt Error", success: false, exist: false });
                }
            })
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }
});
// ! Login Route
UserRouter.post("/login", async (req, res) => {
    let { email, password } = req.body
    try {
        let Data = await UserModel.find({ email })
        if (Data.length == 0) {
            res.status(200).json({ Message: "You are not registered with Us, Please Signup", success: false, exist: false });
        } else {
            let user = Data[0]
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    jwt.sign({ userID: user._id }, process.env.key, (err, token) => {
                        if (token) {
                            res.status(200).json({ Message: "Login Successful", token, success: true, exist: true, user });
                        } else {
                            res.status(400).json({ Message: "JWT error", success: false, exist: true });
                        }
                    });
                } else {
                    res.status(200).json({ Message: "Wrong Credentials", success: false, exist: true });
                }

            })
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err, success: false, exist: true })
    }
});
// ! Patch Route
UserRouter.patch("/:id/reset", Authentication, async (req, res) => {
    let id = req.params.id
    const payload = req.body
    let password = req.body.password
    try {
        bcrypt.hash(password, 10, async (err, hash) => {
            if (hash) {
                payload.password = hash
                const Updated = await UserModel.findByIdAndUpdate({ _id: id }, payload);
                res.status(200).json({ Message: "Updated User Details", Updated });
            } else {
                res.status(400).json({ Message: "Bcrypt Error", success: false, exist: false });
            }
        })
    } catch (err) {
        console.log(err);
        res.status(400).json({ Error: err })
    }
});







module.exports = UserRouter;