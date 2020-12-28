import ExtractPDFPlugin from "./main";
import {App, PluginSettingTab, Setting} from "obsidian";

export default class ExtractPDFSettingsTab extends PluginSettingTab {

    private readonly plugin: ExtractPDFPlugin;

    constructor(app: App, plugin: ExtractPDFPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        containerEl.createEl("h2", {text: "Extract Highlights Plugin"});
        containerEl.createEl("p", {text: "When invoked, will parse the currently focused PDF and copy its content to the cilpboard."});

        new Setting(containerEl)
            .setName('Create new file')
            .setDesc(
                'If enabled, will automatically create a new .md file from the PDF',
            )
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.createNewFile).onChange((value) => {
                    this.plugin.settings.createNewFile = value;
                    this.plugin.saveData(this.plugin.settings);
                }),
            );


        new Setting(containerEl)
            .setName('Copy content to clipboard')
            .setDesc(
                'If enabled, will copy the extracted Markdown to your clipboard',
            )
            .addToggle((toggle) =>
                toggle.setValue(this.plugin.settings.copyToClipboard).onChange((value) => {
                    this.plugin.settings.copyToClipboard = value;
                    this.plugin.saveData(this.plugin.settings);
                }),
            );
    }
}