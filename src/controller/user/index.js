import { sendResponse } from "../../helpers/sendResponse.js";
import User from "../../models/user/index.js";



const GetAllFromDB = async (req, res) => {
  const result = await User.find().select("-password");
  sendResponse(res, {
    statusCode: 200,
    message: "User Rettrieve successfully",
    data: result,
  });
}

const CheckUser = async (req,res)=>{
    res.json({
        success:true,
        message:"User checked successfully",
        user:req.user
    })
};


export const UserController = {
    GetAllFromDB,
    CheckUser
}