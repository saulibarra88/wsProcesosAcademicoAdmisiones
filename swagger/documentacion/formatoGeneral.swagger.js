/**
 * @swagger
 * /rutageneral/ListadoCarrerasDadoFacultad/{facultad}:
 *   get:
 *     summary: Listado de carreras de una facultad
 *     tags:
 *       - Formatos de Reporte
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
 * /rutageneral/VerifocarRutasMatriculasNuevoAlmacenamiento/{carrera}/{periodo}:
 *   get:
 *     summary: Verifica rutas de matrículas de nuevo almacenamiento
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
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutageneral/EstadisitcasMatriculasPeriodoCarrera/{carrera}/{periodo}:
 *   get:
 *     summary: Estadísticas de matrículas por periodo y carrera
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
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutageneral/TotalDefinitivasCarrerasInstitucional/{periodo}:
 *   get:
 *     summary: Total de matrículas definitivas institucionales
 *     tags:
 *       - Formatos de Reporte
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
 * /rutageneral/ListadoAsignaturasDictadoDocente/{carrera}/{cedula}:
 *   get:
 *     summary: Listado de asignaturas dictadas por docente
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
 * /rutageneral/ListadoAsignaturasDictadoPeriodo/{carrera}/{periodo}:
 *   get:
 *     summary: Listado de asignaturas dictadas por periodo
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
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutageneral/ListadoCarrerasMovilidadesPeriodo/{periodo}:
 *   get:
 *     summary: Listado de carreras con movilidad en un periodo
 *     tags:
 *       - Formatos de Reporte
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
 * /rutageneral/ListadoCarrerasHomologacionPeriodo/{periodo}:
 *   get:
 *     summary: Listado de carreras con homologación en un periodo
 *     tags:
 *       - Formatos de Reporte
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
 * /rutageneral/InsertarCarreraMovilidad/:
 *   post:
 *     summary: Registra asociación de carrera para movilidad
 *     tags:
 *       - Formatos de Reporte
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
 * /rutageneral/ClonacionCarreraPeriodo/:
 *   post:
 *     summary: Clona configuraciones de carrera por periodo
 *     tags:
 *       - Formatos de Reporte
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
 * /rutageneral/ClonacionCarreraHomologacionGeneralPeriodo/:
 *   post:
 *     summary: Clona homologaciones de carrera por periodo
 *     tags:
 *       - Formatos de Reporte
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
 * /rutageneral/ActualizacionDatosHomologacionesCarreras/:
 *   post:
 *     summary: Actualiza datos de homologaciones de carreras
 *     tags:
 *       - Formatos de Reporte
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
