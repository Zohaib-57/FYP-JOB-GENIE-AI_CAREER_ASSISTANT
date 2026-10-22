import React from "react";
import { ArrowRight, Bot } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Footer = ({ isAuthenticated }) => {
	const { pathname } = useLocation();
	const isLandingPage = pathname === "/" || pathname === "/home";
	const year = new Date().getFullYear();

	return (
		<footer className="no-print border-t border-white/10 bg-zinc-950/80">
			<div className="mx-auto max-w-7xl px-6 py-12 md:px-8">
				<div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
					<div className="max-w-sm">
						<Link
							to={isAuthenticated ? "/home" : "/"}
							className="flex w-fit items-center gap-3"
						>
							<span
								className="robot-mark relative h-10 w-10 overflow-hidden rounded-xl"
								aria-hidden="true"
							>
								<img
									src="/jobgenie-robot.png"
									alt=""
									className="h-full w-full object-contain"
								/>
							</span>
							<span className="text-xl font-bold text-white">JobGenie</span>
						</Link>
						<p className="mt-4 text-sm leading-relaxed text-gray-400">
							{isLandingPage
								? "Build a stronger career with practical AI tools for your resume and job search."
								: "Your AI-powered toolkit for building resumes, improving your profile, and finding relevant jobs."}
						</p>
					</div>

					{isLandingPage ? (
						<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
							<a
								href="#features"
								className="text-sm font-medium text-gray-300 transition hover:text-white"
							>
								Explore features
							</a>
							<Link
								to={isAuthenticated ? "/generate" : "/signup"}
								className="inline-flex items-center justify-center gap-2 rounded-lg bg-[linear-gradient(to_right,#9333ea,#06b6d4)] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
							>
								{isAuthenticated ? "Open career tools" : "Get started"}
								<ArrowRight className="h-4 w-4" />
							</Link>
						</div>
					) : (
						<nav aria-label="Footer navigation" className="flex flex-col gap-3">
							<p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
								{isAuthenticated ? "Your workspace" : "Get started"}
							</p>
							<div className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-gray-300">
								{isAuthenticated ? (
									<>
										<Link className="hover:text-white" to="/home">Home</Link>
										<Link className="hover:text-white" to="/generate">Resume Builder</Link>
										<Link className="hover:text-white" to="/score">Resume Score</Link>
										<Link className="hover:text-white" to="/jobs">Find Jobs</Link>
									</>
								) : (
									<>
										<Link className="hover:text-white" to="/">Home</Link>
										<Link className="hover:text-white" to="/login">Log in</Link>
										<Link className="hover:text-white" to="/signup">Create account</Link>
									</>
								)}
							</div>
						</nav>
					)}
				</div>

				<div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
					<p>© {year} JobGenie. All rights reserved.</p>
					<p className="inline-flex items-center gap-2">
						<Bot className="h-4 w-4 text-cyan-400" />
						Your next career step starts here.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
