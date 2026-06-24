/**
 * @swagger
 * /rutasalta/ReporteExcelMatriculasCarrerasIndividual/{carrera}/{periodo}/{estado}:
 *   get:
 *     summary: Reporte Excel de matrículas individuales por carrera
 *     tags:
 *       - Alta Transaccionalidad
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
 * /rutasalta/ReporteExcelMatriculasCarrerasTodasInstitucional/{periodo}/{estado}:
 *   get:
 *     summary: Reporte Excel institucional de todas las matrículas de carreras
 *     tags:
 *       - Alta Transaccionalidad
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
 * /rutasalta/ReporteExcelMatriculasNivelacionTodasInstitucional/{periodo}/{estado}:
 *   get:
 *     summary: Reporte Excel institucional de todas las matrículas de nivelación
 *     tags:
 *       - Alta Transaccionalidad
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
 * /rutasalta/ReporteExcelMatriculasAdmisionesInstitucional/{periodo}:
 *   get:
 *     summary: Reporte Excel institucional de admisiones
 *     tags:
 *       - Alta Transaccionalidad
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
 * /rutasalta/ListadoEstudiantesPeriodo/{carrera}/{periodo}:
 *   get:
 *     summary: Listado transaccional de estudiantes en un periodo
 *     tags:
 *       - Alta Transaccionalidad
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
 * /rutasalta/FotosNivelacionMatriculas/{periodo}:
 *   get:
 *     summary: Listado de fotos de nivelación de matrículas
 *     tags:
 *       - Alta Transaccionalidad
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
 * /rutasalta/FinancieroProcesoDatos/:
 *   get:
 *     summary: Proceso de datos financieros
 *     tags:
 *       - Alta Transaccionalidad
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutasalta/InformacionUsuarioSistemas/:
 *   get:
 *     summary: Información del usuario en los sistemas
 *     tags:
 *       - Alta Transaccionalidad
 *     responses:
 *       200:
 *         description: OK
 */
