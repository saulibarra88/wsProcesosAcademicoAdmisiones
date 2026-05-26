import { PDF_IMAGES } from './imgs/images';
type PdfLayoutExtras = (page: number, total: number) => any;

export type PdfLayoutOptions = {
   title: string;
   subtitle?: string;
   headerExtra?: PdfLayoutExtras;
   footerExtra?: PdfLayoutExtras;
   background?: any;
   pageMargins?: [number, number, number, number];
   pageOrientation?: 'portrait' | 'landscape';
};

/**
 * Plantilla base para PDFs: centraliza encabezado, pie y estilos comunes.
 * Para personalizar otro PDF, cambia solo los valores de PdfLayoutOptions
 * y el contenido principal en tu servicio.
 */
export const createBaseLayout = ({
   title,
   subtitle,
   headerExtra,
   footerExtra,
   background,
   pageMargins = [40, 120, 40, 70], // deja espacio para header/pie
   pageOrientation = 'portrait',
}: PdfLayoutOptions) => ({
   pageSize: 'A4',
   pageOrientation,
   pageMargins,
   background, // e.g., watermark o logo si lo necesitas
   header: (page: number, total: number) => ({
      margin: [40, 30, 40, 20],
      stack: [
         {
            image: PDF_IMAGES.HEADER_LOGO, // base64 o url
            width: 175, // ajusta tamaño
            alignment: 'left',
            margin: [-10, -40, 0, 0]
         },
         { text: title, style: 'title' },
         subtitle ? { text: subtitle, style: 'subtitle' } : null,
         headerExtra ? headerExtra(page, total) : null,
      ].filter(Boolean),
   }),
   footer: (page: number, total: number) => ({
      margin: [40, 0, 40, 20],
      stack: [
         {
            image: PDF_IMAGES.FOOTER_LOGO,
            width: 300,
            alignment: 'center',
            margin: [0, 0, 0, -20] 
         },
         // Número de página a la derecha
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
      ].filter(Boolean),
   }),
   styles: {
      title: { fontSize: 14, bold: true, alignment: 'center' },
      subtitle: { fontSize: 10, italics: true, alignment: 'center' },
      footer: { fontSize: 9 },
      tableHeader: { bold: true, fontSize: 9, fillColor: '#eeeeee', alignment: 'center' },
   },
   defaultStyle: { fontSize: 10 },
});
