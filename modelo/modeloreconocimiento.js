const { execMaster } = require("./../config/execSQLMaster.helper");

/**
 * Listar tipos de reconocimiento activos (tt_estado = 1)
 * @param {string} carrera Base de datos de la carrera
 */
module.exports.ListarReconocimientoTipos = async function (carrera) {
  const sentencia = `SELECT tt_idtipo, tt_nombre, tt_descripcion, tt_estado, tt_fecha_registro 
                     FROM [${carrera}].[dbo].[tb_reconocimiento_tipo] 
                     WHERE tt_estado = 1 
                     ORDER BY tt_nombre ASC`;
  try {
    if (carrera && carrera !== "") {
      const sqlConsulta = await execMaster(carrera, sentencia, "OK", "OK");
      return sqlConsulta;
    } else {
      return { data: [], message: "Falta parámetro carrera", count: 0 };
    }
  } catch (error) {
    return { data: [], message: "Error: " + error, count: -1 };
  }
};

/**
 * Listar niveles de reconocimiento activos (tn_estado = 1)
 * @param {string} carrera Base de datos de la carrera
 */
module.exports.ListarReconocimientoNiveles = async function (carrera) {
  const sentencia = `SELECT tn_idnivel, tn_nombre, tn_descripcion, tn_orden, tn_estado, tn_fecha_registro 
                     FROM [${carrera}].[dbo].[tb_reconocimiento_nivel] 
                     WHERE tn_estado = 1 
                     ORDER BY tn_orden ASC, tn_nombre ASC`;
  try {
    if (carrera && carrera !== "") {
      const sqlConsulta = await execMaster(carrera, sentencia, "OK", "OK");
      return sqlConsulta;
    } else {
      return { data: [], message: "Falta parámetro carrera", count: 0 };
    }
  } catch (error) {
    return { data: [], message: "Error: " + error, count: -1 };
  }
};

/**
 * Insertar reconocimiento de estudiante
 * @param {string} carrera Base de datos de la carrera
 * @param {object} datos Datos del reconocimiento
 */
module.exports.InsertarReconocimientoEstudiante = async function (carrera, datos) {
  const escapeSqlString = (val) => {
    if (val === undefined || val === null) return 'NULL';
    return `'${String(val).replace(/'/g, "''")}'`;
  };

  const sentencia = `
    INSERT INTO [${carrera}].[dbo].[tb_reconocimiento_estudiante] (
      tr_idtipo, 
      tr_idnivel, 
      tr_cedula, 
      tr_nombre, 
      tr_institucion,
      tr_titulo, 
      tr_fecha_otorgamiento, 
      tr_fecha_vencimiento, 
      tr_descripcion,
      tr_url, 
      tr_pais, 
      tr_iduser, 
      tr_idestudiante, 
      tr_estado
    ) VALUES (
      ${parseInt(datos.tr_idtipo, 10)},
      ${parseInt(datos.tr_idnivel, 10)},
      ${escapeSqlString(datos.tr_cedula)},
      ${escapeSqlString(datos.tr_nombre)},
      ${escapeSqlString(datos.tr_institucion)},
      ${escapeSqlString(datos.tr_titulo)},
      ${escapeSqlString(datos.tr_fecha_otorgamiento)},
      ${escapeSqlString(datos.tr_fecha_vencimiento)},
      ${escapeSqlString(datos.tr_descripcion)},
      ${escapeSqlString(datos.tr_url)},
      ${escapeSqlString(datos.tr_pais)},
      ${parseInt(datos.tr_iduser, 10)},
      ${parseInt(datos.tr_idestudiante, 10)},
      ${datos.tr_estado === true || datos.tr_estado === 1 || datos.tr_estado === '1' || datos.tr_estado === 'true' ? 1 : 0}
    );
  `;

  try {
    if (carrera && carrera !== "") {
      const sqlConsulta = await execMaster(carrera, sentencia, "OK", "OK");
      return sqlConsulta;
    } else {
      return { data: [], message: "Falta parámetro carrera", count: 0 };
    }
  } catch (error) {
    return { data: [], message: "Error: " + error, count: -1 };
  }
};

