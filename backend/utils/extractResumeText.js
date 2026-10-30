import { execFile as execFileCallback } from "node:child_process";
import { createRequire } from "node:module";
import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import mammoth from "mammoth";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");
const { createWorker, OEM } = require("tesseract.js");
const execFile = promisify(execFileCallback);
const englishModelPath = path.join(
	path.dirname(require.resolve("@tesseract.js-data/eng")),
	"4.0.0_best_int",
);
const DOCX_MIME_TYPE =
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const MINIMUM_TEXT_LENGTH = 50;
const MAX_OCR_PAGES = 10;
const OCR_CACHE_PATH = path.join(os.tmpdir(), "jobgenie-tesseract-cache");

const pdfOcrError = (code, message) => {
	const error = new Error(message);
	error.code = code;
	return error;
};

const renderPdfPages = async (buffer, directory) => {
	const inputPath = path.join(directory, "resume.pdf");
	const outputPrefix = path.join(directory, "page");
	await writeFile(inputPath, buffer);

	try {
		await execFile(
			"pdftoppm",
			[
				"-f",
				"1",
				"-l",
				String(MAX_OCR_PAGES + 1),
				"-scale-to",
				"2400",
				"-png",
				inputPath,
				outputPrefix,
			],
			{ timeout: 60_000, maxBuffer: 1024 * 1024 },
		);
	} catch (error) {
		if (error.code === "ENOENT") {
			throw pdfOcrError(
				"PDF_OCR_UNAVAILABLE",
				"Automatic PDF OCR is unavailable on the server. Install Poppler (poppler-utils) and try again.",
			);
		}
		throw error;
	}

	const pagePaths = (await readdir(directory))
		.filter((name) => /^page-\d+\.png$/.test(name))
		.sort((first, second) => {
			const firstPage = Number(first.match(/\d+/)?.[0]);
			const secondPage = Number(second.match(/\d+/)?.[0]);
			return firstPage - secondPage;
		})
		.map((name) => path.join(directory, name));

	if (pagePaths.length > MAX_OCR_PAGES) {
		throw pdfOcrError(
			"PDF_OCR_PAGE_LIMIT",
			`Scanned PDFs can contain up to ${MAX_OCR_PAGES} pages for OCR.`,
		);
	}

	if (pagePaths.length === 0) {
		throw new Error("The PDF rasterizer did not return any pages");
	}

	return pagePaths;
};

const extractScannedPdfText = async (buffer) => {
	const directory = await mkdtemp(path.join(os.tmpdir(), "jobgenie-resume-"));
	let worker;
	try {
		const pagePaths = await renderPdfPages(buffer, directory);
		await mkdir(OCR_CACHE_PATH, { recursive: true });
		worker = await createWorker("eng", OEM.LSTM_ONLY, {
			langPath: englishModelPath,
			gzip: true,
			cachePath: OCR_CACHE_PATH,
		});

		const pageTexts = [];
		for (const pagePath of pagePaths) {
			const image = await readFile(pagePath);
			const { data } = await worker.recognize(image);
			pageTexts.push(data.text.trim());
		}

		return pageTexts.filter(Boolean).join("\n");
	} finally {
		if (worker) {
			await worker.terminate();
		}
		await rm(directory, { recursive: true, force: true });
	}
};

const extractPdfText = async (buffer) => {
	let parsedText = "";
	let parseError;

	try {
		const pdfData = await pdfParse(buffer);
		parsedText = pdfData.text || "";
	} catch (error) {
		parseError = error;
	}

	if (parsedText.trim().length >= MINIMUM_TEXT_LENGTH) {
		return parsedText;
	}

	try {
		const ocrText = await extractScannedPdfText(buffer);
		return [parsedText.trim(), ocrText.trim()].filter(Boolean).join("\n");
	} catch (ocrError) {
		if (ocrError.code) {
			throw ocrError;
		}
		if (parseError) {
			throw new AggregateError(
				[parseError, ocrError],
				"Could not parse or OCR the uploaded PDF",
			);
		}
		throw ocrError;
	}
};

const extractResumeText = async (file) => {
	if (file.mimetype === "application/pdf") {
		return extractPdfText(file.buffer);
	}

	if (file.mimetype === DOCX_MIME_TYPE) {
		const docxData = await mammoth.extractRawText({ buffer: file.buffer });
		return docxData.value;
	}

	throw new Error("Unsupported resume format");
};

export default extractResumeText;
