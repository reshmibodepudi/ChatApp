import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!taken){
            return res.status(401).json({err:"not authorized"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({err:"unauthorized"});
        }
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            res.status(404).json({err:"user not found"});
        }
        req.user=user;
        next();

    }catch(err){
        console.log(err);
        res.status(500).json({err:"server error"});
    }
};
export default protectRoute;