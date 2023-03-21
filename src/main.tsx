import { App, Plugin, PluginSettingTab } from "obsidian";
import { PluginSettings } from "./components/settings.component";

import * as ReactDOM from "react-dom";
import * as React from "react";

interface ObsidianDailyQuestionSettings {
	includeTags: string;
	excludeTags: string;
}

const DEFAULT_SETTINGS: ObsidianDailyQuestionSettings = {
	includeTags: "",
	excludeTags: "",
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
		ribbonIconEl.addClass("my-plugin-ribbon-class");

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

		this.addSettingTab(new SettingTab(this.app, this));

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

class SettingTab extends PluginSettingTab {
	plugin: ObsidianDailyQuestion;

	constructor(app: App, plugin: ObsidianDailyQuestion) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		const plugin = this.plugin;

		containerEl.createDiv();

		ReactDOM.render(
			<PluginSettings
				includeTags={plugin.settings.includeTags}
				excludeTags={plugin.settings.excludeTags}
				onChange={(settingKey: string, value: string) => {
					plugin.settings[settingKey] = value;
					plugin.saveSettings();
				}}
			/>,
			containerEl
		);
	}
}
