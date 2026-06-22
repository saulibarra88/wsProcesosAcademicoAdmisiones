/**
 * @swagger
 * /rutaadmision/ObtenerListadoEstudianteAdmisiones/{dbBaseCarrera}/{periodo}/{idestado}/{percodigoadmision}:
 *   get:
 *     summary: Obtiene el listado de estudiantes de admisiones
 *     description: Retorna una lista de estudiantes en el proceso de admisiones según la base de datos de carrera, periodo, estado y periodo de admisión.
 *     tags:
 *       - Admisión
 *     parameters:
 *       - in: path
 *         name: dbBaseCarrera
 *         required: true
 *         schema:
 *           type: string
 *         description: Base de datos de la carrera (ej. fca_db)
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del periodo académico (ej. P0042)
 *       - in: path
 *         name: idestado
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del estado de admisión
 *       - in: path
 *         name: percodigoadmision
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del periodo de admisión
 *     responses:
 *       200:
 *         description: Listado obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /rutaadmision/ObtenerListadoEstadosAdmisiones/{dbBaseCarrera}/{periodo}:
 *   get:
 *     summary: Obtiene los estados de admisiones
 *     description: Retorna los estados configurados para admisiones en la carrera y periodo especificados.
 *     tags:
 *       - Admisión
 *     parameters:
 *       - in: path
 *         name: dbBaseCarrera
 *         required: true
 *         schema:
 *           type: string
 *         description: Base de datos de la carrera
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del periodo académico
 *     responses:
 *       200:
 *         description: Listado obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /rutaadmision/pdfComproanteCupoAdmisiones/{acuId}:
 *   get:
 *     summary: Genera comprobante de cupo de admisiones
 *     description: Retorna el comprobante de cupo generado en base a un ID específico.
 *     tags:
 *       - Admisión
 *     parameters:
 *       - in: path
 *         name: acuId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de comprobación de cupo
 *     responses:
 *       200:
 *         description: Documento obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /rutaadmision/ReportepdfListadoEstudiantesAdmisiones/:
 *   post:
 *     summary: Genera reporte PDF de estudiantes admitidos
 *     description: Retorna una cadena base64 del PDF generado con el listado de estudiantes en admisiones.
 *     tags:
 *       - Admisión
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
 *         description: PDF generado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /rutaadmision/ReportepdfListadoAspiranteAdmisiones/:
 *   post:
 *     summary: Genera reporte PDF de aspirantes admitidos
 *     description: Retorna una cadena base64 del PDF generado con el listado de aspirantes en admisiones.
 *     tags:
 *       - Admisión
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
 *         description: PDF generado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /rutaadmision/ReporteexcelListadoEstudiantesAdmisiones/:
 *   post:
 *     summary: Genera reporte Excel de estudiantes admitidos
 *     description: Retorna una cadena base64 del Excel generado con el listado de estudiantes en admisiones.
 *     tags:
 *       - Admisión
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
 *         description: Excel generado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /rutaadmision/ReporteexcelListadoAspiranteAdmisiones/:
 *   post:
 *     summary: Genera reporte Excel de aspirantes admitidos
 *     description: Retorna una cadena base64 del Excel generado con el listado de aspirantes en admisiones.
 *     tags:
 *       - Admisión
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
 *         description: Excel generado con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /rutaadmision/ObtenerListadoAspiranteAdmisiones/{dbBaseCarrera}/{periodo}:
 *   get:
 *     summary: Obtiene el listado de aspirantes de admisiones
 *     description: Retorna una lista de aspirantes admitidos según la base de datos de carrera y el periodo académico.
 *     tags:
 *       - Admisión
 *     parameters:
 *       - in: path
 *         name: dbBaseCarrera
 *         required: true
 *         schema:
 *           type: string
 *         description: Base de datos de la carrera
 *       - in: path
 *         name: periodo
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del periodo académico
 *     responses:
 *       200:
 *         description: Listado obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 * 
 * /rutaadmision/ObtenerPeriodoVigenteAdmisiones/:
 *   get:
 *     summary: Obtiene el periodo vigente de admisiones
 *     description: Retorna la información del periodo de admisión actualmente activo en el sistema.
 *     tags:
 *       - Admisión
 *     responses:
 *       200:
 *         description: Periodo obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BaseResponse'
 *       500:
 *         description: Error en el servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
