// Tests the formatHTML utility function, verifying that it trims whitespace inside tags
// and collapses extra spaces around inline elements.

import { expect } from "chai";
import { formatHTML } from "../common.js";

describe("lib", () => {
    it("formatHTML/1", () => expect(formatHTML("<ul>\n  <li> abc </li>\n  <li>def </li>\n  <li>ghi </li>\n<ul>")).to.be.equal("<ul>\n  <li>abc</li>\n  <li>def</li>\n  <li>ghi</li>\n<ul>"));    
    it("formatHTML/2", () => expect(formatHTML("credat <b> judias </b> appella")).to.be.equal("credat <b>judias</b> appella"));    
});
