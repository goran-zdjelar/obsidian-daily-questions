import {
	App,
	Editor,
	MarkdownView,
	Modal,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { getQuestionFromOpenAi, parseQuestions } from "./ai";
import { getRandomNumber } from "./utils";

interface ObsidianDailyQuestionSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: ObsidianDailyQuestionSettings = {
	mySetting: "default",
};

import { ExampleView, DAILY_QUESTIONS_VIEW } from "./view";

export default class ObsidianDailyQuestion extends Plugin {
	settings: ObsidianDailyQuestionSettings;

	async onload() {
		await this.loadSettings();

		this.registerView(
			DAILY_QUESTIONS_VIEW,
			(leaf) => new ExampleView(leaf)
		);

		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Daily Questions",
			(evt: MouseEvent) => {
				this.activateView();
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// console.log(this.app.fileManager);

		// // This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: "open-sample-modal-simple",
		// 	name: "Open sample modal (simple)",
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	},
		// });
		// // This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: "sample-editor-command",
		// 	name: "Sample editor command",
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection("Sample Editor Command");
		// 	},
		// });
		// // This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: "open-sample-modal-complex",
		// 	name: "Open sample modal (complex)",
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView =
		// 			this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	},
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, "click", (evt: MouseEvent) => {
		// 	console.log("click", evt);
		// });

		// // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(
		// 	window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		// );
	}

	onunload() {
		this.app.workspace.detachLeavesOfType(DAILY_QUESTIONS_VIEW);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async activateView() {
		const test = this.app.vault.getMarkdownFiles();

		// const randomNumber = getRandomNumber(0, test.length - 1);

		// const file = await this.app.vault.read(test[randomNumber]);

		// const questions = await getQuestionFromOpenAi(file);

		// console.log(questions);

		this.app.workspace.detachLeavesOfType(DAILY_QUESTIONS_VIEW);

		await this.app.workspace.getRightLeaf(false).setViewState({
			type: DAILY_QUESTIONS_VIEW,
			active: true,
		});

		this.app.workspace.revealLeaf(
			this.app.workspace.getLeavesOfType(DAILY_QUESTIONS_VIEW)[0]
		);
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: ObsidianDailyQuestion;

	constructor(app: App, plugin: ObsidianDailyQuestion) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl("h2", { text: "Settings for my awesome plugin." });

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						console.log("Secret: " + value);
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}