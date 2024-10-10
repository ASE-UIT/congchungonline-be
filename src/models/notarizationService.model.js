const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const notarizationServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    fieldId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NotarizationField',
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { collection: 'notarizationServices' }
);

notarizationServiceSchema.plugin(toJSON);
notarizationServiceSchema.plugin(paginate);

module.exports = mongoose.model('NotarizationService', notarizationServiceSchema);
