const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const msgSchema = new Schema({
  handle: String,
  message: String,
  roomName: String
});

module.exports = mongoose.model('msg',msgSchema);
