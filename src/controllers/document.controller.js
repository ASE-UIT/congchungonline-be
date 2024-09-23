const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { documentService } = require('../services');

const createDocument = catchAsync(async (req, res) => {
    const document = await documentService.createDocument(req.body, req.files);
    res.status(httpStatus.CREATED).send(document);
});


module.exports = {
    createDocument,
};
