const config = require("../../../config");
const stripe = require("stripe")(config.STRIPE_SECRET_KEY);
const User = require("../../model/User");
// const Order = require("../");

//get the logged in user
const { getLoggedUserId } = require("../../../utils/generalUtils");
//webhook secret
const endpointsecret = "sdlfnskldvnsdlsd";

//create a connected account for all sellers

module.exports.createConnectedAccount = async (req, res, next)=>{
    const { country } = req.body;
    //get the login user information from the database;
    const getUserId = await getLoggedUserId(req.headers.authorization);
    console.log(getUserId);
    const getUserIdToString = getUserId.toString();
    const user  = await User.findById(getUserIdToString);
    if(!user){
        res.status(404).json({
            success: false,
            message: "user not found"
        })
    }
    const account = await stripe.accounts.create({
        type: "express",
        country: country,
        email: user.email,
        capabilities: {
            card_payments: {
                requested: true
            },
            transfers: {
                requested: true
            }
        }

    }, (err, info)=>{
        console.log(err);
        console.log(info);
    });
    console.log(account);
    return res.status(201).json({
        succes: true,
        message: "You have created a connected account successfully !!!",
        account: account
    })
    
}
// crate a payment intent to collect payment from the customer and submit it to the user

module.exports.createIntent = async (req, res, next)=>{
    const paymentIntent = await stripe.paymentIntents.create({
        amount: "20",
        currency: "",
        automatic_payment_method: { enabled: true },
        application_fee_amount: 123,
        transfer_date: {
            destination: "connectedID"
        }
    });
    return res.status(201).json({
        success: true,
        client_secret: paymentIntent.client_secret,
        
    })

}
//set up webhook to handle post payment
module.exports.handlePostPayment = (req, res, next)=>{
    let event = req.body;
    if(endpointsecret){
        //get the signature sent by stripe
        const signature = request.headers["stripe-signature"];
        try{
            event = stripe.webhooks.constructEvent(req.body, siganture, endpointsecret);
        }catch(err){
            console.log("webhook verification failed", err.message);

        }
    }
    //handle the event
    switch(event.type){
        case "payment_intent.succeded":
            const payment_intent = event.data.object;
            console.log(`payment intent for ${payment_intent.amount} was successful`);
            break;
        case "payment_intent.processing":
            const payment_processing = event.data.object;
            console.log(`payment intent for ${payment_processing.amount} is under processing`);
            break;
        case "payment_intent.failed":
            const payment_failed = event.data.object;
            console.log(`payment intent for ${payment_failed.amount} has failed`);
        default:
            console.log(`unhandled event type ${event.type}`);
    } 
    return res.status(200).json({
        message: "successful"
    });
}
//this is for the refund we will have to create a charge Id before the refund
// module.exports.refundPayment = async (req, res, next) =>{
//     const charge = await stripe.charges.create({

//     })
// }