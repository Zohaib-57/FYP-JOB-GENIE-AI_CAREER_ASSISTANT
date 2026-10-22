import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./db/db.js";
import authRoutes from "./routes/auth.js";
import resumeRoutes from "./routes/resume.js";
import jobRoutes from "./routes/jobs.js";

dotenv.config();

const app = express();

// ✅ CORS — allow the configured frontend and Vite's common local dev ports
const allowedOrigins = new Set([
	process.env.CLIENT_URL || "http://localhost:5173",
	...(process.env.NODE_ENV === "production"
		? []
		: [
				"http://localhost:5173",
				"http://localhost:5174",
				"http://127.0.0.1:5173",
				"http://127.0.0.1:5174",
			]),
]);

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || allowedOrigins.has(origin)) {
				callback(null, true);
				return;
			}
			callback(new Error("Not allowed by CORS"));
		},
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

app.use(express.json());
app.use(cookieParser());

// Wait for the database before accepting API traffic.
await connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/jobs", jobRoutes);

// health check
app.get("/", (req, res) => {
	res.json({ status: "API Running", timestamp: new Date().toISOString() });
});

app.use((error, req, res, next) => {
	if (res.headersSent) return next(error);

	const isUploadError =
		error.code?.startsWith("LIMIT_") ||
		error.message === "Only PDF and DOCX files are allowed";
	const status =
		error.code === "LIMIT_FILE_SIZE" || error.status === 413
			? 413
			: isUploadError
				? 400
				: 500;
	const message =
		status === 413
			? "Request or uploaded file exceeds the allowed size."
			: status === 400
				? error.message
				: "Internal server error";

	console.error("REQUEST ERROR:", error.name);
	res.status(status).json({ message });
});

// server — use PORT from .env
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`✅ Server running on port ${PORT}`);
	console.log(
		`✅ CORS allowed origin: ${process.env.CLIENT_URL || "http://localhost:5173"}`,
	);
});
