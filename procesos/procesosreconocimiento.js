const modeloreconocimiento = require('../modelo/modeloreconocimiento');
const centralizada = require('../modelo/centralizada');

/**
 * Proceso para listar tipos de reconocimiento
 * @param {string} carrera Base de datos de la carrera
 */
module.exports.ProcesoListarReconocimientoTipos = async function (carrera) {
  try {
    const resultado = await modeloreconocimiento.ListarReconocimientoTipos(carrera);
    if (resultado.count >= 0) {
      return resultado.data;
    } else {
      console.error(resultado.message);
      return 'ERROR';
    }
  } catch (error) {
    console.error("Error en ProcesoListarReconocimientoTipos:", error);
    return 'ERROR';
  }
};

/**
 * Proceso para listar niveles de reconocimiento
 * @param {string} carrera Base de datos de la carrera
 */
module.exports.ProcesoListarReconocimientoNiveles = async function (carrera) {
  try {
    const resultado = await modeloreconocimiento.ListarReconocimientoNiveles(carrera);
    if (resultado.count >= 0) {
      return resultado.data;
    } else {
      console.error(resultado.message);
      return 'ERROR';
    }
  } catch (error) {
    console.error("Error en ProcesoListarReconocimientoNiveles:", error);
    return 'ERROR';
  }
};

/**
 * Proceso para insertar reconocimiento de estudiante
 * @param {string} carrera Base de datos de la carrera
 * @param {object} datos Datos del reconocimiento
 */
module.exports.ProcesoInsertarReconocimientoEstudiante = async function (carrera, datos) {
  try {
    const resultado = await modeloreconocimiento.InsertarReconocimientoEstudiante(carrera, datos);
    return resultado;
  } catch (error) {
    console.error("Error en ProcesoInsertarReconocimientoEstudiante:", error);
    return { count: -1, message: "Error en el proceso: " + error, data: [] };
  }
};

/**
 * Proceso para listar reconocimientos de un estudiante
 * @param {string} carrera Base de datos de la carrera
 * @param {string} cedula Cédula del estudiante
 */
module.exports.ProcesoListarReconocimientosEstudiante = async function (carrera, cedula) {
  try {
    const resultado = await modeloreconocimiento.ListarReconocimientosEstudiante(carrera, cedula);
    if (resultado.count >= 0) {
      return resultado.data;
    } else {
      console.error(resultado.message);
      return 'ERROR';
    }
  } catch (error) {
    console.error("Error en ProcesoListarReconocimientosEstudiante:", error);
    return 'ERROR';
  }
};

/**
 * Proceso para actualizar un reconocimiento de estudiante
 * @param {string} carrera Base de datos de la carrera
 * @param {object} datos Datos a actualizar
 */
module.exports.ProcesoActualizarReconocimientoEstudiante = async function (carrera, datos) {
  try {
    const resultado = await modeloreconocimiento.ActualizarReconocimientoEstudiante(carrera, datos);
    return resultado;
  } catch (error) {
    console.error("Error en ProcesoActualizarReconocimientoEstudiante:", error);
    return { count: -1, message: "Error en el proceso: " + error, data: [] };
  }
};

/**
 * Proceso para eliminar lógicamente un reconocimiento de estudiante
 * @param {string} carrera Base de datos de la carrera
 * @param {number} idreconocimiento ID del reconocimiento a eliminar
 * @param {number} iduser ID del usuario que realiza la acción
 */
module.exports.ProcesoEliminarReconocimientoEstudiante = async function (carrera, idreconocimiento, iduser) {
  try {
    const resultado = await modeloreconocimiento.EliminarReconocimientoEstudiante(carrera, idreconocimiento, iduser);
    return resultado;
  } catch (error) {
    console.error("Error en ProcesoEliminarReconocimientoEstudiante:", error);
    return { count: -1, message: "Error en el proceso: " + error, data: [] };
  }
};

/**
 * Proceso para analizar un listado de reconocimientos provenientes de Excel
 * @param {string} carrera Base de datos de la carrera
 * @param {Array} filas Filas leídas del archivo de Excel
 */
