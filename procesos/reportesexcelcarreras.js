
const express = require('express');
const router = express.Router();

const fs = require("fs");
const reportespdfmaker = require('../reportesmake/reportescarrerasmake');
const pathimage = require('path');
const axios = require('axios');
const https = require('https');
const crypto = require("crypto");
const procesoCupo = require('../modelo/procesocupos');
const procesocarreras = require('../modelo/procesocarrera');
const procesoacademico = require('../rutas/ProcesoNotasAcademico');
const tools = require('../rutas/tools');
const xlsx = require('xlsx');
const ExcelJS = require('exceljs');
const { JSDOM } = require('jsdom');
const agent = new https.Agent({
    rejectUnauthorized: false,
    // other options if needed
    secureOptions: crypto.constants.SSL_OP_LEGACY_SERVER_CONNECT,
});

module.exports.ProcesoExcelListadoEstudiantesRetirosInstitucional = async function (periodo, cedula) {
    try {
        var resultado = await FuncionExcelListadoEstudiantesRetirosInstitucional(periodo, cedula);
        return resultado
    } catch (error) {
        console.error(error);
        
    }
}
module.exports.ProcesoListadoEstudiantesRetirosCarrera = async function (periodo,dbCarrera) {
    try {
        var resultado = await FuncionListadoEstudiantesRetirosCarrera(periodo,dbCarrera);
        return resultado
    } catch (error) {
        console.error(error);
        
    }
}
module.exports.ProcesoListadoEstudiantesRetirosCarreraPdf = async function (periodo,dbCarrera,cedula) {
    try {
        var resultado = await FuncionListadoEstudiantesRetirosCarreraPdf(periodo,dbCarrera,cedula);
        return resultado
    } catch (error) {
        console.error(error);
        
    }
}
module.exports.ProcesoEstudiantesRetirosCarreraCedula = async function (dbCarrera,cedula) {
    try {
        var resultado = await FuncionEstudiantesRetirosCarreraCedula(dbCarrera,cedula);
        return resultado
    } catch (error) {
        console.error(error);
        
    }
}
module.exports.ProcesoExcelListadoEstudiantesRetirosCarrerraExcel = async function (periodo, dbCarrera) {
    try {
        var resultado = await FuncionExcelListadoEstudiantesRetirosCarreraExcel(periodo, dbCarrera);
        return resultado
    } catch (error) {
        console.error(error);
        
    }
}

