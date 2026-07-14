const express = require('express');
const router = express.Router();
const procesosreconocimiento = require('../procesos/procesosreconocimiento');

/**
 * Endpoint para listar los tipos de reconocimiento
 * GET /wsprocesosadmisiones/rutareconocimiento/ListadoTipos/:carrera
 */
router.get('/ListadoTipos/:carrera', async (req, res) => {
  const carrera = req.params.carrera;
  try {
    const informacion = await procesosreconocimiento.ProcesoListarReconocimientoTipos(carrera);
    if (informacion === 'ERROR') {
      return res.json({
        success: false,
        mensaje: 'Error al obtener el listado de tipos'
      });
    }
    res.json({
      success: true,
      informacion: informacion
    });
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      mensaje: 'Error en la petición: ' + err
    });
  }
});

/**
 * Endpoint para listar los niveles de reconocimiento
 * GET /wsprocesosadmisiones/rutareconocimiento/ListadoNiveles/:carrera
 */
router.get('/ListadoNiveles/:carrera', async (req, res) => {
  const carrera = req.params.carrera;
  try {
    const informacion = await procesosreconocimiento.ProcesoListarReconocimientoNiveles(carrera);
    if (informacion === 'ERROR') {
      return res.json({
        success: false,
        mensaje: 'Error al obtener el listado de niveles'
      });
    }
    res.json({
      success: true,
      informacion: informacion
    });
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      mensaje: 'Error en la petición: ' + err
    });
  }
});

/**
 * Endpoint para ingresar el reconocimiento de un estudiante
 * POST /wsprocesosadmisiones/rutareconocimiento/IngresarReconocimiento
 */
router.post('/IngresarReconocimiento', async (req, res) => {
  const {
    carrera,
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
  } = req.body;

  if (!carrera || !tr_cedula || !tr_idtipo || !tr_idnivel || !tr_nombre || !tr_institucion || !tr_fecha_otorgamiento || (tr_iduser === undefined || tr_iduser === null) || (tr_idestudiante === undefined || tr_idestudiante === null)) {
    return res.json({
      success: false,
      mensaje: 'Faltan parámetros obligatorios en la petición (carrera, tr_cedula, tr_idtipo, tr_idnivel, tr_nombre, tr_institucion, tr_fecha_otorgamiento, tr_iduser, tr_idestudiante)'
    });
  }

  const datos = {
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
  };

  try {
    const respuesta = await procesosreconocimiento.ProcesoInsertarReconocimientoEstudiante(carrera, datos);
    if (respuesta.count > 0 || respuesta.message === 'OK') {
      res.json({
        success: true,
        mensaje: 'Reconocimiento ingresado con éxito'
      });
    } else {
      res.json({
        success: false,
        mensaje: respuesta.message || 'No se pudo ingresar el reconocimiento'
      });
    }
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      mensaje: 'Error al ingresar el reconocimiento: ' + err
    });
  }
});

/**
 * Endpoint para listar reconocimientos de un estudiante
 * GET /wsprocesosadmisiones/rutareconocimiento/ListadoReconocimientosEstudiante/:carrera/:cedula
 */
router.get('/ListadoReconocimientosEstudiante/:carrera/:cedula', async (req, res) => {
  const { carrera, cedula } = req.params;
  try {
    const informacion = await procesosreconocimiento.ProcesoListarReconocimientosEstudiante(carrera, cedula);
    if (informacion === 'ERROR') {
      return res.json({
        success: false,
        mensaje: 'Error al obtener los reconocimientos del estudiante'
      });
    }
    res.json({
      success: true,
      informacion: informacion
    });
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      mensaje: 'Error en la petición: ' + err
    });
  }
});

/**
 * Endpoint para actualizar un reconocimiento existente de estudiante
 * POST /wsprocesosadmisiones/rutareconocimiento/ActualizarReconocimiento
 */
