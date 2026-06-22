/**
 * @swagger
 * /rutaacademiconotas/ListadoCalificacionesEstudiante/{carrera}/{periodo}/{cedula}/{idreglamento}:
 *   get:
 *     summary: Listado de calificaciones de un estudiante
 *     tags:
 *       - Notas Académicas
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
 *         name: idreglamento
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       500:
 *         description: Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /rutaacademiconotas/ListadosCalificacionesEstudiantedadoDocente/{carrera}/{periodo}/{nivel}/{paralelo}/{CodMateria}/{cedula}/{idreglamento}:
 *   get:
 *     summary: Calificaciones de estudiantes a cargo de un docente
 *     tags:
 *       - Notas Académicas
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
 *         name: nivel
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: paralelo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: CodMateria
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: cedula
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: idreglamento
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       500:
 *         description: Error
 * 
 * /rutaacademiconotas/ListadosEstudiantesAsignaturasDocenteExcel/{carrera}/{periodo}/{nivel}/{paralelo}/{CodMateria}/{cedula}:
 *   get:
 *     summary: Excel de estudiantes por asignaturas de un docente
 *     tags:
 *       - Notas Académicas
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
 *         name: nivel
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: paralelo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: CodMateria
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
 * /rutaacademiconotas/ProcesoReporteListadoCalificacionesEstudiantedadoDocente/{carrera}/{periodo}/{nivel}/{paralelo}/{CodMateria}/{cedula}/{idreglamento}/{cedulaUsuario}:
 *   get:
 *     summary: Reporte de calificaciones de estudiantes por docente
 *     tags:
 *       - Notas Académicas
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
 *         name: nivel
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: paralelo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: CodMateria
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: cedula
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: idreglamento
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: cedulaUsuario
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaacademiconotas/ProcesoReporteListadoCalificacionesEstudiantedadoDocenteTres:
 *   post:
 *     summary: Generación de reporte de calificaciones formato tres
 *     tags:
 *       - Notas Académicas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - listado
 *               - carrera
 *               - periodo
 *               - nivel
 *               - paralelo
 *               - CodMateria
 *               - cedula
 *               - cedulaUsuario
 *             properties:
 *               listado:
 *                 type: array
 *                 items:
 *                   type: object
 *               carrera:
 *                 type: string
 *               periodo:
 *                 type: string
 *               nivel:
 *                 type: string
 *               paralelo:
 *                 type: string
 *               CodMateria:
 *                 type: string
 *               cedula:
 *                 type: string
 *               cedulaUsuario:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaacademiconotas/ObtenerlinkActaCalificaciones/{carrera}/{periodo}/{nivel}/{paralelo}/{CodMateria}/{codDocente}/{idtipoacta}:
 *   get:
 *     summary: Obtener el link de acta de calificaciones
 *     tags:
 *       - Notas Académicas
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
 *         name: nivel
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: paralelo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: CodMateria
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: codDocente
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: idtipoacta
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaacademiconotas/ListadoConvalidacionesEstudiantes/{carrera}/{cedula}:
 *   get:
 *     summary: Listado de convalidaciones de un estudiante
 *     tags:
 *       - Notas Académicas
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
 * /rutaacademiconotas/ListadoEquivalenciaRendimento/{idReglamento}:
 *   get:
 *     summary: Obtiene equivalencia de rendimiento del reglamento
 *     tags:
 *       - Notas Académicas
 *     parameters:
 *       - in: path
 *         name: idReglamento
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaacademiconotas/ActualizarActaGeneradaCambioFecha/{periodo}/{acta}:
 *   get:
 *     summary: Actualiza el acta generada por cambio de fecha
 *     tags:
 *       - Notas Académicas
 *     parameters:
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: acta
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaacademiconotas/ObtenerPeriodoDadoCodigo/{periodo}/:
 *   get:
 *     summary: Obtiene información de un periodo dado su código
 *     tags:
 *       - Notas Académicas
 *     parameters:
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaacademiconotas/ObtenerMatriculasInternadosDadoEstudiante/{carrera}/{cedula}:
 *   get:
 *     summary: Obtiene las matrículas de internado de un estudiante
 *     tags:
 *       - Notas Académicas
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
 * /rutaacademiconotas/ListadoRetirosInternadosDadoEstudiante/{carrera}/{cedula}:
 *   get:
 *     summary: Obtiene los retiros de internado de un estudiante
 *     tags:
 *       - Notas Académicas
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
 * /rutaacademiconotas/ListadoEstudiantesPeriodo/{carrera}/{periodo}:
 *   get:
 *     summary: Listado de estudiantes de una carrera en un periodo
 *     tags:
 *       - Notas Académicas
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
 *     responses:
 *       200:
 *         description: OK
 */
