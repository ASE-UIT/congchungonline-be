const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const notarizationFieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
}, { collection: 'notarizationFields' }
);

notarizationFieldSchema.plugin(toJSON);
notarizationFieldSchema.plugin(paginate);


const NotarizationField = mongoose.model('NotarizationFields', notarizationFieldSchema);

module.exports = NotarizationField;
