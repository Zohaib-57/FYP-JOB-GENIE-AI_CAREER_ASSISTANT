import React from "react";
import { Sparkles, ArrowRight, Star, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import HeroAnimation from "./HeroAnimation";

const Home = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  const getStarted = () => navigate(isAuthenticated ? "/generate" : "/signup");
  const openTools = () => navigate(isAuthenticated ? "/score" : "/login");

  return (
    <div className="page-transition min-h-screen pt-20 px-4 md:px-8">

      {/* Hero Section */}
      <div className="relative flex flex-col justify-center items-center gap-5 pb-10 min-h-150 text-center">

        <HeroAnimation />

        {/* Badge */}
        <div className="relative z-10 flex items-center justify-center gap-2 bg-blue-900/50 border border-blue-500/20 text-blue-400 px-5 py-1.5 rounded-full mt-10 md:mt-0 backdrop-blur-sm">
          <Sparkles className="w-4 h-4" />
          <p className="text-sm font-medium tracking-wide">AI POWERED CAREER TOOLS</p>
        </div>

        {/* Heading */}
        <div className="relative z-10 flex flex-col items-center">
          <p className="text-white font-bold text-4xl md:text-6xl">Your AI Career</p>
          <p className="text-4xl md:text-6xl font-semibold text-transparent bg-clip-text bg-[linear-gradient(90deg,#06b6d4_0%,#9333ea_30%,#9333ea_70%,#06b6d4_100%)] py-2 md:py-3 md:ml-10">
            Companion
          </p>
        </div>

        {/* Subtitle */}
        <div className="relative z-10">
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto px-2">
            Build stunning resumes, get instant AI scoring, and discover perfect job matches — all in one powerful platform.
          </p>
        </div>

        {/* Buttons */}
        <div className="relative z-10 flex w-full max-w-xl flex-col justify-center gap-4 mt-8 sm:flex-row">
          <button 
            onClick={getStarted}
            className="flex min-h-14 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[linear-gradient(to_right,#9333ea,#06b6d4)] px-4 text-sm font-bold text-white shadow-[0_0_20px_rgba(147,51,234,0.4)] transition duration-300 hover:scale-[1.02] sm:px-5 sm:text-base"
          >
            {isAuthenticated ? "Get Started" : "Create your free account"} <ArrowRight className="h-5 w-5 shrink-0"/>
          </button>
          <button 
            onClick={openTools}
            className="flex min-h-14 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-white/5 bg-zinc-900 px-4 text-sm font-bold text-white transition duration-300 hover:bg-zinc-800 sm:px-5 sm:text-base"
          >
            {isAuthenticated ? "AI Tools" : "Log in"}
          </button>
        </div>

        {/* Stats */}
        <div className="relative z-10 w-full max-w-6xl grid grid-cols-2 lg:grid-cols-4 gap-4 px-2 md:px-8 pb-10 border-b border-gray-700/50 pt-16">
          <div className="border border-white/10 bg-white/5 text-white flex flex-col justify-center items-center py-6 rounded-2xl hover:shadow-[0_15px_30px_-10px_rgba(168,85,247,0.35)] duration-300 hover:-translate-y-1 backdrop-blur-sm">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-[linear-gradient(90deg,#06b6d4_0%,#9333ea_100%)]">10K+</h1>
            <p className="text-gray-400 text-sm mt-1 font-medium">Resumes Built</p>
          </div>
          <div className="border border-white/10 bg-white/5 text-white flex flex-col justify-center items-center py-6 rounded-2xl hover:shadow-[0_15px_30px_-10px_rgba(168,85,247,0.35)] duration-300 hover:-translate-y-1 backdrop-blur-sm">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-[linear-gradient(90deg,#06b6d4_0%,#9333ea_100%)]">95%</h1>
            <p className="text-gray-400 text-sm mt-1 font-medium">Accuracy Score</p>
          </div>
          <div className="border border-white/10 bg-white/5 text-white flex flex-col justify-center items-center py-6 rounded-2xl hover:shadow-[0_15px_30px_-10px_rgba(168,85,247,0.35)] duration-300 hover:-translate-y-1 backdrop-blur-sm">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-[linear-gradient(90deg,#06b6d4_0%,#9333ea_100%)]">5K+</h1>
            <p className="text-gray-400 text-sm mt-1 font-medium">Jobs Matched</p>
          </div>
          <div className="border border-white/10 bg-white/5 text-white flex flex-col justify-center items-center py-6 rounded-2xl hover:shadow-[0_15px_30px_-10px_rgba(168,85,247,0.35)] duration-300 hover:-translate-y-1 backdrop-blur-sm">
            <h1 className="text-3xl font-bold flex items-center gap-1 bg-clip-text text-transparent bg-[linear-gradient(90deg,#06b6d4_0%,#9333ea_100%)]">
              4.9 <Star className="fill-purple-400 text-purple-400 w-5 h-5 ml-1" />
            </h1>
            <p className="text-gray-400 text-sm mt-1 font-medium">User Rating</p>
          </div>
        </div>
      </div>

      {/* Powerful Features */}
      <div id="features" className="scroll-mt-24 pt-4 pb-20">
        <div className="flex justify-center items-center flex-col gap-3 pb-12 text-center">
          <h1 className="text-transparent font-bold bg-clip-text bg-[linear-gradient(90deg,#06b6d4_0%,#9333ea_100%)] text-3xl md:text-4xl">
            Powerful Features
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-md">
            Everything you need to supercharge your career journey.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 px-2 md:px-8">
          <div className="rounded-2xl p-6 border border-white/10 bg-white/5 flex flex-col items-center text-center gap-4 hover:shadow-[0_15px_30px_-10px_rgba(168,85,247,0.35)] duration-300 hover:-translate-y-2 backdrop-blur-sm">
            <div className="bg-[linear-gradient(to_right,#9333ea,#06b6d4)] text-white h-14 w-14 rounded-xl flex justify-center items-center shadow-lg">
              <FileText className="h-7 w-7" />
            </div>
            <h1 className="font-bold text-white text-lg">AI Resume Builder</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Create professional resumes instantly with AI powered templates and content suggestions.
            </p>
          </div>

          <div className="rounded-2xl p-6 border border-white/10 bg-white/5 flex flex-col items-center text-center gap-4 hover:shadow-[0_15px_30px_-10px_rgba(168,85,247,0.35)] duration-300 hover:-translate-y-2 backdrop-blur-sm">
            <div className="bg-[linear-gradient(to_right,#9333ea,#06b6d4)] text-white h-14 w-14 rounded-xl flex justify-center items-center shadow-lg">
              <FileText className="h-7 w-7" />
            </div>
            <h1 className="font-bold text-white text-lg">Resume Scoring</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Get detailed insights and actionable feedback to improve your ATS CV score.
            </p>
          </div>

          <div className="rounded-2xl p-6 border border-white/10 bg-white/5 flex flex-col items-center text-center gap-4 hover:shadow-[0_15px_30px_-10px_rgba(168,85,247,0.35)] duration-300 hover:-translate-y-2 backdrop-blur-sm">
            <div className="bg-[linear-gradient(to_right,#9333ea,#06b6d4)] text-white h-14 w-14 rounded-xl flex justify-center items-center shadow-lg">
              <FileText className="h-7 w-7" />
            </div>
            <h1 className="font-bold text-white text-lg">Smart Matching</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Find jobs perfectly tailored to your skills, experience, and career goals.
            </p>
          </div>

          <div className="rounded-2xl p-6 border border-white/10 bg-white/5 flex flex-col items-center text-center gap-4 hover:shadow-[0_15px_30px_-10px_rgba(168,85,247,0.35)] duration-300 hover:-translate-y-2 backdrop-blur-sm">
            <div className="bg-[linear-gradient(to_right,#9333ea,#06b6d4)] text-white h-14 w-14 rounded-xl flex justify-center items-center shadow-lg">
              <FileText className="h-7 w-7" />
            </div>
            <h1 className="font-bold text-white text-lg">Skill Gap Analysis</h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              Identify missing skills and get precise recommendations to boost your profile.
            </p>
          </div>

          <div className="rounded-2xl p-6 border border-white/10 bg-white/5 flex flex-col items-center text-center gap-4 hover:shadow-[0_15px_30px_-10px_rgba(168,85,247,0.35)] duration-300 hover:-translate-y-2 backdrop-blur-sm sm:col-span-2 lg:col-span-1">
            <div className="bg-[linear-gradient(to_right,#9333ea,#06b6d4)] text-white h-14 w-14 rounded-xl flex justify-center items-center shadow-lg">
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