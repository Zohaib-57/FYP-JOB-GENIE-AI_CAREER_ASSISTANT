import React, { useState, useRef } from "react";
import {
	FileText,
	Palette,
	Wand2,
	Download,
	PanelLeft,
	RefreshCcw,
	Mail,
	Phone,
	MapPin,
	Link,
	Code,
	Globe,
	Plus,
	Trash,
	ImagePlus,
	X,
} from "lucide-react";
import HeroAnimation from "./HeroAnimation";
import { toast } from "sonner";

const resumeTemplates = [
	{
		id: "classic",
		name: "Classic",
		description: "A clear, single-column layout for a wide range of roles.",
	},
	{
		id: "sidebar",
		name: "Sidebar",
		description: "A two-column design that gives skills and education a clear home.",
	},
	{
		id: "modern",
		name: "Modern",
		description: "A confident color header with clean, easy-to-scan sections.",
	},
];

const Generate = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [address, setAddress] = useState("");
	const [zipCode, setZipCode] = useState("");
	const [linkedin, setLinkedin] = useState("");
	const [github, setGithub] = useState("");
	const [socialLink, setSocialLink] = useState("");
	const [jobTitle, setJobTitle] = useState("");
	const [highSchoolInfo, setHighSchoolInfo] = useState({
		name: "",
		percentage: "",
		years: "",
	});
	const [collegeInfo, setCollegeInfo] = useState({
		name: "",
		percentage: "",
		years: "",
	});

	// Refactored to Array of Objects
	const [experiences, setExperiences] = useState([
		{ title: "", company: "", duration: "", responsibilities: "" },
	]);
	const [customSections, setCustomSections] = useState([]);

	const [extraSkills, setExtraSkills] = useState("");
	const [languages, setLanguages] = useState("");
	const [loading, setLoading] = useState(false);
	const [resume, setResume] = useState(null);
	const [selectedTemplate, setSelectedTemplate] = useState("classic");
	const [showTemplatePicker, setShowTemplatePicker] = useState(true);
	const [profileImage, setProfileImage] = useState("");
	const resumeRef = useRef(null);

	const steps = [
		{
			icon: <Palette size={20} />,
			Heading: "Pick Template",
			Parag: "Choose a stunning layout",
		},
		{
			icon: <FileText size={20} />,
			Heading: "Fill Details",
			Parag: "enter your professional info",
		},
		{
			icon: <Wand2 size={20} />,
			Heading: "AI Generates",
			Parag: "Get a polished resume",
		},
		{
			icon: <Download size={20} />,
			Heading: "Download",
			Parag: "export as pdf",
		},
	];

	const handleGenerate = async () => {
		if (!name.trim() || !email.trim() || !jobTitle.trim()) {
			toast.error("Please add your name, email, and the role you are targeting.");
			return;
		}
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
			toast.error("Enter a valid email address so employers can contact you.");
			return;
		}
		const completedExperiences = experiences.filter(
			(experience) =>
				experience.title.trim() ||
				experience.company.trim() ||
				experience.duration.trim() ||
				experience.responsibilities.trim(),
		);
		if (
			completedExperiences.some(
				(experience) =>
					!experience.title.trim() || !experience.responsibilities.trim(),
			)
		) {
			toast.error(
				"Each work experience needs a job title and at least one responsibility or achievement. Remove unused entries or complete them.",
			);
			return;
		}
		const completedCustomSections = customSections
			.map((section) => ({
				title: section.title.trim(),
				content: section.content.trim(),
			}))
			.filter((section) => section.title || section.content);
		if (
			completedCustomSections.some(
				(section) => !section.title || !section.content,
			)
		) {
			toast.error(
				"Complete both the heading and details for each custom section, or remove the empty section.",
			);
			return;
		}
		setLoading(true);
		setResume(null);
		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/api/resume/generate`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
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
						experiences: completedExperiences,
						extraSkills,
						languages,
						customSections: completedCustomSections,
					}),
				},
			);
			const data = await res.json();
			if (!res.ok) {
				toast.error(data.message || data.error || "Generation failed");
				return;
			}
			setResume(data.resume);
			toast.success("Your resume is ready.");
		} catch (error) {
			toast.error(error.message || "Something went wrong");
		} finally {
			setLoading(false);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	};

	const handleDownload = () => {
		if (!resumeRef.current) {
			toast.error("The resume preview is not ready to export.");
			return;
		}
		window.print();
	};

	const handleReset = () => {
		setResume(null);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	const handleProfileImageChange = (event) => {
		const file = event.target.files?.[0];
		if (!file) return;
		if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
			toast.error("Choose a JPG, PNG, or WebP image.");
			event.target.value = "";
			return;
		}
		if (file.size > 5 * 1024 * 1024) {
			toast.error("Choose an image smaller than 5 MB.");
			event.target.value = "";
			return;
		}

		event.target.value = "";
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === "string") {
				setProfileImage(reader.result);
			}
		};
		reader.onerror = () => toast.error("Could not read that image. Please try another.");
		reader.readAsDataURL(file);
	};

	const updateExperience = (index, field, value) => {
		setExperiences((currentExperiences) =>
			currentExperiences.map((exp, currentIndex) =>
				currentIndex === index ? { ...exp, [field]: value } : exp,
			),
		);
	};

	const removeExperience = (index) => {
		setExperiences((currentExperiences) =>
			currentExperiences.filter((_, i) => i !== index),
		);
	};

	const updateCustomSection = (index, field, value) => {
		setCustomSections((currentSections) =>
			currentSections.map((section, currentIndex) =>
				currentIndex === index ? { ...section, [field]: value } : section,
			),
		);
	};

	const fieldClassName =
		"w-full rounded-xl border border-[#30384b] bg-[#0b0e16]/80 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition duration-200 hover:-translate-y-0.5 hover:border-violet-300/40 hover:bg-[#101827] focus:border-[#8b7cf7] focus:ring-2 focus:ring-violet-400/15 focus:-translate-y-0.5";
	const sectionTitleClassName =
		"text-lg font-semibold tracking-[-0.02em] text-white md:text-xl";

	return (
		<div className="flex flex-col items-center justify-center">
			{/* Hero Section with Animation */}
			<div className="resume-builder-hero relative flex min-h-[30rem] w-full flex-col items-center justify-center pb-10 md:min-h-[33rem]">
				<div className="no-print">
					<HeroAnimation />
				</div>

				{/* Heading */}
				<div className="relative z-10 flex flex-col items-center justify-center gap-4 px-4 pt-20 text-center no-print md:pt-24">
				<h1 className="text-4xl font-semibold tracking-tight text-white md:text-5xl">
						<span className="text-white">AI</span> Resume Builder
					</h1>
					<p className="max-w-xl text-sm leading-relaxed text-gray-400 md:text-base">
						Add the details you want included. Work experience is optional —
						projects, education, and other sections can showcase your strengths.
					</p>
				</div>

				{/* Steps */}
				<div className="relative z-10 mt-10 hidden w-full max-w-3xl items-center no-print md:flex">
					<div className="absolute left-0 top-1/2 z-0 h-px w-full -translate-y-1/2 bg-[#30384b]"></div>
					<div className="relative z-10 w-full flex justify-between px-6">
						{steps.map((step) => (
							<div
								key={step.Heading}
								className="flex flex-col items-center justify-center rounded-xl border border-[#30384b] bg-[#111827] p-3"
							>
								<div className="rounded-lg border border-violet-300/15 bg-violet-400/[0.1] p-3 text-violet-200">
									{step.icon}
								</div>
								<div className="mt-3 w-28 text-center font-semibold text-white text-sm">
									{step.Heading}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Main Content Area: Conditional Rendering (Form -> Loading -> Result) */}
				<div className="resume-content-area relative z-10 mt-12 flex w-full max-w-6xl justify-center px-4 text-white lg:px-8">
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
									AI is crafting your resume...
								</h2>
								<p className="text-gray-400">
									This generally takes 10 to 15 seconds as we optimize keywords.
								</p>
							</div>
						</div>
					) : resume && !showTemplatePicker ? (
						/* Result State */
						<div className="resume-print-region w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-5 duration-700">
							{/* Action Buttons Top Bar */}
							<div className="mb-6 flex w-full max-w-[210mm] flex-col items-stretch justify-between gap-4 rounded-2xl border border-[#30384b] bg-[#111827] p-4 backdrop-blur-md no-print sm:flex-row sm:items-center">
								<div className="flex items-center gap-3">
									<Wand2 className="text-purple-400 h-6 w-6" />
									<div>
										<p className="font-semibold text-white">
											Resume Generated Successfully
										</p>
										<p className="text-xs text-gray-400">
											Your layout is ready to export
										</p>
									</div>
								</div>
								<div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
									<button
										type="button"
										onClick={() => setShowTemplatePicker(true)}
										className="flex items-center justify-center gap-2 rounded-xl border border-[#30384b] bg-[#1b2131] px-4 py-2.5 font-medium text-gray-200 transition duration-200 hover:bg-[#232b3d] sm:px-5"
									>
										<Palette className="h-4 w-4" /> Change Template
									</button>
									<button
										type="button"
										onClick={handleReset}
										className="flex items-center justify-center gap-2 rounded-xl border border-[#30384b] bg-[#1b2131] px-4 py-2.5 font-medium text-gray-200 transition duration-200 hover:bg-[#232b3d] sm:px-5"
									>
										<RefreshCcw className="h-4 w-4" /> Create Another
									</button>
									<button
										type="button"
										onClick={handleDownload}
										className="flex items-center justify-center gap-2 rounded-xl bg-[#7367f5] px-4 py-2.5 font-medium text-white transition duration-200 hover:bg-[#8176ff] sm:px-5"
									>
										<Download className="h-4 w-4" /> Export PDF
									</button>
								</div>
							</div>

							{/* Resume Preview Paper */}
							<div className="w-full flex justify-center pb-20 overflow-x-auto sm:overflow-visible">
								<div
									id="resume-paper"
									className="shrink-0 rounded-[10px] border border-[#30384b] bg-gray-950 p-2.5 shadow-2xl print:border-none print:bg-white print:p-0 print:shadow-none"
									style={{ width: "210mm" }}
								>
									<div
										ref={resumeRef}
										data-template={selectedTemplate}
										className={`resume-document resume-template-${selectedTemplate} bg-white text-black p-8.75 min-h-[297mm]`}
									>
										{/* Header */}
										<div
											className={`resume-header border-b-2 border-purple-600 pb-4 mb-4 text-center ${profileImage ? "resume-header--with-photo" : ""}`}
										>
											{profileImage && (
												<img
													src={profileImage}
													alt={`${resume.name} profile`}
													className="resume-profile-image"
												/>
											)}
											<div className="resume-header-content">
											<h1 className="text-3xl font-bold text-gray-900 mb-1">
												{resume.name}
											</h1>
											<p className="text-purple-700 font-semibold mb-2 text-lg">
												{resume.jobTitle}
											</p>
											<div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-gray-600 text-xs">
												{resume.email && (
													<span className="flex items-center gap-1">
														<Mail className="w-3 h-3" /> {resume.email}
													</span>
												)}
												{resume.phone &&
													resume.phone !== "Phone number if provided" && (
														<span className="flex items-center gap-1">
															<Phone className="w-3 h-3" /> {resume.phone}
														</span>
													)}
												{resume.address &&
													resume.address !== "Address if provided" && (
														<span className="flex items-center gap-1">
															<MapPin className="w-3 h-3" /> {resume.address}
															{resume.zipCode &&
															resume.zipCode !== "Zip code if provided"
																? `, ${resume.zipCode}`
																: ""}
														</span>
													)}
											</div>
											<div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-blue-600 text-xs">
												{resume.linkedin &&
													resume.linkedin !==
														"LinkedIn profile link if provided" && (
														<span className="flex items-center gap-1 hover:underline">
															<Link className="w-3 h-3" /> {resume.linkedin}
														</span>
													)}
												{resume.github &&
													resume.github !==
														"GitHub profile link if provided" && (
														<span className="flex items-center gap-1 hover:underline">
															<Code className="w-3 h-3" /> {resume.github}
														</span>
													)}
												{resume.portfolio &&
													resume.portfolio !== "Portfolio link if provided" && (
														<span className="flex items-center gap-1 hover:underline">
															<Globe className="w-3 h-3" /> {resume.portfolio}
														</span>
													)}
											</div>
											</div>
										</div>

										<div className="resume-body" data-template={selectedTemplate}>
										{/* Summary */}
										<div className="resume-section resume-summary mb-5">
											<h2 className="text-[14px] font-bold text-purple-800 uppercase border-b border-gray-300 pb-1 mb-2">
												Professional Summary
											</h2>
											<p className="text-gray-800 leading-relaxed text-[13px] text-justify">
												{resume.summary}
											</p>
										</div>

										{/* Experience */}
										{resume.experience?.length > 0 && (
											<div className="resume-section resume-experience mb-5">
												<h2 className="text-[14px] font-bold text-purple-800 uppercase border-b border-gray-300 pb-1 mb-3">
													Experience
												</h2>
												{resume.experience.map((exp, i) => (
													<div
														key={`${exp.title || "experience"}-${exp.company || "company"}-${i}`}
														className="resume-entry mb-4 break-inside-avoid"
													>
														<div className="flex justify-between items-baseline mb-1">
															<p className="font-bold text-[14px] text-gray-900">
																{exp.title}
															</p>
															<p className="text-gray-600 font-semibold text-[12px] whitespace-nowrap">
																{exp.duration}
															</p>
														</div>
														<p className="text-purple-700 font-medium text-[13px] italic mb-2">
															{exp.company}
														</p>
														<ul className="list-disc list-outside ml-5 text-gray-700 text-[13px] space-y-1.5">
															{exp.points?.map((point, j) => (
																<li key={`${point}-${j}`}>{point}</li>
															))}
														</ul>
													</div>
												))}
											</div>
										)}

										{/* Education */}
										{resume.education?.length > 0 && (
											<div className="resume-section resume-education mb-5">
												<h2 className="text-[14px] font-bold text-purple-800 uppercase border-b border-gray-300 pb-1 mb-3">
													Education
												</h2>
												{resume.education.map((edu, i) => (
													<div
														key={`${edu.degree || "education"}-${edu.institution || "institution"}-${i}`}
														className="resume-entry mb-3 break-inside-avoid"
													>
														<div className="flex justify-between items-baseline mb-0.5">
															<p className="font-bold text-[14px] text-gray-900">
																{edu.degree}
															</p>
															<p className="text-gray-600 font-semibold text-[12px] whitespace-nowrap">
																{edu.year}
															</p>
														</div>
														<div className="flex justify-between items-baseline">
															<p className="text-purple-700 text-[13px] italic">
																{edu.institution}
															</p>
															{edu.percentage &&
																edu.percentage !== "Percentage/CGPA if any" && (
																	<p className="text-gray-600 text-[12px] font-medium">
																		Score: {edu.percentage}
																	</p>
																)}
														</div>
													</div>
												))}
											</div>
										)}

										{resume.customSections?.length > 0 && (
											<div className="resume-section resume-custom mb-5 space-y-4">
												{resume.customSections.map((section, index) => (
													<section
														key={`${section.title || "section"}-${index}`}
														className="resume-entry break-inside-avoid"
													>
														<h2 className="mb-2 border-b border-gray-300 pb-1 text-[14px] font-bold uppercase text-purple-800">
															{section.title}
														</h2>
														<ul className="ml-5 list-disc space-y-1.5 text-[13px] text-gray-700">
															{section.items?.map((item, itemIndex) => (
																<li key={`${item}-${itemIndex}`}>{item}</li>
															))}
														</ul>
													</section>
												))}
											</div>
										)}

										{/* Technical Skills & Languages Grid layout */}
										<div className="resume-section resume-skills grid grid-cols-2 gap-6 break-inside-avoid">
											{/* Skills */}
											{resume.skills?.length > 0 && (
												<div>
													<h2 className="text-[14px] font-bold text-purple-800 uppercase border-b border-gray-300 pb-1 mb-3">
														Skills
													</h2>
													<div className="flex flex-wrap gap-1.5">
														{resume.skills.map((skill, i) => (
															<span
																key={`${skill}-${i}`}
																className="bg-purple-50 text-purple-800 px-2.5 py-1 rounded-md text-[11px] font-medium border border-purple-100"
															>
																{skill}
															</span>
														))}
													</div>
												</div>
											)}

											{/* Languages & Certifications */}
											<div className="flex flex-col gap-5">
												{resume.languages?.length > 0 && (
													<div>
														<h2 className="text-[14px] font-bold text-purple-800 uppercase border-b border-gray-300 pb-1 mb-3">
															Languages
														</h2>
														<div className="flex flex-wrap gap-2">
															{resume.languages.map((lang, i) => (
																<span
																	key={`${lang}-${i}`}
																	className="text-gray-700 text-[12px]"
																>
																	• {lang}
																</span>
															))}
														</div>
													</div>
												)}

												{resume.certifications?.length > 0 && (
													<div>
														<h2 className="text-[14px] font-bold text-purple-800 uppercase border-b border-gray-300 pb-1 mb-2">
															Certifications
														</h2>
														<ul className="list-disc list-outside ml-4 text-gray-700 text-[12px] space-y-1">
															{resume.certifications.map((cert, i) => (
																<li key={`${cert}-${i}`}>{cert}</li>
															))}
														</ul>
													</div>
												)}
											</div>
										</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					) : showTemplatePicker ? (
						<div className="w-full max-w-5xl rounded-3xl border border-[#30384b] bg-[#111827]/95 p-5 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8">
							<div className="mb-7">
								<p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
									{resume ? "Choose your layout" : "Step 1 · Choose your layout"}
								</p>
								<h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
									Start with a resume template
								</h2>
								<p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
									{resume
										? "Preview a different layout for your generated resume."
										: "Select a layout before adding your details. You can change it anytime while editing your resume."}
								</p>
							</div>

							<div className="grid gap-4 md:grid-cols-3">
								{resumeTemplates.map((template) => (
									<button
										key={template.id}
										type="button"
										aria-pressed={selectedTemplate === template.id}
										onClick={() => setSelectedTemplate(template.id)}
										className={`group rounded-2xl border p-3 text-left transition duration-200 hover:-translate-y-1 ${
											selectedTemplate === template.id
												? "border-violet-300/70 bg-violet-400/[0.08] shadow-lg shadow-violet-950/25"
												: "border-[#30384b] bg-[#0b0e16]/60 hover:border-violet-300/35"
										}`}
									>
										<div
											className={`template-mini-preview template-mini-preview--${template.id}`}
											aria-hidden="true"
										>
											<div className="template-mini-header">
												<span className="template-mini-avatar" />
												<span className="template-mini-title" />
												<span className="template-mini-subtitle" />
											</div>
											<div className="template-mini-content">
												<span className="template-mini-section" />
												<span className="template-mini-line" />
												<span className="template-mini-line template-mini-line--short" />
												<span className="template-mini-section" />
												<span className="template-mini-line" />
												<span className="template-mini-line template-mini-line--short" />
												<span className="template-mini-section" />
												<span className="template-mini-line" />
											</div>
										</div>
										<div className="flex items-start justify-between gap-3 px-1 pt-4">
											<div>
												<h3 className="font-semibold text-white">
													{template.name}
												</h3>
												<p className="mt-1 text-xs leading-relaxed text-gray-400">
													{template.description}
												</p>
											</div>
											<span
												className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
													selectedTemplate === template.id
														? "border-violet-300 bg-violet-400 text-white"
														: "border-gray-600 text-transparent"
												}`}
											>
												✓
											</span>
										</div>
									</button>
								))}
							</div>

							<div className="mt-7 flex flex-col-reverse justify-between gap-3 border-t border-[#30384b] pt-5 sm:flex-row sm:items-center">
								<p className="text-xs text-gray-500">
									Your photo is optional and can be added in the next step.
								</p>
								<button
									type="button"
									onClick={() => setShowTemplatePicker(false)}
									className="rounded-xl bg-[#7367f5] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-900/20 transition hover:-translate-y-0.5 hover:bg-[#8176ff]"
								>
									{resume ? "Apply selected template" : "Continue to details"}
								</button>
							</div>
						</div>
					) : (
						/* Input Form State */
						<div className="resume-builder-form w-full max-w-6xl overflow-hidden rounded-3xl border border-[#30384b] bg-[#111827]/95 shadow-2xl shadow-black/25 backdrop-blur-xl animate-in fade-in duration-500">
							<div className="border-b border-[#30384b] bg-white/[0.025] px-5 py-6 sm:px-7 md:px-10">
								<div className="flex flex-col gap-2">
						<p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">Your resume, your story</p>
						<h2 className="text-2xl font-bold tracking-tight text-white">Build your professional profile</h2>
						<p className="max-w-2xl text-sm leading-relaxed text-gray-400">Required fields are marked with *. Add the sections that fit your background; leave anything that doesn’t apply blank. We’ll polish your wording without inventing details.</p>
						<div className="mt-2 flex flex-wrap items-center gap-3">
							<span className="rounded-lg border border-violet-300/20 bg-violet-400/[0.08] px-3 py-1.5 text-xs font-medium text-violet-200">
								{resumeTemplates.find((template) => template.id === selectedTemplate)?.name} template
							</span>
							<button
								type="button"
								onClick={() => setShowTemplatePicker(true)}
								className="text-xs font-semibold text-cyan-200 underline decoration-cyan-200/30 underline-offset-4 transition hover:text-white"
							>
								Change template
							</button>
						</div>
								</div>
							</div>
							<div className="flex flex-col gap-5 px-4 py-5 sm:px-6 sm:py-7 md:gap-6 md:px-10 md:py-9">
								<section className="flex flex-col gap-5 rounded-2xl border border-[#30384b] bg-[#0b0e16]/35 p-5 md:p-6">
								<div>
									<h2 className={sectionTitleClassName}>01 · Contact information</h2>
									<p className="mt-1 text-sm text-gray-400">Only your name and email are required. Add the professional links you want employers to see.</p>
								</div>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
									<div className="flex flex-col gap-2">
										<label htmlFor="resume-name" className="text-sm font-semibold text-gray-300">
											Full Name *
										</label>
										<input
											id="resume-name"
											required
											className={fieldClassName}
											type="text"
											placeholder="e.g. Jordan Lee"
											autoComplete="name"
											value={name}
											onChange={(e) => setName(e.target.value)}
										/>
									</div>
									<div className="flex flex-col gap-2">
										<label htmlFor="resume-email" className="text-sm font-semibold text-gray-300">
											Email *
										</label>
										<input
											id="resume-email"
											required
											className={fieldClassName}
											type="email"
											placeholder="you@example.com"
											autoComplete="email"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										/>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-sm font-semibold text-gray-300">
											Phone
										</label>
										<input
											className={fieldClassName}
											type="text"
											placeholder="+1 555 010 2040"
											autoComplete="tel"
											value={phone}
											onChange={(e) => setPhone(e.target.value)}
										/>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-sm font-semibold text-gray-300">
											Address & Zip Code
										</label>
										<div className="flex gap-2">
											<input
												className={`${fieldClassName} flex-2`}
												type="text"
												placeholder="City, Country (optional)"
												value={address}
												onChange={(e) => setAddress(e.target.value)}
											/>
											<input
												className={`${fieldClassName} flex-1`}
												type="text"
												placeholder="Postal code"
												value={zipCode}
												onChange={(e) => setZipCode(e.target.value)}
											/>
										</div>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-sm font-semibold text-gray-300">
											LinkedIn Profile
										</label>
										<input
											className={fieldClassName}
											type="text"
											placeholder="https://linkedin.com/in/yourname"
											value={linkedin}
											onChange={(e) => setLinkedin(e.target.value)}
										/>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-sm font-semibold text-gray-300">
											GitHub Profile
										</label>
										<input
											className={fieldClassName}
											type="text"
											placeholder="https://github.com/yourname"
											value={github}
											onChange={(e) => setGithub(e.target.value)}
										/>
									</div>
									<div className="flex flex-col gap-2 col-span-1 md:col-span-2">
										<label className="text-sm font-semibold text-gray-300">
											Portfolio / Other Link
										</label>
										<input
											className={fieldClassName}
											type="text"
											placeholder="https://yourportfolio.com"
											value={socialLink}
											onChange={(e) => setSocialLink(e.target.value)}
										/>
									</div>
								</div>

								<div className="flex flex-col gap-3 rounded-xl border border-dashed border-[#3b4560] bg-[#111827]/55 p-4 sm:flex-row sm:items-center sm:justify-between">
									<div className="flex items-center gap-3">
										{profileImage ? (
											<img
												src={profileImage}
												alt="Selected resume portrait"
												className="h-14 w-14 rounded-full border border-violet-300/30 object-cover"
											/>
										) : (
											<div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#3b4560] bg-[#0b0e16] text-gray-500">
												<ImagePlus className="h-5 w-5" />
											</div>
										)}
										<div>
											<p className="text-sm font-semibold text-gray-200">
												Profile photo <span className="font-normal text-gray-500">(optional)</span>
											</p>
											<p className="mt-1 text-xs text-gray-400">
												JPG, PNG, or WebP up to 5 MB. Included in the PDF only.
											</p>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<label
											htmlFor="resume-profile-image"
											className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#3b4560] bg-[#0b0e16] px-3 py-2 text-xs font-semibold text-gray-200 transition hover:border-violet-300/40 hover:text-white"
										>
											<ImagePlus className="h-4 w-4" />
											{profileImage ? "Change photo" : "Add photo"}
										</label>
										<input
											id="resume-profile-image"
											type="file"
											accept="image/jpeg,image/png,image/webp"
											onChange={handleProfileImageChange}
											className="sr-only"
										/>
										{profileImage && (
											<button
												type="button"
												onClick={() => setProfileImage("")}
												aria-label="Remove profile photo"
												className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#3b4560] text-gray-400 transition hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-200"
											>
												<X className="h-4 w-4" />
											</button>
										)}
									</div>
								</div>

								</section>
								<section className="flex flex-col gap-5 rounded-2xl border border-[#30384b] bg-[#0b0e16]/35 p-5 md:p-6">
								<div>
									<h2 className={sectionTitleClassName}>02 · Target position</h2>
									<p className="mt-1 text-sm text-gray-400">Choose the role you want this resume to focus on. The summary and wording will be tailored to it.</p>
								</div>

								<div className="flex flex-col gap-2">
									<label htmlFor="resume-job-title" className="text-sm font-semibold text-gray-300">
										Targeted Job Title *
									</label>
									<input
										id="resume-job-title"
										required
										className={fieldClassName}
										type="text"
										placeholder="e.g. Product Designer, Junior Data Analyst"
										value={jobTitle}
										onChange={(e) => setJobTitle(e.target.value)}
									/>
								</div>
								</section>

								<section className="flex flex-col gap-5 rounded-2xl border border-[#30384b] bg-[#0b0e16]/35 p-5 md:p-6">
								<div>
									<h2 className={sectionTitleClassName}>03 · Work experience <span className="text-sm font-medium text-gray-500">(optional)</span></h2>
									<p className="mt-1 text-sm leading-relaxed text-gray-400">Include internships, freelance work, part-time roles, or volunteering. Describe what you did and the result; numbers are useful when you know them. You can skip this if you’re new to work.</p>
								</div>

								<div className="flex flex-col gap-4">
									{experiences.map((exp, index) => (
										<div
											key={index}
											className="relative flex flex-col gap-4 rounded-2xl border border-[#30384b] bg-[#111827]/70 p-4 md:p-5"
										>
											<div className="flex items-center justify-between gap-3">
												<h3 className="text-sm font-semibold text-cyan-200">Position {index + 1}</h3>
												<button
													type="button"
													onClick={() => removeExperience(index)}
													aria-label={`Remove position ${index + 1}`}
													title="Remove this position"
													className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-400 transition hover:bg-red-500/10 hover:text-red-300"
												>
													<Trash className="h-3.5 w-3.5" /> Remove
												</button>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
												<div className="flex flex-col gap-2">
													<label className="text-sm font-medium text-gray-300">
													Role / title
													</label>
													<input
														className={fieldClassName}
														placeholder="e.g. Software Engineering Intern"
														value={exp.title}
														onChange={(e) =>
															updateExperience(index, "title", e.target.value)
														}
													/>
												</div>
												<div className="flex flex-col gap-2">
													<label className="text-sm font-medium text-gray-300">
													Company or organization
													</label>
													<input
														className={fieldClassName}
														placeholder="e.g. Acme Studio"
														value={exp.company}
														onChange={(e) =>
															updateExperience(index, "company", e.target.value)
														}
													/>
												</div>
											</div>

											<div className="flex flex-col gap-2">
												<label className="text-sm font-medium text-gray-300">
													Dates
												</label>
												<input
													className={fieldClassName}
													placeholder="e.g. Jun 2024 – Aug 2024"
													value={exp.duration}
													onChange={(e) =>
														updateExperience(index, "duration", e.target.value)
													}
												/>
											</div>
											<div className="flex flex-col gap-2">
												<label className="text-sm font-medium text-gray-300">
													What you did and achieved
												</label>
												<textarea
													className={`${fieldClassName} min-h-32 resize-y leading-relaxed`}
													placeholder={"Example: Redesigned the onboarding flow to make setup easier for new users.\nStart with an action verb. Include tools and measured results when available; never guess numbers."}
													value={exp.responsibilities}
													onChange={(e) =>
														updateExperience(
															index,
															"responsibilities",
															e.target.value,
														)
													}
												/>
											</div>
										</div>
									))}

									<button
										type="button"
										onClick={() =>
											setExperiences((currentExperiences) => [
												...currentExperiences,
												{
													title: "",
													company: "",
													duration: "",
													responsibilities: "",
												},
											])
										}
										className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-400/30 bg-cyan-400/[0.04] py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-400/[0.08]"
									>
										<Plus className="w-4 h-4" /> Add Another Role
									</button>
								</div>
								</section>

								<section className="flex flex-col gap-5 rounded-2xl border border-[#30384b] bg-[#0b0e16]/35 p-5 md:p-6">
								<div>
									<h2 className={sectionTitleClassName}>04 · Education</h2>
									<p className="mt-1 text-sm text-gray-400">Add your most relevant education. If a score isn’t relevant or you’d rather not share it, leave it blank.</p>
								</div>

								<div className="flex flex-col gap-4">
									<div className="flex flex-col gap-3 rounded-xl border border-[#30384b]/70 bg-[#111827]/70 p-4 transition hover:border-violet-300/20">
										<h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
											High School
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
											<input
												className={`${fieldClassName} md:col-span-3`}
												aria-label="High school name"
												placeholder="School name"
												value={highSchoolInfo.name}
												onChange={(e) =>
													setHighSchoolInfo((current) => ({
														...current,
														name: e.target.value,
													}))
												}
											/>
											<input
												className={`${fieldClassName} md:col-span-1`}
												aria-label="High school percentage or GPA"
												placeholder="Percentage / GPA (optional)"
												value={highSchoolInfo.percentage}
												onChange={(e) =>
													setHighSchoolInfo((current) => ({
														...current,
														percentage: e.target.value,
													}))
												}
											/>
											<input
												className={`${fieldClassName} md:col-span-2`}
												aria-label="High school passing year"
												placeholder="Passing year"
												value={highSchoolInfo.years}
												onChange={(e) =>
													setHighSchoolInfo((current) => ({
														...current,
														years: e.target.value,
													}))
												}
											/>
										</div>
									</div>
									<div className="flex flex-col gap-3 rounded-xl border border-[#30384b]/70 bg-[#111827]/70 p-4 transition hover:border-violet-300/20">
										<h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
											College / University
										</h3>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
											<input
												className={`${fieldClassName} md:col-span-3`}
												aria-label="College or university and degree"
												placeholder="e.g. BS Computer Science, State University"
												value={collegeInfo.name}
												onChange={(e) =>
													setCollegeInfo((current) => ({
														...current,
														name: e.target.value,
													}))
												}
											/>
											<input
												className={`${fieldClassName} md:col-span-1`}
												aria-label="College percentage or GPA"
												placeholder="Percentage / GPA (optional)"
												value={collegeInfo.percentage}
												onChange={(e) =>
													setCollegeInfo((current) => ({
														...current,
														percentage: e.target.value,
													}))
												}
											/>
											<input
												className={`${fieldClassName} md:col-span-2`}
												aria-label="College or university attendance years"
												placeholder="Years attended (e.g. 2022-2026)"
												value={collegeInfo.years}
												onChange={(e) =>
													setCollegeInfo((current) => ({
														...current,
														years: e.target.value,
													}))
												}
											/>
										</div>
									</div>
								</div>
								</section>

								<section className="flex flex-col gap-5 rounded-2xl border border-[#30384b] bg-[#0b0e16]/35 p-5 md:p-6">
								<div>
									<h2 className={sectionTitleClassName}>05 · Skills & languages</h2>
									<p className="mt-1 text-sm text-gray-400">Separate items with commas. Include tools, methods, and languages you can confidently discuss.</p>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
									<div className="flex flex-col gap-2">
										<label className="text-sm font-semibold text-gray-300">
											Skills and tools
										</label>
										<textarea
											className={`${fieldClassName} min-h-28 resize-y leading-relaxed`}
											placeholder="e.g. Figma, user research, React, data analysis"
											value={extraSkills}
											onChange={(e) => setExtraSkills(e.target.value)}
										/>
									</div>
									<div className="flex flex-col gap-2">
										<label className="text-sm font-semibold text-gray-300">
											Languages you speak
										</label>
										<textarea
											className={`${fieldClassName} min-h-28 resize-y leading-relaxed`}
											placeholder="e.g. English (fluent), Urdu (native)"
											value={languages}
											onChange={(e) => setLanguages(e.target.value)}
										/>
									</div>
								</div>
								</section>

								<section className="flex flex-col gap-5 rounded-2xl border border-[#30384b] bg-[#0b0e16]/35 p-5 md:p-6">
									<div>
										<h2 className={sectionTitleClassName}>06 · Additional sections <span className="text-sm font-medium text-gray-500">(optional)</span></h2>
										<p className="mt-1 text-sm leading-relaxed text-gray-400">Add projects, certifications, awards, volunteering, publications, coursework, or any section that tells more of your story. Give each section your own heading.</p>
									</div>

									<div className="flex flex-col gap-4">
										{customSections.map((section, index) => (
											<div
												key={index}
												className="flex flex-col gap-3 rounded-2xl border border-[#30384b] bg-[#111827]/70 p-4 md:p-5"
											>
												<div className="flex items-center justify-between gap-3">
													<h3 className="text-sm font-semibold text-cyan-200">Custom section {index + 1}</h3>
													<button
														type="button"
														onClick={() => setCustomSections((current) => current.filter((_, currentIndex) => currentIndex !== index))}
														aria-label={`Remove custom section ${index + 1}`}
														className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-400 transition hover:bg-red-500/10 hover:text-red-300"
													>
														<Trash className="h-3.5 w-3.5" /> Remove
													</button>
												</div>
												<label className="flex flex-col gap-2 text-sm font-medium text-gray-300">
													Section heading
													<input
														className={fieldClassName}
														placeholder="e.g. Selected Projects"
														value={section.title}
														onChange={(event) => updateCustomSection(index, "title", event.target.value)}
													/>
												</label>
												<label className="flex flex-col gap-2 text-sm font-medium text-gray-300">
													Details
													<textarea
														className={`${fieldClassName} min-h-28 resize-y leading-relaxed`}
														placeholder={"Add one item per line, with what you did and the outcome.\nExample: Built a budgeting app in React for a university course project."}
														value={section.content}
														onChange={(event) => updateCustomSection(index, "content", event.target.value)}
													/>
												</label>
											</div>
										))}
										<button
											type="button"
											onClick={() => setCustomSections((current) => [...current, { title: "", content: "" }])}
											className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-cyan-400/30 bg-cyan-400/[0.04] py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/60 hover:bg-cyan-400/[0.08]"
										>
											<Plus className="h-4 w-4" /> Add a custom section
										</button>
									</div>
								</section>
							</div>

							<button
								type="button"
								onClick={handleGenerate}
								disabled={loading}
								className="mx-4 mb-5 flex w-[calc(100%-2rem)] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#7367f5] py-4 text-base font-semibold text-white shadow-lg shadow-violet-900/20 transition-all hover:bg-[#8176ff] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 sm:mx-6 sm:mb-7 sm:w-[calc(100%-3rem)] md:mx-10 md:mb-9 md:w-[calc(100%-5rem)]"
							>
								<Wand2 className="h-5 w-5" /> Generate Resume
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Why use our AI builder */}
			<div className="mt-14 flex items-center justify-center px-4 py-5 text-center text-2xl font-bold text-white no-print">
				<h2>Why use our AI builder?</h2>
			</div>
			<div className="mb-20 grid w-full max-w-6xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:px-8 lg:grid-cols-3 no-print">
				<div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-[#30384b] bg-[#111827]/85 px-6 transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#1b2131]">
					<div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.1] text-violet-200">
						<Wand2 className="h-6 w-6" />
					</div>
					<h3 className="font-bold text-white text-lg mt-2">
						AI-Powered Content
					</h3>
					<p className="text-gray-400 text-center text-sm">
						Smart suggestions that highlight your strengths and tailor content
						to your target role.
					</p>
				</div>
				<div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-[#30384b] bg-[#111827]/85 px-6 transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#1b2131]">
					<div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.1] text-violet-200">
						<PanelLeft className="h-6 w-6" />
					</div>
					<h3 className="font-bold text-white text-lg mt-2">
						Professional Templates
					</h3>
					<p className="text-gray-400 text-center text-sm">
						ATS-friendly layouts designed by recruiters to maximize your
						interview chances.
					</p>
				</div>
				<div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-[#30384b] bg-[#111827]/85 px-6 transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#1b2131]">
					<div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.1] text-violet-200">
						<Download className="h-6 w-6" />
					</div>
					<h3 className="font-bold text-white text-lg mt-2">Instant Export</h3>
					<p className="text-gray-400 text-center text-sm">
						Download your polished resume directly as a beautifully formatted
						PDF.
					</p>
				</div>
			</div>
		</div>
	);
};

export default Generate;
