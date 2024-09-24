const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { notarizationService } = require('../services');

const createDocument = catchAsync(async (req, res) => {
    if (typeof req.body.requesterInfo === 'string') {
            req.body.requesterInfo = JSON.parse(req.body.requesterInfo);}
    const document = await notarizationService.createDocument(req.body, req.files);
    res.status(httpStatus.CREATED).send(document);
});


module.exports = {
    createDocument,
};
