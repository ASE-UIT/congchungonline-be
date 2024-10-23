const express = require('express');
const httpStatus = require('http-status');
const multer = require('multer');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const notarizationValidation = require('../../validations/notarization.validation');
const notarizationController = require('../../controllers/notarization.controller');
const ApiError = require('../../utils/ApiError');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|pdf/;
    const mimeType = allowedFileTypes.test(file.mimetype);
    const extname = allowedFileTypes.test(file.originalname.split('.').pop());

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb(new ApiError(httpStatus.BAD_REQUEST, 'Only images and PDFs are allowed'));
  },
});

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: 'JWT authorization header. Use `Bearer <token>` format.'
 *
 *   responses:
 *     BadRequest:
 *       description: Bad Request
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Invalid request parameters
 *     Unauthorized:
 *       description: Unauthorized access
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Unauthorized
 */

/**
 * @swagger
 * tags:
 *   name: Notarizations
 *   description: Notarization document management API
 */

router.route('/upload-files').post(
  auth('uploadDocuments'),
  upload.array('files'),
  (req, res, next) => {
    req.body.notarizationService = JSON.parse(req.body.notarizationService);
    req.body.notarizationField = JSON.parse(req.body.notarizationField);
    req.body.requesterInfo = JSON.parse(req.body.requesterInfo);

    req.body.files = req.files.map((file) => file.originalname);

    next();
  },
  validate(notarizationValidation.createDocument),
  notarizationController.createDocument
);

router
  .route('/history')
  .get(
    auth('viewNotarizationHistory'),
    validate(notarizationValidation.getHistoryByUserId),
    notarizationController.getHistoryByUserId
  );

router
  .route('/get-history-with-status')
  .get(
    auth('viewNotarizationHistory'),
    validate(notarizationValidation.getHistoryByUserId),
    notarizationController.getHistoryWithStatus
  );

router.route('/getStatusById/:documentId').get(notarizationController.getDocumentStatus);

router.route('/getDocumentByRole').get(auth('getDocumentsByRole'), notarizationController.getDocumentByRole);

router
  .route('/forwardDocumentStatus/:documentId')
  .patch(
    auth('forwardDocumentStatus'),
    validate(notarizationValidation.forwardDocumentStatus),
    notarizationController.forwardDocumentStatus
  );

router.route('/getAllNotarization').get(auth('getAllNotarizations'), notarizationController.getAllNotarizations);

router.route('/getApproveHistory').get(auth('getApproveHistory'), notarizationController.getApproveHistory);

router
  .route('/approve-signature-by-user')
  .post(
    auth('approveSignatureByUser'),
    upload.single('signatureImage'),
    validate(notarizationValidation.approveSignatureByUser),
    notarizationController.approveSignatureByUser
  );

router
  .route('/approve-signature-by-secretary')
  .post(
    auth('approveSignatureBySecretary'),
    upload.none(),
    validate(notarizationValidation.approveSignatureBySecretary),
    notarizationController.approveSignatureBySecretary
  );
/**
 * @swagger
 * /notarization/upload-files:
 *   post:
 *     summary: Upload notarization documents
 *     tags: [Notarizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: The files to upload (e.g., PDF, DOCX)
 *                 example: [file1.pdf, file2.docx]
 *               notarizationField:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ObjectId of the related notarization field
 *                     example: "670aad2016bb592ef84ee39d"
 *                   name:
 *                     type: string
 *                     description: The name of the notarization field
 *                     example: "Hôn nhân gia đình"
 *                   description:
 *                     type: string
 *                     description: The description of the notarization field
 *                     example: "This is an example description for the notarization field."
 *               notarizationService:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: ObjectId of the related notarization service
 *                     example: "670a2ed9b2993b7b2051b3c7"
 *                   name:
 *                     type: string
 *                     description: The name of the notarization service
 *                     example: "Ly hôn - Ly thân"
 *                   fieldId:
 *                     type: string
 *                     description: ObjectId of the related notarization field
 *                     example: "670aad2016bb592ef84ee39d"
 *                   description:
 *                     type: string
 *                     description: The description of the notarization service
 *                     example: "This is an example of a notarization service."
 *                   price:
 *                     type: number
 *                     description: The price of the notarization service
 *                     example: 10000
 *               requesterInfo:
 *                 type: object
 *                 properties:
 *                   citizenId:
 *                     type: string
 *                     description: Citizen ID of the requester
 *                     example: "123456789"
 *                   phoneNumber:
 *                     type: string
 *                     description: Phone number of the requester
 *                     example: "+1234567890"
 *                   email:
 *                     type: string
 *                     description: Email of the requester
 *                     example: "requester@example.com"
 *     responses:
 *       "201":
 *         description: Documents uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Document ID
 *                   example: "60d5ec49f2c1f814d3e8e3c9"
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       filename:
 *                         type: string
 *                         description: Name of the uploaded file
 *                         example: "file1.pdf"
 *                       firebaseUrl:
 *                         type: string
 *                         description: URL of the file in Firebase
 *                         example: "https://firebase.com/path/to/file1.pdf"
 *                 notarizationService:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60d5ec49f2c1f814d3e8e3c5"
 *                     name:
 *                       type: string
 *                       example: "Property Deed Notarization"
 *                     fieldId:
 *                       type: string
 *                       example: "60d5ec49f2c1f814d3e8e3c6"
 *                     description:
 *                       type: string
 *                       example: "Notarization for property deed transfer."
 *                     price:
 *                       type: number
 *                       example: 150.00
 *                 notarizationField:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60d5ec49f2c1f814d3e8e3c7"
 *                     name:
 *                       type: string
 *                       example: "Real Estate"
 *                     description:
 *                       type: string
 *                       example: "Field related to real estate transactions."
 *                 requesterInfo:
 *                   type: object
 *                   properties:
 *                     citizenId:
 *                       type: string
 *                       example: "123456789"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+1234567890"
 *                     email:
 *                       type: string
 *                       example: "requester@example.com"
 *       "400":
 *         description: Bad Request - Invalid data provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid notarization service ID or field ID / No files provided"
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to upload documents"
 */

