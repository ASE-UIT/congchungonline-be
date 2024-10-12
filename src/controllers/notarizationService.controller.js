const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { notarizationServiceService } = require('../services');

const createNotarizationService = catchAsync(async (req, res) => {
  const notarizationService = await notarizationServiceService.createNotarizationService(req.body);
  res.status(httpStatus.CREATED).send(notarizationService);
});

const getNotarizationService = catchAsync(async (req, res) => {
  const notarizationService = await notarizationServiceService.getNotarizationServiceById(req.params.serviceId);
  res.status(httpStatus.OK).send(notarizationService);
});

const getAllNotarizationServices = catchAsync(async (req, res) => {
  const notarizationServices = await notarizationServiceService.getAllNotarizationServices();
  res.status(httpStatus.OK).send(notarizationServices);
});

const updateNotarizationService = catchAsync(async (req, res) => {
  const notarizationService = await notarizationServiceService.updateNotarizationServiceById(req.params.serviceId, req.body);
  res.status(httpStatus.OK).send(notarizationService);
});

const deleteNotarizationService = catchAsync(async (req, res) => {
  await notarizationServiceService.deleteNotarizationServiceById(req.params.serviceId);
  res.status(httpStatus.OK).json({ message: 'Notarization service deleted successfully' });
});

const getNotarizationServicesByFieldId = catchAsync(async (req, res) => {
  const notarizationServices = await notarizationServiceService.getNotarizationServicesByFieldId(req.params.fieldId);
  res.status(httpStatus.OK).send(notarizationServices);
});

module.exports = {
  createNotarizationService,
  getNotarizationService,
  getAllNotarizationServices,
  updateNotarizationService,
  deleteNotarizationService,
  getNotarizationServicesByFieldId,
};
