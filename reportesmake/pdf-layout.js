// pdfLayout.js (CommonJS)
const pathimage = require('path');

// Configuración de imágenes desde la carpeta public/imagenes
const PDF_IMAGES = {
  HEADER_LOGO: pathimage.join(__dirname, '../public/imagenes/espoch.png') ,
  FOOTER_LOGO: pathimage.join(__dirname, '../public/imagenes/matriz.png') 
};

/**
 * Crea la configuración base para un PDF
 */
const createBaseLayout = ({
  title,
  subtitle,
  headerExtra,
  footerExtra,
  background,
  pageMargins = [40, 120, 40, 70],
  pageOrientation = 'portrait',
}) => ({
  pageSize: 'A4',
  pageOrientation,
  pageMargins,
  background,

  header: (page, total) => {
    const headerContent = [
      {
        image: PDF_IMAGES.HEADER_LOGO,
        width: 90,
        alignment: 'left',
        margin: [-10, -40, 0, 0]
      },
      { text: title, style: 'title' },
      subtitle ? { text: subtitle, style: 'subtitle' } : null,
      headerExtra ? headerExtra(page, total) : null,
    ].filter(Boolean);

    return {
      margin: [40, 30, 40, 20],
      stack: headerContent,
    };
  },

  footer: (page, total) => {
    const footerContent = [
      {
        image: PDF_IMAGES.FOOTER_LOGO,
        width: 280,
        alignment: 'center',
        margin: [0, 0, 0, -20]
      },
      {
        text: `Página ${page} de ${total}`,
        style: 'footer',
        alignment: 'right'
      },
      {
        text: `Fecha de elaboración: ${new Date().toISOString().slice(0, 10)}`,
        style: 'footer',
        alignment: 'right',
        margin: [0, 2, 0, 0],
      },
      footerExtra ? footerExtra(page, total) : null,
    ].filter(Boolean);

    return {
      margin: [40, 0, 40, 20],
      stack: footerContent,
    };
  },

  styles: {
    title: { fontSize: 14, bold: true, alignment: 'center' },
    subtitle: { fontSize: 11, alignment: 'center', bold: true },
    footer: { fontSize: 9 },
    tableHeader: { bold: true, fontSize: 9, fillColor: '#eeeeee', alignment: 'center' },
  },

  defaultStyle: { fontSize: 10 },
});

module.exports = { createBaseLayout };