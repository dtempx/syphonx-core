import { expect } from "chai";
import { combineUrl } from "./combineUrl.js";

describe("combineUrl", () => {
    it("1", () => expect(combineUrl("https://www.example.com", "logo")).equals("https://www.example.com/logo"));
    it("2", () => expect(combineUrl("https://www.example.com", "/logo")).equals("https://www.example.com/logo"));
    it("3", () => expect(combineUrl("https://www.example.com/", "logo")).equals("https://www.example.com/logo"));
    it("4", () => expect(combineUrl("https://www.example.com/", "/logo")).equals("https://www.example.com/logo"));
    it("5", () => expect(combineUrl("https://www.example.com/index.html", "logo")).equals("https://www.example.com/logo"));
    it("6", () => expect(combineUrl("https://www.example.com/home/", "logo")).equals("https://www.example.com/home/logo"));
    it("7", () => expect(combineUrl("https://www.example.com/index.html", "/logo")).equals("https://www.example.com/logo"));
    it("8", () => expect(combineUrl("https://www.example.com/home/", "/logo")).equals("https://www.example.com/logo"));
    it("9", () => expect(combineUrl("https://www.example.com", "")).equals("https://www.example.com"));
    it("10", () => expect(combineUrl("", "logo")).equals("logo"));
    it("11", () => expect(combineUrl("https://www.example.com/index.html", "/logo.png?version=1")).equals("https://www.example.com/logo.png?version=1"));
    it("12", () => expect(combineUrl("https://www.example.com/index.html", "/logo.png#fragment")).equals("https://www.example.com/logo.png#fragment"));
    it("13", () => expect(combineUrl("https://www.example.com/über/", "logo")).equals("https://www.example.com/%C3%BCber/logo"));
    it("14", () => expect(combineUrl(null!, "logo")).equals("logo"));
    it("15", () => expect(combineUrl(undefined!, "logo")).equals("logo"));
    it("16", () => expect(combineUrl("https://www.example.com", null!)).equals("https://www.example.com"));
    it("17", () => expect(combineUrl("https://www.example.com", undefined!)).equals("https://www.example.com"));
    it("18", () => expect(combineUrl("https://www.example.com", "/logo with spaces")).equals("https://www.example.com/logo%20with%20spaces"));
    it("19", () => expect(combineUrl("https://www.example.com/foo/", "../baz")).equals("https://www.example.com/baz"));
    it("20", () => expect(combineUrl("https://www.example.com/foo/bar", "../baz")).equals("https://www.example.com/baz"));
    it("21", () => expect(combineUrl("https://www.example.com/foo/bar/", "../baz")).equals("https://www.example.com/foo/baz"));
    it("22", () => expect(combineUrl("https://www.example.com/foo/bar/", "../../baz")).equals("https://www.example.com/baz"));
    it("23", () => expect(combineUrl("https://www.example.com", "../baz")).equals("https://www.example.com/baz"));
    it("24", () => expect(combineUrl("https://www.example.com/", "https://www.iana.org/domains/reserved")).equals("https://www.iana.org/domains/reserved"));
    it("25", () => expect(combineUrl("https://www.example.com/", "//www.iana.org/domains/reserved")).equals("https://www.iana.org/domains/reserved"));
});
