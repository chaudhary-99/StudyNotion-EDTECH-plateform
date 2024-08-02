const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");
const OTPSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    },
});

// a function => to send emails
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse= await mailSender(email,"Verification Email from StudyNotion",otp);
        console.log("Email sent Successfully", mailResponse);

    }
    catch{
        console.log("Error occured while sending mails:", error);
        throw error;
    }

}
// This is pre middleware which means Document save hone se pehle ek mail jayegi with an otp
OTPSchema.pre("save",async function(next){
    await sendVerificationEmail(this.email,this.otp);
    next();
})
module.exports= mongoose.model("OTP",OTPSchema); 
 