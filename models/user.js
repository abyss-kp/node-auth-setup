const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs')
//Define a model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String
})
//On save HOok, encrypt password
//Before saving a model, run this function
userSchema.pre('save', function (next) {
  const user = this;

  //generate a salt then run callback
  bcrypt.genSalt(10, function (err, salt) {
    if (err)
      return next(err)

    //hash (encrypt) our password using salt
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      if (err)
        return next(err)

      //overwrite palin text password with encrypted password
      user.password = hash
      next()
    })
  })
})
userSchema.method.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return callback(err)
    callback(null, isMatch)
  })
}

//Create model class
const ModelClass = mongoose.model('user', userSchema);

//Export model
module.exports = ModelClass