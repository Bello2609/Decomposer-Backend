// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const passport = require("passport");
// const config = require("./src/config");
const User = require("./src/api/model/User");
// require("dotenv").config();
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: `http://localhost:9000/api/v1/auth/google/callback`,
//     passReqToCallback: true
//   },
//   function(request, accessToken, refreshToken, profile, done) {
//     // User.findOrCreate({ googleId: profile.id }, function (err, user) {
//     //   return done(err, user);
//     // });
//     return done(err, done)
//   }
// ));
// passport.serializeUser((profile, cb)=>{ 
//     cb(null, profile);
// });
// passport.deserializeUser((profile, cb)=>{
//     cb(null, profile);
// })
const passport = require('passport')
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser((user,done) => {
    done(null, user.id);
});
passport.deserializeUser((user,done) => {
    done(null, user.id);
});
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `https://decomposer.onrender.com/google/callback`
  },
  async(accessToken, refreshToken, profile, cb)=>{
   // Register user here.
    // const user = await User.find({ "email": profile._json.email });
    // if(!user){
    //   const userInfo = {
    //     name: profile._json.name,
    //     email: profile._json.email,
    //     password: "sdnjks",
    //     role: "buyer",
    //     isVerified: false
    //   }
    //   const userSave = new User(userInfo);
    //   userSave.save();
    //   cb(null, profile);
    // }
    // //if the user exist it will create a token for the user
    //   User.createSessionToken(user._id, user.role);
     cb(null,profile);
  }
));