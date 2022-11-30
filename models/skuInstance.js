const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// SKU Instance model schema
const SKUInstanceSchema = new Schema({
  sku: { type: Schema.Types.ObjectId, ref: 'SKU', required: true },
  size: { type: Number, required: true },
  unit: { type: String, required: true },
  quality: {
    type: String,
    required: true,
    enum: ['New', 'Used - Immaculate', 'Used - Good', 'Used - Worn'],
    default: 'New',
  },
});

// SKUInstance virtuals

// Returns URL of SKU Instance
SKUInstanceSchema.virtual('url').get(function () {
  return `/catalog/skuinstance/${this._id}`;
});

// Returns size and unit of SKY type eg. '90 Litres' or '5.4 m2'

SKUInstanceSchema.virtual('size_formatted').get(function () {
  return `${this.size} ${this.unit}`;
});

module.exports = mongoose.model('SKUInstance', SKUInstanceSchema);
