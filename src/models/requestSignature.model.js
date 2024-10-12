const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const requestSignatureSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    signatureImage: {
      type: String,
      required: true,
    },
    approvalStatus: {
      secretary: {
        approved: { type: Boolean, default: false },
        approvedAt: { type: Date, default: null },
      },
      user: {
        approved: { type: Boolean, default: false },
        approvedAt: { type: Date, default: null },
      },
    },
  },
  {
    timestamps: true,
    collection: 'requestSignature',
  }
);

requestSignatureSchema.plugin(toJSON);
requestSignatureSchema.plugin(paginate);

module.exports = mongoose.model('RequestSignature', requestSignatureSchema);
