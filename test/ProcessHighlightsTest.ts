import 'mocha';
import {assert} from 'chai';
import ToggleHighlight from "../src/ProcessHighlights";

let subject: ToggleHighlight = null;

describe("Process Highlights", () => {
    before(async () => {
        subject = new ToggleHighlight(false);
    });

    describe("Empty input processing", () => {
        it("Returns an empty string", () => {
            const result = subject.process("");
            assert.equal(result, "");
        });

        it("Returns an empty string if there's no highlight", () => {
            const result = subject.process("Foo.");
            assert.equal(result, "");
        });
    });

    describe("Extracts highlights", () => {
        context("Basic markdown == highlights", () => {
            it("Returns a single list-item", () => {
                const result = subject.process("==Foo.==");
                assert.equal(result, "- Foo.\n");
            });

            it("Returns two list-items", () => {
                const result = subject.process("==Foo.== ==Bar.==");
                assert.equal(result, "- Foo.\n- Bar.\n");
            });

            it("Returns only two list-items", () => {
                const result = subject.process("==Foo.== Baz. ==Bar.==");
                assert.equal(result, "- Foo.\n- Bar.\n");
            });

            it("Returns two list-items from different lines", () => {
                const result = subject.process("==Foo.== Bar\nBaz ==Quux.== Quz\n");
                assert.equal(result, "- Foo.\n- Quux.\n");
            });
        });

        context("Default mark-tags highlights", () => {
            it("Returns a single list-item", () => {
                const result = subject.process("<mark>Foo.</mark>");
                assert.equal(result, "- Foo.\n");
            });

            it("Returns two list-items", () => {
                const result = subject.process("<mark>Foo.</mark> <mark>Bar.</mark>>");
                assert.equal(result, "- Foo.\n- Bar.\n");
            });

            it("Returns only two list-items", () => {
                const result = subject.process("<mark>Foo.</mark> Baz. <mark>Bar.</mark>");
                assert.equal(result, "- Foo.\n- Bar.\n");
            });

            it("Returns two list-items from different lines", () => {
                const result = subject.process("<mark>Foo.</mark> Bar\nBaz <mark>Quux.</mark> Quz\n");
                assert.equal(result, "- Foo.\n- Quux.\n");
            });
        });

        context("Optional markdown bold highlights", () => {
            context("Bold highlights disabled", () => {
                let newSubject = new ToggleHighlight(false);

                it("Returns an empty string", () => {
                    const result = newSubject.process("**Foo.**");
                    assert.equal(result, "");
                });
            });

            context("Bold highlights enabled", () => {
                let newSubject = new ToggleHighlight(true);

                it("Returns a single list-item", () => {
                    const result = newSubject.process("**Foo.**");
                    assert.equal(result, "- Foo.\n");
                });

                it("Returns two list-items", () => {
                    const result = newSubject.process("**Foo.** **Bar.**");
                    assert.equal(result, "- Foo.\n- Bar.\n");
                });

                it("Returns only two list-items", () => {
                    const result = newSubject.process("**Foo.** Baz. **Bar.**");
                    assert.equal(result, "- Foo.\n- Bar.\n");
                });

                it("Returns two list-items from different lines", () => {
                    const result = newSubject.process("**Foo.** Bar\nBaz **Quux.** Quz\n");
                    assert.equal(result, "- Foo.\n- Quux.\n");
                });
            });
        });
    });
});



