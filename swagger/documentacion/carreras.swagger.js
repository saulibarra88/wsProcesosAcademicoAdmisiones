/**
 * @swagger
 * /rutacarrera/ListadoPensumCarrera/{carrera}/:
 *   get:
 *     summary: Obtiene el listado de pensum de una carrera
 *     tags:
 *       - Carreras
 *     parameters:
 *       - in: path
 *         name: carrera
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutacarrera/ListadoPensumMateriasCarreras/{carrera}/{pensum}:
 *   get:
 *     summary: Listado de materias de un pensum y carrera
 *     tags:
 *       - Carreras
 *     parameters:
 *       - in: path
 *         name: carrera
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: pensum
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutacarrera/ListadoEstudiantesApellidos/{apellidos}/:
 *   get:
 *     summary: Listado de estudiantes filtrados por apellidos
 *     tags:
 *       - Carreras
 *     parameters:
 *       - in: path
 *         name: apellidos
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutacarrera/ListadoActasFinCicloNoGeneradas/{carrera}/{periodo}:
 *   get:
 *     summary: Actas de fin de ciclo no generadas
 *     tags:
 *       - Carreras
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
 * 
 * /rutacarrera/ReporteExcelActasNoGeneradas/{carrera}/{periodo}:
 *   get:
 *     summary: Reporte Excel de actas no generadas
 *     tags:
 *       - Carreras
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
 * 
 * /rutacarrera/ListadoActasCalificacionesActasNoGeneradas/{carrera}/{periodo}:
 *   get:
 *     summary: Listado de calificaciones de actas no generadas
 *     tags:
 *       - Carreras
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
 * 
 * /rutacarrera/ActivacionBotonCreacionPeriodo/{carrera}/{periodo}/{pemsun}:
 *   get:
 *     summary: Estado de activación del botón de creación de periodo
 *     tags:
 *       - Carreras
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
 *         name: pemsun
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutacarrera/ListadoMatriculasFirmadasPorNivel/{carrera}/{periodo}/{nivel}:
 *   get:
 *     summary: Listado de matrículas firmadas por nivel
 *     tags:
 *       - Carreras
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
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutacarrera/ReporteExcelUltimoNivelCarrerasTodasInstitucional/{periodo}/{estado}:
 *   get:
 *     summary: Reporte Excel de último nivel institucional
 *     tags:
 *       - Carreras
 *     parameters:
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
 * /rutacarrera/ListadoPeriodosCarreras/{carrera}/:
 *   get:
 *     summary: Listado de periodos de una carrera
 *     tags:
 *       - Carreras
 *     parameters:
 *       - in: path
 *         name: carrera
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutacarrera/ObtenerPeriodosVigenteCarreras/{carrera}/:
 *   get:
 *     summary: Obtiene los periodos vigentes de una carrera
 *     tags:
 *       - Carreras
 *     parameters:
 *       - in: path
 *         name: carrera
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutacarrera/ListadoEstuidantesMatriculadosPeriodos/{carrera}/{periodo}:
 *   get:
 *     summary: Listado de estudiantes matriculados en periodos
 *     tags:
 *       - Carreras
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
 * 
 * /rutacarrera/ListadoCarrerasDadoFacultad/{facultad}:
 *   get:
 *     summary: Listado de carreras de una facultad
 *     tags:
 *       - Carreras
 *     parameters:
 *       - in: path
 *         name: facultad
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
