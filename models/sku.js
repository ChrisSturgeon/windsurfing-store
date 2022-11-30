const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// SKU model schema
const SKUSchema = new Schema({
  category: {
    type: String,
    required: true,
    enum: ['Board', 'Sail', 'Mast', 'Boom'],
    default: 'Board',
  },
  brand: [{ type: Schema.Types.ObjectId, ref: 'Brand' }],
  model: { type: String, maxLength: 400 },
  discipline: [{ type: Schema.Types.ObjectId, ref: 'Discipline' }],
  price: { type: Number },
});

// SKU model virtuals
SKUSchema.virtual('url').get(function () {
  return `/catalog/sku/${this._id}`;
});

module.exports = mongoose.model('SKU', SKUSchema);