/**
 * Listar reconocimientos de un estudiante
 * @param {string} carrera Base de datos de la carrera
 * @param {string} cedula Cédula del estudiante
 */
module.exports.ListarReconocimientosEstudiante = async function (carrera, cedula) {
  const sentencia = `
    SELECT r.*, t.tt_nombre, n.tn_nombre 
    FROM [${carrera}].[dbo].[tb_reconocimiento_estudiante] r
    INNER JOIN [${carrera}].[dbo].[tb_reconocimiento_tipo] t ON r.tr_idtipo = t.tt_idtipo
    INNER JOIN [${carrera}].[dbo].[tb_reconocimiento_nivel] n ON r.tr_idnivel = n.tn_idnivel
    WHERE r.tr_cedula = '${cedula.replace(/'/g, "''")}' AND r.tr_estado = 1
    ORDER BY r.tr_fecha_otorgamiento DESC;
  `;
  try {
    if (carrera && carrera !== "") {
      const sqlConsulta = await execMaster(carrera, sentencia, "OK", "OK");
      return sqlConsulta;
    } else {
      return { data: [], message: "Falta parámetro carrera", count: 0 };
    }
  } catch (error) {
    return { data: [], message: "Error: " + error, count: -1 };
  }
};
module.exports.ListarReconocimientosEstudianteCurriculum = async function (carrera, cedula) {
  const sentencia = `
    SELECT r.*, t.tt_nombre, n.tn_nombre 
    FROM [${carrera}].[dbo].[tb_reconocimiento_estudiante] r
    INNER JOIN [${carrera}].[dbo].[tb_reconocimiento_tipo] t ON r.tr_idtipo = t.tt_idtipo
    INNER JOIN [${carrera}].[dbo].[tb_reconocimiento_nivel] n ON r.tr_idnivel = n.tn_idnivel
    WHERE r.tr_cedula = '${cedula}' AND r.tr_estado = 1
    ORDER BY r.tr_fecha_otorgamiento DESC;
  `;
  try {
    if (carrera && carrera !== "") {
      const sqlConsulta = await execMaster(carrera, sentencia, "OK", "OK");
      return sqlConsulta;
    } else {
      return { data: [], message: "Falta parámetro carrera", count: 0 };
    }
  } catch (error) {
    return { data: [], message: "Error: " + error, count: -1 };
  }
};
/**
 * Actualizar un reconocimiento existente de estudiante
 * @param {string} carrera Base de datos de la carrera
 * @param {object} datos Datos a actualizar
 */
module.exports.ActualizarReconocimientoEstudiante = async function (carrera, datos) {
  const escapeSqlString = (val) => {
    if (val === undefined || val === null) return 'NULL';
    return `'${String(val).replace(/'/g, "''")}'`;
  };

  const sentencia = `
    UPDATE [${carrera}].[dbo].[tb_reconocimiento_estudiante]
    SET 
      tr_idtipo = ${parseInt(datos.tr_idtipo, 10)},
      tr_idnivel = ${parseInt(datos.tr_idnivel, 10)},
      tr_nombre = ${escapeSqlString(datos.tr_nombre)},
      tr_institucion = ${escapeSqlString(datos.tr_institucion)},
      tr_titulo = ${escapeSqlString(datos.tr_titulo)},
      tr_fecha_otorgamiento = ${escapeSqlString(datos.tr_fecha_otorgamiento)},
      tr_fecha_vencimiento = ${escapeSqlString(datos.tr_fecha_vencimiento)},
      tr_descripcion = ${escapeSqlString(datos.tr_descripcion)},
      tr_url = ${escapeSqlString(datos.tr_url)},
      tr_pais = ${escapeSqlString(datos.tr_pais)},
      tr_iduser = ${parseInt(datos.tr_iduser, 10)},
      tr_estado = ${datos.tr_estado === true || datos.tr_estado === 1 || datos.tr_estado === '1' || datos.tr_estado === 'true' ? 1 : 0}
    WHERE tr_idreconocimiento = ${parseInt(datos.tr_idreconocimiento, 10)};
  `;

  try {
    if (carrera && carrera !== "") {
      const sqlConsulta = await execMaster(carrera, sentencia, "OK", "OK");
      return sqlConsulta;
    } else {
      return { data: [], message: "Falta parámetro carrera", count: 0 };
    }
  } catch (error) {
    return { data: [], message: "Error: " + error, count: -1 };
  }
};

