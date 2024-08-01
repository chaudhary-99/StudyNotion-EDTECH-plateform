const mongoose=require("mongoose");
const tagsSchema=new mongoose.Schema({
    name:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User",
    },
    de:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true,
    },
});
module.exports= mongoose.model("tagsSchema",tagsSchema); 