import { rateLimit } from "express-rate-limit";

const aiRateLimit = rateLimit({
	windowMs: 15 * 60 * 1000,
	limit: 10,
	standardHeaders: "draft-8",
	legacyHeaders: false,
	message: { message: "Too many AI requests. Please try again in 15 minutes." },
});

export default aiRateLimit;
