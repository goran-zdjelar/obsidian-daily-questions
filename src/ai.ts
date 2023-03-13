import * as dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

const basePath = (app.vault.adapter as any).basePath;

dotenv.config({
	path: `${basePath}/.obsidian/plugins/obsidian-daily-questions/.env`,
	debug: false,
});

const configuration = new Configuration({
	apiKey: process.env.OPENAI_APIKEY,
});

const openai = new OpenAIApi(configuration);

export async function getQuestionFromOpenAi(text: string) {
	const response = await openai.createCompletion({
		model: "text-davinci-003",
		prompt: `Read following text and ask me up to 5 questions as a quiz. Don't provide answers: ${text}`,
		temperature: 0.7,
		max_tokens: 1000,
		top_p: 1,
		frequency_penalty: 0,
		presence_penalty: 0,
	});

	return parseQuestions(response.data.choices[0].text);
}

export function parseQuestions(text?: string): String[] {
	if (!text) {
		return [];
	}

	return text
		.trim()
		.split(/\d{1}\.\s?/)
		.map((part) => part.replace("\n", ""))
		.filter(Boolean);
}
