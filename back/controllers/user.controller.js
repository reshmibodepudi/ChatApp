import User from "../models/user.js";

export const getUsersForSidebar = async (req, res) => {
    try{
        const loggedInUserId = req.user._id

        const filterUser = await User.find({_id: {$ne: loggedInUserId}}).select("-password")

        res.status(200).json(filterUser);

    } catch(err){
        console.log(err);
        res.status(500).json({err:"internal error"});
    }

};
