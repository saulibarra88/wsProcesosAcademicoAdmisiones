/**
 * @swagger
 * /rutarecord/ListadoSolicitudesRecordPeriodo/{carrera}/{periodo}/{estado}:
 *   get:
 *     summary: Listado de solicitudes de record por periodo
 *     tags:
 *       - Formatos de Reporte
 *     parameters:
 *       - in: path
 *         name: carrera
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutarecord/ListadoSolicitudesRecordCedula/{carrera}/{cedula}:
 *   get:
 *     summary: Listado de solicitudes de record por cédula de estudiante
 *     tags:
 *       - Formatos de Reporte
 *     parameters:
 *       - in: path
 *         name: carrera
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: cedula
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutarecord/EliminarSolicitudRecord/{carrera}/{periodo}/{cedula}/{idsolicitud}:
 *   get:
 *     summary: Elimina una solicitud de record académico
 *     tags:
 *       - Formatos de Reporte
 *     parameters:
 *       - in: path
 *         name: carrera
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: cedula
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: idsolicitud
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 */
