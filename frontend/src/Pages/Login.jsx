import React, { useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ParticleBackground from "./ParticleBackground";
import RobotAssistant from "./RobotAssistant";
import { toast } from "sonner";

const Login = ({ setAuthenticated }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const res = await fetch(
				`${import.meta.env.VITE_API_URL}/api/auth/login`,
				{
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, password }),
				},
			);

			const responseText = await res.text();
			let data;
			try {
				data = responseText ? JSON.parse(responseText) : {};
			} catch {
				throw new Error("The server returned an invalid response. Please try again.");
			}

			if (!res.ok) {
				toast.error(
					data.message ||
						(res.status >= 500
							? "A server error occurred while signing in. Please try again."
							: "Login failed"),
				);
				return;
			}

			setAuthenticated(true);
			toast.success("Welcome back!");
			navigate("/home");
		} catch (error) {
			toast.error(
				error instanceof TypeError
					? "Could not connect to the server. Make sure the backend is running and CLIENT_URL matches this page's address."
					: error.message || "Something went wrong",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="page-transition relative flex min-h-[calc(100vh-68px)] flex-col items-center justify-center gap-8 px-4 py-10 lg:flex-row lg:gap-16">
			<div className="pointer-events-none opacity-[0.05]"><ParticleBackground /></div>
			<div className="hidden lg:block"><RobotAssistant message="Hi! I'm your career AI. Let me help you land your dream job!" /></div>
			<div className="relative z-10 flex min-h-[440px] w-full max-w-lg flex-col items-center justify-center rounded-3xl border border-[#30384b] bg-[#111827]/95 px-6 py-8 shadow-[0_24px_60px_rgba(15,23,42,0.6)] backdrop-blur-xl transition duration-200 hover:-translate-y-0.5 hover:border-violet-300/25 hover:shadow-[0_28px_70px_rgba(91,65,226,0.18)] sm:px-8 sm:py-10">
				<div>
					<span
						className="robot-mark relative mx-auto mb-5 block h-12 w-12 overflow-hidden rounded-xl border border-violet-300/15 bg-violet-400/[0.08] shadow-lg"
						aria-hidden="true"
					>
						<img
							src="/jobgenie-robot.png"
							alt=""
							className="h-full w-full object-contain drop-shadow-[0_0_6px_rgba(34,211,238,0.3)]"
						/>
					</span>
					<div className="flex justify-center flex-col items-center">
						<h1 className="text-white font-semibold text-xl">Welcome back</h1>
						<p className="text-gray-400">Sign in to your JobGenie account</p>
					</div>

					<div>
						<form
							onSubmit={handleLogin}
							className="mt-7 flex flex-col items-stretch justify-center gap-5 text-white"
						>
							<div className="relative flex flex-col gap-2">
								<label htmlFor="login-email" className="text-sm font-medium text-gray-300">Email</label>
								<Mail className="absolute top-9 text-gray-500 pl-2 pt-1" />
								<input
									id="login-email"
									required
									className="w-[min(20rem,calc(100vw-5rem))] rounded-xl border border-[#30384b] bg-[#0b0e16]/90 px-8 py-3 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition duration-200 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-[#0f172a] placeholder:text-gray-500 focus:border-[#8b7cf7] focus:outline-none focus:ring-2 focus:ring-violet-400/15 focus:-translate-y-0.5"
									type="email"
									placeholder="Enter your Email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>

							<div className="relative flex flex-col gap-2">
								<label htmlFor="login-password" className="text-sm font-medium text-gray-300">Password</label>
								<Lock className="absolute top-9 text-gray-500 pl-2 pt-1" />
								<input
									id="login-password"
									required
									className="w-[min(20rem,calc(100vw-5rem))] rounded-xl border border-[#30384b] bg-[#0b0e16]/90 px-8 py-3 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.02)] transition duration-200 hover:-translate-y-0.5 hover:border-violet-300/35 hover:bg-[#0f172a] placeholder:text-gray-500 focus:border-[#8b7cf7] focus:outline-none focus:ring-2 focus:ring-violet-400/15 focus:-translate-y-0.5"
									type="password"
									placeholder="Enter password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>

							<div>
								<button
									disabled={isSubmitting}
									className="mt-3 w-[min(20rem,calc(100vw-5rem))] cursor-pointer rounded-xl bg-[#7367f5] py-3 text-base font-semibold text-white shadow-[0_16px_32px_rgba(115,103,245,0.35)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#8176ff] hover:shadow-[0_20px_38px_rgba(129,118,255,0.5)] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
									type="submit"
								>
									{isSubmitting ? "Signing in..." : "Login"}
								</button>
							</div>
						</form>

						<div className="mt-5 flex flex-wrap justify-center gap-x-2 gap-y-1 text-sm">
							<p className="text-gray-400">Don't have an account?</p>
							<Link to="/signup" className="font-medium text-violet-300 hover:text-violet-200">
								Sign up
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
