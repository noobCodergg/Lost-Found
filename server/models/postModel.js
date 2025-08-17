const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  itemName: String,
  category: String,
  status: String, // 'lost' or 'found'
  description: String,
  date: Date,
  imageUrl: String, 
  user:String,
  latitude:Number,
  longitude:Number,
}, { timestamps: true });

module.exports = mongoose.models.Report || mongoose.model('items', postSchema);
