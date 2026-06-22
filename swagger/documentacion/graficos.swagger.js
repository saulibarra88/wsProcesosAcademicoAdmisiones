/**
 * @swagger
 * /rutagraficos/ReporteNoMatriculado/{carrera}/{periodo1}/{periodo2}/{cedula}:
 *   get:
 *     summary: Reporte de estudiantes no matriculados
 *     tags:
 *       - Gráficos
 *     parameters:
 *       - in: path
 *         name: carrera
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: periodo1
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: periodo2
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
 * /rutagraficos/GraficoParciales1/:
 *   post:
 *     summary: Genera gráfico de rendimiento para el primer parcial
 *     tags:
 *       - Gráficos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - carrera
 *               - periodo
 *               - nivel
 *               - paralelo
 *               - codMateria
 *             properties:
 *               carrera:
 *                 type: string
 *               periodo:
 *                 type: string
 *               nivel:
 *                 type: string
 *               paralelo:
 *                 type: string
 *               codMateria:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutagraficos/GraficoParciales2/:
 *   post:
 *     summary: Genera gráfico de rendimiento para el segundo parcial
 *     tags:
 *       - Gráficos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - carrera
 *               - periodo
 *               - nivel
 *               - paralelo
 *               - codMateria
 *             properties:
 *               carrera:
 *                 type: string
 *               periodo:
 *                 type: string
 *               nivel:
 *                 type: string
 *               paralelo:
 *                 type: string
 *               codMateria:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 * 
 * /rutagraficos/GraficoParcialesR/:
 *   post:
 *     summary: Genera gráfico de rendimiento para la recuperación
 *     tags:
 *       - Gráficos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - carrera
 *               - periodo
 *               - nivel
 *               - paralelo
 *               - codMateria
 *             properties:
 *               carrera:
 *                 type: string
 *               periodo:
 *                 type: string
 *               nivel:
 *                 type: string
 *               paralelo:
 *                 type: string
 *               codMateria:
 *                 type: string
 *     responses:
 *       200:
 *         description: OK
 */
