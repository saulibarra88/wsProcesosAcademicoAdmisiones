/**
 * @swagger
 * /rutamovilidadAsignatura/InsertarAsignaturasMovilidad/:
 *   post:
 *     summary: Registra la asociación de asignaturas para movilidad
 *     tags: [Movilidad]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dbBaseCarrera
 *               - listado
 *             properties:
 *               dbBaseCarrera:
 *                 type: string
 *               listado:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadAsignatura/ObtenerAsignaturaMovilidadDocente/:
 *   post:
 *     summary: Obtiene asignaturas de movilidad asignadas a un docente
 *     tags: [Movilidad]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dbBaseCarrera
 *               - periodo
 *               - codDocente
 *             properties:
 *               dbBaseCarrera:
 *                 type: string
 *               periodo:
 *                 type: string
 *               codDocente:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadAsignatura/ObtenerAsignaturaMovilidadNivelParalelo/:
 *   post:
 *     summary: Obtiene asignaturas de movilidad por nivel y paralelo
 *     tags: [Movilidad]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dbBaseCarrera
 *               - periodo
 *               - nivel
 *               - paralelo
 *             properties:
 *               dbBaseCarrera:
 *                 type: string
 *               periodo:
 *                 type: string
 *               nivel:
 *                 type: string
 *               paralelo:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadAsignatura/EliminarAsignaturaMovilidadDocente/:
 *   post:
 *     summary: Elimina una asignatura de movilidad asignada a un docente
 *     tags: [Movilidad]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dbBaseCarrera
 *               - id
 *             properties:
 *               dbBaseCarrera:
 *                 type: string
 *               id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadAsignatura/DesactivarAsignaturaMovilidadDocente/:
 *   post:
 *     summary: Desactiva una asignatura de movilidad asignada a un docente
 *     tags: [Movilidad]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dbBaseCarrera
 *               - id
 *               - estado
 *             properties:
 *               dbBaseCarrera:
 *                 type: string
 *               id:
 *                 type: integer
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadAsignatura/ObtenerDatosDocenteAsignaturasCarrera/:
 *   post:
 *     summary: Obtiene datos del docente y sus asignaturas asignadas en la carrera
 *     tags: [Movilidad]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - dbBaseCarrera
 *               - periodo
 *               - cedulaDocente
 *             properties:
 *               dbBaseCarrera:
 *                 type: string
 *               periodo:
 *                 type: string
 *               cedulaDocente:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
