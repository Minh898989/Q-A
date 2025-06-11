const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const ggModel = require("../models/ggModel");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://api-tdminh-15.onrender.com/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await ggModel.findOrCreateGoogleUser(profile);
            return done(null, user);
        } catch (err) {
            return done(err, null);
        }
    }));

module.exports = passport;