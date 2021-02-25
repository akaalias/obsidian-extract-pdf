## Extract PDF text to Markdown

Allows you to extract the basic textual content of a PDF into a Markdown file. Works well with headings, paragraphs and lists.

### Demo

![](https://github.com/akaalias/obsidian-extract-pdf/blob/master/demo.gif?raw=true)

### How to use this plugin

After you've installed and activated the plugin:

1. Drag your PDF into Obsidian
2. Open the PDF within Obsidian
3. Make sure the pane with your PDF is focused
4. Click the "PDF to Markdown" button in the sidebar
5. Edit the generated markdown file to your needs

### Tips & Tricks for editing the generated markdown file

I just went ahead and turned a 500 page PDF into markdown and found that it worked better and faster than I expected.

#### Bulk-removing page footers

The book I used had the same footer on every page. That means they got copied into the markdown file over and over, too.

For bulk search-and-replace I use the Atom editor (https://atom.io):

0. Copy the footer text into your clipboard
1. Download and install Atom
2. Open Atom and open the Markdown file inside
3. Use "Find -> Find in Buffer" and paste the footer text
4. Use the button "Replace" or "Replace All" to remove footer text

#### Remove a single space before a new line of text

Weirdly, sometimes, new lines of text had a space infront of them. Such as:

` Some text`

...which resulted in Obisidian treating it as a sub-block of the preceding line.

To remove the space for those lines, I used a regular expression search-and-replace:

1. In "Find in current buffer" activate "Regex Search" (The `.*` icon)
2. Enter `^([ ]|\t)+` into the search field
4. Use the button "Replace" or "Replace All" to remove the space

## Known issues

### First-time use

If you had a PDF open in Obisidian _before_ you installed and activated the plugin, hitting the button may not work. I've had this issue with other plugins as well. The code just doesn't hook up to already-open files.

The solution is to simply close the PDF note and re-open it. That will allow the plugin to hook into it.

### Limited PDF parsing

Please understand that this is a basic, best-effort tool to get basic text and headings from a PDF. It really just gets the text from a pdf and turns it into Markdown. The plugin doesn't handle anything more complex, like tables, images, annotations etc:

- Does not turn PDF highlights and annotations into MD highlights
- Does not retain PDF numbered lists
- Does not skip text in headers and footers
