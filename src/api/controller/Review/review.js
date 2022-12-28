const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Review = require("../../model/Review");
const config = require("../../../config");
module.exports.postReview = async( req, res, next )=>{
   let token = req.headers.authorization;
   let user_id;
   const { description }  = req.body;
    token = token.split(" ")[1];
    if(token){
        jwt.verify(token, config.SECRET_JWT, (err, decode)=>{
            // get the id of the user that send the request
            user_id = decode._id;
        });
    }
    const review = new Review({
        buyerName: user_id,
        description: description
    });
    review.save(err=>{
        if(err){
            res.status(500).json({
                succes: false,
                data: {
                    message: "Server error"
                }
            })
        }
        return res.status(201).json({
            success: true,
            data: {
                message: "Review posted successfully"
            }
        })
    });
}
module.exports.getAllReview = async( req, res, next )=>{
    const review = await Review.find({}).populate("buyerName").exec();
    if(review.lenght < 1){
        res.status(404).json({
            success: false,
            data: {
                message: "No review is found"
            }
        })
    }
    return res.status(200).json({
        success: true,
        data:{
            review,
            message: "All reviews fetched successfully"
        }
    })
}