/**
 * @swagger
 * /notarization/getStatusById/{documentId}:
 *   get:
 *     summary: Get the status of a document by ID
 *     tags: [Notarizations]
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the document to retrieve status
 *     responses:
 *       "200":
 *         description: Document status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notarizations'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /notarization/getDocumentByRole:
 *   get:
 *     summary: Get all notarization documents by user role
 *     tags: [Notarizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successfully retrieved documents for the specified role
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 requesterInfo:
 *                   type: object
 *                   properties:
 *                     citizenId:
 *                       type: string
 *                       example: "123456789012"
 *                     phoneNumber:
 *                       type: string
 *                       example: "941788455"
 *                     email:
 *                       type: string
 *                       example: "123@gmail.com"
 *                 _id:
 *                   type: string
 *                   example: "66f516c6df00763b8878bb89"
 *                 notaryService:
 *                   type: string
 *                   example: "Example Notary Service"
 *                 notaryField:
 *                   type: string
 *                   example: "Example Notary Field"
 *                 userId:
 *                   type: string
 *                   example: "66f46255529f780cf0b20d3e"
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "66f516c6df00763b8878bb8b"
 *                       filename:
 *                         type: string
 *                         example: "1727338182964-search-interface-symbol.png"
 *                       firebaseUrl:
 *                         type: string
 *                         example: "https://storage.googleapis.com/congchungonline-6692e.appspot.com/66f516c6df00763b8878bb89/1727338182108-search-interface-symbol.png"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-09-26T08:09:42.039Z"
 *                 __v:
 *                   type: integer
 *                   example: 1
 *                 status:
 *                   type: string
 *                   example: "processing"
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         code: 403
 *         message: You do not have permission to access these documents
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /notarization/forwardDocumentStatus/{documentId}:
 *   patch:
 *     summary: Forward the status of a notarization document by document ID
 *     tags: [Notarizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: documentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the document to forward status
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 description: The action to do
 *                 example: accept
 *     responses:
 *       "200":
 *         description: Successfully updated the document status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Document status updated to digitalSignature"
 *                 documentId:
 *                   type: string
 *                   example: "66f462fa57b33d48e47ab55f"
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         code: 403
 *         message: You do not have permission to access these documents
 *       "404":
 *         code: 404
 *         message: Document not found
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /notarization/getApproveHistory:
 *   get:
 *     summary: Retrieve the approval history of notarization documents
 *     tags: [Notarizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Successfully retrieved approval history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   documentId:
 *                     type: string
 *                     example: "66f462fa57b33d48e47ab55f"
 *                   status:
 *                     type: string
 *                     example: "approved"
 *                   approvedBy:
 *                     type: string
 *                     example: "userId123"
 *                   approvedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-09-26T08:09:42.039Z"
 *                   comments:
 *                     type: string
 *                     example: "Document approved successfully."
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden - User does not have permission to access this resource
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "You do not have permission to access this resource."
 *       "404":
 *         description: Not Found - Approval history not found for the specified document
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Approval history not found."
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to retrieve approval history"
 */

/**
 * @swagger
 * /notarization/getAllNotarization:
 *   get:
 *     summary: Get allnotarizations
 *     description: Only admins can retrieve all notarizations.
 *     tags: [Notarizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of notarization
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notarizations'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /notarization/approve-signature-by-user:
 *   post:
 *     summary: Approve signature by user
 *     tags: [Notarizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               documentId:
 *                 type: string
 *                 description: ID of the document to approve
 *               amount:
 *                 type: number
 *                 description: Amount of the document to approve
 *               signatureImage:
 *                 type: string
 *                 format: binary
 *                 description: Signature image of the document
 *     responses:
 *       "200":
 *         description: Signature approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Signature approved successfully"
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /notarization/approve-signature-by-secretary:
 *   post:
 *     summary: Approve signature by secretary
 *     tags: [Notarizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documentId:
 *                 type: string
 *                 description: ID of the document to approve
 *     responses:
 *       "200":
 *         description: Signature approved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Signature approved successfully"
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */

/**
 * @swagger
 * /notarization/history:
 *   get:
 *     summary: Get notarization history by user ID
 *     tags: [Notarizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: Notarization history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Notarizations'
 *       "400":
 *         $ref: '#/components/responses/BadRequest'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "500":
 *         $ref: '#/components/responses/InternalServerError'
 */

module.exports = router;
