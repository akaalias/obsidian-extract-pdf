import {Plugin, addIcon, Notice} from "obsidian"
import {parse} from 'node_modules/@opendocsg/pdf2md/lib/util/pdf';
import {makeTransformations, transform} from 'node_modules/@opendocsg/pdf2md/lib/util/transformations';
import pdfjs from 'node_modules/pdfjs-dist/build/pdf';
import worker from 'node_modules/pdfjs-dist/build/pdf.worker.entry';

addIcon('target', '<path d="M50 88C29.0132 88 12 70.9868 12 50C12 29.0132 29.0132 12 50 12C70.9868 12 88 29.0132 88 50C87.9761 70.9769 70.9769 87.9761 50 88ZM50 22.8571C35.0094 22.8571 22.8571 35.0094 22.8571 50C22.8571 64.9906 35.0094 77.1429 50 77.1429C64.9906 77.1429 77.1429 64.9906 77.1429 50C77.1429 35.0094 64.9906 22.8571 50 22.8571ZM50 66.2857C41.0056 66.2857 33.7143 58.9943 33.7143 50C33.7143 41.0056 41.0056 33.7143 50 33.7143C58.9943 33.7143 66.2857 41.0056 66.2857 50C66.2857 54.3192 64.5699 58.4616 61.5157 61.5157C58.4616 64.5699 54.3192 66.2857 50 66.2857Z" fill="#646464"/>')

export default class ExtractPDFPlugin extends Plugin {

	async onload() {
		this.addRibbonIcon('target', 'Extract PDF', () => {
			this.extract();
		});
	}

	async extract() {
		let activeLeaf: any = this.app.workspace.activeLeaf ?? null
		let pdfPath = activeLeaf?.view.file.path;
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

		this.saveToClipboard(resultMD);
	}

	saveToClipboard(data: string) {
		if (data.length > 0) {
			navigator.clipboard.writeText(data);
			new Notice("Copied to clipboard!");
		} else {
			new Notice( "No text found");
		}
	}
}
