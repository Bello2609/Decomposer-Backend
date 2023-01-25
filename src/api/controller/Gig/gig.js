const jwt = require("jsonwebtoken");
const Gig = require("../../model/Gig");
const config = require("../../../config");
module.exports.postReview = async( req, res, next )=>{
    try{
        let token = req.headers.authorization;
        let gigId = req.params.id;
        let user_id;
        const { description, rating }  = req.body;
        token = token.split(" ")[1];
        if(token){
            jwt.verify(token, config.SECRET_JWT, (err, decoded)=>{
                // get the id of the user that send the request
                user_id = decoded._id;
            });
        }
        const gig = await Gig.findById(gigId).exec();
        if(!gig){
            return res.status(404).json({
                data: {
                    message: "Sorry this gig cannot be found"
                }
            })
        }else{
            if(rating > 5){
                return res.status(404).json({
                    data: {
                        message: "Sorry you have exceeded the rating limit"
                    }
                });
            }

            const newReview = {
                buyerName: user_id,
                rating: Number(rating),
                description: description
            }
            gig.review.push(newReview);
            gig.numReview = gig.review.length;
            gig.ratings = gig.review.reduce((acc, curentValue) => curentValue.rating + acc, 0) / gig.review.length;
            gig.save((err, save)=>{
                if(err){
                    return res.status(501).json({
                        data: {
                            message: err.message
                        }
                    })
                }
                return res.status(201).json({
                    data: {
                        message: "You have succesfully added a review",
                        review: save
                    }
                })
            })
        }
    }catch(err){
        return res.status(404).json({
            data: {
                message: err.message
            }
        })
    }
    
}
module.exports.getAllReview = async( req, res, next )=>{
    const review = await Gig.find({}).populate("buyerName").exec();
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