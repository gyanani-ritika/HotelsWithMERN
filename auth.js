const LocalStrategy = require('passport-local').Strategy
const passport = require('passport')
const Person = require('./models/Person');

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await Person.findOne({ userName: username });
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
            //done is a callback function that takes three arguments: error, user, and info
        }

        const isPasswordMatch = await user.comparePassword(password);
        // comparePassword is a method defined in the Person model
        if (isPasswordMatch) {
            return done(null, user);
        }
        else {
            return done(null, false, { message: 'Incorrect password.' });
        }
    } catch (error) {
        return done(error);
        // user is not need to be passed in case of error
    }
}))

module.exports = passport; 