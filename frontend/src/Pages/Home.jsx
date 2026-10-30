import React from "react";
import { Sparkles, ArrowRight, Star, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeroAnimation from "./HeroAnimation";

const Home = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const getStarted = () => navigate(isAuthenticated ? "/generate" : "/signup");
  const openTools = () => navigate(isAuthenticated ? "/score" : "/login");

  return (
    <div className="page-transition min-h-screen px-4 pb-16 pt-12 md:px-8 md:pt-16">

      {/* Hero Section */}
      <div className="relative mx-auto flex min-h-[34rem] max-w-7xl flex-col items-center justify-center gap-5 pb-10 text-center md:min-h-[38rem]">

        <HeroAnimation />

        {/* Badge */}
        <div className="relative z-10 mt-10 flex items-center justify-center gap-2 rounded-full border border-violet-300/15 bg-violet-400/[0.08] px-4 py-1.5 text-violet-200 backdrop-blur-sm md:mt-0">
          <Sparkles className="w-4 h-4" />
          <p className="text-sm font-medium tracking-wide">AI POWERED CAREER TOOLS</p>
        </div>

        {/* Heading */}
        <div className="relative z-10 flex flex-col items-center">
          <p className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">Your AI Career</p>
          <p className="py-2 text-4xl font-semibold tracking-tight text-transparent bg-clip-text bg-[linear-gradient(90deg,#a68bff_0%,#7367f5_55%,#a68bff_100%)] sm:text-5xl md:py-3 md:text-6xl">
            Companion
          </p>
        </div>

        {/* Subtitle */}
        <div className="relative z-10">
          <p className="mx-auto max-w-2xl px-2 text-sm leading-7 text-gray-400 md:text-base">
            Build stunning resumes, get instant AI scoring, and discover perfect job matches — all in one powerful platform.
          </p>
        </div>

        {/* Buttons */}
        <div className="relative z-10 mt-7 flex w-full max-w-xl flex-col justify-center gap-3 sm:flex-row">
          <button 
            onClick={getStarted}
            className="flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#7367f5] px-4 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(115,103,245,0.2)] transition duration-200 hover:bg-[#8176ff] sm:px-5 sm:text-base"
          >
            {isAuthenticated ? "Get Started" : "Create your free account"} <ArrowRight className="h-5 w-5 shrink-0"/>
          </button>
          <button 
            onClick={openTools}
            className="flex min-h-12 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-[#30384b] bg-[#111827] px-4 text-sm font-semibold text-gray-200 transition duration-200 hover:border-[#46506a] hover:bg-[#1b2131] sm:px-5 sm:text-base"
          >
            {isAuthenticated ? "AI Tools" : "Log in"}
          </button>
        </div>

        {/* Stats */}
        <div className="relative z-10 grid w-full max-w-6xl grid-cols-2 gap-3 border-b border-[#30384b]/70 px-2 pb-10 pt-12 md:grid-cols-4 md:gap-4 md:px-8 md:pt-16">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#30384b] bg-[#111827]/85 py-6 text-white transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#1b2131]">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-[linear-gradient(90deg,#06b6d4_0%,#9333ea_100%)]">10K+</h1>
            <p className="text-gray-400 text-sm mt-1 font-medium">Resumes Built</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#30384b] bg-[#111827]/85 py-6 text-white transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#1b2131]">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-[linear-gradient(90deg,#06b6d4_0%,#9333ea_100%)]">95%</h1>
            <p className="text-gray-400 text-sm mt-1 font-medium">Accuracy Score</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#30384b] bg-[#111827]/85 py-6 text-white transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#1b2131]">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-[linear-gradient(90deg,#06b6d4_0%,#9333ea_100%)]">5K+</h1>
            <p className="text-gray-400 text-sm mt-1 font-medium">Jobs Matched</p>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#30384b] bg-[#111827]/85 py-6 text-white transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#1b2131]">
            <h1 className="text-3xl font-bold flex items-center gap-1 bg-clip-text text-transparent bg-[linear-gradient(90deg,#06b6d4_0%,#9333ea_100%)]">
              4.9 <Star className="fill-purple-400 text-purple-400 w-5 h-5 ml-1" />
            </h1>
            <p className="text-gray-400 text-sm mt-1 font-medium">User Rating</p>
          </div>
        </div>
      </div>

      {/* Powerful Features */}
      <div id="features" className="mx-auto max-w-7xl scroll-mt-24 px-2 pb-16 pt-5 md:px-8 md:pb-20">
        <div className="flex justify-center items-center flex-col gap-3 pb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
            Powerful Features
          </h1>
          <p className="max-w-md text-sm text-gray-400 md:text-base">
            Everything you need to supercharge your career journey.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div className="flex h-full flex-col items-center gap-4 rounded-2xl border border-[#30384b] bg-[#111827]/85 p-6 text-center transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#1b2131]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.1] text-violet-200">
              <FileText className="h-7 w-7" />
            </div>
            <h1 className="font-bold text-white text-lg">AI Resume Builder</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Create professional resumes instantly with AI powered templates and content suggestions.
            </p>
          </div>

          <div className="flex h-full flex-col items-center gap-4 rounded-2xl border border-[#30384b] bg-[#111827]/85 p-6 text-center transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#1b2131]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.1] text-violet-200">
              <FileText className="h-7 w-7" />
            </div>
            <h1 className="font-bold text-white text-lg">Resume Scoring</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Get detailed insights and actionable feedback to improve your ATS CV score.
            </p>
          </div>

          <div className="flex h-full flex-col items-center gap-4 rounded-2xl border border-[#30384b] bg-[#111827]/85 p-6 text-center transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#1b2131]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.1] text-violet-200">
              <FileText className="h-7 w-7" />
            </div>
            <h1 className="font-bold text-white text-lg">Smart Matching</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Find jobs perfectly tailored to your skills, experience, and career goals.
            </p>
          </div>

          <div className="flex h-full flex-col items-center gap-4 rounded-2xl border border-[#30384b] bg-[#111827]/85 p-6 text-center transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#1b2131]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.1] text-violet-200">
              <FileText className="h-7 w-7" />
            </div>
            <h1 className="font-bold text-white text-lg">Skill Gap Analysis</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Identify missing skills and get precise recommendations to boost your profile.
            </p>
          </div>

          <div className="flex h-full flex-col items-center gap-4 rounded-2xl border border-[#30384b] bg-[#111827]/85 p-6 text-center transition duration-200 hover:-translate-y-1 hover:border-violet-300/25 hover:bg-[#1b2131] sm:col-span-2 lg:col-span-1 xl:col-span-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-300/15 bg-violet-400/[0.1] text-violet-200">
              <FileText className="h-7 w-7" />
            </div>
            <h1 className="font-bold text-white text-lg">Career Pathing</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI-driven career recommendations based on your unique profile.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;