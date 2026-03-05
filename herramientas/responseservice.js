function sendResponseServicios(res, success, datos = [], message = '') {
    return res.json({
        success,
        datos,
        message
    });
}
function sendResponseProcesos(proceso, datos = [], message = '') {
    return {
        proceso,
        datos,
        message
    };
}
function sendResponseModelo(modelo, datos = [], message = '') {
    return {
        modelo,
        datos,
        message
    };
}

module.exports = { sendResponseServicios,sendResponseProcesos,sendResponseModelo };