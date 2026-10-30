import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createCanvas } from "@napi-rs/canvas";
import { describe, it } from "node:test";
import { promisify } from "node:util";
import extractResumeText from "./extractResumeText.js";

const execFileAsync = promisify(execFile);
const PDF_MIME_TYPE = "application/pdf";

const createPdf = (objects) => {
	const chunks = [Buffer.from("%PDF-1.4\n")];
	const offsets = [];
	let offset = chunks[0].length;

	objects.forEach((object, index) => {
		offsets.push(offset);
		const objectChunks = [
			Buffer.from(`${index + 1} 0 obj\n`),
			object,
			Buffer.from("\nendobj\n"),
		];
		chunks.push(...objectChunks);
		offset += objectChunks.reduce((length, chunk) => length + chunk.length, 0);
	});

	const xrefOffset = offset;
	const xrefEntries = offsets
		.map((position) => `${String(position).padStart(10, "0")} 00000 n \n`)
		.join("");
	chunks.push(
		Buffer.from(
			`xref\n0 ${objects.length + 1}\n0000000000 65535 f \n${xrefEntries}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`,
		),
	);

	return Buffer.concat(chunks);
};

const makeSearchablePdf = () => {
	const content = Buffer.from(
		"BT /F1 14 Tf 50 180 Td (Alex Morgan is a Senior Software Engineer with Node.js experience.) Tj ET",
	);

	return createPdf([
		Buffer.from("<< /Type /Catalog /Pages 2 0 R >>"),
		Buffer.from("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"),
		Buffer.from(
			"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 500 250] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
		),
		Buffer.from("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>"),
		Buffer.concat([
			Buffer.from(`<< /Length ${content.length} >>\nstream\n`),
			content,
			Buffer.from("\nendstream"),
		]),
	]);
};

const makeScannedPdf = () => {
	const width = 1000;
	const height = 400;
	const canvas = createCanvas(width, height);
	const context = canvas.getContext("2d");
	context.fillStyle = "#fff";
	context.fillRect(0, 0, width, height);
	context.fillStyle = "#111";
	context.font = "bold 54px Arial";
	context.fillText("Alex Morgan", 60, 110);
	context.font = "42px Arial";
	context.fillText("Senior Software Engineer", 60, 190);
	context.fillText("Built systems with Node.js and Python.", 60, 270);

	const image = canvas.toBuffer("image/jpeg");
	const content = Buffer.from("q 500 0 0 200 0 0 cm /Im0 Do Q");

	return createPdf([
		Buffer.from("<< /Type /Catalog /Pages 2 0 R >>"),
		Buffer.from("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"),
		Buffer.from(
			"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 500 200] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>",
		),
		Buffer.concat([
			Buffer.from(
				`<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.length} >>\nstream\n`,
			),
			image,
			Buffer.from("\nendstream"),
		]),
		Buffer.concat([
			Buffer.from(`<< /Length ${content.length} >>\nstream\n`),
			content,
			Buffer.from("\nendstream"),
		]),
	]);
};

const popplerAvailable = await execFileAsync("pdftoppm", ["-v"])
	.then(() => true)
	.catch(() => false);

describe("extractResumeText", () => {
	it("keeps searchable PDF extraction unchanged", async () => {
		const text = await extractResumeText({
			mimetype: PDF_MIME_TYPE,
			buffer: makeSearchablePdf(),
		});

		assert.match(text, /Alex Morgan/);
		assert.match(text, /Senior Software Engineer/);
	});

	it(
		"extracts text from scanned PDFs with local OCR",
		{ skip: !popplerAvailable },
		async () => {
			const text = await extractResumeText({
				mimetype: PDF_MIME_TYPE,
				buffer: makeScannedPdf(),
			});

			assert.ok(text.trim().length >= 50);
			assert.match(text, /Alex Morgan/);
			assert.match(text, /Software Engineer/);
			assert.match(text, /Built systems with/);
		},
	);
});
