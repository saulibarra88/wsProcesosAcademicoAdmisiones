/**
 * @swagger
 * /rutamovilidadconfiguraciones/ListadoFacultadesAdministracion/:
 *   get:
 *     summary: Listado de facultades de administración
 *     tags: [Movilidad]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadconfiguraciones/ListadoFacultadesActivas/:
 *   get:
 *     summary: Listado de facultades activas
 *     tags: [Movilidad]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadconfiguraciones/ListadoEscuelaAdministracion/{facultad}:
 *   get:
 *     summary: Listado de escuelas por facultad
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/PrpuestaCodigoPensum/{carrera}:
 *   get:
 *     summary: Propuesta de código de pensum por carrera
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/ListadoCarrerasAdministracion/{escuela}:
 *   get:
 *     summary: Listado de carreras de administración por escuela
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: escuela
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadconfiguraciones/ListadoSedes/:
 *   get:
 *     summary: Listado de sedes institucionales
 *     tags: [Movilidad]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadconfiguraciones/CodigoSeguirdadCarrera/{escuela}:
 *   get:
 *     summary: Código de seguridad de carrera por escuela
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: escuela
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadconfiguraciones/ListadoTipoInstituciones/:
 *   get:
 *     summary: Listado de tipos de instituciones
 *     tags: [Movilidad]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadconfiguraciones/ListadoInstitucionesTodas/:
 *   get:
 *     summary: Listado de todas las instituciones
 *     tags: [Movilidad]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadconfiguraciones/ListadoTitulosTodos/:
 *   get:
 *     summary: Listado de todos los títulos registrados
 *     tags: [Movilidad]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadconfiguraciones/ObtenerDatosInstitucion/:
 *   get:
 *     summary: Obtiene datos de instituciones
 *     tags: [Movilidad]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadconfiguraciones/ObtenerNuevoCodigoPeriodoAcademico/{tipo}:
 *   get:
 *     summary: Obtiene el nuevo código de periodo académico
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadconfiguraciones/ListadoCarrerasCalificaciones/:
 *   get:
 *     summary: Listado de carreras y sus calificaciones
 *     tags: [Movilidad]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadconfiguraciones/ObtenerFechasCalificacionesAcademico/:
 *   get:
 *     summary: Obtiene fechas de calificaciones del calendario académico
 *     tags: [Movilidad]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadconfiguraciones/ObtenerInformacionAcademicaEstudiante/{cedula}:
 *   get:
 *     summary: Obtiene información académica de un estudiante
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/ObtenerUsuarioPorIdRolyBaseCarrera/{idrol}/{dbcarrera}:
 *   get:
 *     summary: Obtiene usuario por ID de rol y base de datos de carrera
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: idrol
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: dbcarrera
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadconfiguraciones/ListadoTitulosDadoInstitucion/{codInstitucion}:
 *   get:
 *     summary: Listado de títulos de una institución
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: codInstitucion
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadconfiguraciones/IngresoTituloInstitucion/{codInstitucion}/{codTitulo}:
 *   get:
 *     summary: Registra la asociación de un título a una institución
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: codInstitucion
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: codTitulo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidadconfiguraciones/IngresarFacultad:
 *   post:
 *     summary: Ingresa una nueva facultad
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/ActualizarFacultad:
 *   post:
 *     summary: Actualiza una facultad
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/CambiarEstadoFacultad:
 *   post:
 *     summary: Cambia el estado de una facultad
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/IngresarEscuela:
 *   post:
 *     summary: Ingresa una nueva escuela
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/ActualizarEscuela:
 *   post:
 *     summary: Actualiza una escuela
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/CambiarEstadoEscuela:
 *   post:
 *     summary: Cambia el estado de una escuela
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/IngresarCarrera:
 *   post:
 *     summary: Ingresa una nueva carrera
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/ActualizarCarrera:
 *   post:
 *     summary: Actualiza una carrera
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/CambiarEstadoCarrera:
 *   post:
 *     summary: Cambia el estado de una carrera
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/IngresarPais:
 *   post:
 *     summary: Registra un nuevo país
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/ActualizarPais:
 *   post:
 *     summary: Actualiza un país
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/IngresarProvincia:
 *   post:
 *     summary: Registra una nueva provincia
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/ActualizarProvincia:
 *   post:
 *     summary: Actualiza una provincia
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/IngresarCiudad:
 *   post:
 *     summary: Registra una nueva ciudad
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/ActualizarCiudad:
 *   post:
 *     summary: Actualiza una ciudad
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/IngresarInstituciones:
 *   post:
 *     summary: Registra una nueva institución
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/ActualizarInstituciones:
 *   post:
 *     summary: Actualiza una institución
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/IngresarTitulo:
 *   post:
 *     summary: Registra un nuevo título
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/ActualizarTitulo:
 *   post:
 *     summary: Actualiza un título
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/ActualizarDatosInstitucional:
 *   post:
 *     summary: Actualiza datos institucionales generales
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/IngresoNuevoPeriodoAcademico:
 *   post:
 *     summary: Registra un nuevo periodo académico
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/ActualizarPeriodoCarreras:
 *   post:
 *     summary: Actualiza periodos y asociaciones de carreras
 *     tags: [Movilidad]
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
 * /rutamovilidadconfiguraciones/ActualizarFechasCalificacionesCarreras:
 *   post:
 *     summary: Actualiza las fechas límites de calificaciones de carreras
 *     tags: [Movilidad]
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
