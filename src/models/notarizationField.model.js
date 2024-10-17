const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const notarizationFieldSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { collection: 'notarizationFields' }
);

notarizationFieldSchema.plugin(toJSON);
notarizationFieldSchema.plugin(paginate);

module.exports = mongoose.model('NotarizationFields', notarizationFieldSchema);
