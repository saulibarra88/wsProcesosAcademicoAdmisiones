/**
 * @swagger
 * tags:
 *   - name: Procesos
 *     description: Operaciones generales de procesos académicos y nivelación
 */

/**
 * @swagger
 * /rutaprocesos/ProcesoConfirmacionCupoInscripcion/{periodo}/{cedula}/:
 *   get:
 *     summary: Proceso de confirmación de cupo de inscripción
 *     tags: [Procesos]
 *     parameters:
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
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 * 
 * /rutaprocesos/ProcesoMatriculacionAceptacionCupo/{periodo}/{cedula}/:
 *   get:
 *     summary: Proceso de matriculación por aceptación de cupo
 *     tags: [Procesos]
 *     parameters:
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
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/ProcesoRetirosParciales/{periodo}/{cedula}/:
 *   get:
 *     summary: Proceso de retiros parciales
 *     tags: [Procesos]
 *     parameters:
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
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/ProcesoImpedimentoAcademicoNivelacion/{periodo}/{cedula}/:
 *   get:
 *     summary: Impedimento académico en nivelación
 *     tags: [Procesos]
 *     parameters:
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
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/ProcesoMatriculadosDefinitivasPeriodos/{periodo}/{cedula}/:
 *   get:
 *     summary: Matriculados definitivos en periodos
 *     tags: [Procesos]
 *     parameters:
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
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/ProcesoConfirmadoCasoEspecialRuben/{periodo}/:
 *   get:
 *     summary: Caso especial Ruben
 *     tags: [Procesos]
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
 * /rutaprocesos/ProcesoActivarCupoRetiro/{periodo}/{cedula}/:
 *   get:
 *     summary: Activar cupo tras retiro
 *     tags: [Procesos]
 *     parameters:
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
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/ProcesoPerdidaPeriodoAcumulado/{periodo}/{cedula}/:
 *   get:
 *     summary: Pérdida de periodo acumulado
 *     tags: [Procesos]
 *     parameters:
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
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/ProcesoAprobacionNivelacionpasoCarrera/{periodo}/:
 *   get:
 *     summary: Aprobación de nivelación y paso a carrera
 *     tags: [Procesos]
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
 * /rutaprocesos/ProcesoAdmisionesVerificacionRegistroCupo/{periodo}/:
 *   get:
 *     summary: Verificación de registro de cupo en admisiones
 *     tags: [Procesos]
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
 * /rutaprocesos/ListadoEstudiantesNoRegistradoADmisionesPeridaCupo/{periodo}/:
 *   get:
 *     summary: Estudiantes no registrados en admisiones con pérdida de cupo
 *     tags: [Procesos]
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
 * /rutaprocesos/ListadoEstudianntesCupoPorEstado/{periodo}/{idEstado}/{cedula}:
 *   get:
 *     summary: Listado de estudiantes cupo por estado
 *     tags: [Procesos]
 *     parameters:
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: idEstado
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: cedula
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/ExcelListadoEstudianntesCupoPorEstado/{periodo}/{idEstado}/{cedula}:
 *   get:
 *     summary: Listado Excel de estudiantes cupo por estado
 *     tags: [Procesos]
 *     parameters:
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: idEstado
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: cedula
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/ListadoEstadoCupo/:
 *   get:
 *     summary: Listado de estados de cupo
 *     tags: [Procesos]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/VerificarRegistroIncripcionEstudiantesAdmisiones/{periodo}/{cedula}/:
 *   get:
 *     summary: Verificar registro de inscripción de estudiantes de admisiones
 *     tags: [Procesos]
 *     parameters:
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
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/ListadoProcesoPeriodo/:
 *   get:
 *     summary: Listado de periodos en proceso
 *     tags: [Procesos]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/PeriodoVigenteMaster/:
 *   get:
 *     summary: Periodo vigente en Master
 *     tags: [Procesos]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/ListadoPeriodoVigenteMaster/:
 *   get:
 *     summary: Listado de periodos vigentes en Master
 *     tags: [Procesos]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/IngresarInscripcionEstuidanteCasoEspeciales/{periodo}/{cedula}:
 *   get:
 *     summary: Registrar inscripción de estudiantes casos especiales
 *     tags: [Procesos]
 *     parameters:
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
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/ListadoMatriculasProcesosValidacion/:
 *   get:
 *     summary: Listado de matrículas en proceso de validación
 *     tags: [Procesos]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/ListadoEstudianteMatriculadoDadoNivel/{periodo}/{nivel}:
 *   get:
 *     summary: Listado de estudiantes matriculados por nivel
 *     tags: [Procesos]
 *     parameters:
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
 * /rutaprocesos/ListadoEstudianteMatriculadoDadoNivelCupos/{periodo}/{nivel}:
 *   get:
 *     summary: Listado de cupos de estudiantes matriculados por nivel
 *     tags: [Procesos]
 *     parameters:
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
 * /rutaprocesos/ListadoHomologacionCarreraAdminisiones/:
 *   get:
 *     summary: Listado de homologación de carrera admisiones
 *     tags: [Procesos]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/DocumentosMatriculasPeriodos/{BaseCarrera}/{periodo}:
 *   get:
 *     summary: Documentos de matrículas por periodo
 *     tags: [Procesos]
 *     parameters:
 *       - in: path
 *         name: BaseCarrera
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
 * /rutaprocesos/RevisionDoumentosNoGeneradosMatriculasCarreras/{periodo}:
 *   get:
 *     summary: Revisión de documentos no generados de matrículas de carreras
 *     tags: [Procesos]
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
 * /rutaprocesos/PDFListadoDocumentosCarreras/{periodo}/{cedula}:
 *   get:
 *     summary: PDF del listado de documentos de carreras
 *     tags: [Procesos]
 *     parameters:
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
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/PDFListadoEstudianteMatriculasTerceraSegunda/{carrera}/{periodo}/{tipo}/{cedula}:
 *   get:
 *     summary: PDF de listado de matrículas en tercera y segunda
 *     tags: [Procesos]
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
 *         name: tipo
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
 * /rutaprocesos/PDFPerdidasAsignaturasEstudiantes/{carrera}/{periodo}/{cedula}:
 *   get:
 *     summary: PDF de pérdida de asignaturas de estudiantes
 *     tags: [Procesos]
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
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/PDFPerdidasAsignaturasEstudiantesNivelParalelos/{carrera}/{periodo}/{cedula}:
 *   get:
 *     summary: PDF de pérdidas de asignaturas por nivel y paralelo
 *     tags: [Procesos]
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
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/PDFMatriculasEstadosNivelParalelos/{carrera}/{periodo}/{cedula}:
 *   get:
 *     summary: PDF de matrículas por estado, nivel y paralelo
 *     tags: [Procesos]
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
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/ProcesosPruebas/{periodo}/:
 *   get:
 *     summary: Procesos de pruebas
 *     tags: [Procesos]
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
 * /rutaprocesos/PDFEvaluacionesRecuperacionCarrera/{carrera}/{periodo}/{cedula}:
 *   get:
 *     summary: PDF de evaluaciones de recuperación de carrera
 *     tags: [Procesos]
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
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/PDFAsignaturasPaoTipoCarrera/{carrera}/{periodo}/{cedula}:
 *   get:
 *     summary: PDF de asignaturas PAO por tipo de carrera
 *     tags: [Procesos]
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
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/PDFEPromediosGeneralesAsignaturas/{carrera}/{periodo}/{cedula}:
 *   get:
 *     summary: PDF de promedios generales de asignaturas
 *     tags: [Procesos]
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
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/PdfReporteHomologacionesCarrera:
 *   post:
 *     summary: PDF de reporte de homologaciones de carrera
 *     tags: [Procesos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - listado
 *               - dbBaseCarrera
 *               - cedulaUsuario
 *             properties:
 *               listado:
 *                 type: array
 *                 items:
 *                   type: object
 *               dbBaseCarrera:
 *                 type: string
 *               cedulaUsuario:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaprocesos/ActualizacionCentralizadaDatos:
 *   post:
 *     summary: Actualización centralizada de datos
 *     tags: [Procesos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - listado
 *               - dbBaseCarrera
 *             properties:
 *               listado:
 *                 type: array
 *                 items:
 *                   type: object
 *               dbBaseCarrera:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
