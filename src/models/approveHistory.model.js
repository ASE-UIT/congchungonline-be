const mongoose = require('mongoose');

const ApproveHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Document'
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  beforeStatus: {
    type: String,
    required: true,
  },
  afterStatus: {
    type: String,
    required: true,
  }
}, { collection: 'approveHistory' }
);

module.exports = mongoose.model('ApproveHistory', ApproveHistorySchema);