module.exports.ProcesoAnalizarExcelReconocimientos = async function (carrera, filas) {
  try {
    // 1. Obtener catálogos de tipo y nivel
    const catalogos = await modeloreconocimiento.ListarCatalogosImportacion(carrera);
    const tipos = [];
    const niveles = [];
    if (catalogos && catalogos.data) {
      catalogos.data.forEach(c => {
        if (c.catalogo === 'TIPO') tipos.push(c);
        if (c.catalogo === 'NIVEL') niveles.push(c);
      });
    }

    const resultado = [];

    // 2. Procesar cada fila de la planilla
    for (let index = 0; index < filas.length; index++) {
      const fila = filas[index];
      // Si la fila está totalmente vacía, omitirla
      const keys = Object.keys(fila);
      const isCompletelyEmpty = keys.length === 0 || keys.every(key => {
        const val = fila[key];
        return val === undefined || val === null || String(val).trim() === '';
      });
      if (isCompletelyEmpty) {
        continue;
      }
      const cedula = String(fila.CEDULA || '').trim();
      const tipoValor = String(fila.TIPO_RECONOCIMIENTO || '').trim();
      const nivelValor = String(fila.NIVEL_RECONOCIMIENTO || '').trim();
      const nombre = String(fila.NOMBRE_RECONOCIMIENTO || '').trim();
      const institucion = String(fila.INSTITUCION_OTORGANTE || '').trim();
      const titulo = String(fila.TITULO_MENCION_OTORGADA || '').trim();
      const fecha = String(fila.FECHA_RECONOCIMIENTO || '').trim();
      const descripcion = String(fila.DESCRIPCION || '').trim();
      const pais = String(fila.PAIS || 'ECUADOR').trim();

      const itemAnalizado = {
        filaIndex: index + 1,
        cedula,
        nombre,
        institucion,
        titulo,
        fecha,
        descripcion,
        pais,
        tr_idtipo: null,
        tr_idnivel: null,
        tr_idestudiante: 0,
        nombreEstudiante: 'No matriculado (se asignará ID 0)',
        valido: true,
        tipoNombre: tipoValor,
        nivelNombre: nivelValor,
        observacion: 'Listo para importar'
      };

      if (!cedula) {
        itemAnalizado.valido = false;
        itemAnalizado.observacion = 'Error: Cédula vacía';
        resultado.push(itemAnalizado);
        continue;
      }

      if (!nombre || !institucion || !fecha) {
        itemAnalizado.valido = false;
        itemAnalizado.observacion = 'Error: Faltan campos obligatorios (Nombre, Institución o Fecha)';
        resultado.push(itemAnalizado);
        continue;
      }

      // Resolver Tipo de Reconocimiento
      let resolvedTipo = tipos.find(t => String(t.id) === tipoValor || t.nombre.toUpperCase() === tipoValor.toUpperCase());
      if (resolvedTipo) {
        itemAnalizado.tr_idtipo = resolvedTipo.id;
        itemAnalizado.tipoNombre = resolvedTipo.nombre;
      } else {
        itemAnalizado.valido = false;
        itemAnalizado.observacion = `Error: Tipo de reconocimiento "${tipoValor}" no existe o está inactivo`;
        resultado.push(itemAnalizado);
        continue;
      }

      // Resolver Nivel de Reconocimiento
      let resolvedNivel = niveles.find(n => String(n.id) === nivelValor || n.nombre.toUpperCase() === nivelValor.toUpperCase());
      if (resolvedNivel) {
        itemAnalizado.tr_idnivel = resolvedNivel.id;
        itemAnalizado.nivelNombre = resolvedNivel.nombre;
      } else {
        itemAnalizado.valido = false;
        itemAnalizado.observacion = `Error: Nivel de reconocimiento "${nivelValor}" no existe o está inactivo`;
        resultado.push(itemAnalizado);
        continue;
      }
        const cedulaSinGuion = String(cedula).replace(/-/g, '').trim();
      // Buscar estudiante en la carrera
     // Si no está matriculado en la carrera, buscar en la centralizada para obtener su nombre completo
        const dbCentral = await centralizada.obtenerdocumentoCentralizada(cedulaSinGuion);
        if (dbCentral && dbCentral.data && dbCentral.data.length > 0) {
          const per = dbCentral.data[0];
          itemAnalizado.nombreEstudiante = `${per.per_nombres} ${per.per_primerApellido || ''} ${per.per_segundoApellido || ''}`.replace(/\s+/g, ' ').trim();
        } else {
          itemAnalizado.nombreEstudiante = 'Estudiante no encontrado en el sistema';
        }
        itemAnalizado.tr_idestudiante = 0;
        itemAnalizado.observacion = 'Estudiante Procesado con Exito';

      resultado.push(itemAnalizado);
    }

    return { success: true, data: resultado };
  } catch (error) {
    console.error("Error al analizar Excel:", error);
    return { success: false, message: "Error al analizar Excel: " + error, data: [] };
  }
};


module.exports.ProcesoInsertarMasivoReconocimientos = async function (carrera, datos, iduser) {
  try {
    let insertados = 0;
    for (const item of datos) {
      // Normalizar la fecha al formato YYYY-MM-DD
      let fechaFormateada = null;
      if (item.fecha) {
        const parts = item.fecha.split('/');
        if (parts.length === 3) {
          fechaFormateada = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        } else {
          try {
            const d = new Date(item.fecha);
            if (!isNaN(d.getTime())) {
              const year = d.getFullYear();
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const day = String(d.getDate()).padStart(2, '0');
              fechaFormateada = `${year}-${month}-${day}`;
            }
          } catch(e) {}
        }
      }

      const payload = {
        tr_idtipo: item.tr_idtipo,
        tr_idnivel: item.tr_idnivel,
        tr_cedula: item.cedula,
        tr_nombre: item.nombre,
        tr_institucion: item.institucion,
        tr_titulo: item.titulo,
        tr_fecha_otorgamiento: fechaFormateada,
        tr_fecha_vencimiento: null,
        tr_descripcion: item.descripcion,
        tr_url: '',
        tr_pais: item.pais || 'Ecuador',
        tr_iduser: iduser,
        tr_idestudiante: item.tr_idestudiante || 0,
        tr_estado: 1
      };

      const result = await modeloreconocimiento.InsertarReconocimientoEstudiante(carrera, payload);
      if (result && (result.message === 'OK' || result.count > 0)) {
        insertados++;
      }
    }
    return { success: true, message: `Se importaron ${insertados} de ${datos.length} registros exitosamente.`, count: insertados };
  } catch (error) {
    console.error("Error en ProcesoInsertarMasivoReconocimientos:", error);
    return { success: false, message: "Error al realizar la importación masiva: " + error, count: -1 };
  }
};
