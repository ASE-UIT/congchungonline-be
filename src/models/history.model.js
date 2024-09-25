const moongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const HistorySchema = moongoose.Schema({
  uuid: {
    type: String,
    required: true,
  },
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
  notaryService: {
    type: String,
    required: true,
  },
  notaryField: {
    type: String,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

HistorySchema.plugin(toJSON);
HistorySchema.plugin(paginate);

module.exports = moongoose.model('History', HistorySchema);
