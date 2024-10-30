"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPDFPageToImage = convertPDFPageToImage;
exports.convertPDFToImages = convertPDFToImages;
var child_process_1 = require("child_process");
var util_1 = require("util");
var path = __importStar(require("path"));
var fs = __importStar(require("fs-extra"));
var execAsync = (0, util_1.promisify)(child_process_1.exec);
function convertPDFPageToImage(pdfPath, pageNumber, options) {
    return __awaiter(this, void 0, void 0, function () {
        var outputPath, command, buffer, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    outputPath = path.join(options.savePath, "".concat(options.saveFilename, "_page_").concat(pageNumber.toString().padStart(5, "0"), ".png"));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    command = [
                        'convert',
                        "-density ".concat(options.density),
                        "\"".concat(pdfPath, "\"[").concat(pageNumber - 1, "]"), // ImageMagick uses 0-based page numbers
                        '-quality 100',
                        options.height ? "-resize x".concat(options.height) : '',
                        "\"".concat(outputPath, "\""),
                    ].filter(Boolean).join(' ');
                    console.log('Executing convert command:', command);
                    return [4 /*yield*/, execAsync(command)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, fs.readFile(outputPath)];
                case 3:
                    buffer = _a.sent();
                    return [4 /*yield*/, fs.unlink(outputPath)];
                case 4:
                    _a.sent(); // Clean up the temporary file
                    return [2 /*return*/, {
                            buffer: buffer,
                            page: pageNumber,
                        }];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error converting PDF page:', error_1);
                    throw new Error("Failed to convert PDF page ".concat(pageNumber, ": ").concat(error_1));
                case 6: return [2 /*return*/];
            }
        });
    });
}
function convertPDFToImages(pdfPath, options, pages) {
    return __awaiter(this, void 0, void 0, function () {
        var pageNumbers, stdout, pageCount, results, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    pageNumbers = void 0;
                    if (!(typeof pages === 'number')) return [3 /*break*/, 4];
                    if (!(pages === -1)) return [3 /*break*/, 2];
                    return [4 /*yield*/, execAsync("identify \"".concat(pdfPath, "\" | wc -l"))];
                case 1:
                    stdout = (_a.sent()).stdout;
                    pageCount = parseInt(stdout.trim(), 10);
                    pageNumbers = Array.from({ length: pageCount }, function (_, i) { return i + 1; });
                    return [3 /*break*/, 3];
                case 2:
                    pageNumbers = [pages];
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    pageNumbers = pages;
                    _a.label = 5;
                case 5: return [4 /*yield*/, Promise.all(pageNumbers.map(function (pageNum) {
                        return convertPDFPageToImage(pdfPath, pageNum, options);
                    }))];
                case 6:
                    results = _a.sent();
                    return [2 /*return*/, results];
                case 7:
                    error_2 = _a.sent();
                    console.error('Error in bulk conversion:', error_2);
                    throw error_2;
                case 8: return [2 /*return*/];
            }
        });
    });
}
