const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP Generated", otp);

        //check for Unique otp
        let result = await OTP.findOne({ otp: otp });
        while (result) {
            var otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });
            result = await OTP.findOne({ otp: otp });
        }
        const otpPayload = { email, otp };

        //create an entry for otp
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        //return response Successfull
        res.status(200).json({
            success: true,
            message: "OTP sent Successfully",
            otp,
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })

    }
};

//signUp
exports.signUp = async (req, res) => {
    try {
        //data fetch from request body 
        const { firstName, lastName, email, password, confirmPassword, accountType, contactNumber, otp } = req.body;

        //validate entries
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields are required",

            })
        }

        //match both passwords
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirmes Password value doesn't match",
            })
        }

        //check user already exit or not
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return response.status(400).json({
                success: false,
                message: "User is already registered",
            });
        }

        //find most recent OTP stored for the User
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);

        //OTP validation
        if (recentOtp.length === 0) {
            //OTP not found
            return response.status().json({
                success: false,
                message: "OTP not found",
            })
        }
        else if (otp !== recentOtp) {
            //Invalid OTP
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            })
        }

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10); //10 is number of rounds to hash a password

        //Entry created in DB

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        //return response Successfull
        res.status(200).json({
            success: true,
            message: "User Registered Successfully",
            user,
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered, try again",
        })

    }
};

//Login

exports.login = async (req, res) => {
    try {
        //get data from req body
        const { email, password } = req.body;

        //validation data
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required, Please try again alter",
            });
        }

        //user check exist or not
        const user = await User.findOne({ email }).populate("additonalDetails");
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not Registered, please signup first",
            });

        }

        //password matching then generate JWT token
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h"
            });
            user.token = token;
            user.password = undefined;
            //create cookie and send response 
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: "User Logged in Successfully",
            })
        }
        else {
            //return response Successfull
            res.status(401).json({
                success: false,
                message: "Password is incorrect",

            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failure, please try again",
        })

    }
};

//changePassword
exports.changePassword = async (req, res) => {
    try {
        //set data from req body
        //get oldpassword, newPassword, confirmNewPassword
        //Validation
        //Update pwd in Db
        //send mail to User - password updated
        //return response
        
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login failure, please try again",
        })

    }
};

