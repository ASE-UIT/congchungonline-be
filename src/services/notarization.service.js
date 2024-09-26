const httpStatus = require('http-status');
const { Document, StatusTracking } = require('../models');
const ApiError = require('../utils/ApiError');
const { bucket } = require('../config/firebase');

const uploadFileToFirebase = async (file, folderName) => {
  const fileName = `${Date.now()}-${file.originalname}`;
  const fileRef = bucket.file(`${folderName}/${fileName}`);

  try {
    await fileRef.save(file.buffer, { contentType: file.mimetype });
    return `https://storage.googleapis.com/${bucket.name}/${folderName}/${fileName}`;
  } catch (error) {
    console.error('Error uploading file:', error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload file');
  }
};

const createDocument = async (documentBody, files) => {
  if (!files || files.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No files provided');
  }

  try {
    const newDocument = new Document({
      ...documentBody,
      files: [],
    });

    await newDocument.save();

    const fileUrls = await Promise.all(files.map((file) => uploadFileToFirebase(file, newDocument._id)));

    const formattedFiles = files.map((file, index) => ({
      filename: `${Date.now()}-${file.originalname}`,
      firebaseUrl: fileUrls[index],
    }));

    newDocument.files = formattedFiles;
    await newDocument.save();

    return newDocument;
  } catch (error) {
    console.error('Error uploading file:', error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload file');
  }
};

const createStatusTracking = async (documentId, status) => {
  try {
    const statusTracking = new StatusTracking({
      documentId,
      status,
      updatedAt: new Date(),
    });

    await statusTracking.save();
    return statusTracking;
  } catch (error) {
    console.error('Error creating status tracking:', error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create status tracking');
  }
};

const getHistoryByUserId = async (userId) => {
  return Document.find({ userId });
};

const getDocumenntStatus = async (documentId) => {
  try {
    const statusTracking = await StatusTracking.findOne({ documentId });
    return statusTracking;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  createDocument,
  createStatusTracking,
  getHistoryByUserId,
  getDocumenntStatus,
};
