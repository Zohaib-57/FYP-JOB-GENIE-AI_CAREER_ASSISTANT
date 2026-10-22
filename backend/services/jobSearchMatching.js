const normalize = (value) =>
	String(value || "")
		.toLowerCase()
		.replace(/[^a-z0-9+#]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();

const hasTerm = (text, term) => {
	const normalizedText = ` ${normalize(text)} `;
	const normalizedTerm = normalize(term);
	return Boolean(normalizedTerm) && normalizedText.includes(` ${normalizedTerm} `);
};

const skillAliases = {
	javascript: ["javascript", "js", "ecmascript"],
	typescript: ["typescript", "ts"],
	"react.js": ["react", "react js", "reactjs"],
	"node.js": ["node", "node js", "nodejs"],
	"express.js": ["express", "express js", "expressjs"],
	"next.js": ["next", "next js", "nextjs"],
	"vue.js": ["vue", "vue js", "vuejs"],
	"c++": ["c++", "cpp"],
	"c#": ["c#", "c sharp"],
	postgresql: ["postgresql", "postgres"],
	mongodb: ["mongodb", "mongo db"],
};

const aliasesFor = (term) => skillAliases[term.toLowerCase()] || [term];

export const rankJobSearchResults = (jobs, profile, limit = 20) => {
	const skills = [...new Set(profile.skills.map((term) => term.trim()).filter(Boolean))];
	const keywords = [
		...new Set(
			profile.keywords
				.map((term) => term.trim())
				.filter(
					(term) =>
						term &&
						!skills.some((skill) => normalize(skill) === normalize(term)),
				),
		),
	];
	const roles = [
		profile.jobTitle,
		...profile.relatedJobTitles,
	].filter(Boolean);

	return jobs
		.map((job) => {
			const title = job.title || "";
			const tags = Array.isArray(job.tags) ? job.tags.join(" ") : "";
			const text = `${title} ${tags} ${job.description || ""}`;
			let score = 0;
			const matchReasons = [];

			if (hasTerm(title, profile.jobTitle)) {
				score += 30;
				matchReasons.push("Job title matches your primary target role");
			} else if (hasTerm(text, profile.jobTitle)) {
				score += 10;
				matchReasons.push("Description mentions your primary target role");
			} else {
				const matchedRelatedRole = profile.relatedJobTitles.find((role) =>
					hasTerm(title, role),
				);
				if (matchedRelatedRole) {
					score += 18;
					matchReasons.push(`Title matches related role: ${matchedRelatedRole}`);
				}
			}

			const matchedSkills = skills.filter((skill) =>
				aliasesFor(skill).some((alias) => hasTerm(text, alias)),
			);
			if (matchedSkills.length > 0) {
				score += Math.round(
					(matchedSkills.length / Math.max(Math.min(skills.length, 6), 1)) * 45,
				);
				matchReasons.push(
					`${matchedSkills.length} resume skill${matchedSkills.length === 1 ? "" : "s"} found in the listing`,
				);
			}

			const matchedKeywords = keywords.filter((keyword) =>
				aliasesFor(keyword).some((alias) => hasTerm(text, alias)),
			);
			if (matchedKeywords.length > 0) {
				score += Math.min(25, matchedKeywords.length * 5);
				matchReasons.push(
					`${matchedKeywords.length} additional resume keyword${matchedKeywords.length === 1 ? "" : "s"} matched`,
				);
			}

			if (
				roles.some((role) => hasTerm(title, role)) &&
				matchedSkills.length > 0
			) {
				score += 10;
				matchReasons.push("Role and skills both align");
			}

			return {
				...job,
				matchScore: Math.min(100, score),
				matchedSkills,
				matchedKeywords,
				matchReasons,
			};
		})
		.filter((job) => job.matchScore >= 15)
		.sort((first, second) => second.matchScore - first.matchScore)
		.slice(0, limit);
};
