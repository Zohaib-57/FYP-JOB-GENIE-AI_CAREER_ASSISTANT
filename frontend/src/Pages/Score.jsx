import React, { useState } from "react";
import {
	Upload,
	Target,
	TrendingUp,
	Award,
	BarChart3,
	CheckCircle,
	AlertCircle,
	RefreshCcw,
} from "lucide-react";
import HeroAnimation from "./HeroAnimation";
import { toast } from "sonner";

const Score = () => {
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [scoreData, setScoreData] = useState(null);
	const sectionEntries = Object.entries(scoreData?.sections || {})
		.filter(([, section]) => Number.isFinite(section?.score))
		.sort(([, first], [, second]) => first.score - second.score);
	const prioritySection = sectionEntries[0];
	const improvementItems = Array.isArray(scoreData?.improvements)
		? scoreData.improvements
		: [];
	const strengthItems = Array.isArray(scoreData?.strengths)
		? scoreData.strengths
		: [];
	const overallScore = Number.isFinite(scoreData?.overallScore)
		? scoreData.overallScore
		: 0;

	const sectionLabel = (key) =>
		({
			atsCompatibility: "ATS compatibility",
			keywords: "Role keywords",
			experience: "Experience impact",
			education: "Education",
			formatting: "Formatting & structure",
		})[key] || key.replace(/([A-Z])/g, " $1");

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

	const handleScore = async () => {
		if (!file) {
			toast.error("Please upload a resume first");
			return;
		}
		setLoading(true);
		setScoreData(null);
		try {
			const formData = new FormData();
			formData.append("resume", file);
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/api/resume/score`,
				{
					method: "POST",
					credentials: "include",
					body: formData,
				},
			);
			const data = await res.json();
			if (!res.ok) {
				toast.error(data.message || data.error || "Scoring failed");
				return;
			}
			setScoreData(data.scoreData);
			toast.success("Resume analysis complete.");
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		} finally {
			setLoading(false);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleReset = () => {
		setScoreData(null);
		setFile(null);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const CircularScore = ({ score }) => {
		const radius = 70;
		const circumference = 2 * Math.PI * radius;
		const offset = circumference - (score / 100) * circumference;
		const color = score >= 75 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";

		return (
			<div className="flex flex-col items-center gap-2">
				<svg width="180" height="180" viewBox="0 0 180 180">
					<circle
						cx="90"
						cy="90"
						r={radius}
						fill="none"
						stroke="#27272a"
						strokeWidth="12"
					/>
					<circle
						cx="90"
						cy="90"
						r={radius}
						fill="none"
						stroke={color}
						strokeWidth="12"
						strokeDasharray={circumference}
						strokeDashoffset={offset}
						strokeLinecap="round"
						transform="rotate(-90 90 90)"
						style={{ transition: "stroke-dashoffset 1s ease" }}
					/>
					<text
						x="90"
						y="98"
						textAnchor="middle"
						fill="white"
						fontSize="40"
						fontWeight="bold"
					>
						{score}
					</text>
					<text x="90" y="125" textAnchor="middle" fill="#9ca3af" fontSize="14">
						out of 100
					</text>
				</svg>
				<p className="text-gray-400 text-sm font-medium mt-2">
					Overall ATS compatibility
				</p>
			</div>
		);
	};

	return (
		<div className="min-h-screen flex flex-col items-center bg-[#0b0e16]">
			{/* Hero Section with Animation */}
			<div className="relative flex w-full flex-col items-center pb-10">
				<div className="absolute inset-0"><HeroAnimation /></div>

				<div className="relative z-10 mb-8 flex flex-col items-center justify-center px-4 pt-20 text-center md:pt-24">
					<h1 className="py-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
						<span className="text-white">Resume</span> Scoring
					</h1>
					<p className="text-gray-400 py-2 max-w-xl">
						Upload your resume and get an AI-powered ATS analysis with
						actionable feedback to improve your chances.
					</p>
				</div>

				{/* Main Content Area: Conditional Rendering (Upload -> Loading -> Result) */}
				<div className="relative z-10 mt-2 flex w-full max-w-6xl justify-center px-4 text-white lg:px-8">
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
									Analyzing ATS Compatibility...
								</h2>
								<p className="text-gray-400">
									Our AI is reading your resume against industry standards.
								</p>
							</div>
						</div>
					) : scoreData ? (
						/* Score Results State */
						<div className="w-full flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
							<div className="flex w-full justify-end">
								<button
									onClick={handleReset}
									className="flex items-center gap-2 rounded-xl border border-[#30384b] bg-[#1b2131] px-4 py-2.5 font-medium text-gray-200 transition duration-200 hover:bg-[#232b3d] sm:px-5"
								>
									<RefreshCcw className="h-4 w-4" /> Score Another
								</button>
							</div>

							<div className="w-full overflow-hidden rounded-3xl border border-[#30384b] bg-[#111827] shadow-2xl shadow-black/20 backdrop-blur-md">
								<div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] bg-gradient-to-r from-violet-500/[0.12] via-transparent to-cyan-400/[0.06] px-5 py-4 sm:px-7">
									<div>
										<p className="text-[11px] font-bold uppercase tracking-[0.2em] text-violet-200">
											Resume insights
										</p>
										<h2 className="mt-1 text-lg font-semibold text-white sm:text-xl">
											Your ATS readiness report
										</h2>
									</div>
									<span className="rounded-full border border-white/10 bg-black/10 px-3 py-1.5 text-xs font-medium text-gray-300">
										5 review areas
									</span>
								</div>
								<div className="p-4 sm:p-7">
								<div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
									<div className="flex flex-col items-center justify-center rounded-2xl border border-violet-300/10 bg-gradient-to-b from-violet-400/[0.07] to-[#0b0e16] p-4 sm:p-5">
										<CircularScore score={overallScore} />
										<p className={`mt-1 text-sm font-semibold ${overallScore >= 75 ? "text-green-300" : overallScore >= 50 ? "text-amber-300" : "text-red-300"}`}>
											{overallScore >= 75 ? "Strong foundation" : overallScore >= 50 ? "Room to improve" : "Needs attention"}
										</p>
										<p className="mt-2 max-w-xs text-center text-xs leading-relaxed text-gray-400">
											An AI-generated review guide, not a guarantee of how a specific employer’s ATS will rank your resume.
										</p>
									</div>

									<div className="flex flex-col justify-center gap-4 rounded-2xl border border-[#30384b] bg-[#0b0e16]/65 p-5 sm:p-6">
										<div>
											<p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Your next best step</p>
											<h2 className="mt-2 text-xl font-bold text-white">
												{improvementItems[0]
													? "Start with this focused action"
													: prioritySection
													? `Focus on ${sectionLabel(prioritySection[0]).toLowerCase()}`
													: "Review your resume improvements"}
											</h2>
											<p className="mt-2 text-sm leading-relaxed text-gray-300">
												{improvementItems[0] ||
													prioritySection?.[1]?.feedback ||
													"Use the prioritized suggestions below to strengthen your resume."}
											</p>
										</div>
									</div>
								</div>

								<section className="mt-7">
									<div className="mb-4 flex flex-wrap items-end justify-between gap-2">
										<div>
											<h2 className="text-lg font-bold text-white">Score breakdown</h2>
											<p className="mt-1 text-xs text-gray-400">Lowest scores are shown first, so you can focus where it matters.</p>
										</div>
										<span className="text-xs text-gray-500">Each area is scored out of 100</span>
									</div>
									<div className="grid gap-3 md:grid-cols-2">
										{sectionEntries.map(([key, section], index) => {
											const score = Math.max(0, Math.min(100, section.score));
											const tone = score >= 75
												? { text: "text-green-300", bar: "bg-green-400", border: "border-green-400/15", status: "On track" }
												: score >= 50
													? { text: "text-amber-300", bar: "bg-amber-400", border: "border-amber-400/15", status: "Could improve" }
													: { text: "text-red-300", bar: "bg-red-400", border: "border-red-400/15", status: "Priority" };
											return (
												<article
													key={key}
													className={`rounded-xl border ${tone.border} bg-[#0b0e16]/75 p-4 ${index === 0 ? "ring-1 ring-amber-400/15" : ""}`}
												>
													<div className="flex items-start justify-between gap-3">
														<div>
															<h3 className="font-semibold text-white">{sectionLabel(key)}</h3>
															<p className={`mt-1 text-[11px] font-semibold uppercase tracking-wider ${tone.text}`}>{tone.status}</p>
														</div>
														<p className={`shrink-0 text-lg font-bold tabular-nums ${tone.text}`}>{score}<span className="text-xs font-medium text-gray-500">/100</span></p>
													</div>
													<div
														className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#232b3d]"
														role="progressbar"
														aria-label={`${sectionLabel(key)} score`}
														aria-valuemin={0}
														aria-valuemax={100}
														aria-valuenow={score}
													>
														<div className={`h-full rounded-full ${tone.bar}`} style={{ width: `${score}%`, transition: "width 1s ease-out" }} />
													</div>
													<p className="mt-3 text-sm leading-relaxed text-gray-300">
														{section.feedback || "No detailed feedback was provided for this area."}
													</p>
												</article>
											);
										})}
									</div>
								</section>

								<div className="mt-6 grid gap-4 lg:grid-cols-2">
									<section className="rounded-2xl border border-green-400/15 bg-green-400/[0.035] p-5">
										<h3 className="flex items-center gap-2 font-semibold text-green-300">
											<CheckCircle className="h-5 w-5" /> What’s working
										</h3>
										{strengthItems.length > 0 ? (
											<ul className="mt-4 flex flex-col gap-3">
												{strengthItems.map((strength, index) => (
													<li key={`${strength}-${index}`} className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-300">
														<span className="mt-0.5 text-green-300">✓</span><span>{strength}</span>
													</li>
												))}
											</ul>
										) : (
											<p className="mt-3 text-sm text-gray-400">No strengths were returned for this analysis.</p>
										)}
									</section>
									<section className="rounded-2xl border border-amber-400/15 bg-amber-400/[0.035] p-5">
										<h3 className="flex items-center gap-2 font-semibold text-amber-300">
											<AlertCircle className="h-5 w-5" /> Improvement plan
										</h3>
										{improvementItems.length > 0 ? (
											<ol className="mt-4 flex flex-col gap-3">
												{improvementItems.map((improvement, index) => (
													<li key={`${improvement}-${index}`} className="flex items-start gap-3 text-sm leading-relaxed text-gray-300">
														<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-300/10 text-[11px] font-bold text-amber-200">{index + 1}</span>
														<span>{improvement}</span>
													</li>
												))}
											</ol>
										) : (
											<p className="mt-3 text-sm text-gray-400">No improvement suggestions were returned for this analysis.</p>
										)}
									</section>
								</div>
								</div>
							</div>
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
									PDF or DOCX (max 5 MB). English scanned PDFs use OCR automatically.
								</p>
								<input
									type="file"
									accept=".pdf,.docx"
									className="hidden"
									onChange={handleChange}
								/>
							</label>

							<button
								onClick={handleScore}
								disabled={loading || !file}
								className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#7367f5] py-3.5 text-base font-semibold text-white transition duration-200 hover:bg-[#8176ff] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 sm:mt-8 sm:py-4 sm:text-lg"
							>
								Analyze Resume Score
							</button>
						</div>
					)}
				</div>
			</div>

			{/* What Our AI Analyzes Area */}
			<div className="mt-16 flex w-full flex-col items-center border-t border-[#30384b]/70 bg-[#111827]/60 py-14">
				<h2 className="mb-10 px-4 text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
					What Our AI Analyzes
				</h2>
				<div className="grid w-full max-w-6xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
					<div className="flex min-h-52 flex-col items-center justify-center gap-4 rounded-2xl border border-[#30384b] bg-[#111827] px-5 transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#1b2131]">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.1] text-violet-200">
							<Target className="h-6 w-6" />
						</div>
						<h3 className="font-semibold text-white text-lg">
							ATS Compatibility
						</h3>
						<p className="text-gray-400 text-center text-sm">
							Checks if your resume structurally passes standard tracking
							systems.
						</p>
					</div>
					<div className="flex min-h-52 flex-col items-center justify-center gap-4 rounded-2xl border border-[#30384b] bg-[#111827] px-5 transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#1b2131]">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.1] text-violet-200">
							<TrendingUp className="h-6 w-6" />
						</div>
						<h3 className="font-semibold text-white text-lg">
							Keyword Mapping
						</h3>
						<p className="text-gray-400 text-center text-sm">
							Matches your content against industry-relevant technical keywords.
						</p>
					</div>
					<div className="flex min-h-52 flex-col items-center justify-center gap-4 rounded-2xl border border-[#30384b] bg-[#111827] px-5 transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#1b2131]">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.1] text-violet-200">
							<Award className="h-6 w-6" />
						</div>
						<h3 className="font-semibold text-white text-lg">Impact Scoring</h3>
						<p className="text-gray-400 text-center text-sm">
							Evaluates the strength of your action verbs and business metrics.
						</p>
					</div>
					<div className="flex min-h-52 flex-col items-center justify-center gap-4 rounded-2xl border border-[#30384b] bg-[#111827] px-5 transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#1b2131]">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.1] text-violet-200">
							<BarChart3 className="h-6 w-6" />
						</div>
						<h3 className="font-semibold text-white text-lg">
							Format Consistency
						</h3>
						<p className="text-gray-400 text-center text-sm">
							Reviews structural lengths, formatting traps, and section balance.
						</p>
					</div>
				</div>
			</div>

		</div>
	);
};

export default Score;
