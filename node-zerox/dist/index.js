"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zerox = void 0;
var utils_1 = require("./utils");
var openAI_1 = require("./openAI");
var types_1 = require("./types");
var utils_2 = require("./utils");
var fs_extra_1 = __importDefault(require("fs-extra"));
var os_1 = __importDefault(require("os"));
var path_1 = __importDefault(require("path"));
var p_limit_1 = __importDefault(require("p-limit"));
var zerox = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var inputTokenCount, outputTokenCount, priorPage, aggregatedMarkdown, startTime, rand, tempDirectory, _c, extension, localPath, pdfPath, endOfPath, rawFileName, fileName, files, images, _i, images_1, image, imagePath, _d, content, inputTokens, outputTokens, formattedMarkdown, error_1, processPage_1, processPagesInBatches, limit, results, filteredResults, resultFilePath, endTime, completionTime, formattedPages;
    var _e = _b.cleanup, cleanup = _e === void 0 ? true : _e, _f = _b.concurrency, concurrency = _f === void 0 ? 10 : _f, filePath = _b.filePath, _g = _b.llmParams, llmParams = _g === void 0 ? {} : _g, _h = _b.maintainFormat, maintainFormat = _h === void 0 ? false : _h, _j = _b.model, model = _j === void 0 ? types_1.ModelOptions.gpt_4o_mini : _j, _k = _b.openaiAPIKey, openaiAPIKey = _k === void 0 ? "" : _k, outputDir = _b.outputDir, _l = _b.pagesToConvertAsImages, pagesToConvertAsImages = _l === void 0 ? -1 : _l, _m = _b.tempDir, tempDir = _m === void 0 ? os_1.default.tmpdir() : _m;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0:
                inputTokenCount = 0;
                outputTokenCount = 0;
                priorPage = "";
                aggregatedMarkdown = [];
                startTime = new Date();
                llmParams = (0, utils_2.validateLLMParams)(llmParams);
                // Validators
                if (!openaiAPIKey || !openaiAPIKey.length) {
                    throw new Error("Missing OpenAI API key");
                }
                if (!filePath || !filePath.length) {
                    throw new Error("Missing file path");
                }
                rand = Math.floor(1000 + Math.random() * 9000).toString();
                tempDirectory = path_1.default.join(tempDir || os_1.default.tmpdir(), "zerox-temp-".concat(rand));
                return [4 /*yield*/, fs_extra_1.default.ensureDir(tempDirectory)];
            case 1:
                _o.sent();
                return [4 /*yield*/, (0, utils_1.downloadFile)({
                        filePath: filePath,
                        tempDir: tempDirectory,
                    })];
            case 2:
                _c = _o.sent(), extension = _c.extension, localPath = _c.localPath;
                if (!localPath)
                    throw "Failed to save file to local drive";
                // Sort the `pagesToConvertAsImages` array to make sure we use the right index
                // for `formattedPages` as `pdf2pic` always returns images in order
                if (Array.isArray(pagesToConvertAsImages)) {
                    pagesToConvertAsImages.sort(function (a, b) { return a - b; });
                }
                if (!(extension !== ".png")) return [3 /*break*/, 7];
                pdfPath = void 0;
                if (!(extension === ".pdf")) return [3 /*break*/, 3];
                pdfPath = localPath;
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, (0, utils_1.convertFileToPdf)({
                    extension: extension,
                    localPath: localPath,
                    tempDir: tempDirectory,
                })];
            case 4:
                pdfPath = _o.sent();
                _o.label = 5;
            case 5: 
            // Convert the file to a series of images
            return [4 /*yield*/, (0, utils_1.convertPdfToImages)({
                    localPath: pdfPath,
                    pagesToConvertAsImages: pagesToConvertAsImages,
                    tempDir: tempDirectory,
                })];
            case 6:
                // Convert the file to a series of images
                _o.sent();
                _o.label = 7;
            case 7:
                endOfPath = localPath.split("/")[localPath.split("/").length - 1];
                rawFileName = endOfPath.split(".")[0];
                fileName = rawFileName
                    .replace(/[^\w\s]/g, "")
                    .replace(/\s+/g, "_")
                    .toLowerCase()
                    .substring(0, 255);
                return [4 /*yield*/, fs_extra_1.default.readdir(tempDirectory)];
            case 8:
                files = _o.sent();
                images = files.filter(function (file) { return file.endsWith(".png"); });
                if (!maintainFormat) return [3 /*break*/, 15];
                _i = 0, images_1 = images;
                _o.label = 9;
            case 9:
                if (!(_i < images_1.length)) return [3 /*break*/, 14];
                image = images_1[_i];
                imagePath = path_1.default.join(tempDirectory, image);
                _o.label = 10;
            case 10:
                _o.trys.push([10, 12, , 13]);
                return [4 /*yield*/, (0, openAI_1.getCompletion)({
                        apiKey: openaiAPIKey,
                        imagePath: imagePath,
                        llmParams: llmParams,
                        maintainFormat: maintainFormat,
                        model: model,
                        priorPage: priorPage,
                    })];
            case 11:
                _d = _o.sent(), content = _d.content, inputTokens = _d.inputTokens, outputTokens = _d.outputTokens;
                formattedMarkdown = (0, utils_1.formatMarkdown)(content);
                inputTokenCount += inputTokens;
                outputTokenCount += outputTokens;
                // Update prior page to result from last processing step
                priorPage = formattedMarkdown;
                // Add all markdown results to array
                aggregatedMarkdown.push(formattedMarkdown);
                return [3 /*break*/, 13];
            case 12:
                error_1 = _o.sent();
                console.error("Failed to process image ".concat(image, ":"), error_1);
                throw error_1;
            case 13:
                _i++;
                return [3 /*break*/, 9];
            case 14: return [3 /*break*/, 17];
            case 15:
                processPage_1 = function (image) { return __awaiter(void 0, void 0, void 0, function () {
                    var imagePath, _a, content, inputTokens, outputTokens, formattedMarkdown, error_2;
                    return __generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                imagePath = path_1.default.join(tempDirectory, image);
                                _b.label = 1;
                            case 1:
                                _b.trys.push([1, 3, , 4]);
                                return [4 /*yield*/, (0, openAI_1.getCompletion)({
                                        apiKey: openaiAPIKey,
                                        imagePath: imagePath,
                                        llmParams: llmParams,
                                        maintainFormat: maintainFormat,
                                        model: model,
                                        priorPage: priorPage,
                                    })];
                            case 2:
                                _a = _b.sent(), content = _a.content, inputTokens = _a.inputTokens, outputTokens = _a.outputTokens;
                                formattedMarkdown = (0, utils_1.formatMarkdown)(content);
                                inputTokenCount += inputTokens;
                                outputTokenCount += outputTokens;
                                // Update prior page to result from last processing step
                                priorPage = formattedMarkdown;
                                // Add all markdown results to array
                                return [2 /*return*/, formattedMarkdown];
                            case 3:
                                error_2 = _b.sent();
                                console.error("Failed to process image ".concat(image, ":"), error_2);
                                throw error_2;
                            case 4: return [2 /*return*/];
                        }
                    });
                }); };
                processPagesInBatches = function (images, limit) { return __awaiter(void 0, void 0, void 0, function () {
                    var results, promises;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                results = [];
                                promises = images.map(function (image, index) {
                                    return limit(function () {
                                        return processPage_1(image).then(function (result) {
                                            results[index] = result;
                                        });
                                    });
                                });
                                return [4 /*yield*/, Promise.all(promises)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/, results];
                        }
                    });
                }); };
                limit = (0, p_limit_1.default)(concurrency);
                return [4 /*yield*/, processPagesInBatches(images, limit)];
            case 16:
                results = _o.sent();
                filteredResults = results.filter(utils_1.isString);
                aggregatedMarkdown.push.apply(aggregatedMarkdown, filteredResults);
                _o.label = 17;
            case 17:
                if (!outputDir) return [3 /*break*/, 19];
                resultFilePath = path_1.default.join(outputDir, "".concat(fileName, ".md"));
                return [4 /*yield*/, fs_extra_1.default.writeFile(resultFilePath, aggregatedMarkdown.join("\n\n"))];
            case 18:
                _o.sent();
                _o.label = 19;
            case 19:
                if (!cleanup) return [3 /*break*/, 21];
                return [4 /*yield*/, fs_extra_1.default.remove(tempDirectory)];
            case 20:
                _o.sent();
                _o.label = 21;
            case 21:
                endTime = new Date();
                completionTime = endTime.getTime() - startTime.getTime();
                formattedPages = aggregatedMarkdown.map(function (el, i) {
                    var pageNumber;
                    // If we convert all pages, just use the array index
                    if (pagesToConvertAsImages === -1) {
                        pageNumber = i + 1;
                    }
                    // Else if we convert specific pages, use the page number from the parameter
                    else if (Array.isArray(pagesToConvertAsImages)) {
                        pageNumber = pagesToConvertAsImages[i];
                    }
                    // Else, the parameter is a number and use it for the page number
                    else {
                        pageNumber = pagesToConvertAsImages;
                    }
                    return { content: el, page: pageNumber, contentLength: el.length };
                });
                return [2 /*return*/, {
                        completionTime: completionTime,
                        fileName: fileName,
                        inputTokens: inputTokenCount,
                        outputTokens: outputTokenCount,
                        pages: formattedPages,
                    }];
        }
    });
}); };
exports.zerox = zerox;
