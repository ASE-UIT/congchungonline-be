const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const documentSchema = new mongoose.Schema({
  files: [
    {
      filename: {
        type: String,
        required: true,
        trim: true,
      },
      firebaseUrl: {
        type: String,
        required: true,
        trim: true,
      },
    },
  ],
  notarizationService: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NotarizationService',
      required: true,
    },
    name: {
      type: String,
      required: true,
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
  notarizationField: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'NotarizationField',
      required: true,
    },
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
  requesterInfo: {
    citizenId: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

documentSchema.plugin(toJSON);
documentSchema.plugin(paginate);

module.exports = mongoose.model('Document', documentSchema);
