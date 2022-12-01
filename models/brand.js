const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Brand model schema
const BrandSchema = new Schema({
  name: { type: String, required: true, maxLength: 50 },
  about: { type: String, maxLength: 2000 },
});

BrandSchema.virtual('url').get(function () {
  return `/stock/brand/${this._id}`;
});

module.exports = mongoose.model('Brand', BrandSchema);
