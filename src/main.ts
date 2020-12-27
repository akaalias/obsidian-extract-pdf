import {Plugin, addIcon, Notice, Modal, App, Workspace} from "obsidian"
import {parse} from 'node_modules/pdf2md/lib/util/pdf';
import {makeTransformations, transform} from 'node_modules/pdf2md/lib/util/transformations';
import pdfjs from 'node_modules/pdfjs-dist/build/pdf';
import ExtractPDFSettings from "./ExtractPDFSettings";
import ExtractPDFSettingsTab from "./ExtractPDFSettingsTab";

addIcon('extract', '<path d="M16 71.25L16 24.5C16 19.8056 19.8056 16 24.5 16L71.25 16C75.9444 16 79.75 19.8056 79.75 24.5L79.75 41.5L71.25 41.5L71.25 24.5L24.5 24.5L24.5 71.25L41.5 71.25L41.5 79.75L24.5 79.75C19.8056 79.75 16 75.9444 16 71.25ZM42.7452 48.725L48.7547 42.7325L75.5 69.4778L75.5 54.25L84 54.25L84 84L54.25 84L54.25 75.5L69.4862 75.5L42.7452 48.725Z" fill="white" fill-opacity="0.5"/>')

export default class ExtractPDFPlugin extends Plugin {
	public settings: ExtractPDFSettings;
	private modal: ProgressModal;

	async onload() {
		this.loadSettings();
		this.addSettingTab(new ExtractPDFSettingsTab(this.app, this));
		this.modal = new ProgressModal(this.app);

		this.addRibbonIcon('extract', 'PDF to Markdown', () => {
			this.extract();
		});
	}

	loadSettings() {
		this.settings = new ExtractPDFSettings();
		(async () => {
			const loadedSettings: ExtractPDFSettings = await this.loadData();
			if (loadedSettings) {
				console.log("Found existing settings file");
				this.settings.createNewFile = loadedSettings.createNewFile;
				this.settings.copyToClipboard = loadedSettings.copyToClipboard;
			} else {
				console.log("No settings file found, saving...");
				this.saveData(this.settings);
			}
		})();
	}

	async extract()  {
		let file = this.app.workspace.getActiveFile();

		if(file === null) return;
		if(file.extension !== 'pdf') return;

		let arrayBuffer = await this.app.vault.readBinary(file);
		let doc = await pdfjs.getDocument(arrayBuffer).promise;

		this.modal.fileName = file.name;
		this.modal.open();

		var result = await parse(doc);
		const {fonts, pages} = result
		const transformations = makeTransformations(fonts.map)
		const parseResult = transform(pages, transformations)
		const resultMD = parseResult.pages
			// @ts-ignore
			.map(page => page.items.join('\n'))
			.join('---\n\n')

		const filePath = file.name.replace(".pdf", ".md");

		if(this.settings.copyToClipboard) {
			this.saveToClipboard(resultMD);
		}

		if(this.settings.createNewFile) {
			await this.saveToFile(filePath, resultMD);
			await this.app.workspace.openLinkText(filePath, '', true);
		}

		this.modal.close();

	}

	saveToClipboard(data: string) {
		if (data.length > 0) {
			navigator.clipboard.writeText(data);
  		} else {
			new Notice( "No text found");
		}
	}

	async saveToFile(filePath: string, mdString: string) {
		const fileExists = await this.app.vault.adapter.exists(filePath);
		if (fileExists) {
			await this.appendFile(filePath, mdString);
		} else {
			await this.app.vault.create(filePath, mdString);
		}
	}

	async appendFile(filePath: string, note: string) {
		let existingContent = await this.app.vault.adapter.read(filePath);
		if(existingContent.length > 0) {
			existingContent = existingContent + '\r\r';
		}
		await this.app.vault.adapter.write(filePath, existingContent + note);
	}
}

class ProgressModal extends Modal {
	public fileName: string;

	constructor(app: App) {
		super(app);
	}

	onOpen() {
		let {contentEl} = this;
		contentEl.createEl("h2", {text: "Extract PDF Plugin"});
		contentEl.createEl("p", {text: 'Processing ' + this.fileName});
	}

	onClose() {
		let {contentEl} = this;
		contentEl.empty();
	}
}