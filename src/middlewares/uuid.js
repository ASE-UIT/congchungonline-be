const addUUIDToHeader = (req, res, next) => {
    const uuid = req.headers['x-request-id'];
    if (!uuid) {
      return res.status(400).send({ message: 'UUID is required' });
    }
    req.uuid = uuid;
    next();
  };
  
  module.exports = addUUIDToHeader;
  