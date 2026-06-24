/**
 * @swagger
 * /rutaadministrativa/ListadoConfigHomologacionesFechas/{periodo}/:
 *   get:
 *     summary: Configuración de fechas de homologación por periodo
 *     tags:
 *       - Administrativo
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
 * /rutaadministrativa/ListadoConfigHomologacionesCarreras/{dbcarrera}/:
 *   get:
 *     summary: Configuración de carreras para homologaciones
 *     tags:
 *       - Administrativo
 *     parameters:
 *       - in: path
 *         name: dbcarrera
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaadministrativa/ObtenerCarreraVigenteHomologacion/{dbcarrera}/{periodo}:
 *   get:
 *     summary: Obtiene la carrera vigente para homologaciones en un periodo
 *     tags:
 *       - Administrativo
 *     parameters:
 *       - in: path
 *         name: dbcarrera
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
 * /rutaadministrativa/ListadoRetirosInstitucionales/{periodo}/{cedula}:
 *   get:
 *     summary: Listado de retiros institucionales
 *     tags:
 *       - Administrativo
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
 * /rutaadministrativa/RetirosEstudianteCarrerasCedula/{cedula}/{dbCarrera}:
 *   get:
 *     summary: Retiros de un estudiante en una carrera dada su cédula
 *     tags:
 *       - Administrativo
 *     parameters:
 *       - in: path
 *         name: cedula
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: dbCarrera
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaadministrativa/ListadoRetirosCarreras/{periodo}/{dbCarrera}:
 *   get:
 *     summary: Listado de retiros de una carrera en un periodo
 *     tags:
 *       - Administrativo
 *     parameters:
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: dbCarrera
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaadministrativa/ListadoRetirosCarrerasPdf/{periodo}/{dbCarrera}/{cedula}:
 *   get:
 *     summary: Generación PDF de listado de retiros de carreras
 *     tags:
 *       - Administrativo
 *     parameters:
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: dbCarrera
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
 * /rutaadministrativa/ListadoRetirosCarrerasExcel/{periodo}/{dbCarrera}:
 *   get:
 *     summary: Generación Excel de listado de retiros de carreras
 *     tags:
 *       - Administrativo
 *     parameters:
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: dbCarrera
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaadministrativa/VerificarEstuidanteGraduado/{cedula}:
 *   get:
 *     summary: Verifica si un estudiante está graduado en los sistemas
 *     tags:
 *       - Administrativo
 *     parameters:
 *       - in: path
 *         name: cedula
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaadministrativa/ObtenerNivelAcademicoEstudiante/{dbcarrera}/{cedula}:
 *   get:
 *     summary: Obtiene el nivel académico actual del estudiante
 *     tags:
 *       - Administrativo
 *     parameters:
 *       - in: path
 *         name: dbcarrera
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
 * /rutaadministrativa/ListadoCarrerasDadoFacultad/{facultad}:
 *   get:
 *     summary: Listado de carreras de una facultad
 *     tags:
 *       - Administrativo
 *     parameters:
 *       - in: path
 *         name: facultad
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaadministrativa/IngresoHomologacionFecha/:
 *   post:
 *     summary: Ingresa fechas de homologación
 *     tags:
 *       - Administrativo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaadministrativa/RetiroestudianteSinMatricula/:
 *   post:
 *     summary: Registra el retiro de un estudiante sin matrícula previa
 *     tags:
 *       - Administrativo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutaadministrativa/ListadoEstuidanteGraduadoCarreraFechas:
 *   post:
 *     summary: Listado de estudiantes graduados filtrado por carrera y fechas
 *     tags:
 *       - Administrativo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: OK
 */
