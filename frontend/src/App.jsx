import React, { useEffect, useState } from "react";
import Navbar from "./Pages/Navbar";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";
import Generate from "./Pages/Generate";
import Score from "./Pages/Score";
import Jobs from "./Pages/Jobs";
import Footer from "./Pages/Footer";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster, toast } from "sonner";

const App = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
			credentials: "include",
		})
			.then((response) => setIsAuthenticated(response.ok))
			.catch(() => setIsAuthenticated(false));
	}, []);

	const handleLogout = async () => {
		try {
			const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
				method: "POST",
				credentials: "include",
			});
			if (!response.ok) {
				throw new Error("Logout request failed");
			}
			toast.success("You have been signed out.");
		} catch {
			toast.error("Could not reach the server while signing out.");
		} finally {
			setIsAuthenticated(false);
		}
	};

	return (
		<div className="flex min-h-screen flex-col bg-zinc-900">
			<Toaster
				position="top-right"
				richColors
				closeButton
				toastOptions={{
					style: {
						background: "#18181b",
						border: "1px solid rgba(255,255,255,0.12)",
						color: "#fff",
					},
				}}
			/>
			<Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
			<main className="flex-1">
				<Routes>
					<Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
					<Route
						path="/login"
						element={
							isAuthenticated ? (
								<Navigate to="/home" replace />
							) : (
								<Login setAuthenticated={setIsAuthenticated} />
							)
						}
					/>
					<Route
						path="/signup"
						element={isAuthenticated ? <Navigate to="/home" replace /> : <Signup />}
					/>
					<Route
						path="/home"
						element={
							isAuthenticated ? (
								<Home isAuthenticated={isAuthenticated} />
							) : (
								<Navigate to="/" replace />
							)
						}
					/>
					<Route
						path="/generate"
						element={
							isAuthenticated ? <Generate /> : <Navigate to="/login" replace />
						}
					/>
					<Route
						path="/score"
						element={isAuthenticated ? <Score /> : <Navigate to="/login" replace />}
					/>
					<Route
						path="/jobs"
						element={isAuthenticated ? <Jobs /> : <Navigate to="/login" replace />}
					/>
				</Routes>
			</main>
			<Footer isAuthenticated={isAuthenticated} />
		</div>
	);
};

export default App;
