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
	<div className="mt-3 rounded-xl border border-violet-300/15 bg-violet-400/[0.05] p-3">
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
		<div className="page-transition flex min-h-screen flex-col items-center bg-[#0b0e16]">
			<div className="relative flex w-full flex-col items-center pb-10">
				<div className="absolute inset-0"><HeroAnimation /></div>

				<div className="relative z-10 mt-20 flex items-center gap-2 rounded-full border border-violet-300/15 bg-violet-400/[0.08] px-4 py-1.5 text-violet-200 backdrop-blur-sm md:mt-24">
					<Bot className="w-5 h-5" />
					<p className="text-sm font-medium tracking-wide shadow-sm">
						AI POWERED MATCHING
					</p>
				</div>

				<div className="relative z-10 mt-5 px-4 text-center">
					<h1 className="mb-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
						<span className="text-white">Smart</span> Job Hunting
					</h1>
					<p className="mx-auto max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
						Upload your resume to find relevant job listings in Pakistan.
					</p>
				</div>

				{/* Main Content Area: Conditional Rendering */}
				<div className="relative z-10 mt-10 flex w-full max-w-6xl justify-center px-4 pb-10 text-white lg:px-8">
					{loading ? (
						/* Loading State */
						<div className="flex w-full flex-col items-center justify-center gap-6 rounded-2xl border border-[#30384b] bg-[#111827] p-8 text-violet-300 shadow-xl shadow-black/20 backdrop-blur-md sm:p-14">
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
							<div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#30384b] bg-[#111827] p-5 shadow-xl shadow-black/20 backdrop-blur-md sm:p-6 md:flex-row md:items-center">
								<div>
									<h2 className="text-white font-bold text-xl mb-2 flex items-center gap-2">
										<Sparkles className="w-5 h-5 text-purple-400" />
										Job search results for:{" "}
										<span className="text-purple-400">{jobTitle}</span>
									</h2>
								</div>
								<button
									onClick={handleReset}
									className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#30384b] bg-[#1b2131] px-4 py-2.5 font-medium text-gray-200 shadow-lg transition duration-200 hover:bg-[#232b3d] md:w-auto md:px-5"
								>
									<RefreshCcw className="h-4 w-4" /> Search Again
								</button>
							</div>

							<section className="rounded-2xl border border-[#30384b] bg-[#111827] p-5 sm:p-6">
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
												className="rounded-lg border border-violet-300/15 bg-violet-400/[0.07] px-3 py-1 text-xs text-violet-100"
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
													className="rounded-lg border border-violet-300/15 bg-violet-400/[0.04] px-3 py-1 text-xs text-violet-100"
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
									className="rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-amber-200"
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
									<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
								{jobs.map((job) => (
									<div
										key={job.id}
										className="flex flex-col justify-between rounded-2xl border border-[#30384b] bg-[#111827] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-violet-300/25 hover:bg-[#1b2131]"
									>
										<div className="flex items-start gap-4 mb-4">
											{job.logo ? (
												<img
													src={job.logo}
													alt={job.company}
													className="h-14 w-14 shrink-0 rounded-xl bg-white p-1 object-contain"
												/>
											) : (
												<div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.08]">
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
						<div className="w-full max-w-2xl rounded-3xl border border-[#30384b] bg-[#111827] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl animate-in fade-in duration-500 sm:p-8">
						<label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-violet-300/30 bg-[#0b0e16]/60 p-8 text-center transition duration-200 hover:border-violet-300/60 hover:bg-violet-400/[0.04] sm:p-12">
								<Upload
									className="mb-5 text-gray-400 transition group-hover:text-violet-300"
									size={50}
								/>
								<p className="text-gray-200 text-xl font-medium">
									{file ? file.name : "Click to upload your resume"}
								</p>
								<p className="text-gray-500 text-sm mt-2">
									PDF or DOCX. English scanned PDFs are processed with OCR automatically.
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
								className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#7367f5] py-3.5 text-base font-semibold text-white transition duration-200 hover:bg-[#8176ff] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 sm:mt-8 sm:py-4 sm:text-lg"
							>
								Scan Job Market
							</button>
						</div>
					)}
				</div>
			</div>

			<div className="mt-6 flex w-full flex-col items-center border-t border-[#30384b]/70 bg-[#111827]/60 py-14">
				<h2 className="mb-10 px-4 text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
					How Our AI Agent Works
				</h2>

				<div className="grid w-full max-w-6xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-3">
					<div className="flex min-h-52 flex-col items-center justify-center gap-4 rounded-2xl border border-[#30384b] bg-[#111827] px-6 transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#1b2131]">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.1] text-violet-200">
							<Bot className="h-6 w-6" />
						</div>
						<h3 className="font-semibold text-white text-lg">Resume Parsing</h3>
						<p className="text-gray-400 text-center text-sm">
							AI securely extracts your skills, professional experience, and
							target roles from your uploaded resume.
						</p>
					</div>
					<div className="flex min-h-52 flex-col items-center justify-center gap-4 rounded-2xl border border-[#30384b] bg-[#111827] px-6 transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#1b2131]">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.1] text-violet-200">
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
					<div className="flex min-h-52 flex-col items-center justify-center gap-4 rounded-2xl border border-[#30384b] bg-[#111827] px-6 transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#1b2131]">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.1] text-violet-200">
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
