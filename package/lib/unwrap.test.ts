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
            "nodes": [],
            "value": null
        },
        "c": null,
        "d": {
            "key": "d",
            "nodes": [],
            "value": {
                "name": "xyz"
            }
        },
        "e": {
            "key": "e",
            "nodes": [],
            "value": ["abc", "def", "ghi"]
        },
        "f": {
            "key": "f",
            "nodes": [],
            "value": [{ "name": "abc" }, { "name": "def" }, { "name": "ghi" }]
        },
        "g": {
            "key": "g",
            "nodes": [],
            "value": {
                "x": {
                    "key": "g.x",
                    "nodes": [],
                    "value": "xyz"
                }
            }
        },
        "h": {
            "key": "h",
            "nodes": [],
            "value": {
                "x": {
                    "key": "g.x",
                    "nodes": [],
                    "value": {
                        "y": {
                            "key": "g.x.y",
                            "nodes": [],
                            "value": "xy"
                        }
                    }
                }
            }
        }

    }) as Record<string, unknown>;
    it("a has expected value", () => expect(obj.a).equals("xyz"));
    it("b has expected value", () => expect(obj.b).equals(null));
    it("c has expected value", () => expect(obj.c).equals(null));
    it("d has expected value", () => expect(obj.d).eql({ "name": "xyz" }));
    it("e has expected value", () => expect(obj.e).eql(["abc", "def", "ghi"]));
    it("f has expected value", () => expect(obj.f).eql([{ "name": "abc" }, { "name": "def" }, { "name": "ghi" }]));
    it("g has expected value", () => expect(obj.g).eql({ "x": "xyz" }));
    it("h has expected value", () => expect(obj.h).eql({ "x": { "y": "xy" } }));
});
