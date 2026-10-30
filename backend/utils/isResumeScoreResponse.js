const sectionKeys = [
	"atsCompatibility",
	"keywords",
	"experience",
	"education",
	"formatting",
];

const isScore = (score) =>
	Number.isInteger(score) && score >= 0 && score <= 100;

const isConciseText = (text, maximumWords) =>
	typeof text === "string" &&
	text.trim().length > 0 &&
	text.trim().split(/\s+/).length <= maximumWords;

const isResumeScoreResponse = (value) =>
	value?.documentType === "resume" &&
	isScore(value.overallScore) &&
	sectionKeys.every(
		(key) =>
			isScore(value.sections?.[key]?.score) &&
			isConciseText(value.sections[key].feedback, 20),
	) &&
	Array.isArray(value.improvements) &&
	value.improvements.length <= 4 &&
	value.improvements.every((item) => isConciseText(item, 18)) &&
	Array.isArray(value.strengths) &&
	value.strengths.length <= 3 &&
	value.strengths.every((item) => isConciseText(item, 10));

export default isResumeScoreResponse;
