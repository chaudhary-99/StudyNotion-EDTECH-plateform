const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator=require("otp-generator");

//SendOTP

exports.sendOTP = async (req, res) => {
    try {
        //fetch email from request body
        const { email } = req.body;
        //check user already present
        const checkUserPresent = await User.findOne({ email });
        //if user already exit then retutn a response
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered",
            })
        }
        //generate otp
        var otp=otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP Generated", otp);

        //check for Unique otp
        let result= await OTP.findOne({otp:otp});
        while(result){
            var otp=otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result= await OTP.findOne({otp:otp});
        }
        const otpPayload={email,otp};
        //create an entry for otp
        const otpBody=await OTP.create(otpPayload);
        console.log(otpBody);

        //return response Successfull
        res.status(200).json({
            success:true,
            message:"OTP sent Successfully",
            otp,
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:error.message,
        })

    }


};