import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

/**
 * Authentication Middleware
 * Verifies the JWT token from the HttpOnly session cookie.
 * Attaches the decoded user payload (e.g., { id }) to req.user.
 * Returns 401 if token is missing or invalid.
 */
const auth = (req, res, next) => {
	try {
		const token = req.cookies?.jobgenie_token;

		if (!token) {
			return res
				.status(401)
				.json({ message: "Access denied. No token provided." });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Attach user info to request for downstream use
		req.user = decoded;
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res
				.status(401)
				.json({ message: "Token expired. Please login again." });
		}
		return res
			.status(401)
			.json({ message: "Invalid token. Please login again." });
	}
};

export default auth;
