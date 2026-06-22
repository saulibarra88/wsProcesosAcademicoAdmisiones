/**
 * @swagger
 * components:
 *   schemas:
 *     BaseResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         informacion:
 *           type: array
 *           items:
 *             type: object
 *         mensaje:
 *           type: string
 *           example: "Operación realizada con éxito"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         mensaje:
 *           type: string
 *           example: "Descripción del error ocurrido en el servidor"
 */
