/**
 * @swagger
 * tags:
 *   - name: Movilidad
 *     description: Gestión de movilidad estudiantil, convenios y homologaciones
 */

/**
 * @swagger
 * /rutamovilidad/CarrerasDadoFacultadHomologaciones/{periodo}/{codFacultad}:
 *   get:
 *     summary: Obtiene carreras de una facultad para homologaciones
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: codFacultad
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/ControlesCuposConfiguracionesMovilidad/{carreramovilidad}/{periodo}/{puntaje}:
 *   get:
 *     summary: Control de cupos y configuraciones de movilidad
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: carreramovilidad
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: puntaje
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/ListadoSolicitudesMovilidadPorEstado/{estado}/{periodo}:
 *   get:
 *     summary: Listado de solicitudes de movilidad por estado
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: estado
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
 * /rutamovilidad/ListadoSolicitudesMovilidadPorCarrera/{estado}/{periodo}/{carrera}:
 *   get:
 *     summary: Listado de solicitudes de movilidad por carrera
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: estado
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: carrera
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/ObtenerFormatoTextoCodigo/{codigo}:
 *   get:
 *     summary: Obtiene formato de texto por código
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/ListadoTipoInscripcion/:
 *   get:
 *     summary: Listado de tipos de inscripción
 *     tags: [Movilidad]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/TotalesCantidadesSolicitud/:
 *   get:
 *     summary: Obtiene totales de solicitudes
 *     tags: [Movilidad]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/ObnterHomologacionCarreraEstuidante/{carrera}/{periodo}/{cedula}:
 *   get:
 *     summary: Obtiene homologación de carrera de un estudiante
 *     tags: [Movilidad]
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
 * /rutamovilidad/ObtnerDocumentosSOlicitudesTipo/{idsolicitud}/{tipo}:
 *   get:
 *     summary: Obtiene documentos de solicitudes por tipo
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: idsolicitud
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/ObtnerSolicitudEstuidantePeriodo/{carrera}/{cedula}/{periodo}:
 *   get:
 *     summary: Obtiene solicitud de estudiante por periodo
 *     tags: [Movilidad]
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
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/InsertarCuposConfiguracionesCarreras/{periodo}/{idusuario}/:
 *   get:
 *     summary: Inserta cupos y configuraciones de carreras
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: idusuario
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/ListadoCuposConfiguracionesCarreras/{periodo}/:
 *   get:
 *     summary: Listado de cupos y configuraciones de carreras
 *     tags: [Movilidad]
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
 * /rutamovilidad/ListadoPaisesMaster/:
 *   get:
 *     summary: Listado de países
 *     tags: [Movilidad]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/ListadoProvinciasMaster/{codPais}/:
 *   get:
 *     summary: Listado de provincias por país
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: codPais
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/ListadoCiudadMaster/{codProvincia}/:
 *   get:
 *     summary: Listado de ciudades por provincia
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: codProvincia
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/ListadoInstitucionesMaster/{codciudad}/:
 *   get:
 *     summary: Listado de instituciones por ciudad
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: codciudad
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/ListadoestadoVida/:
 *   get:
 *     summary: Listado de estado de vida
 *     tags: [Movilidad]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/ObnterDatosEstudianteMaster/{cedula}:
 *   get:
 *     summary: Obtiene datos de estudiante en Master
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
 * /rutamovilidad/ObnterDatosEstudianteCarrera/{cedula}/{carrera}:
 *   get:
 *     summary: Obtiene datos de carrera de un estudiante
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: cedula
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: carrera
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/ObnterDatosCarreraCodigo/{carrera}:
 *   get:
 *     summary: Obtiene datos de carrera por código
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
 * /rutamovilidad/ObnterDatosCarreraFacultadCodigo/{carrera}:
 *   get:
 *     summary: Obtiene datos de carrera y facultad por código
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
 * /rutamovilidad/ListadoTitulosInstitucion/{codInstitucion}:
 *   get:
 *     summary: Listado de títulos por institución
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
 * /rutamovilidad/ListadoGradoEstudianteTodas/{cedula}:
 *   get:
 *     summary: Listado de grados académicos de un estudiante
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
 * /rutamovilidad/ObtenerDatosEstuidanteCarrera/{dbcarrera}/{cedula}:
 *   get:
 *     summary: Obtiene datos de estudiante en una carrera
 *     tags: [Movilidad]
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
 * /rutamovilidad/ReporteExcelSolicitudesMovilidad/{periodo}/{estado}:
 *   get:
 *     summary: Reporte Excel de solicitudes de movilidad
 *     tags: [Movilidad]
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
 * /rutamovilidad/ReportePdfSolicitudesMovilidadAprobadas/{periodo}:
 *   get:
 *     summary: Reporte PDF de solicitudes aprobadas
 *     tags: [Movilidad]
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
 * /rutamovilidad/PdfCertificadoMovilidadEstudiante/{periodo}/{cedula}:
 *   get:
 *     summary: Certificado PDF de movilidad estudiante
 *     tags: [Movilidad]
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
 * /rutamovilidad/CurriculumEstuidante/{carrera}/{cedula}/{periodo}:
 *   get:
 *     summary: Obtiene currículum de estudiante en un periodo
 *     tags: [Movilidad]
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
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/CurriculumEstuidanteConsultor/{carrera}/{cedula}/:
 *   get:
 *     summary: Obtiene currículum de estudiante versión consultor
 *     tags: [Movilidad]
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
 * /rutamovilidad/CurriculumEstudianteCarreras/{carrera}/{cedula}/:
 *   get:
 *     summary: Obtiene currículum de estudiante en carreras
 *     tags: [Movilidad]
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
 * /rutamovilidad/ListadoEstadoCivilMaster/:
 *   get:
 *     summary: Listado de estado civil
 *     tags: [Movilidad]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/ListadoSexoMaster/:
 *   get:
 *     summary: Listado de géneros/sexo
 *     tags: [Movilidad]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/ListadoCiudadTodasMaster/:
 *   get:
 *     summary: Listado de todas las ciudades
 *     tags: [Movilidad]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/ListadoInscripcionesTodasEstudiante/{cedula}:
 *   get:
 *     summary: Listado de todas las inscripciones de un estudiante
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
 * /rutamovilidad/ObtenerDatosCarrera/{dbBase}:
 *   get:
 *     summary: Obtiene datos de carrera por base de datos
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: dbBase
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/ListadoCarrerasTraspaso/{dbBase}/{periodo}:
 *   get:
 *     summary: Listado de carreras de traspaso
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: dbBase
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
 * /rutamovilidad/ObtenerHomologacionCarrera/{dbBase}/{periodo}:
 *   get:
 *     summary: Obtiene homologaciones de una carrera
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: dbBase
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
 * /rutamovilidad/ListadoCarrerasSolicitudAprobadasPeriodo/{periodo}:
 *   get:
 *     summary: Listado de carreras con solicitudes aprobadas en periodo
 *     tags: [Movilidad]
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
 * /rutamovilidad/PdfresporteSolicitudAprobadasCarreraPreiodo/{periodo}/{carrera}/{strnombre}:
 *   get:
 *     summary: Reporte PDF de solicitudes aprobadas por carrera y periodo
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: carrera
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: strnombre
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/PdfresporteSolicitudAprobadasCarreraTipo/{periodo}/{carrera}/{tipo}/{strnombre}:
 *   get:
 *     summary: Reporte PDF de solicitudes aprobadas por carrera, tipo y periodo
 *     tags: [Movilidad]
 *     parameters:
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: carrera
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: tipo
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: strnombre
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/ListadoEstadosSolicitudes/:
 *   get:
 *     summary: Listado de estados de solicitudes
 *     tags: [Movilidad]
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutamovilidad/MatriculaEstuidanteCarreraPeriodo/{carrera}/{periodo}/{cedula}/:
 *   get:
 *     summary: Matrícula de estudiante en carrera y periodo
 *     tags: [Movilidad]
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
 * /rutamovilidad/RetirosAsignaturasTodasEstudiantes/{carrera}/{cedula}/:
 *   get:
 *     summary: Retiro de asignaturas de un estudiante
 *     tags: [Movilidad]
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
 * /rutamovilidad/DatosEstudiantesCambioCarreraProcesos/:
 *   post:
 *     summary: Obtiene datos de estudiante para cambio de carrera
 *     tags: [Movilidad]
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
 * 
 * /rutamovilidad/IngresarSolicitudMovilidadEstudiante:
 *   post:
 *     summary: Ingresa una nueva solicitud de movilidad
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
 * /rutamovilidad/ActulizarEstadoSolicitud:
 *   post:
 *     summary: Actualiza el estado de una solicitud
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
 * /rutamovilidad/InsertarSolicitudAprobadaInscripcionMoviInterna:
 *   post:
 *     summary: Aprueba solicitud e inscribe en movilidad interna
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
 * /rutamovilidad/InsertarSolicitudAprobadaInscripcionMoviTraspaso:
 *   post:
 *     summary: Aprueba solicitud e inscribe en movilidad por traspaso
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
 * /rutamovilidad/InsertarInscripcionMoviExterna:
 *   post:
 *     summary: Registra inscripción en movilidad externa
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
 * /rutamovilidad/InsertarInscripcionAntigua:
 *   post:
 *     summary: Registra inscripción antigua
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
 * /rutamovilidad/ActuzalizarCarrerasConfiguracionesMovilidad:
 *   post:
 *     summary: Actualiza configuraciones de carreras para movilidad
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
 * /rutamovilidad/InserarEstudianteMaster:
 *   post:
 *     summary: Inserta estudiante en tabla Master
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
 * /rutamovilidad/InserarGradoEstudianteMaster:
 *   post:
 *     summary: Inserta grado académico de estudiante en Master
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
 * /rutamovilidad/EliminarGradoEstuidante:
 *   post:
 *     summary: Elimina grado académico de un estudiante
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
 * /rutamovilidad/ActualizarradoEstuidante:
 *   post:
 *     summary: Actualiza grado académico de un estudiante
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
 * /rutamovilidad/EliminacionInscripcionMovExterna:
 *   post:
 *     summary: Elimina inscripción de movilidad externa
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
 * /rutamovilidad/ActulizarSolicitudesEstudiante:
 *   post:
 *     summary: Actualiza solicitudes del estudiante
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
 * /rutamovilidad/IngresoDocumentosSolicitud:
 *   post:
 *     summary: Registra documentos adjuntos de una solicitud
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
 * /rutamovilidad/IngresoEstuidanteExcepcionMovilidad:
 *   post:
 *     summary: Registra estudiante con excepción en movilidad
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
 * /rutamovilidad/ActualizarEstuidanteMaster:
 *   post:
 *     summary: Actualiza estudiante en tabla Master
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
 * /rutamovilidad/ActualizarEstuidanteCarrera:
 *   post:
 *     summary: Actualiza carrera de un estudiante
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
 * /rutamovilidad/ActualizarSolicitudEstadoAcademico:
 *   post:
 *     summary: Actualiza el estado académico de la solicitud
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
 * /rutamovilidad/ActulizarDocumentoSolicitud:
 *   post:
 *     summary: Actualiza documentos de una solicitud de movilidad
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
