import React from "react";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ParticleBackground from "./ParticleBackground";
import RobotAssistant from "./RobotAssistant";
import { toast } from "sonner";

const Signup = () => {

   const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async (e) => {
  e.preventDefault();

  if (!name || !email || !password || !confirmPassword) {
    toast.error("Please fill all fields");
    return;
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Signup failed");
      return;
    }

    toast.success("Account created successfully.");
    navigate("/login");

  } catch (error) {
    toast.error(error.message || "Something went wrong");
  }
};

  return (
    <div className="page-transition flex flex-col lg:flex-row justify-center items-center min-h-[calc(100vh-68px)] py-10 px-4 gap-10 lg:gap-20">
      <ParticleBackground/>
      <div className="hidden lg:block"><RobotAssistant message="Let's build your profile and kickstart your career!" /></div>
      <div className="container border border-white/10 bg-white/5 min-h-[480px] w-full max-w-md duration-300 flex flex-col justify-center items-center rounded-2xl px-6 py-8 hover:shadow-[0_2px_30px_rgba(168,85,247,0.15)] hover:-translate-y-1">
        <div>
          <span
            className="robot-mark relative mx-auto mb-5 block h-12 w-12 overflow-hidden rounded-xl shadow-lg"
            aria-hidden="true"
          >
            <img
              src="/jobgenie-robot.png"
              alt=""
              className="h-full w-full object-contain drop-shadow-[0_0_6px_rgba(34,211,238,0.3)]"
            />
          </span>
          <div className="flex justify-center flex-col items-center">
            <h1 className="text-white font-semibold text-xl">Create Account</h1>
            <p className="text-gray-400">
              Start your AI-powered career journey
            </p>
          </div>

          <div>
            <form
              onSubmit={handleSignup}
              className="flex flex-col justify-center items-center text-white gap-4 mt-6"
            >
              <div className="relative flex flex-col">
                <label htmlFor="signup-name">Full name</label>
                <User className="absolute top-7 text-gray-500 pl-2 pt-1"></User>
                <input
                  id="signup-name"
                  required
                  className="bg-zinc-900 px-8 py-2 w-[min(20rem,calc(100vw-5rem))] rounded-[7px] border border-gray-500 focus:outline-none focus:border-purple-500 focus:border-2 transition duration-200"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="relative flex flex-col">
                <label htmlFor="signup-email">Email</label>
                <Mail className="absolute top-7 text-gray-500 pl-2 pt-1"></Mail>
                <input
                  id="signup-email"
                  required
                  className="bg-zinc-900 px-8 py-2 w-[min(20rem,calc(100vw-5rem))] rounded-[7px] border border-gray-500 focus:outline-none focus:border-purple-500 focus:border-2 transition duration-200"
                  type="email"
                  placeholder="Enter your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative flex flex-col">
                <label htmlFor="signup-password">Password</label>
                <Lock className="absolute top-7 text-gray-500 pl-2 pt-1"></Lock>
                <input
                  id="signup-password"
                  required
                  className="bg-zinc-900 px-8 pr-10 py-2 w-[min(20rem,calc(100vw-5rem))] rounded-[7px] border border-gray-500 focus:outline-none focus:border-purple-500 focus:border-2 transition duration-200"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-8 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative flex flex-col">
                <label htmlFor="signup-confirm-password">Confirm password</label>
                <Lock className="absolute top-7 text-gray-500 pl-2 pt-1"></Lock>
                <input
                  id="signup-confirm-password"
                  required
                  className="bg-zinc-900 px-8 pr-10 py-2 w-[min(20rem,calc(100vw-5rem))] rounded-[7px] border border-gray-500 focus:outline-none focus:border-purple-500 focus:border-2 transition duration-200"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((visible) => !visible)}
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirmed password"
                      : "Show confirmed password"
                  }
                  className="absolute right-3 top-8 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
               <div>
              <button className="bg-[linear-gradient(to_right,#9333ea,#06b6d4)] rounded-[7px] w-[min(20rem,calc(100vw-5rem))] mt-5 py-2 text-lg font-bold text-white hover:scale-[1.02] duration-300 cursor-pointer" type="submit">
                Create Account
              </button>
            </div>
            </form>
           

            <div className="flex gap-5 justify-center mt-3">
              <p className="text-gray-400">Already have account?</p>
              <Link to="/login" className="text-purple-600">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
