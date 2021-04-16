const mongoose = require('mongoose');
const GeoJSON = require('mongoose-geojson-schema');

const { Schema } = mongoose;

const entrySchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: String,
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  location: {
    type: mongoose.Schema.Types.Point,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Entry = mongoose.model('Entry', entrySchema);

module.exports = Entry;
