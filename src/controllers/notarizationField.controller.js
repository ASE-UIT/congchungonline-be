const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { notarizationFieldService } = require('../services');

const createNotarizationField = catchAsync(async (req, res) => {
  const notarizationField = await notarizationFieldService.createNotarizationField(req.body);
  res.status(httpStatus.CREATED).send(notarizationField);
});

const getNotarizationField = catchAsync(async (req, res) => {
  const notarizationField = await notarizationFieldService.getNotarizationFieldById(req.params.fieldId);
  res.status(httpStatus.OK).send(notarizationField);
});

const getAllNotarizationFields = catchAsync(async (req, res) => {
  const notarizationFields = await notarizationFieldService.getAllNotarizationFields();
  res.status(httpStatus.OK).send(notarizationFields);
});

const updateNotarizationField = catchAsync(async (req, res) => {
  const notarizationField = await notarizationFieldService.updateNotarizationFieldById(req.params.fieldId, req.body);
  res.status(httpStatus.OK).send(notarizationField);
});

const deleteNotarizationField = catchAsync(async (req, res) => {
  await notarizationFieldService.deleteNotarizationFieldById(req.params.fieldId);
  res.status(httpStatus.OK).json({ message: 'Notarization field deleted successfully' });
});

module.exports = {
  createNotarizationField,
  getNotarizationField,
  getAllNotarizationFields,
  updateNotarizationField,
  deleteNotarizationField,
};
