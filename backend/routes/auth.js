import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"; // adjust to your model path

const router = express.Router();

const isProd = process.env.NODE_ENV === "production";

// Cross-site cookie settings (Vercel frontend <-> Render backend)
const cookieOptions = {
	httpOnly: true,
	secure: isProd,
	sameSite: "lax",
	maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	path: "/",
};

const signToken = (userId) =>
	jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// REGISTER
router.post("/register", async (req, res) => {
	try {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const existing = await User.findOne({ email });
		if (existing) {
			return res.status(400).json({ message: "User already exists" });
		}

		const hashed = await bcrypt.hash(password, 10);
		const user = await User.create({ name, email, password: hashed });

		const token = signToken(user._id);
		res.cookie("token", token, cookieOptions);

		res.status(201).json({
			token, // also returned so the frontend can use a Bearer header if cookies get blocked
			user: { id: user._id, name: user.name, email: user.email },
		});
	} catch (error) {
		console.error("REGISTER ERROR:", error.name);
		res.status(500).json({ message: "Internal server error" });
	}
});

// LOGIN
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ message: "Email and password are required" });
		}

		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			return res.status(400).json({ message: "Invalid credentials" });
		}

		const token = signToken(user._id);
		res.cookie("token", token, cookieOptions);

		res.json({
			token,
			user: { id: user._id, name: user.name, email: user.email },
		});
	} catch (error) {
		console.error("LOGIN ERROR:", error.name);
		res.status(500).json({ message: "Internal server error" });
	}
});

// LOGOUT — clearCookie must use the same options (minus maxAge)
router.post("/logout", (req, res) => {
	const { maxAge, ...clearOptions } = cookieOptions;
	res.clearCookie("token", clearOptions);
	res.json({ message: "Logged out" });
});

export default router;