import { PDFDocument, rgb, degrees } from 'pdf-lib';

// Client-Side Image Resizer & Compressor Engine (Runs 100% in browser on Netlify)
export async function processImageResizerClient(
  file: File,
  options?: Record<string, any>
): Promise<{ downloadUrl: string; fileName: string; fileSize: number }> {
  const targetKB = options?.targetKB ? parseInt(options.targetKB, 10) : 30;
  const targetBytes = targetKB * 1024;
  const format = options?.format === 'png' ? 'image/png' : options?.format === 'webp' ? 'image/webp' : 'image/jpeg';
  const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';

  const imageBitmap = await createImageBitmap(file);
  let origW = imageBitmap.width;
  let origH = imageBitmap.height;

  if (options?.targetWidth && parseInt(options.targetWidth, 10) > 0) {
    origW = parseInt(options.targetWidth, 10);
  }
  if (options?.targetHeight && parseInt(options.targetHeight, 10) > 0) {
    origH = parseInt(options.targetHeight, 10);
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  let currentQuality = 0.85;
  let scaleFactor = 1.0;
  let finalBlob: Blob | null = null;

  for (let attempt = 0; attempt < 12; attempt++) {
    const w = Math.max(50, Math.round(origW * scaleFactor));
    const h = Math.max(50, Math.round(origH * scaleFactor));

    canvas.width = w;
    canvas.height = h;

    if (ctx) {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(imageBitmap, 0, 0, w, h);
    }

    finalBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), format, currentQuality);
    });

    if (finalBlob && (finalBlob.size <= targetBytes || (currentQuality <= 0.15 && scaleFactor <= 0.2))) {
      break;
    }

    if (currentQuality > 0.25) {
      currentQuality -= 0.15;
    } else {
      scaleFactor *= 0.75;
    }
  }

  if (!finalBlob) {
    finalBlob = file;
  }

  const downloadUrl = URL.createObjectURL(finalBlob);
  const fileName = `DocFlow_Resized_${targetKB}KB.${ext}`;

  return {
    downloadUrl,
    fileName,
    fileSize: finalBlob.size
  };
}

// Client-Side PDF Operations (Merge, Split, Rotate, Watermark)
export async function processPdfClient(
  endpoint: string,
  files: File[],
  options?: Record<string, any>
): Promise<{ downloadUrl: string; fileName: string; fileSize: number }> {
  if (endpoint === 'merge') {
    const mergedPdf = await PDFDocument.create();
    for (const f of files) {
      const bytes = await f.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    const pdfBytes = await mergedPdf.save();
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    return {
      downloadUrl: URL.createObjectURL(blob),
      fileName: 'DocFlow_Merged_Document.pdf',
      fileSize: blob.size
    };
  }

  if (endpoint === 'rotate') {
    const bytes = await files[0].arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    const angle = options?.rotationAngle ? parseInt(options.rotationAngle, 10) : 90;
    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      const current = page.getRotation().angle;
      page.setRotation(degrees((current + angle) % 360));
    });
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    return {
      downloadUrl: URL.createObjectURL(blob),
      fileName: 'DocFlow_Rotated_Document.pdf',
      fileSize: blob.size
    };
  }

  if (endpoint === 'watermark') {
    const bytes = await files[0].arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    const text = options?.watermarkText || 'CONFIDENTIAL';
    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      const { width, height } = page.getSize();
      page.drawText(text, {
        x: width / 4,
        y: height / 2,
        size: 36,
        color: rgb(0.95, 0.2, 0.4),
        opacity: 0.35,
        rotate: degrees(45)
      });
    });
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    return {
      downloadUrl: URL.createObjectURL(blob),
      fileName: 'DocFlow_Watermarked_Document.pdf',
      fileSize: blob.size
    };
  }

  if (endpoint === 'split') {
    const bytes = await files[0].arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    const splitPdf = await PDFDocument.create();
    const [firstPage] = await splitPdf.copyPages(pdfDoc, [0]);
    splitPdf.addPage(firstPage);
    const pdfBytes = await splitPdf.save();
    const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    return {
      downloadUrl: URL.createObjectURL(blob),
      fileName: 'DocFlow_Split_Page_1.pdf',
      fileSize: blob.size
    };
  }

  // Default fallback for single PDF pass-through
  const bytes = await files[0].arrayBuffer();
  const blob = new Blob([bytes], { type: files[0].type || 'application/pdf' });
  return {
    downloadUrl: URL.createObjectURL(blob),
    fileName: `DocFlow_${files[0].name}`,
    fileSize: blob.size
  };
}
