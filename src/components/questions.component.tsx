import { Notice } from "obsidian";
import * as React from "react";
import { getQuestionFromOpenAi } from "../ai";
import { useApp } from "../hooks";
import { getRandomNumber } from "../utils";

export function Questions() {
	const app = useApp();
	const [isLoading, setIsLoading] = React.useState(false);
	const [hasErrorOccurred, setHasErrorOcurred] = React.useState(false);
	const [questions, setQuestions] = React.useState<String[]>([]);
	const [relatedTo, setRelatedTo] = React.useState<String>("");

	return (
		<div>
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
				<>
					<h4>
						Questions {relatedTo ? `related to "${relatedTo}"` : ""}
						:
					</h4>

					<ol>
						{questions.map((question, index) => (
							<li key={index} style={{ marginBottom: "10px" }}>
								{question}
							</li>
						))}
					</ol>
				</>
			) : null}

			<div>
				<button
					onClick={async () => {
						setIsLoading(true);
						setHasErrorOcurred(false);

						const currentFile = app?.workspace.getActiveFile();

						if (!currentFile) {
							new Notice(
								"There was an issue while reading current note"
							);
							setHasErrorOcurred(true);
							return;
						}

						const currentFileContent = await app?.vault.read(
							currentFile
						);

						if (!currentFileContent) {
							new Notice(
								"There was an issue while reading current note content"
							);
							setHasErrorOcurred(true);
							return;
						}

						const aiQuestions = await getQuestionFromOpenAi(
							currentFileContent
						);

						setIsLoading(false);
						setHasErrorOcurred(false);
						setQuestions(aiQuestions);
					}}
				>
					Generate quiz questions for this note
				</button>
				<button
					onClick={async () => {
						setQuestions([]);
						setIsLoading(true);
						setHasErrorOcurred(false);

						const allNotes = app?.vault.getMarkdownFiles();
						const randomNote =
							allNotes?.[getRandomNumber(0, allNotes.length - 1)];

						if (!randomNote) {
							new Notice(
								"There was an issue while reading current note"
							);
							setHasErrorOcurred(true);
							return;
						}

						const currentFileContent = await app?.vault.read(
							randomNote
						);

						if (!currentFileContent) {
							new Notice(
								"There was an issue while reading current note content"
							);
							setHasErrorOcurred(true);
							return;
						}

						const aiQuestions = await getQuestionFromOpenAi(
							currentFileContent
						);

						setRelatedTo(randomNote.basename);
						setIsLoading(false);
						setHasErrorOcurred(false);
						setQuestions(aiQuestions);
					}}
				>
					Generate quiz questions for a random note
				</button>
			</div>
		</div>
	);
}
