import express from "express";
import upload from "../middleware/upload.js";
import aiRateLimit from "../middleware/aiRateLimit.js";
import auth from "../middleware/auth.js";
import extractResumeText from "../utils/extractResumeText.js";
import { generateAIJSON } from "../services/aiProvider.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Resolve .env path explicitly (ES Module safe)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ✅ Correct CommonJS import for pdf-parse in ES Modules
const router = express.Router();

// ================= GENERATE RESUME =================
router.post("/generate", auth, aiRateLimit, async (req, res) => {
	try {
		const {
			name,
			email,
			phone,
			address,
			zipCode,
			linkedin,
			github,
			socialLink,
			jobTitle,
			highSchoolInfo,
			collegeInfo,
			experiences,
			extraSkills,
			languages,
			customSections,
		} = req.body;

		if (!name || !email || !jobTitle) {
			return res
				.status(400)
				.json({ message: "Name, email, and job title are required" });
		}

		// Format experiences arrays into clean text for AI injection
		let experienceText = "Not provided";
		if (experiences && Array.isArray(experiences) && experiences.length > 0) {
			experienceText = experiences
				.map(
					(exp, i) =>
						`ROLE ${i + 1}: ${exp.title || "Unknown"} at ${exp.company || "Unknown"} (${exp.duration || "Unknown Duration"})\nRaw Responsibilities: ${exp.responsibilities || "N/A"}`,
				)
				.join("\n\n");
		}

		const prompt = `You are a strict JSON data-parsing resume builder. 
CRITICAL RULE: DO NOT invent, hallucinate, or fabricate ANY details. Do not add random skills, languages, or certifications that were not explicitly provided in the Prompt!

Provided Candidate Information:
Name: ${name}
Email: ${email}
Phone: ${phone || ""}
Address: ${address || ""} ${zipCode ? `, ${zipCode}` : ""}
LinkedIn: ${linkedin || ""}
GitHub: ${github || ""}
Portfolio/Links: ${socialLink || ""}
Job Title: ${jobTitle}
High School: ${highSchoolInfo ? `${highSchoolInfo.name}, ${highSchoolInfo.percentage}, ${highSchoolInfo.years}` : ""}
College: ${collegeInfo ? `${collegeInfo.name}, ${collegeInfo.percentage}, ${collegeInfo.years}` : ""}
Extra Skills: ${extraSkills || ""}
Languages: ${languages || ""}
Additional Resume Sections (user-provided; do not invent details):
${JSON.stringify(Array.isArray(customSections) ? customSections : [])}

WORK EXPERIENCE (Strictly map these):
${experienceText}

INSTRUCTIONS: 
You must return a valid JSON object. 
Fill the JSON exact layout parameters entirely with the "Provided Candidate Information". 
Do NOT use ANY placeholder names! If a field is empty, return an empty array [] or empty string "".
For "summary", write a concise summary tailored to ${jobTitle}, using only supported information. Do not claim experience or skills unless provided. If there is little information, write a short objective rather than making assumptions.
For "experience", rewrite the "Raw Responsibilities" into clear, professional bullet points for "points". Preserve all factual claims and numbers; never invent metrics. Maintain the Company and Title exactly as provided. If no work experience was provided, return [].
For "customSections", preserve every supplied section heading and its information. Improve clarity and spelling without adding claims. Return each as { "title": "", "items": [] }, splitting the provided content into concise entries while preserving its meaning. If no custom sections were provided, return [].
For "skills", split the "Extra Skills" comma-separated text into an array of strings. If empty, return [].
For "languages", split the comma-separated text into an array. If empty, return [].
For "certifications", return an empty array [] unless certifications were explicitly mentioned in Extra Skills.

OUTPUT FORMAT SCHEMA (Return ONLY JSON matching this exact blank structure):
{
  "name": "",
  "email": "",
  "phone": "",
  "address": "",
  "zipCode": "",
  "linkedin": "",
  "github": "",
  "portfolio": "",
  "jobTitle": "",
  "summary": "",
  "experience": [
    {
      "title": "",
      "company": "",
      "duration": "",
      "points": []
    }
  ],
  "education": [
    {
      "degree": "",
      "institution": "",
      "year": "",
      "percentage": ""
    }
  ],
  "skills": [],
  "languages": [],
  "certifications": [],
  "customSections": [
    {
      "title": "",
      "items": []
    }
  ]
}`;

		const resume = await generateAIJSON(
			prompt,
			(value) =>
				Boolean(value.summary) &&
				Array.isArray(value.skills) &&
				(value.customSections === undefined ||
					(Array.isArray(value.customSections) &&
						value.customSections.every(
							(section) =>
								section &&
								typeof section.title === "string" &&
								Array.isArray(section.items) &&
								section.items.every((item) => typeof item === "string"),
						))),
		);

		const preservedCustomSections = Array.isArray(customSections)
			? customSections
					.filter(
						(section) =>
							section &&
							typeof section.title === "string" &&
							typeof section.content === "string" &&
							section.title.trim() &&
							section.content.trim(),
					)
					.map((section) => ({
						title: section.title.trim(),
						items: section.content
							.split(/\r?\n/)
							.map((item) => item.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "").trim())
							.filter(Boolean),
					}))
			: [];

		res.json({
			success: true,
			resume: { ...resume, customSections: preservedCustomSections },
			message: "Resume generated successfully",
		});
	} catch (error) {
		console.error("GENERATE ERROR:", error.name);
		const status =
			error.name === "AIProviderError"
				? error.status === 429
					? 429
					: 503
				: 500;
		res.status(status).json({
			message:
				error.name === "AIProviderError"
					? "Configured AI providers are unavailable. Check provider settings and try again."
					: "Failed to generate resume",
		});
	}
});

