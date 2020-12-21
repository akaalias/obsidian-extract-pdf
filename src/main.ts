import {Plugin,addIcon} from "obsidian"

addIcon('target', '<path d="M50 88C29.0132 88 12 70.9868 12 50C12 29.0132 29.0132 12 50 12C70.9868 12 88 29.0132 88 50C87.9761 70.9769 70.9769 87.9761 50 88ZM50 22.8571C35.0094 22.8571 22.8571 35.0094 22.8571 50C22.8571 64.9906 35.0094 77.1429 50 77.1429C64.9906 77.1429 77.1429 64.9906 77.1429 50C77.1429 35.0094 64.9906 22.8571 50 22.8571ZM50 66.2857C41.0056 66.2857 33.7143 58.9943 33.7143 50C33.7143 41.0056 41.0056 33.7143 50 33.7143C58.9943 33.7143 66.2857 41.0056 66.2857 50C66.2857 54.3192 64.5699 58.4616 61.5157 61.5157C58.4616 64.5699 54.3192 66.2857 50 66.2857Z" fill="#646464"/>')

export default class ExtractPDFPlugin extends Plugin {

	async onload() {
		this.addRibbonIcon('target', 'Extract PDF', () => {
			this.extractPDF();
		});
	}

	extractPDF(): void {
		let activeLeaf: any = this.app.workspace.activeLeaf ?? null

		try {
			if (this.app.workspace.activeLeaf?.view.icon == "pdf-file") {
				console.log("Process PDF");
				var pdfPath = activeLeaf?.view.file.path;
				
				console.log(pdfPath);

				const vaultPath = activeLeaf?.view.file.vault.adapter.basePath;
				const path = "file://" + vaultPath + "/" + pdfPath;

				// @ts-ignore
				var loadingTask = pdfjsLib.getDocument(path);

				loadingTask.promise
					// @ts-ignore
					.then(function (doc) {
						var numPages = doc.numPages;
						console.log("# Document Loaded");
						console.log("Number of Pages: " + numPages);
						console.log();

						var lastPromise; // will be used to chain promises
						// @ts-ignore
						lastPromise = doc.getMetadata().then(function (data) {
							console.log("# Metadata Is Loaded");
							console.log("## Info");
							console.log(JSON.stringify(data.info, null, 2));
							console.log();
							if (data.metadata) {
								console.log("## Metadata");
								console.log(JSON.stringify(data.metadata.getAll(), null, 2));
								console.log();
							}
						});

						// @ts-ignore
						var loadPage = function (pageNum) {
							// @ts-ignore
							return doc.getPage(pageNum).then(function (page) {
								console.log("# Page " + pageNum);
								var viewport = page.getViewport({ scale: 1.0 });
								console.log("Size: " + viewport.width + "x" + viewport.height);
								console.log();
								return page
									.getTextContent()
									// @ts-ignore
									.then(function (content) {
										// Content contains lots of information about the text layout and
										// styles, but we need only strings at the moment
										// @ts-ignore
										var strings = content.items.map(function (item) {
											return item.str;
										});
										console.log("## Text Content");
										console.log(strings.join(" "));
									})
									.then(function () {
										console.log();
									});
							});
						};
						// Loading of the first page will wait on metadata and subsequent loadings
						// will wait on the previous pages.
						for (var i = 1; i <= numPages; i++) {
							lastPromise = lastPromise.then(loadPage.bind(null, i));
						}
						return lastPromise;
					})
					.then(
						function () {
							console.log("# End of Document");
						},
						// @ts-ignore
						function (err) {
							console.error("Error: " + err);
						}
					);

			}
		} catch (e) {
			console.log(e.message)
		}
	}
}