router.post('/ActualizarReconocimiento', async (req, res) => {
  const {
    carrera,
    tr_idreconocimiento,
    tr_idtipo,
    tr_idnivel,
    tr_nombre,
    tr_institucion,
    tr_titulo,
    tr_fecha_otorgamiento,
    tr_fecha_vencimiento,
    tr_descripcion,
    tr_url,
    tr_pais,
    tr_iduser,
    tr_estado
  } = req.body;

  if (!carrera || !tr_idreconocimiento || !tr_idtipo || !tr_idnivel || !tr_nombre || !tr_institucion || !tr_fecha_otorgamiento || !tr_iduser) {
    return res.json({
      success: false,
      mensaje: 'Faltan parámetros obligatorios en la petición (carrera, tr_idreconocimiento, tr_idtipo, tr_idnivel, tr_nombre, tr_institucion, tr_fecha_otorgamiento, tr_iduser)'
    });
  }

  const datos = {
    tr_idreconocimiento,
    tr_idtipo,
    tr_idnivel,
    tr_nombre,
    tr_institucion,
    tr_titulo,
    tr_fecha_otorgamiento,
    tr_fecha_vencimiento,
    tr_descripcion,
    tr_url,
    tr_pais,
    tr_iduser,
    tr_estado
  };

  try {
    const respuesta = await procesosreconocimiento.ProcesoActualizarReconocimientoEstudiante(carrera, datos);
    if (respuesta.count > 0 || respuesta.message === 'OK') {
      res.json({
        success: true,
        mensaje: 'Reconocimiento actualizado con éxito'
      });
    } else {
      res.json({
        success: false,
        mensaje: respuesta.message || 'No se pudo actualizar el reconocimiento'
      });
    }
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      mensaje: 'Error al actualizar el reconocimiento: ' + err
    });
  }
});

/**
 * Endpoint para eliminar lógicamente un reconocimiento de estudiante
 * POST /wsprocesosadmisiones/rutareconocimiento/EliminarReconocimiento
 */
router.post('/EliminarReconocimiento', async (req, res) => {
  const { carrera, tr_idreconocimiento, tr_iduser } = req.body;

  if (!carrera || !tr_idreconocimiento || (tr_iduser === undefined || tr_iduser === null)) {
    return res.json({
      success: false,
      mensaje: 'Faltan parámetros obligatorios en la petición (carrera, tr_idreconocimiento, tr_iduser)'
    });
  }

  try {
    const respuesta = await procesosreconocimiento.ProcesoEliminarReconocimientoEstudiante(carrera, tr_idreconocimiento, tr_iduser);
    if (respuesta.count > 0 || respuesta.message === 'OK') {
      res.json({
        success: true,
        mensaje: 'Reconocimiento eliminado con éxito'
      });
    } else {
      res.json({
        success: false,
        mensaje: respuesta.message || 'No se pudo eliminar el reconocimiento'
      });
    }
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      mensaje: 'Error al eliminar el reconocimiento: ' + err
    });
  }
});

/**
 * Endpoint para analizar un lote de reconocimientos desde Excel
 * POST /wsprocesosadmisiones/rutareconocimiento/AnalizarExcelReconocimiento
 */
router.post('/AnalizarExcelReconocimiento', async (req, res) => {
  const { carrera, filas } = req.body;

  if (!carrera || !filas || !Array.isArray(filas)) {
    return res.json({
      success: false,
      mensaje: 'Faltan parámetros obligatorios en la petición (carrera, filas)'
    });
  }

  try {
    const respuesta = await procesosreconocimiento.ProcesoAnalizarExcelReconocimientos(carrera, filas);
    res.json(respuesta);
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      mensaje: 'Error al analizar la planilla Excel: ' + err
    });
  }
});

/**
 * Endpoint para procesar e insertar un lote de reconocimientos analizados
 * POST /wsprocesosadmisiones/rutareconocimiento/ProcesarExcelReconocimiento
 */
router.post('/ProcesarExcelReconocimiento', async (req, res) => {
  const { carrera, datos, tr_iduser } = req.body;

  if (!carrera || !datos || !Array.isArray(datos) || (tr_iduser === undefined || tr_iduser === null)) {
    return res.json({
      success: false,
      mensaje: 'Faltan parámetros obligatorios en la petición (carrera, datos, tr_iduser)'
    });
  }

  try {
    const respuesta = await procesosreconocimiento.ProcesoInsertarMasivoReconocimientos(carrera, datos, tr_iduser);
    res.json(respuesta);
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      mensaje: 'Error al procesar la importación masiva: ' + err
    });
  }
});

module.exports = router;
