import { ParsedEvent, ReconnectInterval } from "eventsource-parser";
import Image from "next/image";

export default function Home() {
	const prompt =
		'Generate 3 twitter biographies with no hashtags and clearly labeled "1.", "2.", and "3.". Only return these 3 twitter bios, nothing else.';

	const generateBio = async () => {
		const response = await fetch(process.env.BASE_URL + "/api/openai", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				prompt,
			}),
		});

		if (!response.ok) {
			throw new Error(response.statusText);
		}

		// This data is a ReadableStream
		const data = response.body;
		if (!data) {
			return;
		}

		const onParseGPT = (event: ParsedEvent | ReconnectInterval) => {
			if (event.type === "event") {
				const data = event.data;
				try {
					const text = JSON.parse(data).text ?? "";
					console.log(text);
				} catch (e) {
					console.error(e);
				}
			}
		};
	};
	generateBio();

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
	);
}
