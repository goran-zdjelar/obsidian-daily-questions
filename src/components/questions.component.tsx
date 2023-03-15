import { Notice } from "obsidian";
import * as React from "react";
import { getQuestionFromOpenAi } from "../ai";
import { useApp } from "../hooks";

export function Questions() {
	const app = useApp();
	const [isLoading, setIsLoading] = React.useState(true);
	const [hasErrorOccurred, setHasErrorOcurred] = React.useState(false);
	const [questions, setQuestions] = React.useState<String[]>([]);

	React.useEffect(() => {
		async function fetchFileContent() {
			const currentFile = app?.workspace.getActiveFile();

			if (!currentFile) {
				new Notice("There was an issue while reading current note");
				setHasErrorOcurred(true);
				return;
			}

			const currentFileContent = await app?.vault.read(currentFile);

			if (!currentFileContent) {
				new Notice(
					"There was an issue while reading current note content"
				);
				setHasErrorOcurred(true);
				return;
			}

			const aiQuestions = await getQuestionFromOpenAi(currentFileContent);

			setIsLoading(false);
			setHasErrorOcurred(false);
			setQuestions(aiQuestions);
		}

		fetchFileContent();
	}, []);

	return (
		<div>
			<h4>Questions:</h4>
			{isLoading && !hasErrorOccurred ? (
				<p>Preparing questions...</p>
			) : null}
			{hasErrorOccurred ? (
				<p>
					There was an error while fetching questions. Please try
					again.
				</p>
			) : null}

			{questions.length > 0 && !isLoading && !hasErrorOccurred ? (
				<ol>
					{questions.map((question, index) => (
						<li key={index} style={{ marginBottom: "10px" }}>
							{question}
						</li>
					))}
				</ol>
			) : null}
		</div>
	);
}
