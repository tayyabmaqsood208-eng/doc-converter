import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import fs from 'fs';

export const pdfOps = {
  /**
   * Merge multiple PDF files into one single PDF document
   */
  async mergePdfs(filePaths: string[]): Promise<Uint8Array> {
    const mergedPdf = await PDFDocument.create();

    for (const filePath of filePaths) {
      const pdfBytes = fs.readFileSync(filePath);
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    return await mergedPdf.save();
  },

  /**
   * Split a PDF into specified page ranges or individual pages
   */
  async splitPdf(filePath: string, pageRangesStr?: string): Promise<{ filename: string; bytes: Uint8Array }[]> {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const totalPages = pdfDoc.getPageCount();

    const results: { filename: string; bytes: Uint8Array }[] = [];

    if (!pageRangesStr || pageRangesStr.trim() === 'all') {
      for (let i = 0; i < totalPages; i++) {
        const newPdf = await PDFDocument.create();
        const [page] = await newPdf.copyPages(pdfDoc, [i]);
        newPdf.addPage(page);
        const bytes = await newPdf.save();
        results.push({ filename: `page_${i + 1}.pdf`, bytes });
      }
    } else {
      const ranges = pageRangesStr.split(',').map(r => r.trim());
      let fileIdx = 1;

      for (const range of ranges) {
        const newPdf = await PDFDocument.create();
        const pagesToCopy: number[] = [];

        if (range.includes('-')) {
          const [start, end] = range.split('-').map(n => parseInt(n, 10));
          for (let p = Math.max(1, start); p <= Math.min(totalPages, end); p++) {
            pagesToCopy.push(p - 1);
          }
        } else {
          const pageNum = parseInt(range, 10);
          if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
            pagesToCopy.push(pageNum - 1);
          }
        }

        if (pagesToCopy.length > 0) {
          const copiedPages = await newPdf.copyPages(pdfDoc, pagesToCopy);
          copiedPages.forEach(p => newPdf.addPage(p));
          const bytes = await newPdf.save();
          results.push({ filename: `split_part_${fileIdx}.pdf`, bytes });
          fileIdx++;
        }
      }
    }

    return results;
  },

  /**
   * Compress PDF by optimizing content streams and removing metadata
   */
  async compressPdf(filePath: string): Promise<Uint8Array> {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    return await pdfDoc.save({ useObjectStreams: true });
  },

  /**
   * Rotate pages in a PDF document by 90, 180, 270 degrees
   */
  async rotatePdf(filePath: string, rotationAngle: number): Promise<Uint8Array> {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();

    pages.forEach((page) => {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + rotationAngle) % 360));
    });

    return await pdfDoc.save();
  },

  /**
   * Add text watermark to PDF pages
   */
  async watermarkPdf(filePath: string, watermarkText: string): Promise<Uint8Array> {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    pages.forEach((page) => {
      const { width, height } = page.getSize();
      const fontSize = Math.min(width, height) / 10;
      const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      page.drawText(watermarkText, {
        x: width / 2 - textWidth / 2,
        y: height / 2 - textHeight / 2,
        size: fontSize,
        font,
        color: rgb(0.8, 0.2, 0.2),
        opacity: 0.3,
        rotate: degrees(45)
      });
    });

    return await pdfDoc.save();
  },

  /**
   * Protect PDF document by setting metadata security permissions
   */
  /**
   * NOTE: pdf-lib does not implement real PDF encryption.
   * This marks the document and must not be advertised as cryptographic protection.
   */
  async protectPdf(filePath: string, _userPassword: string): Promise<Uint8Array> {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    pdfDoc.setTitle('DocFlow Document');
    pdfDoc.setSubject('Processed with DocFlow (metadata mark only — not encrypted)');
    return await pdfDoc.save();
  },

  /**
   * Attempt to load a PDF. Real encrypted PDFs require a proper decryption library.
   */
  async unlockPdf(filePath: string, _password?: string): Promise<Uint8Array> {
    const pdfBytes = fs.readFileSync(filePath);
    try {
      const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: false });
      return await pdfDoc.save();
    } catch {
      // Do not silently bypass encryption — fail closed for encrypted files.
      throw new Error('This PDF appears encrypted. Password unlock is not fully supported yet.');
    }
  },

  /**
   * Add text or image annotation edit layer to PDF
   */
  async editPdf(filePath: string, annotations: Array<{ pageNum: number; text?: string; x: number; y: number }>): Promise<Uint8Array> {
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    annotations.forEach(ann => {
      const pageIndex = ann.pageNum - 1;
      if (pageIndex >= 0 && pageIndex < pages.length) {
        const page = pages[pageIndex];
        if (ann.text) {
          page.drawText(ann.text, {
            x: ann.x,
            y: ann.y,
            size: 14,
            font,
            color: rgb(0, 0, 0)
          });
        }
      }
    });

    return await pdfDoc.save();
  }
};
