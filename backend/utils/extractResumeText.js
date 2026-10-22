import { createRequire } from "module";
import mammoth from "mammoth";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

const DOCX_MIME_TYPE =
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const extractResumeText = async (file) => {
	if (file.mimetype === "application/pdf") {
		const pdfData = await pdfParse(file.buffer);
		return pdfData.text;
	}

	if (file.mimetype === DOCX_MIME_TYPE) {
		const docxData = await mammoth.extractRawText({ buffer: file.buffer });
		return docxData.value;
	}

	throw new Error("Unsupported resume format");
};

export default extractResumeText;
