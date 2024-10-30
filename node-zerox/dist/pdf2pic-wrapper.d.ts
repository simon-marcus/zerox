interface ConversionOptions {
    density: number;
    format: string;
    height: number;
    width?: number;
    preserveAspectRatio: boolean;
    saveFilename: string;
    savePath: string;
}
export declare function convertPDFPageToImage(pdfPath: string, pageNumber: number, options: ConversionOptions): Promise<{
    buffer: Buffer;
    page: number;
}>;
export declare function convertPDFToImages(pdfPath: string, options: ConversionOptions, pages: number | number[]): Promise<{
    buffer: Buffer;
    page: number;
}[]>;
export {};
