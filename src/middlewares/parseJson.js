const parseJson = (req, res, next) => {
  try {
    // Parse the JSON fields manually
    if (req.body.notarizationService) {
      req.body.notarizationService = JSON.parse(req.body.notarizationService);
    }
    if (req.body.notarizationField) {
      req.body.notarizationField = JSON.parse(req.body.notarizationField);
    }
    if (req.body.requesterInfo) {
      req.body.requesterInfo = JSON.parse(req.body.requesterInfo);
    }

    // Proceed to the next middleware
    next();
  } catch (error) {
    // Handle JSON parsing error
    return res.status(400).json({ message: 'Invalid JSON input' });
  }
};

module.exports = parseJson;
