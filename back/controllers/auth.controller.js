import bcrypt from "bcryptjs";
import User from "../models/user.js";
import generateToken from "../utils/generatetokens.js";

export const signup = async (req, res) => {
    try {
        const { fullname, username, password, confirmpassword, gender } = req.body;
        // Check if password and confirm password match
        if (password !== confirmpassword) {
            return res.status(400).json({ err: "password and confirm password don't match!" });
        }
        // Check if the username is already taken
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ err: "username already taken!" });
        }
        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // Profile picture URLs based on gender
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        // Create a new user
        const newUser = new User({
            fullname,
            username,
            password: hashedPassword,
            gender,
            profilepic: gender === "male" ? boyProfilePic : girlProfilePic,
        });
        if(newUser) {
            generateToken(newUser._id, res);
        }
        // Save the new user to the database
        await newUser.save();
        // Return a success response
        return res.status(201).json({
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilepic: newUser.profilepic,
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ err: "internal error" });
    }
};

export const login = async (req, res) => {
    
    try{
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPassword = await bcrypt.compare(password, user?.password || "");
        if(!user, !isPassword) {
            return res.status(400).json({err:"Invald username or password!"});
        }
        generateToken(user._id, res);
        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilepic: user.profilepic,
        });
    } catch(err) {
        console.log(err);
        return res.status(500).json({ err: "internal error" });
    }
};

export const logout = (req, res) => {

    try{
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "Logged out successfully!"});

    } catch(err) {
        console.log(err);
        return res.status(500).json({ err: "internal error" });
    }
};