/**
 * Eliminar (lógicamente) un reconocimiento de estudiante
 * @param {string} carrera Base de datos de la carrera
 * @param {number} idreconocimiento ID del reconocimiento a eliminar
 * @param {number} iduser ID del usuario que elimina
 */
module.exports.EliminarReconocimientoEstudiante = async function (carrera, idreconocimiento, iduser) {
  const sentencia = `
    UPDATE [${carrera}].[dbo].[tb_reconocimiento_estudiante]
    SET 
      tr_estado = 0,
      tr_iduser = ${parseInt(iduser, 10)}
    WHERE tr_idreconocimiento = ${parseInt(idreconocimiento, 10)};
  `;
  try {
    if (carrera && carrera !== "") {
      const sqlConsulta = await execMaster(carrera, sentencia, "OK", "OK");
      return sqlConsulta;
    } else {
      return { data: [], message: "Falta parámetro carrera", count: 0 };
    }
  } catch (error) {
    return { data: [], message: "Error: " + error, count: -1 };
  }
};

/**
 * Obtener estudiante por cédula (tanto con guion como sin guion)
 * @param {string} carrera Base de datos de la carrera
 * @param {string} cedula Cédula del estudiante
 */
module.exports.ObtenerEstudiantePorCedula = async function (carrera, cedula) {
  const cedulaLimpia = String(cedula).trim();
  let cedulaConGuion = cedulaLimpia;
  if (!cedulaLimpia.includes("-") && cedulaLimpia.length > 1) {
    cedulaConGuion = cedulaLimpia.slice(0, -1) + "-" + cedulaLimpia.slice(-1);
  }
  const sentencia = `
    SELECT strCodigo, strNombres, strApellidos, strCedula 
    FROM [${carrera}].[dbo].[Estudiantes] 
    WHERE strCedula = '${cedulaLimpia}' OR strCedula = '${cedulaConGuion}';
  `;
  try {
    if (carrera && carrera !== "") {
      const sqlConsulta = await execMaster(carrera, sentencia, "OK", "OK");
      return sqlConsulta;
    } else {
      return { data: [], message: "Falta parámetro carrera", count: 0 };
    }
  } catch (error) {
    return { data: [], message: "Error: " + error, count: -1 };
  }
};

/**
 * Listar catálogos activos de tipo y nivel de reconocimiento
 * @param {string} carrera Base de datos de la carrera
 */
module.exports.ListarCatalogosImportacion = async function (carrera) {
  const sentencia = `
    SELECT tt_idtipo AS id, tt_nombre AS nombre, 'TIPO' AS catalogo 
    FROM [${carrera}].[dbo].[tb_reconocimiento_tipo] 
    WHERE tt_estado = 1
    UNION ALL
    SELECT tn_idnivel AS id, tn_nombre AS nombre, 'NIVEL' AS catalogo 
    FROM [${carrera}].[dbo].[tb_reconocimiento_nivel] 
    WHERE tn_estado = 1;
  `;
  try {
    if (carrera && carrera !== "") {
      const sqlConsulta = await execMaster(carrera, sentencia, "OK", "OK");
      return sqlConsulta;
    } else {
      return { data: [], message: "Falta parámetro carrera", count: 0 };
    }
  } catch (error) {
    return { data: [], message: "Error: " + error, count: -1 };
  }
};
