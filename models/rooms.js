const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  roomName: String
});

module.exports = mongoose.model('room',roomSchema);
