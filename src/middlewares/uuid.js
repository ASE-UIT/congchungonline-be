const addUUIDToHeader = (req, res, next) => {
    const uuid = req.headers['x-request-id'];
    if (!uuid) {
      return res.status(400).send({ message: 'UUID is required' });
    }
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidV4Regex.test(uuid)) {
      return res.status(400).send({ message: 'Invalid UUID format' });
    }
    req.uuid = uuid;
    next();
  };
  
  module.exports = addUUIDToHeader;
  