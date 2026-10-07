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
		<div className="page-transition relative flex flex-col lg:flex-row justify-center items-center min-h-[calc(100vh-68px)] gap-10 lg:gap-20 px-4 py-10">
			<ParticleBackground />
			<div className="hidden lg:block"><RobotAssistant message="Hi! I'm your career AI. Let me help you land your dream job!" /></div>
			<div className="container border border-white/10 bg-white/5 min-h-[440px] w-full max-w-md duration-300 flex flex-col justify-center items-center rounded-2xl px-6 py-8 hover:shadow-[0_2px_30px_rgba(168,85,247,0.15)] hover:-translate-y-1">
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
						<h1 className="text-white font-semibold text-xl">Welcome back</h1>
						<p className="text-gray-400">Sign in to your JobGenie account</p>
					</div>

					<div>
						<form
							onSubmit={handleLogin}
							className="flex flex-col justify-center items-center text-white gap-4 mt-6"
						>
							<div className="relative flex flex-col">
								<label htmlFor="login-email">Email</label>
								<Mail className="absolute top-7 text-gray-500 pl-2 pt-1" />
								<input
									id="login-email"
									required
									className="bg-zinc-900 px-8 py-2 w-[min(20rem,calc(100vw-5rem))] rounded-[7px] border border-gray-500 focus:outline-none focus:border-purple-500 focus:border-2 transition duration-200"
									type="email"
									placeholder="Enter your Email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>

							<div className="relative flex flex-col">
								<label htmlFor="login-password">Password</label>
								<Lock className="absolute top-7 text-gray-500 pl-2 pt-1" />
								<input
									id="login-password"
									required
									className="bg-zinc-900 px-8 py-2 w-[min(20rem,calc(100vw-5rem))] rounded-[7px] border border-gray-500 focus:outline-none focus:border-purple-500 focus:border-2 transition duration-200"
									type="password"
									placeholder="Enter password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
								/>
							</div>

							<div>
								<button
									disabled={isSubmitting}
									className="bg-[linear-gradient(to_right,#9333ea,#06b6d4)] rounded-[7px] w-[min(20rem,calc(100vw-5rem))] mt-5 py-2 text-lg font-bold text-white hover:scale-[1.02] duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
									type="submit"
								>
									{isSubmitting ? "Signing in..." : "Login"}
								</button>
							</div>
						</form>

						<div className="flex gap-5 justify-center mt-3">
							<p className="text-gray-400">Don't have an account?</p>
							<Link to="/signup" className="text-purple-600">
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
