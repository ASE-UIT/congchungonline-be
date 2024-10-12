const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const sessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
  },
  notaryField: {
    type: String,
    required: true,
  },
  notaryService: {
    type: String,
    required: true,
  },
  sessionName: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  email: {
    type: [String],
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

sessionSchema.plugin(toJSON);
sessionSchema.plugin(paginate);

module.exports = mongoose.model('Session', sessionSchema);
