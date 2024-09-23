const express = require('express');
const multer = require('multer');
const validate = require('../../middlewares/validate');
const documentValidation = require('../../validations/document.validation');
const documentController = require('../../controllers/document.controller');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router
    .route('/')
    .post(upload.array('files'), validate(documentValidation.createDocument), documentController.createDocument);

module.exports = router;
