import { expect } from "chai";
import { unwind } from "./unwind.js";

describe("unwind", () => {
    it("a.b.c has expected value", () => expect(unwind({"a.b.c": "xyz"})).eql({ a: { b: { c: "xyz" } } }));
});
