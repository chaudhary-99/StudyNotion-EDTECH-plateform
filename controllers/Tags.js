const Tag=require("../models/Tags");

//create tag ka handler function
exports.createTag=async(req,res)=>{
    try{
        //fetch data
        const {name,description}=req.body;
        //validation
        if(!name||!description){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        //create entry in DB
        const tagDetails=await Tag.create({
            name:name,
            description:description,
        });
        console.log(tagDetails);
        //return response
        res.status(200).json({
            success:true,
            message:"Tag created successfully",
        })


    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
 
};

// get all tags
exports.showAlltags=async(req,res)=>{
    try{
        const allTags=await Tag.find({},{name:true,description:true});

       
        //return response
        res.status(200).json({
            success:true,
            message:"All Tags returned successfully",
            allTags,
        })


    }
    catch(error){
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};