// ================= SCORE RESUME =================
router.post(
	"/score",
	auth,
	aiRateLimit,
	upload.single("resume"),
	async (req, res) => {
		try {
			if (!req.file) {
				return res.status(400).json({ message: "No resume file uploaded" });
			}

			if (!req.file.buffer || req.file.buffer.length < 100) {
				return res.status(400).json({ message: "Invalid or empty PDF file" });
			}

			let resumeText;
			try {
				resumeText = await extractResumeText(req.file);
			} catch (parseError) {
				console.error("RESUME PARSE ERROR:", parseError.name);
				return res.status(400).json({
					message:
						"Could not read the resume. Upload a valid text-based PDF or DOCX file.",
				});
			}

			if (!resumeText || resumeText.trim().length < 50) {
				return res.status(400).json({
					message: "Could not extract text from resume. Try a different file.",
				});
			}

			if (resumeText.length > 50000) {
				return res
					.status(413)
					.json({ message: "Resume text exceeds the 50,000-character limit." });
			}

			const prompt = `You are an expert resume and ATS-readiness coach. Review only the information present in the resume. Never claim you know how a specific employer's ATS works and do not invent missing resume content.

Resume Text:
${resumeText}

Score the resume as a practical estimate, not a guarantee of interview or ATS outcomes. For every section feedback, state what you observed in the resume, why it matters to a recruiter or parser, and the most useful concrete change. If you identify a missing item, say it is not evident in the provided text rather than asserting it does not exist. Do not recommend adding skills, numbers, qualifications, or experience unless they are truthful for this candidate.

Prioritize improvements by impact: first address structural/parser risks and the weakest sections, then suggest precise edits. Make suggestions actionable (for example, explain what kind of keyword to mirror from a target job description, where to place it, or how to clarify an achievement). For experience feedback, explain how to show action, scope, tools, and outcomes without fabricating metrics. Keep feedback concise and specific to this resume.

Return ONLY a valid JSON object with this exact structure. Do not include markdown, explanations, or extra text:
{
  "overallScore": 75,
  "sections": {
    "atsCompatibility": { "score": 80, "feedback": "What was observed, why it matters, and a concrete fix." },
    "keywords": { "score": 70, "feedback": "What was observed, why it matters, and a concrete fix." },
    "experience": { "score": 75, "feedback": "What was observed, why it matters, and a concrete fix." },
    "education": { "score": 90, "feedback": "What was observed, why it matters, and a concrete fix." },
    "formatting": { "score": 65, "feedback": "What was observed, why it matters, and a concrete fix." }
  },
  "improvements": [
    "Highest-impact action first, including what to change and how",
    "Next most useful action, with a specific place or example"
  ],
  "strengths": [
    "Key strength 1",
    "Key strength 2",
    "Key strength 3"
  ]
}

All scores must be integers between 0-100.`;

			const scoreData = await generateAIJSON(
				prompt,
				(value) => {
					const sectionKeys = [
						"atsCompatibility",
						"keywords",
						"experience",
						"education",
						"formatting",
					];
					return (
						Number.isInteger(value.overallScore) &&
						value.overallScore >= 0 &&
						value.overallScore <= 100 &&
						sectionKeys.every(
							(key) =>
								Number.isInteger(value.sections?.[key]?.score) &&
								value.sections[key].score >= 0 &&
								value.sections[key].score <= 100 &&
								typeof value.sections[key].feedback === "string" &&
								value.sections[key].feedback.trim().length > 0,
						) &&
						Array.isArray(value.improvements) &&
						value.improvements.every((item) => typeof item === "string") &&
						Array.isArray(value.strengths) &&
						value.strengths.every((item) => typeof item === "string")
					);
				},
			);

			res.json({
				success: true,
				scoreData,
				message: "Resume analysis completed",
			});
		} catch (error) {
			console.error("SCORE ERROR:", error.name);
			const status =
				error.name === "AIProviderError"
					? error.status === 429
						? 429
						: 503
					: 500;
			res.status(status).json({
				message:
					error.name === "AIProviderError"
						? "Configured AI providers are unavailable. Check provider settings and try again."
						: "Failed to analyze resume",
			});
		}
	},
);

export default router;
