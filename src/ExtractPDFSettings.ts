export default class ExtractPDFSettings {
    public createNewFile: boolean;
    public copyToClipboard: boolean;

    constructor() {
        this.createNewFile = true;
        this.copyToClipboard = true;
    }
}