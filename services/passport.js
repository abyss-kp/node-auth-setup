const passport = require('passport');
const User = require('../models/user')
const config = require('../config')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const LocalStrategy = require('passport-local')

// Create local Strategy
const localOptions = { usernameField: 'email' }
const localLogin = new LocalStrategy({
  localOptions,
  function(email, password) {
    // Verify username and password,call done with the user
    // If it is the correct email and password
    // Otherwise, call done with false
    User.findOne({ email: email }, function (err, user) {
      if (err)
        return done(err)
      if (!user) return done(null, false)

      // Compare password- is password equal to user.password
      user.comparePassword(password, function (err, isMatch) {
        if (err) return done(err)
        if (!isMatch) return done(null, false)
        return done(null, user)
      })
    })
  }
})

//Setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'), secretOrKey: config.secret
}

// Create JWT strategy
const jwtLogin = new JwtStrategy(jwtOptions, function (payload, done) {
  // See if user id in payload exists in DB
  // If it does, call 'Done' with that 
  // otherwise , call done without user obj
  User.findById(payload.sub, function (err, user) {
    if (err)
      return done(err, false)
    if (user)
      done(null, user)
    done(null, false)
  })
})

// Tell passport to use this strategy
passport.use(jwtLogin)
passport.use(localLogin)