const httpStatus = require('http-status');
const { NotarizationField } = require('../models');
const ApiError = require('../utils/ApiError');

const createNotarizationField = async (notarizationFieldBody) => {
  try {
    if (await NotarizationField.findOne({ name: notarizationFieldBody.name })) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Notarization field name already exists');
    }
    return await NotarizationField.create(notarizationFieldBody);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error creating notarization field');
  }
};

const getAllNotarizationFields = async () => {
  try {
    const notarizationFields = await NotarizationField.find();
    if (!notarizationFields || notarizationFields.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No notarization fields found');
    }
    return notarizationFields;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching notarization fields');
  }
};

const getNotarizationFieldById = async (notarizationFieldId) => {
  try {
    const notarizationField = await NotarizationField.findById(notarizationFieldId);
    if (!notarizationField) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Notarization field not found');
    }

    return notarizationField;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error fetching notarization field');
  }
};

const updateNotarizationFieldById = async (notarizationFieldId, updateBody) => {
  try {
    const notarizationField = await getNotarizationFieldById(notarizationFieldId);
    if (!notarizationField) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Notarization field not found');
    }

    if (updateBody.name && (await NotarizationField.findOne({ name: updateBody.name, _id: { $ne: notarizationFieldId } }))) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
    }

    Object.assign(notarizationField, updateBody);
    await notarizationField.save();
    return notarizationField;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error updating notarization field');
  }
};

const deleteNotarizationFieldById = async (notarizationFieldId) => {
  try {
    const notarizationField = await getNotarizationFieldById(notarizationFieldId);
    if (!notarizationField) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Notarization field not found');
    }

    await notarizationField.remove();
    return notarizationField;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error deleting notarization field');
  }
};

module.exports = {
  createNotarizationField,
  getAllNotarizationFields,
  getNotarizationFieldById,
  updateNotarizationFieldById,
  deleteNotarizationFieldById,
};
