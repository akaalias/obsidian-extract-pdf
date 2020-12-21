import {Plugin, addIcon, Notice} from "obsidian"
import {parse} from 'node_modules/@opendocsg/pdf2md/lib/util/pdf';
import {makeTransformations, transform} from 'node_modules/@opendocsg/pdf2md/lib/util/transformations';
import pdfjs from 'node_modules/pdfjs-dist/build/pdf';
import worker from 'node_modules/pdfjs-dist/build/pdf.worker.entry';

addIcon('extract', '<path d="M16 71.25L16 24.5C16 19.8056 19.8056 16 24.5 16L71.25 16C75.9444 16 79.75 19.8056 79.75 24.5L79.75 41.5L71.25 41.5L71.25 24.5L24.5 24.5L24.5 71.25L41.5 71.25L41.5 79.75L24.5 79.75C19.8056 79.75 16 75.9444 16 71.25ZM42.7452 48.725L48.7547 42.7325L75.5 69.4778L75.5 54.25L84 54.25L84 84L54.25 84L54.25 75.5L69.4862 75.5L42.7452 48.725Z" fill="black" fill-opacity="0.5"/>')

export default class ExtractPDFPlugin extends Plugin {

	async onload() {
		this.addRibbonIcon('extract', 'Extract PDF', () => {
			this.extract();
		});
	}

	async extract() {

		let activeLeaf: any = this.app.workspace.activeLeaf ?? null
		let pdfPath = activeLeaf?.view.file.path;

		if(!pdfPath.endsWith(".pdf")) return;

		const vaultPath = activeLeaf?.view.file.vault.adapter.basePath;
		const onlyPath = vaultPath + "/" + pdfPath;
		const fullPath = "file://" + onlyPath;

		pdfjs.GlobalWorkerOptions.workerSrc = worker;

		// @ts-ignore
		var loadingTask = pdfjsLib.getDocument(fullPath);

		var resultMD = await loadingTask.promise
			// @ts-ignore
			.then(async function (doc) {
				var result = await parse(doc);
				const {fonts, pages} = result
				const transformations = makeTransformations(fonts.map)
				const parseResult = transform(pages, transformations)
				const text = parseResult.pages
					// @ts-ignore
					.map(page => page.items.join('\n') + '\n')
					.join('')

				return text;
			});

		const filePath = pdfPath.replace(".pdf", ".md");

		this.saveToClipboard(resultMD);
		await this.saveToFile(filePath, resultMD);
        await this.app.workspace.openLinkText(filePath, filePath, true);
    }

	saveToClipboard(data: string) {
		if (data.length > 0) {
			navigator.clipboard.writeText(data);
			new Notice("Copied to clipboard!");
		} else {
			new Notice( "No text found");
		}
	}

	async saveToFile(filePath: string, mdString: string) {
		//If files exists then append conent to existing file
		const fileExists = await this.app.vault.adapter.exists(filePath);
		if (fileExists) {
		} else {
			await this.app.vault.create(filePath, mdString);
		}
	}
}
