const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  email: {
    type: String,
    require:true
  },
  place: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    require:true,
    unique: true,
  },
  desc: {
    type: String,
    default: ''

  },
  public_url: {
      type: String,
      default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Posto', postSchema);
