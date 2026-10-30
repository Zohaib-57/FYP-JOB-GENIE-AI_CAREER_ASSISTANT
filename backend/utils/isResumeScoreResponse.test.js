import { describe, it } from "node:test";
import assert from "node:assert/strict";
import isResumeScoreResponse from "./isResumeScoreResponse.js";

const validResponse = {
	documentType: "resume",
	overallScore: 82,
	sections: {
		atsCompatibility: { score: 80, feedback: "Clear headings." },
		keywords: { score: 75, feedback: "Add role-specific terms." },
		experience: { score: 85, feedback: "Strong evidence of impact." },
		education: { score: 90, feedback: "Education is easy to find." },
		formatting: { score: 80, feedback: "Use consistent spacing." },
	},
	improvements: ["Add a relevant keyword."],
	strengths: ["Experience is clearly presented."],
};

describe("isResumeScoreResponse", () => {
	it("accepts a complete resume score with integer scores in range", () => {
		assert.equal(isResumeScoreResponse(validResponse), true);
	});

	it("rejects documents that were not classified as resumes", () => {
		assert.equal(
			isResumeScoreResponse({ ...validResponse, documentType: "other" }),
			false,
		);
	});

	it("rejects scores outside the allowed range", () => {
		assert.equal(
			isResumeScoreResponse({
				...validResponse,
				overallScore: 101,
			}),
			false,
		);
	});

	it("rejects scores when required section feedback is missing", () => {
		assert.equal(
			isResumeScoreResponse({
				...validResponse,
				sections: {
					...validResponse.sections,
					experience: { score: 85, feedback: "" },
				},
			}),
			false,
		);
	});

	it("rejects overly long section feedback", () => {
		assert.equal(
			isResumeScoreResponse({
				...validResponse,
				sections: {
					...validResponse.sections,
					experience: {
						score: 85,
						feedback:
							"This feedback has far too many words to remain concise and useful in the generated report, so readers must scan multiple lines before finding an actionable resume improvement.",
					},
				},
			}),
			false,
		);
	});

	it("rejects more improvement suggestions than the report can display", () => {
		assert.equal(
			isResumeScoreResponse({
				...validResponse,
				improvements: [
					"First suggestion.",
					"Second suggestion.",
					"Third suggestion.",
					"Fourth suggestion.",
					"Fifth suggestion.",
				],
			}),
			false,
		);
	});
});
