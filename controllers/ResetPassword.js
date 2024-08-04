const User = require("../models/User");
const mailSender = require("../utils/mailSender");
//resetPasswordToken --mailSend krne ka kaam kr rhe hai
//resetPassword --> Db mein update krne ka kaam  

//resetPasswordToken
exports.resetPasswordToken = async (req, res) => {

    try {
        //get email from request body
        //check user for this email, email validation
        const { email } = req.body.email;
        const user = await User.findOne({ email }); //if prblm happen write {email:email}
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "This email doesn't registered with us",
            });
        }

        //generate token
        const token = crypto.randomUUID();
        //user updated by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            { email: email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000,
            },
            { new: true }  //third parameter new:true use krne se updated parameter return hota hai 
        );

        //create url
        const url = `http://localhost:3000/update-password/${token}`; //This is the link to be sent on frontend for Password Reset

        //send mail containing the URL
        await mailSender(email, "Password Rest Link", `Password Rest Link: ${url}`);
        return res.status().json({
            success: true,
            message: "Email sent successfully,please check email and change pwd",
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong, while reset password",
        })
    }
}

//ResetPassword
exports.resetPassword = async (res, req) => {
    try {
        //fetch data
        const { password, confirmPassword, token } = req.user.body;

        //validation
        if (password !== confirmPassword) {
            return res.status().json({
                success: false,
                message: "Password not matching",
            })
        }

        //get userdetails from db using token
        const userDetails = await User.findOne({ token: token });

        //if no entry - invalid token
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Token invalid"
            })
        }

        //token time check
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Token is expired, Please regenerate your token"
            });
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        //update the password in 
        await User.findOneAndUpdate({ token: token }, { password: hashedPassword }, { new: true },);
        return res.status(200).json({
            success: true,
            message: "Password reset Successfully",
        });

    }

    catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: "Something went wrong while reseting pwd",
        });  
    }
}
