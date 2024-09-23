const express = require('express');
const multer = require('multer');
const validate = require('../../middlewares/validate');
const documentValidation = require('../../validations/document.validation');
const documentController = require('../../controllers/document.controller');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: Document management API
 */

router.post('/', upload.array('files'), validate(documentValidation.createDocument), documentController.createDocument);

/**
 * @swagger
 * /documents:
 *   post:
 *     summary: Upload document
 *     tags: [Documents]
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
 *                 description: The files to upload
 *               notaryService:
 *                 type: string
 *                 description: Name of the notary service
 *                 example: Example Notary Service
 *               notaryField:
 *                 type: string
 *                 description: Field of the notary service
 *                 example: Example Notary Field
 *               requesterInfo:
 *                 type: object
 *                 description: Information about the requester
 *                 properties:
 *                   citizenId:
 *                     type: string
 *                     description: Citizen ID of the requester
 *                     example: 123456789012
 *                   phoneNumber:
 *                     type: string
 *                     description: Phone number of the requester
 *                     example: 0941788455
 *                   email:
 *                     type: string
 *                     description: Email address of the requester
 *                     example: 123@gmail.com
 *                 required:
 *                   - citizenId
 *                   - phoneNumber
 *                   - email
 *             required:
 *               - files
 *               - notaryService
 *               - notaryField
 *               - requesterInfo
 *           example:
 *             notaryService: Example Notary Service
 *             notaryField: Example Notary Field
 *             requesterInfo:
 *               citizenId: 123456789012
 *               phoneNumber: 0941788455
 *               email: 123@gmail.com
 *             files: [file1.pdf, file2.docx]
 *     responses:
 *       "200":
 *         description: Documents uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notaryService:
 *                   type: string
 *                   description: Name of the notary service
 *                   example: Vay-Mượn Tài Sản
 *                 notaryField:
 *                   type: string
 *                   description: Field of the notary service
 *                   example: Vay mượn
 *                 requesterInfo:
 *                   type: object
 *                   description: Information about the requester
 *                   properties:
 *                     citizenId:
 *                       type: string
 *                       description: Citizen ID of the requester
 *                       example: 123456789012
 *                     phoneNumber:
 *                       type: string
 *                       description: Phone number of the requester
 *                       example: 0941788455
 *                     email:
 *                       type: string
 *                       description: Email address of the requester
 *                       example: 123@gmail.com
 *                 files:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: Unique identifier for the file
 *                       filename:
 *                         type: string
 *                         description: The name of the uploaded file
 *                         example: 1727103365437-790-qd-dhcntt_28-9-22_quy_che_dao_tao.pdf
 *                       firebaseUrl:
 *                         type: string
 *                         description: The URL of the uploaded file in Firebase
 *                         example: https://storage.googleapis.com/congchungonline-6692e.appspot.com/66f1818416c9ba1bfc053c3c/1727103364640-790-qd-dhcntt_28-9-22_quy_che_dao_tao.pdf
 *                 id:
 *                   type: string
 *                   description: ID of the created document
 *                   example: 66f1818416c9ba1bfc053c3c
 *       "400":
 *         description: Bad Request - No files provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No files provided
 *       "500":
 *         description: Internal Server Error - Failed to upload file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Failed to upload file
 */

module.exports = router;
