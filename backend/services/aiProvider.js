import { GoogleGenerativeAI } from "@google/generative-ai";
import OpenAI from "openai";

const parseJSON = (text) => {
	try {
		return JSON.parse(text.replace(/```json\n?|\n?```/g, "").trim());
	} catch {
		const match = text.match(/\{[\s\S]*\}/);
		if (!match) throw new Error("AI response was not valid JSON");
		return JSON.parse(match[0]);
	}
};

export const runWithProviderFallback = async (providers, run) => {
	const errors = [];
	for (const provider of providers) {
		try {
			return await run(provider);
		} catch (error) {
			errors.push(error);
			console.warn(
				`AI provider ${provider.name} failed; trying fallback if available.`,
			);
		}
	}

	const error = new Error("All configured AI providers failed");
	error.name = "AIProviderError";
	error.status = errors.at(-1)?.status;
	throw error;
};

const createProviders = () => {
	const providers = [];

	if (process.env.QWEN_API_KEY) {
		const client = new OpenAI({
			apiKey: process.env.QWEN_API_KEY,
			baseURL:
				process.env.QWEN_BASE_URL ||
				"https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
			timeout: 45000,
			maxRetries: 0,
		});
		providers.push({
			name: "Qwen",
			generate: async (prompt) => {
				const response = await client.chat.completions.create({
					model: process.env.QWEN_MODEL || "qwen-plus",
					messages: [{ role: "user", content: prompt }],
					response_format: { type: "json_object" },
				});
				return response.choices[0]?.message?.content || "";
			},
		});
	}

	if (process.env.GEMINI_API_KEY) {
		const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
		const model = client.getGenerativeModel({
			model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
			generationConfig: { responseMimeType: "application/json" },
		});
		providers.push({
			name: "Gemini",
			generate: async (prompt) => {
				const response = await model.generateContent(prompt);
				return response.response.text();
			},
		});
	}

	return providers;
};

export const generateAIJSON = async (prompt, validate) => {
	const providers = createProviders();
	if (providers.length === 0) {
		const error = new Error("Configure QWEN_API_KEY or GEMINI_API_KEY");
		error.name = "AIProviderError";
		error.status = 503;
		throw error;
	}

	return runWithProviderFallback(providers, async (provider) => {
		const result = parseJSON(await provider.generate(prompt));
		if (validate && validate(result) === false) {
			throw new Error("AI response did not match the required structure");
		}
		return result;
	});
};
