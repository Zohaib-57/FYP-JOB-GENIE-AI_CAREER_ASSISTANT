import React, { useState } from "react";
import {
	Bot,
	Upload,
	Search,
	Sparkles,
	MapPin,
	Briefcase,
	ExternalLink,
	RefreshCcw,
} from "lucide-react";
import HeroAnimation from "./HeroAnimation";
import { toast } from "sonner";

const JobMatchDetails = ({ job }) => (
	<div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-3">
		<p className="text-sm font-semibold text-cyan-300">
			Resume match: {job.matchScore}/100
		</p>
		{job.matchedSkills?.length > 0 && (
			<p className="mt-1 text-xs text-gray-300">
				Matching skills: {job.matchedSkills.join(", ")}
			</p>
		)}
		{job.matchedKeywords?.length > 0 && (
			<p className="mt-1 text-xs text-gray-400">
				Other matching keywords: {job.matchedKeywords.join(", ")}
			</p>
		)}
		{job.matchReasons?.length > 0 && (
			<p className="mt-1 text-xs text-gray-500">
				{job.matchReasons.join(" · ")}
			</p>
		)}
	</div>
);

const Jobs = () => {
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [jobs, setJobs] = useState([]);
	const [jobTitle, setJobTitle] = useState("");
	const [relatedJobTitles, setRelatedJobTitles] = useState([]);
	const [experienceSummary, setExperienceSummary] = useState("");
	const [skills, setSkills] = useState([]);
	const [keywords, setKeywords] = useState([]);
	const [searchWarnings, setSearchWarnings] = useState([]);
	const [hasSearched, setHasSearched] = useState(false);

	const handleChange = (e) => {
		const f = e.target.files[0];
		if (f && f.size > 5 * 1024 * 1024) {
			setFile(null);
			e.target.value = "";
			toast.error("Resume file must be 5MB or smaller");
			return;
		}
		if (f) setFile(f);
	};

	const handleFindJobs = async () => {
		if (!file) {
			toast.error("Please upload a resume first");
			return;
		}
		setLoading(true);
		setJobs([]);
		setHasSearched(false);
		setSearchWarnings([]);
		try {
			const formData = new FormData();
			formData.append("resume", file);
			const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/find`, {
				method: "POST",
				credentials: "include",
				body: formData,
			});
			let data;
			try {
				data = await res.json();
			} catch {
				throw new Error("The server returned an invalid response. Please try again.");
			}
			if (!res.ok) {
				toast.error(data.message || data.error || "Job search failed");
				return;
			}
			const results = Array.isArray(data.jobs) ? data.jobs : [];
			setJobs(results);
			setJobTitle(data.jobTitle || "");
			setRelatedJobTitles(
				Array.isArray(data.relatedJobTitles) ? data.relatedJobTitles : [],
			);
			setExperienceSummary(data.experienceSummary || "");
			setSkills(Array.isArray(data.skills) ? data.skills : []);
			setKeywords(Array.isArray(data.keywords) ? data.keywords : []);
			setSearchWarnings(
				Array.isArray(data.searchWarnings) ? data.searchWarnings : [],
			);
			setHasSearched(true);
			if (data.searchWarnings?.length > 0) {
				toast.warning("Some role searches were unavailable; partial results are shown.");
			} else if (results.length > 0) {
				toast.success("Job matches are ready.");
			} else {
				toast.info("Search completed, but no matching jobs were found.");
			}
		} catch (error) {
			toast.error(
				error instanceof TypeError
					? "Could not connect to the server. Check that the backend is running, then try again."
					: error.message || "Something went wrong",
			);
		} finally {
			setLoading(false);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleReset = () => {
		setJobs([]);
		setJobTitle("");
		setRelatedJobTitles([]);
		setExperienceSummary("");
		setSkills([]);
		setKeywords([]);
		setSearchWarnings([]);
		setHasSearched(false);
		setFile(null);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div className="page-transition flex flex-col items-center min-h-screen">
			<div className="relative w-full flex flex-col items-center min-h-112.5 pb-10">
				<HeroAnimation />

				<div className="relative z-10 flex items-center gap-2 bg-blue-900/30 border border-blue-500/20 text-blue-400 px-5 py-1.5 rounded-full mt-25 backdrop-blur-sm">
					<Bot className="w-5 h-5" />
					<p className="text-sm font-medium tracking-wide shadow-sm">
						AI POWERED MATCHING
					</p>
				</div>

				<div className="relative z-10 mt-6 text-center px-4">
					<h1 className="text-transparent font-bold bg-clip-text bg-[linear-gradient(90deg,#06b6d4_0%,#9333ea_30%,#9333ea_70%,#06b6d4_100%)] text-5xl mb-3">
						<span className="text-white">Smart</span> Job Hunting
					</h1>
					<p className="text-gray-400 max-w-lg mx-auto">
						Upload your resume to find relevant job listings in Pakistan.
					</p>
				</div>

				{/* Main Content Area: Conditional Rendering */}
				<div className="relative z-10 w-full max-w-5xl px-4 lg:px-8 mt-12 flex justify-center text-white pb-10">
					{loading ? (
						/* Loading State */
						<div className="flex flex-col items-center justify-center p-20 gap-6 text-purple-400 w-full bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
							<svg
								className="animate-spin h-16 w-16"
								viewBox="0 0 24 24"
								fill="none"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8v8H4z"
								/>
							</svg>
							<div className="text-center">
								<h2 className="text-2xl font-bold text-white mb-2">
									Searching for jobs...
								</h2>
								<p className="text-gray-400">
									We are carefully identifying your job profile, then searching
									the main role and related roles.
								</p>
							</div>
						</div>
					) : hasSearched ? (
						/* Jobs Results State */
						<div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
							{/* Header Box */}
							<div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4">
								<div>
									<h2 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
										<Sparkles className="w-5 h-5 text-purple-400" />
										Job search results for:{" "}
										<span className="text-purple-400">{jobTitle}</span>
									</h2>
								</div>
								<button
									onClick={handleReset}
									className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium bg-zinc-800 hover:bg-zinc-700 text-white transition duration-300 whitespace-nowrap shadow-lg"
								>
									<RefreshCcw className="h-4 w-4" /> Search Again
								</button>
							</div>

							<section className="rounded-2xl border border-white/10 bg-white/5 p-6">
								<h3 className="text-lg font-bold text-white">
									What we identified in your resume
								</h3>
								<p className="mt-3 text-sm text-gray-300">
									Primary role:{" "}
									<span className="font-semibold text-cyan-300">{jobTitle}</span>
								</p>
								{experienceSummary && (
									<p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-300">
										Relevant experience: {experienceSummary}
									</p>
								)}
								{relatedJobTitles.length > 0 && (
									<p className="mt-2 text-sm text-gray-300">
										Also searched for: {relatedJobTitles.join(", ")}
									</p>
								)}
								<div className="mt-4">
									<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
										Skills identified
									</p>
									<div className="flex flex-wrap gap-2">
										{skills.map((skill, index) => (
											<span
												key={`${skill}-${index}`}
												className="rounded-md border border-purple-500/30 bg-purple-900/30 px-3 py-1 text-xs text-purple-100"
											>
												{skill}
											</span>
										))}
									</div>
								</div>
								{keywords.length > 0 && (
									<div className="mt-4">
										<p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
											Additional resume keywords
										</p>
										<div className="flex flex-wrap gap-2">
											{keywords.map((keyword, index) => (
												<span
													key={`${keyword}-${index}`}
													className="rounded-md border border-cyan-500/20 bg-cyan-900/20 px-3 py-1 text-xs text-cyan-100"
												>
													{keyword}
												</span>
											))}
										</div>
									</div>
								)}
								<p className="mt-4 text-xs text-gray-500">
									These terms are extracted from resume text and used to search;
									check each listing to confirm it fits your experience.
								</p>
							</section>

							{searchWarnings.map((warning, index) => (
								<p
									key={`${warning}-${index}`}
									className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200"
								>
									{warning}
								</p>
							))}

							<section className="flex flex-col gap-4">
								<div>
									<h3 className="text-xl font-bold text-white">
										Suggested jobs <span className="text-gray-400">({jobs.length})</span>
									</h3>
									<p className="text-sm text-gray-400">
										Up to 20 relevant listings, ranked by overlap with your
										extracted role, skills, and keywords.
									</p>
								</div>
								{jobs.length === 0 ? (
									<p className="rounded-xl border border-white/10 bg-white/5 p-5 text-gray-300">
										No matching jobs were found. Try again later or upload a
										different resume.
									</p>
								) : (
									<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
								{jobs.map((job) => (
									<div
										key={job.id}
										className="border border-white/10 bg-white/5 rounded-2xl p-5 flex flex-col justify-between hover:shadow-[0_0_30px_rgba(147,51,234,0.15)] hover:border-purple-500/30 transition-all duration-300"
									>
										<div className="flex items-start gap-4 mb-4">
											{job.logo ? (
												<img
													src={job.logo}
													alt={job.company}
													className="w-14 h-14 rounded-xl object-contain bg-white p-1"
												/>
											) : (
												<div className="w-14 h-14 rounded-xl bg-purple-900/40 flex items-center justify-center shrink-0">
													<Briefcase className="w-6 h-6 text-purple-400" />
												</div>
											)}
											<div>
												<h3 className="text-white font-bold text-lg leading-tight mb-1">
													{job.title}
												</h3>
												<p className="text-purple-300 text-sm font-medium">
													{job.company}
												</p>
												<JobMatchDetails job={job} />
											</div>
										</div>

										<div className="flex flex-col gap-3 mt-auto">
											<div className="flex flex-wrap items-center gap-3">
												<span className="flex items-center gap-1.5 bg-black/30 border border-white/5 px-2.5 py-1 rounded text-gray-300 text-xs font-medium">
													<MapPin className="w-3.5 h-3.5 text-cyan-400" />{" "}
													{job.location}
												</span>
												<span className="flex items-center gap-1.5 bg-black/30 border border-white/5 px-2.5 py-1 rounded text-gray-300 text-xs font-medium">
													<Briefcase className="w-3.5 h-3.5 text-purple-400" />{" "}
													{job.type}
												</span>
											</div>

											<a
												href={job.applyLink}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center justify-center gap-2 w-full bg-[linear-gradient(to_right,#9333ea,#06b6d4)] py-2.5 rounded-xl text-white font-semibold text-sm hover:scale-[1.02] duration-300 cursor-pointer shadow-lg mt-2"
											>
												Apply Now <ExternalLink className="w-4 h-4" />
											</a>
										</div>
									</div>
								))}
									</div>
								)}
							</section>
						</div>
					) : (
						/* Upload Form State */
						<div className="w-full max-w-xl p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl animate-in fade-in duration-500 shadow-2xl">
							<label className="border-2 border-dashed border-indigo-500/40 rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-400 hover:bg-white/5 transition duration-300 group">
								<Upload
									className="text-gray-400 mb-5 group-hover:text-indigo-400 transition"
									size={50}
								/>
								<p className="text-gray-200 text-xl font-medium">
									{file ? file.name : "Click to upload your resume"}
								</p>
								<p className="text-gray-500 text-sm mt-2">
									PDF or DOCX. Scanned PDFs need OCR/searchable text.
								</p>
								<input
									type="file"
									accept=".pdf,.docx"
									className="hidden"
									onChange={handleChange}
								/>
							</label>

							<button
								onClick={handleFindJobs}
								disabled={loading || !file}
								className="mt-8 w-full py-4 rounded-xl text-white font-bold text-lg bg-[linear-gradient(to_right,#9333ea,#06b6d4)] active:scale-95 cursor-pointer duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] transition"
							>
								Scan Job Market
							</button>
						</div>
					)}
				</div>
			</div>

			<div className="mt-6 w-full bg-zinc-950/50 py-16 flex flex-col items-center border-t border-white/5">
				<h2 className="text-center text-white font-bold text-3xl mb-10">
					How Our AI Agent Works
				</h2>

				<div className="flex flex-wrap justify-center gap-6 px-4 max-w-6xl">
					<div className="w-72 h-52 rounded-2xl px-6 border border-white/10 bg-white/5 flex flex-col justify-center items-center gap-4 hover:-translate-y-2 duration-300 backdrop-blur-sm">
						<div className="bg-[linear-gradient(to_right,#9333ea,#06b6d4)] text-white h-12 w-12 rounded-xl flex justify-center items-center shadow-lg">
							<Bot className="h-6 w-6" />
						</div>
						<h3 className="font-semibold text-white text-lg">Resume Parsing</h3>
						<p className="text-gray-400 text-center text-sm">
							AI securely extracts your skills, professional experience, and
							target roles from your uploaded resume.
						</p>
					</div>
					<div className="w-72 h-52 rounded-2xl px-6 border border-white/10 bg-white/5 flex flex-col justify-center items-center gap-4 hover:-translate-y-2 duration-300 backdrop-blur-sm">
						<div className="bg-[linear-gradient(to_right,#9333ea,#06b6d4)] text-white h-12 w-12 rounded-xl flex justify-center items-center shadow-lg">
							<Search className="h-6 w-6" />
						</div>
						<h3 className="font-semibold text-white text-lg">
							RapidAPI Job Search
						</h3>
						<p className="text-gray-400 text-center text-sm">
							Searches JSearch for Pakistan job listings using your resume's
							suggested role and skills.
						</p>
					</div>
					<div className="w-72 h-52 rounded-2xl px-6 border border-white/10 bg-white/5 flex flex-col justify-center items-center gap-4 hover:-translate-y-2 duration-300 backdrop-blur-sm">
						<div className="bg-[linear-gradient(to_right,#9333ea,#06b6d4)] text-white h-12 w-12 rounded-xl flex justify-center items-center shadow-lg">
							<Sparkles className="h-6 w-6" />
						</div>
						<h3 className="font-semibold text-white text-lg">Relevant Search</h3>
						<p className="text-gray-400 text-center text-sm">
							Uses your most relevant job title and skills to build a focused
							job search.
						</p>
					</div>
				</div>
			</div>

		</div>
	);
};

export default Jobs;
