const httpStatus = require('http-status');
const { Document, StatusTracking, ApproveHistory, NotarizationService, NotarizationField } = require('../models');
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

const createDocument = async (documentBody, files, userId) => {
  try {
    if (!files || files.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'No files provided');
    }

    const { notarizationField, notarizationService, requesterInfo } = documentBody;

    const notarizationFieldDoc = await NotarizationField.findById(notarizationField.id);
    if (!notarizationFieldDoc) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid notarization field ID provided');
    }

    const notarizationServiceDoc = await NotarizationService.findById(notarizationService.id);
    if (!notarizationServiceDoc) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid notarization service ID provided');
    }

    if (String(notarizationServiceDoc.fieldId) !== String(notarizationFieldDoc._id)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Notarization service does not match the provided field');
    }

    // Check if additional properties match
    if (notarizationFieldDoc.name !== notarizationField.name) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Notarization field name does not match');
    }

    if (notarizationFieldDoc.description !== notarizationField.description) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Notarization field description does not match');
    }
    if (notarizationServiceDoc.name !== notarizationService.name) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Notarization service name does not match');
    }

    if (notarizationServiceDoc.description !== notarizationService.description) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Notarization service description does not match');
    }

    if (notarizationServiceDoc.price !== notarizationService.price) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Notarization service price does not match');
    }

    const newDocument = new Document({
      files: [],
      notarizationService: {
        id: notarizationService.id,
        name: notarizationService.name,
        fieldId: notarizationService.fieldId,
        description: notarizationService.description,
        price: notarizationService.price,
      },
      notarizationField: {
        id: notarizationField.id,
        name: notarizationField.name,
        description: notarizationField.description,
      },
      requesterInfo: {
        citizenId: requesterInfo.citizenId,
        phoneNumber: requesterInfo.phoneNumber,
        email: requesterInfo.email,
      },
      userId,
      createdAt: Date.now(),
    });

    const fileUrls = await Promise.all(files.map((file) => uploadFileToFirebase(file, newDocument._id)));
    const formattedFiles = files.map((file, index) => ({
      filename: `${Date.now()}-${file.originalname}`,
      firebaseUrl: fileUrls[index],
    }));

    newDocument.files = formattedFiles;
    await newDocument.save();

    return newDocument;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error creating document:', error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload document');
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

const getHistoryWithStatus = async (userId) => {
  const history = await Document.find({ userId });
  const statusTrackings = await StatusTracking.find({ documentId: { $in: history.map((doc) => doc._id) } });
  return history.map((doc) => {
    const statusTracking = statusTrackings.find((tracking) => tracking.documentId.toString() === doc._id.toString());
    return {
      ...doc.toObject(),
      status: statusTracking.status,
    };
  });
};

const getDocumentStatus = async (documentId) => {
  try {
    const statusTracking = await StatusTracking.findOne({ documentId });
    return statusTracking;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getDocumentByRole = async (role) => {
  try {
    let statusFilter = [];

    if (role === 'notary') {
      statusFilter = ['processing'];
    } else if (role === 'secretary') {
      statusFilter = ['verification', 'digitalSignature'];
    } else {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to access these documents');
    }

    const statusTrackings = await StatusTracking.find({ status: { $in: statusFilter } });

    const documentIds = statusTrackings.map((tracking) => tracking.documentId);

    const documents = await Document.find({ _id: { $in: documentIds } });

    const result = documents.map((doc) => {
      const statusTracking = statusTrackings.find((tracking) => tracking.documentId.toString() === doc._id.toString());
      return {
        ...doc.toObject(),
        status: statusTracking.status,
      };
    });

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error('Error retrieving documents by role:', error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to retrieve documents');
  }
};

const forwardDocumentStatus = async (documentId, action, role, userId) => {
  try {
    const validStatuses = ['pending', 'verification', 'processing', 'digitalSignature', 'completed'];
    const roleStatusMap = {
      notary: ['processing'],
      secretary: ['verification', 'digitalSignature'],
    };

    let newStatus;

    if (action === 'accept') {
      const currentStatus = await StatusTracking.findOne({ documentId }, 'status');
      if (!currentStatus) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Document status not found');
      }
      if (!roleStatusMap[role]) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to access these documents');
      }
      if (!roleStatusMap[role].includes(currentStatus.status)) {
        throw new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to access these documents');
      }
      const currentStatusIndex = validStatuses.indexOf(currentStatus.status);

      if (currentStatusIndex === -1) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid current status');
      }
      newStatus = validStatuses[currentStatusIndex + 1];
      if (!newStatus) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Document has already reached final status');
      }
    } else if (action === 'reject') {
      newStatus = 'rejected';
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid action provided');
    }

    const approveHistory = new ApproveHistory({
      userId,
      documentId,
      beforeStatus: (await StatusTracking.findOne({ documentId }, 'status')).status,
      afterStatus: newStatus,
    });

    await approveHistory.save();

    const result = await StatusTracking.updateOne(
      { documentId },
      {
        status: newStatus,
        updatedAt: new Date(),
      }
    );

    if (result.nModified === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No status found for this document');
    }

    return {
      message: `Document status updated to ${newStatus}`,
      documentId,
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error forwarding document status:', error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'An unexpected error occurred');
  }
};

const getApproveHistory = async (userId) => {
  try {
    const history = await ApproveHistory.find({ userId });

    if (history.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No approval history found for this user.');
    }

    return history;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Error fetching approve history:', error.message);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to fetch approve history');
  }
};

const getAllNotarizations = async (filter, options) => {
  const notatizations = await Document.paginate(filter, options);
  return notatizations;
};

module.exports = {
  createDocument,
  createStatusTracking,
  getHistoryByUserId,
  getDocumentStatus,
  getDocumentByRole,
  forwardDocumentStatus,
  getApproveHistory,
  getAllNotarizations,
  getHistoryWithStatus,
};
