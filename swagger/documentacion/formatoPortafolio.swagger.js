/**
 * @swagger
 * /rutaportafolio/MatriculdasTodasEstuidanteCarrera/{carrera}/{cedula}:
 *   get:
 *     summary: Todas las matrículas de un estudiante en una carrera
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
 * /rutaportafolio/SolicitudesTercerasTodas/{carrera}/{cedula}:
 *   get:
 *     summary: Todas las solicitudes de terceras matrículas de un estudiante
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
 * /rutaportafolio/SolicitudesValidacionesTodas/{carrera}/{cedula}:
 *   get:
 *     summary: Todas las solicitudes de convalidación y validación de un estudiante
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
 * /rutaportafolio/SolicitudesMovilidadesTodas/{carrera}/{cedula}:
 *   get:
 *     summary: Todas las solicitudes de movilidad estudiantil de un estudiante
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
 * /rutaportafolio/SolicitudesRetirosTodos/{carrera}/{cedula}:
 *   get:
 *     summary: Todos los retiros de asignaturas de un estudiante
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
 */