module.exports.ProcesoListadoRetirosEstudiantePeriodoTrnsaccion = async function (transaccion,dbCarrera,periodo,cedula,codigo) {
    try {
        var resultado = await FuncionEstudiantesRetirosPeriodoCarreraCedulaTrandsaccion(transaccion,dbCarrera,periodo, cedula,codigo);
        return resultado
    } catch (error) {
        console.error(error);
        
    }
}
module.exports.ProcesoListadoRetirosEstudiantePeriodo= async function (dbCarrera,periodo,cedula,codigo) {
    try {
        var resultado = await FuncionEstudiantesRetirosPeriodoCarreraCedula(dbCarrera,periodo, cedula,codigo);
        return resultado
    } catch (error) {
        console.error(error);
        
    }
}
async function FuncionExcelListadoEstudiantesRetirosInstitucional(periodo, cedula) {
    try {
        var lstResultado = []
        var ListadoCarreras = await procesocarreras.ListadoCarreraNivelacion("OAS_Master", "UNA");
        for (var carreras of ListadoCarreras.data) {

            var ListadoRetirosTipos = await procesocarreras.TiposRetirosEstudiantesCarrerasListado(carreras.strBaseDatos, periodo);
            var ListadoRetirosNormales = await procesocarreras.RetirosEstudiantesNormalesCarrerasListado(carreras.strBaseDatos, periodo);
            if (ListadoRetirosTipos.count > 0) {
                for (var retiros of ListadoRetirosTipos.data) {
                    var datos = {
                        sintCodMatricula: retiros.sintCodigo[0],
                        strCodPeriodo: retiros.strCodPeriodo[0],
                        dtFechaAprob: retiros.dtFechaAprob,
                        dtFechaAsentado: retiros.dtFechaAsentado,
                        strdescripcion: retiros.strdescripcion,
                        strnombreTipo: retiros.strnombre,
                        strCedula: retiros.strCedula,
                        strNombres: retiros.strNombres,
                        strApellidos: retiros.strApellidos,
                        strCarrera: carreras.strNombreCarrera,
                        strFacultad: carreras.strNombreFacultad,
                        strSede: carreras.strSede,
                        strNivel: retiros.strCodNivel,
                        strtipo: "PROCESOS CUPOS"
                    }

                    lstResultado.push(datos);
                }
            }
            if (ListadoRetirosNormales.count > 0) {
                for (var retirosnormales of ListadoRetirosNormales.data) {
                    var datosNormales = {
                        sintCodMatricula: retirosnormales.sintCodMatricula,
                        strCodPeriodo: retirosnormales.strCodPeriodo,
                        dtFechaAprob: retirosnormales.dtFechaAprob,
                        dtFechaAsentado: retirosnormales.dtFechaAsentado,
                        strdescripcion: retirosnormales.strResolucion,
                        strnombreTipo: "",
                        strCedula: retirosnormales.strCedula,
                        strNombres: retirosnormales.strNombres,
                        strApellidos: retirosnormales.strApellidos,
                        strCarrera: carreras.strNombreCarrera,
                        strFacultad: carreras.strNombreFacultad,
                        strSede: carreras.strSede,
                        strNivel: retirosnormales.strCodNivel,
                        strtipo: "PROCESOS NORMAL"
                    }
                    lstResultado.push(datosNormales);
                }
            }
        }
        var resultado = await ProcesoRetirosInstitucionalExcel(periodo, cedula, lstResultado);
        return resultado
    } catch (error) {
        console.error(error);
        
    }

}
async function FuncionListadoEstudiantesRetirosCarrera(periodo, dbCarrera) {
    try {
        var lstResultado = []
            var ListadoRetirosTipos = await procesocarreras.TiposRetirosEstudiantesCarrerasListado(dbCarrera, periodo);
            var ListadoRetirosNormales = await procesocarreras.RetirosEstudiantesNormalesCarrerasListado(dbCarrera, periodo);
            var ListadoRetirosSinMatriculas= await procesocarreras.RetirosSinMatriculaEstudiantesCarrerasListado(dbCarrera, periodo);
            if (ListadoRetirosTipos.count > 0) {
                for (var retiros of ListadoRetirosTipos.data) {
                    var datos = {
                        sintCodMatricula: retiros.sintCodigo[0],
                        strCodPeriodo: retiros.strCodPeriodo[0],
                        dtFechaAprob: retiros.dtFechaAprob,
                        dtFechaAsentado: retiros.dtFechaAsentado,
                        strdescripcion: retiros.strdescripcion,
                        strnombreTipo: retiros.strnombre,
                        strurl:retiros.strUrl,
                        strCedula: retiros.strCedula,
                        strNombres: retiros.strNombres,
                        strApellidos: retiros.strApellidos,
                        strNivel: retiros.strCodNivel,
                        strtipo: "RETIROS TIPOS"
                    }

                    lstResultado.push(datos);
                }
            }
            if (ListadoRetirosNormales.count > 0) {
                for (var retirosnormales of ListadoRetirosNormales.data) {
                    var datosNormales = {
                        sintCodMatricula: retirosnormales.sintCodMatricula,
                        strCodPeriodo: retirosnormales.strCodPeriodo,
                        dtFechaAprob: retirosnormales.dtFechaAprob,
                        dtFechaAsentado: retirosnormales.dtFechaAsentado,
                        strdescripcion: retirosnormales.strResolucion,
                        strnombreTipo: "",
                        strurl:"",
                        strCedula: retirosnormales.strCedula,
                        strNombres: retirosnormales.strNombres,
                        strApellidos: retirosnormales.strApellidos,
                        strNivel: retirosnormales.strCodNivel,
                        strtipo: "RETIROS ASIGNATURAS"
                    }
                    lstResultado.push(datosNormales);
                }
            }
            if (ListadoRetirosSinMatriculas.count > 0) {
                for (var retirossinmatricula of ListadoRetirosSinMatriculas.data) {
                    var datosSinMatricula = {
                        sintCodMatricula:0,
                        strCodPeriodo: retirossinmatricula.strCodPeriodo,
                        dtFechaAprob: retirossinmatricula.rsm_dtFechaAprob,
                        dtFechaAsentado: retirossinmatricula.rsm_fecha_registro,
                        strdescripcion: retirossinmatricula.rsm_strObservacion,
                        strnombreTipo: "",
                        strurl:retirossinmatricula.rsm_strRuta,
                        strCedula: retirossinmatricula.strCedula,
                        strNombres: retirossinmatricula.strNombres,
                        strApellidos: retirossinmatricula.strApellidos,
                        strNivel: 'NIGUNO',
                        strtipo: "RETIRO SIN MATRICULA"
                    }
                    lstResultado.push(datosSinMatricula);
                }
            }
        
      
        return lstResultado
    } catch (error) {
        console.error(error);
        
    }

}
async function FuncionListadoEstudiantesRetirosCarreraPdf(periodo, dbCarrera,cedula) {
    try {
        var lstResultado = []
            var ListadoRetirosTipos = await procesocarreras.TiposRetirosEstudiantesCarrerasListado(dbCarrera, periodo);
            var ListadoRetirosNormales = await procesocarreras.RetirosEstudiantesNormalesCarrerasListado(dbCarrera, periodo);
            var ListadoRetirosSinMatriculas= await procesocarreras.RetirosSinMatriculaEstudiantesCarrerasListado(dbCarrera, periodo);
            if (ListadoRetirosTipos.count > 0) {
                for (var retiros of ListadoRetirosTipos.data) {
                    var datos = {
                        sintCodMatricula: retiros.sintCodigo[0],
                        strCodPeriodo: retiros.strCodPeriodo[0],
                        dtFechaAprob: retiros.dtFechaAprob,
                        dtFechaAsentado: retiros.dtFechaAsentado,
                        strdescripcion: retiros.strdescripcion,
                        strnombreTipo: retiros.strnombre,
                        strurl:retiros.strUrl,
                        strCedula: retiros.strCedula,
                        strNombres: retiros.strNombres,
                        strApellidos: retiros.strApellidos,
                        strNivel: retiros.strCodNivel,
                        strtipo: "RETIROS TIPOS"
                    }

                    lstResultado.push(datos);
                }
            }
            if (ListadoRetirosNormales.count > 0) {
                for (var retirosnormales of ListadoRetirosNormales.data) {
                    var datosNormales = {
                        sintCodMatricula: retirosnormales.sintCodMatricula,
                        strCodPeriodo: retirosnormales.strCodPeriodo,
                        dtFechaAprob: retirosnormales.dtFechaAprob,
                        dtFechaAsentado: retirosnormales.dtFechaAsentado,
                        strdescripcion: retirosnormales.strResolucion,
                        strnombreTipo: "",
                        strurl:"",
                        strCedula: retirosnormales.strCedula,
                        strNombres: retirosnormales.strNombres,
                        strApellidos: retirosnormales.strApellidos,
                        strNivel: retirosnormales.strCodNivel,
                        strtipo: "RETIROS ASIGNATURAS"
                    }
                    lstResultado.push(datosNormales);
                }
            }
            if (ListadoRetirosSinMatriculas.count > 0) {
                for (var retirossinmatricula of ListadoRetirosSinMatriculas.data) {
                    var datosSinMatricula = {
                        sintCodMatricula:0,
                        strCodPeriodo: retirossinmatricula.strCodPeriodo,
                        dtFechaAprob: retirossinmatricula.rsm_dtFechaAprob,
                        dtFechaAsentado: retirossinmatricula.rsm_fecha_registro,
                        strdescripcion: retirossinmatricula.rsm_strObservacion,
                        strnombreTipo: "",
                        strurl:retirossinmatricula.rsm_strRuta,
                        strCedula: retirossinmatricula.strCedula,
                        strNombres: retirossinmatricula.strNombres,
                        strApellidos: retirossinmatricula.strApellidos,
                        strNivel: 'NINGUNO',
                        strtipo: "RETIRO SIN MATRICULA"
                    }
                    lstResultado.push(datosSinMatricula);
                }
            }
        
      var base64pdf= await generarReportListadoEstudiantesRetirosCarreraPdf(lstResultado,dbCarrera,periodo,cedula)
        return base64pdf
    } catch (error) {
        console.error(error);
        
    }

}
async function FuncionExcelListadoEstudiantesRetirosCarreraExcel(periodo, dbCarrera) {
    try {
        var lstResultado = []
            var ListadoRetirosTipos = await procesocarreras.TiposRetirosEstudiantesCarrerasListado(dbCarrera, periodo);
            var ListadoRetirosNormales = await procesocarreras.RetirosEstudiantesNormalesCarrerasListado(dbCarrera, periodo);
            var ListadoRetirosSinMatriculas= await procesocarreras.RetirosSinMatriculaEstudiantesCarrerasListado(dbCarrera, periodo);
            if (ListadoRetirosTipos.count > 0) {
                for (var retiros of ListadoRetirosTipos.data) {
                    var datos = {
                        sintCodMatricula: retiros.sintCodigo[0],
                        strCodPeriodo: retiros.strCodPeriodo[0],
                        dtFechaAprob: retiros.dtFechaAprob,
                        dtFechaAsentado: retiros.dtFechaAsentado,
                        strdescripcion: retiros.strdescripcion,
                        strnombreTipo: retiros.strnombre,
                        strurl:retiros.strUrl,
                        strCedula: retiros.strCedula,
                        strNombres: retiros.strNombres,
                        strApellidos: retiros.strApellidos,
                        strNivel: retiros.strCodNivel,
                        strtipo: "RETIROS TIPOS"
                    }

                    lstResultado.push(datos);
                }
            }
            if (ListadoRetirosNormales.count > 0) {
                for (var retirosnormales of ListadoRetirosNormales.data) {
                    var datosNormales = {
                        sintCodMatricula: retirosnormales.sintCodMatricula,
                        strCodPeriodo: retirosnormales.strCodPeriodo,
                        dtFechaAprob: retirosnormales.dtFechaAprob,
                        dtFechaAsentado: retirosnormales.dtFechaAsentado,
                        strdescripcion: retirosnormales.strResolucion,
                        strnombreTipo: "",
                        strurl:"",
                        strCedula: retirosnormales.strCedula,
                        strNombres: retirosnormales.strNombres,
                        strApellidos: retirosnormales.strApellidos,
                        strNivel: retirosnormales.strCodNivel,
                        strtipo: "RETIROS ASIGNATURAS"
                    }
                    lstResultado.push(datosNormales);
                }
            }
            if (ListadoRetirosSinMatriculas.count > 0) {
                for (var retirossinmatricula of ListadoRetirosSinMatriculas.data) {
                    var datosSinMatricula = {
                        sintCodMatricula:0,
                        strCodPeriodo: retirossinmatricula.strCodPeriodo,
                        dtFechaAprob: retirossinmatricula.rsm_dtFechaAprob,
                        dtFechaAsentado: retirossinmatricula.rsm_fecha_registro,
                        strdescripcion: retirossinmatricula.rsm_strObservacion,
                        strnombreTipo: "",
                        strurl:retirossinmatricula.rsm_strRuta,
                        strCedula: retirossinmatricula.strCedula,
                        strNombres: retirossinmatricula.strNombres,
                        strApellidos: retirossinmatricula.strApellidos,
                        strNivel: 'NIGUNO',
                        strtipo: "RETIRO SIN MATRICULA"
                    }
                    lstResultado.push(datosSinMatricula);
                }
            }
        
        var resultado = await ProcesoRetirosCarrerasExcel(periodo, dbCarrera, lstResultado);
        return resultado
    } catch (error) {
        console.error(error);
        
    }

}

