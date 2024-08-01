const mongoose=require("mongoose");
const CourseProgress=new mongoose.Schema({
    courseProgress:
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseProgress",
        },
    CompletedVideos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubSection",
        }
    ],
});
module.exports= mongoose.model("CourseProgress",CourseProgress);