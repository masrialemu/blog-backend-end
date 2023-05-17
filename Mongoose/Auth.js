const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(value) {
        return /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(value);
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 4
  },

   public_url: {
    type: String,
    default: ''
   
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});


const User = mongoose.model('AuthX', userSchema);

module.exports = User;
