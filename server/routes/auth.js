import express from "express";
import { User } from "../models/User.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const router = express.Router();

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    //validation
    if (!username || !password)
        return res
            .status(400)
            .json({ success: false, message: "Missing username or password" });
    try {
        // Check for existing user
        const user = await User.findOne({ username });

        if (user)
            return res
                .status(400)
                .json({ success: false, message: "Username already" });
        // Not existing user
        const hashedPassword = await argon2.hash(password);
        const newUser = new User({
            username,
            password: hashedPassword,
        });
        await newUser.save();

        // Rerurn notif and token
        const accessToken = jwt.sign(
            { userId: newUser._id },
            process.env.ACCESS_TOKEN_SECRET
        );

        res.json({
            success: true,
            message: "Created Success",
            accessToken,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

// @route POST api/auth/login
// @desc Login user
// @access Public
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    //validation
    if (!username || !password)
        return res
            .status(400)
            .json({ success: false, message: "Missing username or password" });

    try {
        // Check for existing user ///username
        const user = await User.findOne({ username });
        if (!user)
            return res.status(400).json({
                success: false,
                message: "Incorrect username or password",
            });
        // username found check password
        const passwordValid = await argon2.verify(user.password, password);
        if (!passwordValid)
            return res.status(400).json({
                success: false,
                message: "Incorrect password or passwor",
            });
        // Username and pass good
        // Rerurn token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET
        );

        res.json({
            success: true,
            message: "Login success",
            accessToken,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});

export default router;
