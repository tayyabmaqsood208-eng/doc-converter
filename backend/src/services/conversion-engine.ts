import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import util from 'util';
import { fileStore } from './file-store';

const execPromise = util.promisify(exec);

const LIBREOFFICE_PATH = process.env.LIBREOFFICE_PATH || 'C:\\Program Files\\LibreOffice\\program\\soffice.exe';

export const conversionEngine = {
  /**
   * Convert Office documents (DOC, DOCX, PPT, PPTX, XLS, XLSX) to PDF using LibreOffice headless CLI
   */
  async convertOfficeToPdf(inputFilePath: string): Promise<string> {
    const outputDir = fileStore.getOutputDir();
    
    const sofficeCmd = fs.existsSync(LIBREOFFICE_PATH)
      ? `"${LIBREOFFICE_PATH}"`
      : 'soffice';

    const command = `${sofficeCmd} --headless --convert-to pdf --outdir "${outputDir}" "${inputFilePath}"`;
    
    try {
      console.log(`[ConversionEngine] Executing Office to PDF: ${command}`);
      const { stdout, stderr } = await execPromise(command, { timeout: 90000 });
      console.log(`[ConversionEngine] Output: ${stdout}`);
      
      const inputBasename = path.basename(inputFilePath, path.extname(inputFilePath));
      const expectedPdfPath = path.join(outputDir, `${inputBasename}.pdf`);

      if (fs.existsSync(expectedPdfPath)) {
        return expectedPdfPath;
      }
      
      throw new Error(`Converted PDF file not found at expected path: ${expectedPdfPath}. Stderr: ${stderr}`);
    } catch (err: any) {
      throw new Error(`Office to PDF conversion failed: ${err.message}`);
    }
  },

  /**
   * Convert PDF to Word (DOCX), PowerPoint (PPTX), or Excel (XLSX) using LibreOffice headless CLI
   */
  async convertPdfToOffice(inputFilePath: string, targetFormat: 'docx' | 'pptx' | 'xlsx'): Promise<string> {
    const outputDir = fileStore.getOutputDir();
    const inputBasename = path.basename(inputFilePath, path.extname(inputFilePath));
    const expectedOutputPath = path.join(outputDir, `${inputBasename}.${targetFormat}`);

    const sofficeCmd = fs.existsSync(LIBREOFFICE_PATH)
      ? `"${LIBREOFFICE_PATH}"`
      : 'soffice';

    let filterArg = '';
    if (targetFormat === 'docx') filterArg = '--infilter="writer_pdf_import"';
    if (targetFormat === 'pptx') filterArg = '--infilter="impress_pdf_import"';
    if (targetFormat === 'xlsx') filterArg = '--infilter="calc_pdf_import"';

    const command = `${sofficeCmd} --headless ${filterArg} --convert-to ${targetFormat} --outdir "${outputDir}" "${inputFilePath}"`;

    try {
      console.log(`[ConversionEngine] Executing PDF to ${targetFormat.toUpperCase()}: ${command}`);
      const { stdout, stderr } = await execPromise(command, { timeout: 90000 });
      console.log(`[ConversionEngine] Output: ${stdout}`);

      if (fs.existsSync(expectedOutputPath)) {
        return expectedOutputPath;
      }

      throw new Error(`Converted ${targetFormat.toUpperCase()} document not found at expected path: ${expectedOutputPath}. Stderr: ${stderr}`);
    } catch (err: any) {
      throw new Error(`PDF to ${targetFormat.toUpperCase()} conversion failed: ${err.message}`);
    }
  }
};
