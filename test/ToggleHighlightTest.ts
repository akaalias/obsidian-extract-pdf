import 'mocha';
import {assert} from 'chai';
import ToggleHighlight from "../src/ToggleHighlight";

let subject: ToggleHighlight = null;

describe("Toggle Highlights", () => {
    before(async () => {
        subject = new ToggleHighlight();
    });

    describe("Empty input", () => {
        it("Returns an empty string", () => {
            const result = subject.toggleHighlight("");
            assert.equal(result, "");
        });
    });

    describe("Turning Highlights ON", () => {
        it("Returns everything when there is no period", () => {
            const result = subject.toggleHighlight("Foo", 0);
            assert.equal(result, "==Foo==");
        });

        it("Returns first highlighted sentence", () => {
            const result = subject.toggleHighlight("Foo.", 0);
            assert.equal(result, "==Foo.==");
        });

        it("Returns first highlighted sentence with cursor position 0", () => {
            const result = subject.toggleHighlight("Foo. Bar. Baz.", 0);
            assert.equal(result, "==Foo.== Bar. Baz.");
        });

        it("Returns first highlighted sentence with cursor position 1", () => {
            const result = subject.toggleHighlight("Foo. Bar. Baz.", 1);
            assert.equal(result, "==Foo.== Bar. Baz.");
        });

        it("Returns second highlighted sentence with cursor position 6", () => {
            const result = subject.toggleHighlight("Foo. Bar. Baz.", 6);
            assert.equal(result, "Foo. ==Bar.== Baz.");
        });

        it("Returns second highlighted sentence with cursor position 8", () => {
            const result = subject.toggleHighlight("Foo. Bar. Baz.", 8);
            assert.equal(result, "Foo. ==Bar.== Baz.");
        });

        it("Returns second highlighted sentence with cursor position 10", () => {
            const result = subject.toggleHighlight("==Foo.== Bar. Baz.", 10);
            assert.equal(result, "==Foo.== ==Bar.== Baz.");
        });

    });

    describe("Turning Highlights OFF", () => {
        it("Returns sentence", () => {
            const result = subject.toggleHighlight("==Foo.==", 2);
            assert.equal(result, "Foo.");
        });

        it("Returns first un-highlighted and second sentence", () => {
            const result = subject.toggleHighlight("==Foo.== Bar.", 2);
            assert.equal(result, "Foo. Bar.");
        });

        it("Returns first sentence un-highlighted", () => {
            const result = subject.toggleHighlight("==Foo.== ==Bar.==", 2);
            assert.equal(result, "Foo. ==Bar.==");
        });

        it("Returns second sentence un-highlighted", () => {
            const result = subject.toggleHighlight("==Foo.== ==Bar.==", 11);
            assert.equal(result, "==Foo.== Bar.");
        });
    });
});