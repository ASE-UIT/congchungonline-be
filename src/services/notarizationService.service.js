const httpStatus = require('http-status');
const { NotarizationService, NotarizationField } = require('../models');
const ApiError = require('../utils/ApiError');

const createNotarizationService = async (notarizationServiceBody) => {
  try {
    if (await NotarizationService.findOne({ name: notarizationServiceBody.name })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Notarization service name already exists');
    }

    if (!(await NotarizationField.findById(notarizationServiceBody.fieldId))) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid fieldId provided');
    }

    return await NotarizationService.create(notarizationServiceBody);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating notarization service');
  }
};

const getAllNotarizationServices = async () => {
  try {
    const services = await NotarizationService.find();
    if (!services || services.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No notarization services found');
    }
    return services;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching notarization services');
  }
};

const getNotarizationServiceById = async (serviceId) => {
  try {
    const service = await NotarizationService.findById(serviceId);
    if (!service) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Notarization service not found');
    }
    return service;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching notarization service');
  }
};

const updateNotarizationServiceById = async (serviceId, updateBody) => {
  try {
    const service = await getNotarizationServiceById(serviceId);
    if (!service) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Notarization service not found');
    }

    if (updateBody.name && (await NotarizationService.findOne({ name: updateBody.name, _id: { $ne: serviceId } }))) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Service name already taken');
    }

    if (updateBody.fieldId && !(await NotarizationField.findById(updateBody.fieldId))) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid fieldId provided');
    }

    Object.assign(service, updateBody);
    await service.save();
    return service;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error updating notarization service');
  }
};

const deleteNotarizationServiceById = async (serviceId) => {
  try {
    const service = await getNotarizationServiceById(serviceId);
    if (!service) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Notarization service not found');
    }

    await service.remove();
    return service;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error deleting notarization service');
  }
};

const getNotarizationServicesByFieldId = async (fieldId) => {
  try {
    const fieldExists = await NotarizationField.findById(fieldId);
    if (!fieldExists) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid fieldId provided');
    }

    const services = await NotarizationService.find({ fieldId });
    if (!services || services.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No notarization services found for the given field');
    }
    return services;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching notarization services by field');
  }
};

module.exports = {
  createNotarizationService,
  getAllNotarizationServices,
  getNotarizationServiceById,
  updateNotarizationServiceById,
  deleteNotarizationServiceById,
  getNotarizationServicesByFieldId,
};
