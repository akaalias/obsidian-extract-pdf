## Extract PDF text to Markdown

Allows you to extract the basic textual content of a PDF into a Markdown file. Works well with headings, paragraphs and lists.

### Demo

![](https://github.com/akaalias/extract-pdf-obsidian/blob/main/demo.gif?raw=true)

### How to use this plugin

1. Install the plugin
2. Activate the plugin
3. Open a PDF file
4. Click the "PDF to Markdown" button in the sidebar
5. Edit the generated markdown file to your needs

## Known issues

### First-time use

If you had a PDF open in Obisidian _before_ you installed and activated the plugin, hitting the button may not work. I've had this issue with other plugins as well. The code just doesn't hook up to already-open files. 

The solution is to simply close the PDF note and re-open it. That will allow the plugin to hook into it.

### Limited PDF parsing
Please understand that this is a basic, best-effort tool to get basic text and headings from a PDF. It really just gets the text from a pdf and turns it into Markdown. The plugin doesn't handle anything more complex, like tables, images, annotations etc: 

- Does not turn PDF highlights and annotations into MD highlights
- Does not retain PDF numbered lists
- Does not skip text in headers and footers
