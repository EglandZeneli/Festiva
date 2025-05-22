
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title:            { type: String, required: true },
  category:         { type: String, required: true },
  startDate:        { type: Date,   required: true },
  endDate:          { type: Date },              // optional
  location:         { type: String, required: true },
  imageUrl:         { type: String },            // renamed
  price:            { type: Number, required: true },
  ticketsAvailable: { type: Number, required: true },
  organizer:        { type: String },            // optional
  description:      { type: String },            // optional / long text
}, {
});

module.exports = mongoose.model('Event', eventSchema);
