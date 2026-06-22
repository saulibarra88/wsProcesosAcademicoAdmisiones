/**
 * @swagger
 * /rutascript/ProcesosPruebas/{periodo}/:
 *   get:
 *     summary: Ejecuta procesos de pruebas en el periodo
 *     tags:
 *       - Scripts Generales
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
 * /rutascript/ProcesosNotasRecuperacion/:
 *   get:
 *     summary: Procesa notas de recuperación
 *     tags:
 *       - Scripts Generales
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutascript/ProcesosEliminacionMatriculasPendientes/{periodo}:
 *   get:
 *     summary: Ejecuta eliminación de matrículas pendientes
 *     tags:
 *       - Scripts Generales
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
 * /rutascript/ProcesosVerificacionInconsistenciaMatricula/{carrera}/{periodoactual}/{periodoanterior}:
 *   get:
 *     summary: Verifica inconsistencia en matrículas
 *     tags:
 *       - Scripts Generales
 *     parameters:
 *       - in: path
 *         name: carrera
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: periodoactual
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: periodoanterior
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
