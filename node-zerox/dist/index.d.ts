import { ZeroxArgs, ZeroxOutput } from "./types";
export declare const zerox: ({ cleanup, concurrency, filePath, llmParams, maintainFormat, model, openaiAPIKey, outputDir, pagesToConvertAsImages, tempDir, }: ZeroxArgs) => Promise<ZeroxOutput>;
