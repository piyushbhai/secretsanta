const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  year: { type: Number, required: true },
  giverName: String,
  giverEmail: String,
  receiverName: String,
  receiverEmail: String
}, { timestamps: true });

schema.index({ year: 1, giverEmail: 1 }, { unique: true });

module.exports = mongoose.model('Assignment', schema);