async function ProcesoRetirosInstitucionalExcel(periodo, cedula, lstResultado) {
    try {

        var periodoinfo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo)
        var respuesta = []
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Listado de estudiantes');
        // Crear un header superior que combine las primeras 18 columnas

        worksheet.mergeCells('A1:L1');
        const headerespoch = worksheet.getCell('A1');
        headerespoch.value = 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO'; // Texto del header
        headerespoch.font = { name: 'Arial', size: 12, bold: true }; // Tamaño y fuente Arial
        headerespoch.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado

        //
        worksheet.mergeCells('A2:L2');
        const headerperiodo = worksheet.getCell('A2');
        headerperiodo.value = 'INFORMACIÓN DE RETIROS INSTITUCIONALES NIVELACIÓN'; // Texto del header
        headerperiodo.font = { name: 'Arial', size: 12, bold: true }; // Tamaño y fuente Arial
        headerperiodo.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
       
        worksheet.mergeCells('A3:L3');
        const headerperiodo1 = worksheet.getCell('A3');
        headerperiodo1.value = periodoinfo.data[0].strDescripcion + "(" + periodo + ")"; // Texto del header
        headerperiodo1.font = { name: 'Arial', size: 11, bold: true }; // Tamaño y fuente Arial
        headerperiodo1.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado

        // Crear un header superior que combine las primeras 18 columnas
        worksheet.mergeCells('A4:L4'); // Combina de A1 a Q1 (18 columnas)
        const headerCell = worksheet.getCell('A4');
        headerCell.value = 'LISTADO DE ESTUDIANTES RETIRADOS NIVELACIÓN'; // Texto del header
        headerCell.font = { name: 'Arial', size: 11, bold: false }; // Tamaño y fuente Arial
        headerCell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
        headerCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '9cccfc' }, // Color de fondo
        };

        // Encabezados de tabla
        const headers = ['No', 'Periodo', 'Cédula', 'Apellidos', 'Nombres','Nivel', 'Tipo','Retiro', 'Carrera', 'Facultad','Sede', 'Fecha'];
        worksheet.addRow(headers).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        // Agregar datos y aplicar bordes a cada celda
        lstResultado.forEach((row, index) => {
            const rowData = [
                index + 1,
                row.strCodPeriodo,
                row.strCedula,
                row.strApellidos,
                row.strNombres,
                row.strNivel,
                row.strtipo,
                row.strnombreTipo,
                row.strCarrera,
                row.strFacultad,
                row.strSede,
                row.dtFechaAsentado,
            ];
            const excelRow = worksheet.addRow(rowData);

            excelRow.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        });


        // Ajustar tamaño de las columnas
        worksheet.columns.forEach((column) => {
            column.width = 20;
        });

        // Guardar archivo Excel
        const buffer = await workbook.xlsx.writeBuffer();
        const base64 = buffer.toString('base64');

        // Retornar la cadena Base64
        //Almacenar el archivo fisico
       // const fs = require('fs');
       // fs.writeFileSync('ReporteDatosRetiros.xlsx', buffer);
        return base64;

    } catch (error) {
        console.error(error);
        
        return 'ERROR';
    }
}
async function ProcesoRetirosCarrerasExcel(periodo,dbCarrera, lstResultado) {
    try {

        var carreraInfo = await procesoCupo.ObtenerDatosBase(dbCarrera)
        var periodoinfo = await procesoCupo.ObtenerPeriodoDadoCodigo(periodo)
        var respuesta = []
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Listado de estudiantes');
        // Crear un header superior que combine las primeras 18 columnas

        worksheet.mergeCells('A1:H1');
        const headerespoch = worksheet.getCell('A1');
        headerespoch.value = 'ESCUELA SUPERIOR POLITECNICA DE CHIMBORAZO'; // Texto del header
        headerespoch.font = { name: 'Arial', size: 12, bold: true }; // Tamaño y fuente Arial
        headerespoch.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado

        //
        worksheet.mergeCells('A2:H2');
        const headercarrera = worksheet.getCell('A2');
        headercarrera.value = carreraInfo.data[0].strNombreCarrera ; // Texto del header
        headercarrera.font = { name: 'Arial', size: 12, bold: true }; // Tamaño y fuente Arial
        headercarrera.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado


        worksheet.mergeCells('A3:H3');
        const headerperiodo = worksheet.getCell('A3');
        headerperiodo.value = 'INFORMACIÓN DE RETIROS '; // Texto del header
        headerperiodo.font = { name: 'Arial', size: 12, bold: true }; // Tamaño y fuente Arial
        headerperiodo.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
       
        worksheet.mergeCells('A4:H4');
        const headerperiodo1 = worksheet.getCell('A4');
        headerperiodo1.value = periodoinfo.data[0].strDescripcion + "(" + periodo + ")"; // Texto del header
        headerperiodo1.font = { name: 'Arial', size: 11, bold: true }; // Tamaño y fuente Arial
        headerperiodo1.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado

        // Crear un header superior que combine las primeras 18 columnas
        worksheet.mergeCells('A5:H5'); // Combina de A1 a Q1 (18 columnas)
        const headerCell = worksheet.getCell('A5');
        headerCell.value = 'LISTADO DE ESTUDIANTES RETIRADOS'; // Texto del header
        headerCell.font = { name: 'Arial', size: 11, bold: false }; // Tamaño y fuente Arial
        headerCell.alignment = { vertical: 'middle', horizontal: 'center' }; // Centrado
        headerCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '9cccfc' }, // Color de fondo
        };

        // Encabezados de tabla
        const headers = ['No', 'Periodo', 'Cédula', 'Apellidos', 'Nombres','Nivel', 'Retiro','Tipo'];
        worksheet.addRow(headers).eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' },
            };
        });

        // Agregar datos y aplicar bordes a cada celda
        lstResultado.forEach((row, index) => {
            const rowData = [
                index + 1,
                row.strCodPeriodo,
                row.strCedula,
                row.strApellidos,
                row.strNombres,
                row.strNivel,
                row.strtipo,
                row.strnombreTipo
            ];
            const excelRow = worksheet.addRow(rowData);

            excelRow.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        });


        // Ajustar tamaño de las columnas
        worksheet.columns.forEach((column) => {
            column.width = 20;
        });

        // Guardar archivo Excel
        const buffer = await workbook.xlsx.writeBuffer();
        const base64 = buffer.toString('base64');

        // Retornar la cadena Base64
        //Almacenar el archivo fisico
      //  const fs = require('fs');
      //  fs.writeFileSync('ReporteDatosRetiros.xlsx', buffer);
        return base64;

    } catch (error) {
        console.error(error);
        
        return 'ERROR';
    }
}
async function generarReportListadoEstudiantesRetirosCarreraPdf(listado, carrera, periodo,cedulaUsuario) {
    try {
        var base64 = await reportespdfmaker.pdfmakegenerarReporteRetiros(listado, carrera, periodo, cedulaUsuario);
        return base64;
    } catch (error) {
        console.error(error);
        return 'ERROR';
    }
}

