import { fromPath as originalFromPath } from 'pdf2pic';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs-extra';

const execAsync = promisify(exec);

interface ConversionOptions {
  density: number;
  format: string;
  height: number;
  width?: number;
  preserveAspectRatio: boolean;
  saveFilename: string;
  savePath: string;
}

export async function convertPDFPageToImage(
  pdfPath: string,
  pageNumber: number,
  options: ConversionOptions
): Promise<{ buffer: Buffer; page: number }> {
  const outputPath = path.join(
    options.savePath,
    `${options.saveFilename}_page_${pageNumber.toString().padStart(5, "0")}.png`
  );

  try {
    // Use ImageMagick's convert command directly
    const command = [
      'convert',
      `-density ${options.density}`,
      `"${pdfPath}"[${pageNumber - 1}]`, // ImageMagick uses 0-based page numbers
      '-quality 100',
      options.height ? `-resize x${options.height}` : '',
      `"${outputPath}"`,
    ].filter(Boolean).join(' ');

    console.log('Executing convert command:', command);
    await execAsync(command);

    // Read the resulting file
    const buffer = await fs.readFile(outputPath);
    await fs.unlink(outputPath); // Clean up the temporary file

    return {
      buffer,
      page: pageNumber,
    };
  } catch (error) {
    console.error('Error converting PDF page:', error);
    throw new Error(`Failed to convert PDF page ${pageNumber}: ${error}`);
  }
}

export async function convertPDFToImages(
  pdfPath: string,
  options: ConversionOptions,
  pages: number | number[]
): Promise<{ buffer: Buffer; page: number }[]> {
  try {
    // If pages is a single number, convert just that page
    // If it's -1, we need to get the total page count first
    let pageNumbers: number[];
    
    if (typeof pages === 'number') {
      if (pages === -1) {
        // Get page count using ImageMagick
        const { stdout } = await execAsync(`identify "${pdfPath}" | wc -l`);
        const pageCount = parseInt(stdout.trim(), 10);
        pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1);
      } else {
        pageNumbers = [pages];
      }
    } else {
      pageNumbers = pages;
    }

    // Convert each page
    const results = await Promise.all(
      pageNumbers.map(pageNum => 
        convertPDFPageToImage(pdfPath, pageNum, options)
      )
    );

    return results;
  } catch (error) {
    console.error('Error in bulk conversion:', error);
    throw error;
  }
}