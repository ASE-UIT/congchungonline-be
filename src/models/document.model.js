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
  notarizationServiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NotarizationService',
    required: true,
  },
  notarizationFieldId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'NotarizationField',
    required: true,
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
