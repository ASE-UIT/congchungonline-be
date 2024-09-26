const mongoose = require('mongoose');

const addUUIDToHeader = (req, res, next) => {
    const uuid = req.headers['x-request-id'];
    if (!uuid) {
      return res.status(400).send({ message: 'UUID is required' });
    }
    if (!mongoose.Types.ObjectId.isValid(uuid)) {
      return res.status(400).send({ message: 'Invalid UUID format' });
    }
    req.uuid = uuid;
    next();
  };
  
  module.exports = addUUIDToHeader;
  