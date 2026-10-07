import express from "express";
import User from "../models/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth.js";

const router = express.Router();
const AUTH_COOKIE = "jobgenie_token";
const authCookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax",
	path: "/",
	maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ================= SIGNUP =================
router.post("/signup", async (req, res) => {
	try {
		const { name, email, password } = req.body;

		// check if user exists
		const userExists = await User.findOne({ email });
		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}

		// hash password
		const hashedPassword = await bcryptjs.hash(password, 10);

		// create user
		const user = await User.create({
			name,
			email,
			password: hashedPassword,
		});

		res.status(201).json({
			message: "User registered successfully",
		});
	} catch (error) {
		console.error("SIGNUP ERROR:", error.name);
		res.status(500).json({ message: "Unable to create account" });
	}
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body ?? {};
		if (
			typeof email !== "string" ||
			!email.trim() ||
			typeof password !== "string" ||
			!password
		) {
			return res.status(400).json({ message: "Email and password are required" });
		}

		// check user
		const user = await User.findOne({ email: email.trim() });
		if (!user) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		// check password
		const isMatch = await bcryptjs.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid email or password" });
		}

		// create JWT token
		const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});

		res.cookie(AUTH_COOKIE, token, authCookieOptions);
		res.json({
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		console.error("LOGIN ERROR:", error.name);
		res.status(500).json({ message: "Unable to log in" });
	}
});

router.post("/logout", (req, res) => {
	res.clearCookie(AUTH_COOKIE, { path: "/" });
	res.sendStatus(204);
});

// ================= GET CURRENT USER =================
router.get("/me", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		if (!user) return res.status(401).json({ message: "Invalid session" });

		res.json({ user });
	} catch (error) {
		console.error("CURRENT USER ERROR:", error.name);
		res.status(500).json({ message: "Unable to load account" });
	}
});

export default router;
