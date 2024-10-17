const express = require('express');
const validate = require('../../middlewares/validate');
const locationValidation = require('../../validations/location.validation');
const locationController = require('../../controllers/location.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Location
 *   description: Location API
 */

router.route('/get-provinces').get(locationController.getProvinces);
router.route('/get-districts/:provinceId').get(validate(locationValidation.getDistrict), locationController.getDistricts);
router.route('/get-wards/:districtId').get(validate(locationValidation.getWard), locationController.getWards);

/**
 * @swagger
 * /location/get-provinces:
 *   get:
 *     summary: Get list of provinces
 *     tags: [Location]
 *     responses:
 *       "200":
 *         description: A list of provinces
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       province_id:
 *                         type: string
 *                         description: The ID of the province
 *                         example: "79"
 *                       province_name:
 *                         type: string
 *                         description: The name of the province
 *                         example: "Thành phố Hồ Chí Minh"
 *                       province_type:
 *                         type: string
 *                         description: The type of the province
 *                         example: "Thành phố Trung ương"
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to get provinces"
 */

/**
 * @swagger
 * /location/get-districts/{provinceId}:
 *   get:
 *     summary: Get list of districts by province ID
 *     tags: [Location]
 *     parameters:
 *       - in: path
 *         name: provinceId
 *         required: true
 *         description: The ID of the province
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: A list of districts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       district_id:
 *                         type: string
 *                         description: The ID of the district
 *                         example: "776"
 *                       district_name:
 *                         type: string
 *                         description: The name of the district
 *                         example: "Quận 8"
 *                       district_type:
 *                         type: string
 *                         description: The type of the district
 *                         example: "Quận"
 *                       lat:
 *                         type: number
 *                         format: float
 *                         description: The latitude of the district
 *                         example: null
 *                       lng:
 *                         type: number
 *                         format: float
 *                         description: The longitude of the district
 *                         example: null
 *                       province_id:
 *                         type: string
 *                         description: The ID of the province this district belongs to
 *                         example: "79"
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid province ID format"
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to get districts"
 */

/**
 * @swagger
 * /location/get-wards/{districtId}:
 *   get:
 *     summary: Get list of wards by district ID
 *     tags: [Location]
 *     parameters:
 *       - in: path
 *         name: districtId
 *         required: true
 *         description: The ID of the district
 *         schema:
 *           type: string
 *     responses:
 *       "200":
 *         description: A list of wards
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       district_id:
 *                         type: string
 *                         description: The ID of the district this ward belongs to
 *                         example: "763"
 *                       ward_id:
 *                         type: string
 *                         description: The ID of the ward
 *                         example: "26854"
 *                       ward_name:
 *                         type: string
 *                         description: The name of the ward
 *                         example: "Phường Trường Thạnh"
 *                       ward_type:
 *                         type: string
 *                         description: The type of the ward
 *                         example: "Phường"
 *       "400":
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid district ID format"
 *       "500":
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to get wards"
 */

module.exports = router;
