const jwt=require("jsonwebtoken");
require("dotenv").config();

const User=require("../models/User");

//auth
exports.auth=async(req,res,next)=>{
    try{
        //token can be extracted from cookies, body, beerer token 
        //Most safest method - beerer token
        //most unsafe token method - body
        const token=req.cookies.token ||req.cookies.body|| req.header("Authorisation");

        //if token missing
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is Missing",
            });
        }

        //Verify the token - using secret Key
        try{
            const decode= await jwt.verify(token,process.env.JWT_SECRET);
            console.log(decode);
            req.user=decode;
        }
        catch(error){
            //verification issue
            return res.status(401).json({
                success:false,
                message:"Token is invalid",
            });
        }
        next();
    }
    catch{
        return res.status(401).json({
            success:false,
            message:"Something went wrong, while validating the token",
        })
    }
}
//isStudent
exports.isStudent=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Student only",
            })
        }
        next();
    }
    catch{
        return res.status(500).json({
            success:false,
            message:"User Role can't be verfied",
        })
    }
}

//isInstructor
exports.isInstructor=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Instructor only",
            })
        }
        next();
    }
    catch{
        return res.status(500).json({
            success:false,
            message:"User Role can't be verfied",
        })
    }
}


//isAdmin
exports.isAdmin=async(req,res,next)=>{
    try{
        if(req.user.accountType!=="Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin only",
            })
        }
        next();
    }
    catch{
        return res.status(500).json({
            success:false,
            message:"User Role can't be verfied",
        })
    }
}

