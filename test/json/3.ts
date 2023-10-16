import { expect } from "chai";
import { syphonx, select } from "../common.js";

const tests = [
    {
        html: `
            <html>
            <body>
            <script type="application/ld+json">{"a":1}</script>
            </body>
            </html>
        `,
        select: [
            {
                "query": [["script[type='application/ld+json']",["json"]]]
            }
        ] as syphonx.Select[],
        result: { "a": 1 }
    },
    {
        html: `
            <html>
            <body>
            <script type="application/ld+json">{"a":1}</script>
            <script type="application/ld+json">{"b":2}</script>
            </body>
            </html>
        `,
        select: [
            {
                "query": [["script[type='application/ld+json']",["json"]]],
            }
        ] as syphonx.Select[],
        result: { "a": 1 }
    },
    {
        html: `
            <html>
            <body>
            <script type="application/ld+json">{"a":1}</script>
            </body>
            </html>
        `,
        select: [
            {
                "query": [["script[type='application/ld+json']",["json"]]],
                "repeated": true
            }
        ] as syphonx.Select[],
        result: [{ "a": 1 }]
    },
    {
        html: `
            <html>
            <body>
            <script type="application/ld+json">{"a":1}</script>
            <script type="application/ld+json">{"b":2}</script>
            </body>
            </html>
        `,
        select: [
            {
                "query": [["script[type='application/ld+json']",["json"]]],
                "repeated": true
            }
        ] as syphonx.Select[],
        result: [{ "a": 1 }, { "b": 2 }]
    },


    {
        html: `
            <html>
            <body>
            <script type="application/ld+json">{"a":1}</script>
            </body>
            </html>
        `,
        select: [
            {
                "query": [["script[type='application/ld+json']",["json"]]],
                "all": true
            }
        ] as syphonx.Select[],
        result: [{ "a": 1 }]
    },
    {
        html: `
            <html>
            <body>
            <script type="application/ld+json">{"a":1}</script>
            <script type="application/ld+json">{"b":2}</script>
            </body>
            </html>
        `,
        select: [
            {
                "query": [["script[type='application/ld+json']",["json"]]],
                "all": true
            }
        ] as syphonx.Select[],
        result: [{ "a": 1 }, { "b": 2 }]
    },
    {
        html: `
            <html>
            <body>
            <script type="application/ld+json">{"a":1}</script>
            <script type="application/ld+json">{"b":2}</script>
            </body>
            </html>
        `,
        select: [
            {
                "query": [["script[type='application/ld+json']",["json"]]],
                "all": true,
                "value": "{value.find(obj => obj.b !== undefined)}"
            }
        ] as syphonx.Select[],
        
        result: { "b": 2 }
    }
];

describe("json/3", () => {
    for (const test of tests)
        it(`${tests.indexOf(test) + 1}`, () => expect(select(test.select, { html: test.html })).eql(test.result));
});

