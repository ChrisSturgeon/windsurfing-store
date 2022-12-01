const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Discipline model schema
const DisciplineSchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: ['Wave', 'Freestyle', 'Freeride', 'Slalom', 'Kids'],
    default: 'Wave',
  },
});

// Discipline virtuals
DisciplineSchema.virtual('url').get(function () {
  return `/stock/discipline/${this._id}`;
});

module.exports = mongoose.model('Discipline', DisciplineSchema);
