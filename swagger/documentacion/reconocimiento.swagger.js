/**
 * @swagger
 * tags:
 *   - name: Reconocimiento Estudiante
 *     description: Servicios para la gestión de reconocimientos de estudiantes y sus catálogos correspondientes.
 */

/**
 * @swagger
 * /rutareconocimiento/ListadoTipos/{carrera}:
 *   get:
 *     summary: Obtiene el catálogo de tipos de reconocimientos activos
 *     tags:
 *       - Reconocimiento Estudiante
 *     parameters:
 *       - in: path
 *         name: carrera
 *         required: true
 *         description: Base de datos de la carrera a consultar
 *         schema:
 *           type: string
 *           example: "OAS_Medicina"
 *     responses:
 *       200:
 *         description: Operación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 informacion:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       tt_idtipo:
 *                         type: integer
 *                         example: 1
 *                       tt_nombre:
 *                         type: string
 *                         example: "Académico"
 *                       tt_descripcion:
 *                         type: string
 *                         example: "Reconocimientos por alto promedio"
 *                       tt_estado:
 *                         type: boolean
 *                         example: true
 *                       tt_fecha_registro:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-07-13T14:00:00.000Z"
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /rutareconocimiento/ListadoNiveles/{carrera}:
 *   get:
 *     summary: Obtiene el catálogo de niveles de reconocimientos activos
 *     tags:
 *       - Reconocimiento Estudiante
 *     parameters:
 *       - in: path
 *         name: carrera
 *         required: true
 *         description: Base de datos de la carrera a consultar
 *         schema:
 *           type: string
 *           example: "OAS_Medicina"
 *     responses:
 *       200:
 *         description: Operación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 informacion:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       tn_idnivel:
 *                         type: integer
 *                         example: 1
 *                       tn_nombre:
 *                         type: string
 *                         example: "Nacional"
 *                       tn_descripcion:
 *                         type: string
 *                         example: "Otorgado por entidades nacionales"
 *                       tn_orden:
 *                         type: integer
 *                         example: 1
 *                       tn_estado:
 *                         type: boolean
 *                         example: true
 *                       tn_fecha_registro:
 *                         type: string
 *                         format: date-time
 *                         example: "2026-07-13T14:00:00.000Z"
 *       500:
 *         description: Error en el servidor
 */

/**
 * @swagger
 * /rutareconocimiento/IngresarReconocimiento:
 *   post:
 *     summary: Registra un nuevo reconocimiento para un estudiante
 *     tags:
 *       - Reconocimiento Estudiante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - carrera
 *               - tr_idtipo
 *               - tr_idnivel
 *               - tr_nombre
 *               - tr_institucion
 *               - tr_fecha_otorgamiento
 *               - tr_iduser
 *               - tr_idestudiante
 *             properties:
 *               carrera:
 *                 type: string
 *                 description: Nombre de la base de datos de la carrera
 *                 example: "OAS_Medicina"
 *               tr_idtipo:
 *                 type: integer
 *                 description: ID del tipo de reconocimiento (tb_reconocimiento_tipo)
 *                 example: 1
 *               tr_idnivel:
 *                 type: integer
 *                 description: ID del nivel de reconocimiento (tb_reconocimiento_nivel)
 *                 example: 2
 *               tr_cedula:
 *                 type: string
 *                 description: Cédula del estudiante
 *                 example: "0601234567"
 *               tr_nombre:
 *                 type: string
 *                 description: Nombre o descripción del reconocimiento
 *                 example: "Primer Lugar en Olimpiadas de Programación"
 *               tr_institucion:
 *                 type: string
 *                 description: Institución que otorga el reconocimiento
 *                 example: "ESPOCH"
 *               tr_titulo:
 *                 type: string
 *                 description: Título asociado al reconocimiento
 *                 example: "Diploma al Mérito Académico"
 *               tr_fecha_otorgamiento:
 *                 type: string
 *                 format: date
 *                 description: Fecha en que se otorgó el reconocimiento
 *                 example: "2026-07-10"
 *               tr_fecha_vencimiento:
 *                 type: string
 *                 format: date
 *                 description: Fecha de vencimiento (si aplica)
 *                 example: "2027-07-10"
 *               tr_descripcion:
 *                 type: string
 *                 description: Información detallada adicional
 *                 example: "Premio entregado en sesión solemne."
 *               tr_url:
 *                 type: string
 *                 description: Enlace web de validación del reconocimiento
 *                 example: "https://ejemplo.com/reconocimiento/valido"
 *               tr_pais:
 *                 type: string
 *                 description: País donde se otorgó el reconocimiento
 *                 example: "Ecuador"
 *               tr_iduser:
 *                 type: integer
 *                 description: ID del usuario administrador que registra
 *                 example: 10
 *               tr_idestudiante:
 *                 type: integer
 *                 description: ID de la clave foránea del estudiante
 *                 example: 450
 *               tr_estado:
 *                 type: integer
 *                 description: Estado del registro (1 activo, 0 inactivo)
 *                 example: 1
 *     responses:
 *       200:
 *         description: Registro exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 mensaje:
 *                   type: string
 *                   example: "Reconocimiento ingresado con éxito"
 *       400:
 *         description: Datos inválidos o faltantes
 *       500:
 *         description: Error en el servidor
 */
