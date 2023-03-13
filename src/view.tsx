import { ItemView, WorkspaceLeaf } from "obsidian";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { AppContext } from "./context";
import { Questions } from "./components/questions.component";

export const DAILY_QUESTIONS_VIEW = "example-view";

export class ExampleView extends ItemView {
	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	root = createRoot(this.containerEl.children[1]);

	getViewType() {
		return DAILY_QUESTIONS_VIEW;
	}

	getDisplayText() {
		return "Example view";
	}

	async onOpen() {
		this.root.render(
			<React.StrictMode>
				<AppContext.Provider value={this.app}>
					<Questions />
				</AppContext.Provider>
			</React.StrictMode>
		);
	}

	async onClose() {
		this.root.unmount();
	}
}
