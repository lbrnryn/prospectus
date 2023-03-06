const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/User");

module.exports = function(passport) {
    passport.use(new LocalStrategy(async (username, password, done) => {
        const user = await User.findOne({ username: username });
        if (!user) { return done(null, false) }
        const passwordMatched = await bcrypt.compare(password, user.password);
        if (!passwordMatched) { return done(null, false) }
        return done(null, user)
    }))
}

passport.serializeUser((user, done) => {
    done(null, user._id)
})
passport.deserializeUser(async (id, done) => {
    // const user = await User.findOne({ _id: id });
    const user = await User.findById(id);
    done(null, user)
})

// module.exports = function(passport) {
//     passport.use(new LocalStrategy(async function(username, password, done) {
//         User.findOne({ username: username }, (err, user) => {
//             if (err) {
//                 console.log(err);
//                 return done(err);
//             }
//             if (!user) { return done(null, false) }
//             bcrypt.compare(password, user.password, function(err, res) {
//                 if (err) {
//                     console.log(err)
//                 }
//                 console.log(res)
//             })
//             return done(null, user);
//         })

//         // try {
//         //     const user = await User.findOne({ username: username });
//         //     console.log(user)
//         //     if (!user) { return done(null, false) }
//         //     const passwordMatched = await bcrypt.compare(password, user.password);
//         //     if (!passwordMatched) { return done(null, false) }
//         //     return done(null, user);
//         // } catch(err) { console.log(err) }
//     }))
// }

// passport.serializeUser((user, done) => { done(null, user) });
// passport.deserializeUser((user, done) => { done(null, user) });