const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  email: {
    type: String,
    require

  },
  place: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    require,
    unique: true,
  },
  desc: {
    type: String
  },
  public_url: {
      type: String,
      default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Posto', postSchema);
