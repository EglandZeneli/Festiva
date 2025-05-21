// Backend/models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title:            { type: String, required: true },
  category:         { type: String, required: true },
  startDate:        { type: Date,   required: true },
  endDate:          { type: Date },
  location:         { type: String, required: true },
  imageUrl:         { type: String },
  price:            { type: Number, required: true },
  ticketsAvailable: { type: Number, required: true },
  organizer:        { type: String },
  description:      { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