async function FuncionEstudiantesRetirosCarreraCedula(dbCarrera,cedula) {
    try {
        var lstResultado = []
            var ListadoRetirosTipos = await procesocarreras.TiposRetirosEstudiantesCarrerasCedula(dbCarrera, cedula);
            var ListadoRetirosNormales = await procesocarreras.RetirosEstudiantesNormalesCarrerasCedula(dbCarrera, cedula);
            var ListadoRetirosSinMatriculas= await procesocarreras.RetirosSinMatriculaEstudiantesCarrerasCedula(dbCarrera, cedula);
            if (ListadoRetirosTipos.count > 0) {
                for (var retiros of ListadoRetirosTipos.data) {
                    var datos = {
                        sintCodMatricula: retiros.sintCodigo[0],
                        strCodPeriodo: retiros.strCodPeriodo[0],
                        strPeriodoDescripcion: retiros.strDescripcion[0],
                        dtFechaAprob: retiros.dtFechaAprob,
                        dtFechaAsentado: retiros.dtFechaAsentado,
                        strdescripcion: retiros.strdescripcion,
                        strnombreTipo: retiros.strnombre,
                        strurl:retiros.strUrl,
                        strCedula: retiros.strCedula,
                        strNombres: retiros.strNombres,
                        strApellidos: retiros.strApellidos,
                        strNivel: retiros.strCodNivel,
                        strtipo: "RETIROS TIPOS"
                    }

                    lstResultado.push(datos);
                }
            }
            if (ListadoRetirosNormales.count > 0) {
                for (var retirosnormales of ListadoRetirosNormales.data) {
                    var datosNormales = {
                        sintCodMatricula: retirosnormales.sintCodMatricula,
                        strCodPeriodo: retirosnormales.strCodPeriodo,
                        strPeriodoDescripcion: retirosnormales.strDescripcion,
                        dtFechaAprob: retirosnormales.dtFechaAprob,
                        dtFechaAsentado: retirosnormales.dtFechaAsentado,
                        strdescripcion: retirosnormales.strResolucion,
                        strnombreTipo: "",
                        strurl:"",
                        strCedula: retirosnormales.strCedula,
                        strNombres: retirosnormales.strNombres,
                        strApellidos: retirosnormales.strApellidos,
                        strNivel: retirosnormales.strCodNivel,
                        strtipo: "RETIROS ASIGNATURAS"
                    }
                    lstResultado.push(datosNormales);
                }
            }
            if (ListadoRetirosSinMatriculas.count > 0) {
                for (var retirossinmatricula of ListadoRetirosSinMatriculas.data) {
                   
                    var datosSinMatricula = {
                        sintCodMatricula:0,
                        strCodPeriodo: retirossinmatricula.rsm_strCodPeriodo,
                        strPeriodoDescripcion: retirossinmatricula.strDescripcion,
                        dtFechaAprob: retirossinmatricula.rsm_dtFechaAprob,
                        dtFechaAsentado: retirossinmatricula.rsm_fecha_registro,
                        strdescripcion: retirossinmatricula.rsm_strObservacion,
                        strnombreTipo: "",
                        strurl:retirossinmatricula.rsm_strRuta,
                        strCedula: retirossinmatricula.strCedula,
                        strNombres: retirossinmatricula.strNombres,
                        strApellidos: retirossinmatricula.strApellidos,
                        strNivel: 'NIGUNO',
                        strtipo: "RETIRO SIN MATRICULA"
                    }
                    lstResultado.push(datosSinMatricula);
                }
            }
        
      
        return lstResultado
    } catch (error) {
        console.error(error);
        
    }

}

