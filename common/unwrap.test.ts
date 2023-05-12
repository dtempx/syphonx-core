import { expect } from "chai";
import { unwrap } from "./unwrap.js";

describe("unwrap", () => {
    const obj = unwrap({
        "a": {
            "key": "a",
            "value": "xyz",
            "nodes": ["h1"]
        },
        "b": {
            "key": "b",
            "nodes": []
        },
        "c": null
    }) as Record<string, unknown>;
    it("a has expected value", () => expect(obj.a).equals("xyz"));
    it("b has expected value", () => expect(obj.b).equals(null));
    it("c has expected value", () => expect(obj.c).equals(null));
});
