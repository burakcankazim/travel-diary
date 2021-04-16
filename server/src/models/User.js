const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    // eslint-disable-next-line no-useless-escape
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    unique: true,
  },
  hash: String,
  salt: String,
  entries: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Entry',
    },
  ],
});

userSchema.plugin(uniqueValidator, { message: 'already taken' });

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.convertToJson = function () {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
  };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
