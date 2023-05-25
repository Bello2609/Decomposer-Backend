const { Strategy } = require("passport-google-oauth20");
const passport = require("passport");
const config = require("./src/config");
const User = 

passport.use(
    new Strategy({
        clientID: config.CLIENT_ID,
        clientSecret: config.CLIENT_SECRET,
        callbackURL: `v1/auth/google/callback`
    },
        async (accessToken, refreshToken, profile, cb)=>{

            return cb(err, profile);
        }   
    )
);
passport.serializeUser((profile, cb)=>{
    cb(null, profile);
});
passport.deserializeUser((profile, cb)=>{
    cb(null, profile);
})