async function FuncionEstudiantesRetirosPeriodoCarreraCedulaTrandsaccion( transaccion,dbCarrera,periodo,cedula,codigo) {
    try {
        var lstResultado = []
            var ListadoRetirosTipos = await procesocarreras.TiposRetirosEstudiantesCarrerasListadoTransaccion(transaccion,dbCarrera,periodo, cedula);
            var ListadoRetirosNormales = await procesocarreras.RetirosEstudiantesNormalesCarrerasListadoTransaccion(transaccion,dbCarrera,periodo, cedula);
            var ListadoRetirosSinMatriculas= await procesocarreras.ObternerDatosRetirosinMatriculaTransaccion(transaccion,dbCarrera,periodo, codigo);   
            if (ListadoRetirosTipos.count > 0) {
                for (var retiros of ListadoRetirosTipos.data) {
                    var datos = {
                        sintCodMatricula: retiros.sintCodigo[0],
                        strCodPeriodo: retiros.strCodPeriodo[0],
                        dtFechaAprob: retiros.dtFechaAprob,
                        dtFechaAsentado: retiros.dtFechaAsentado,
                        strdescripcion: retiros.strdescripcion,
                        strnombreTipo: retiros.strnombre,
                        strurl:retiros.strUrl,
                        strCedula: retiros.strCedula,
                        strNombres: retiros.strNombres,
                        strApellidos: retiros.strApellidos,
                        strNivel: retiros.strCodNivel,
                        strtipo: "RETIROS TIPOS"
                    }

                    lstResultado.push(datos);
                }
            }
            if (ListadoRetirosNormales.count > 0) {
                for (var retirosnormales of ListadoRetirosNormales.data) {
                    var datosNormales = {
                        sintCodMatricula: retirosnormales.sintCodMatricula,
                        strCodPeriodo: retirosnormales.strCodPeriodo,
                        strPeriodoDescripcion: retirosnormales.strDescripcion,
                        dtFechaAprob: retirosnormales.dtFechaAprob,
                        dtFechaAsentado: retirosnormales.dtFechaAsentado,
                        strdescripcion: retirosnormales.strResolucion,
                        strnombreTipo: "",
                        strurl:"",
                        strCedula: retirosnormales.strCedula,
                        strNombres: retirosnormales.strNombres,
                        strApellidos: retirosnormales.strApellidos,
                        strNivel: retirosnormales.strCodNivel,
                        strtipo: "RETIROS ASIGNATURAS"
                    }
                    lstResultado.push(datosNormales);
                }
            }
            if (ListadoRetirosSinMatriculas.count > 0) {
                for (var retirossinmatricula of ListadoRetirosSinMatriculas.data) {
                   
                    var datosSinMatricula = {
                        sintCodMatricula:0,
                        strCodPeriodo: retirossinmatricula.rsm_strCodPeriodo,
                        strPeriodoDescripcion: retirossinmatricula.strDescripcion,
                        dtFechaAprob: retirossinmatricula.rsm_dtFechaAprob,
                        dtFechaAsentado: retirossinmatricula.rsm_fecha_registro,
                        strdescripcion: retirossinmatricula.rsm_strObservacion,
                        strnombreTipo: "",
                        strurl:retirossinmatricula.rsm_strRuta,
                        strCedula: retirossinmatricula.strCedula,
                        strNombres: retirossinmatricula.strNombres,
                        strApellidos: retirossinmatricula.strApellidos,
                        strNivel: 'NIGUNO',
                        strtipo: "RETIRO SIN MATRICULA"
                    }
                    lstResultado.push(datosSinMatricula);
                }
            }
        
      
        return lstResultado
    } catch (error) {
        console.error(error);
        
    }

}
async function FuncionEstudiantesRetirosPeriodoCarreraCedula( dbCarrera,periodo,cedula,codigo) {
    try {
        var lstResultado = []
            var ListadoRetirosTipos = await procesocarreras.TiposRetirosEstudiantesCarrerasListado(dbCarrera,periodo, cedula);
            var ListadoRetirosNormales = await procesocarreras.RetirosEstudiantesNormalesCarrerasListado(dbCarrera,periodo, cedula);
            var ListadoRetirosSinMatriculas= await procesocarreras.ObternerDatosRetirosinMatricula(dbCarrera,periodo, codigo);
            if (ListadoRetirosTipos.count > 0) {
                for (var retiros of ListadoRetirosTipos.data) {
                    var datos = {
                        sintCodMatricula: retiros.sintCodigo[0],
                        strCodPeriodo: retiros.strCodPeriodo[0],
                        strPeriodoDescripcion: '',
                        dtFechaAprob: retiros.dtFechaAprob,
                        dtFechaAsentado: retiros.dtFechaAsentado,
                        strdescripcion: retiros.strdescripcion,
                        strnombreTipo: retiros.strnombre,
                        strurl:retiros.strUrl,
                        strCedula: retiros.strCedula,
                        strNombres: retiros.strNombres,
                        strApellidos: retiros.strApellidos,
                        strNivel: retiros.strCodNivel,
                        strtipo: "RETIROS TIPOS"
                    }

                    lstResultado.push(datos);
                }
            }
            if (ListadoRetirosNormales.count > 0) {
                for (var retirosnormales of ListadoRetirosNormales.data) {
                    var datosNormales = {
                        sintCodMatricula: retirosnormales.sintCodMatricula,
                        strCodPeriodo: retirosnormales.strCodPeriodo,
                        strPeriodoDescripcion: retirosnormales.strDescripcion,
                        dtFechaAprob: retirosnormales.dtFechaAprob,
                        dtFechaAsentado: retirosnormales.dtFechaAsentado,
                        strdescripcion: retirosnormales.strResolucion,
                        strnombreTipo: "",
                        strurl:"",
                        strCedula: retirosnormales.strCedula,
                        strNombres: retirosnormales.strNombres,
                        strApellidos: retirosnormales.strApellidos,
                        strNivel: retirosnormales.strCodNivel,
                        strtipo: "RETIROS ASIGNATURAS"
                    }
                    lstResultado.push(datosNormales);
                }
            }
            if (ListadoRetirosSinMatriculas.count > 0) {
                for (var retirossinmatricula of ListadoRetirosSinMatriculas.data) {
                   
                    var datosSinMatricula = {
                        sintCodMatricula:0,
                        strCodPeriodo: retirossinmatricula.rsm_strCodPeriodo,
                        strPeriodoDescripcion: retirossinmatricula.strDescripcion,
                        dtFechaAprob: retirossinmatricula.rsm_dtFechaAprob,
                        dtFechaAsentado: retirossinmatricula.rsm_fecha_registro,
                        strdescripcion: retirossinmatricula.rsm_strObservacion,
                        strnombreTipo: "",
                        strurl:retirossinmatricula.rsm_strRuta,
                        strCedula: retirossinmatricula.strCedula,
                        strNombres: retirossinmatricula.strNombres,
                        strApellidos: retirossinmatricula.strApellidos,
                        strNivel: 'NIGUNO',
                        strtipo: "RETIRO SIN MATRICULA"
                    }
                    lstResultado.push(datosSinMatricula);
                }
            }
        
      
        return lstResultado
    } catch (error) {
        console.error(error);
        
    }

}