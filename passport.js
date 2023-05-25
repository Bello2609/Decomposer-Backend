const { Strategy } = require("passport-google-oauth20");
const passport = require("passport");
const config = require("./src/config");
const User = require("./src/api/model/User");

// passport.use(
//     new Strategy({
//         clientID: config.CLIENT_ID,
//         clientSecret: config.CLIENT_SECRET,
//         callbackURL: `v1/auth/google/callback`,
//         passReqToCallback: true
//     },
//         async (accessToken, refreshToken, profile, cb)=>{

//             return cb(err, profile);
//         }
//     )
// );
passport.use(new Strategy({
    clientID: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET,
    callbackURL: `v1/auth/google/callback`,
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return done(err, user);
    // });
    return done(err, done)
  }
));
passport.serializeUser((profile, cb)=>{ 
    cb(null, profile);
});
passport.deserializeUser((profile, cb)=>{
    cb(null, profile);
})