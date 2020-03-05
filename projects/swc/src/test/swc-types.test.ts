import { d, vv, dvp, bbp, vvm, dcc } from "../swc-types";

describe("types", () => {
    it("d", () => {
        expect(d("a", 1)).toEqual(["a", 1]);
        expect([d("a", 1), d("b", 2)]).toEqual([["a", 1],["b",2]]);
    });
    it("vv", () => {
        expect(vv("a", [d("a", 1)])).toEqual(["a", [["a", 1]]]);
        expect(vv("b", [d("a", 1), d("b", 2)])).toEqual(["b", [["a", 1],["b",2]]]);
    });
    it("vvm", () => {
        expect(vvm([vv("a",[])], [])).toEqual([[["a",[]]], []]);
        expect(vvm([
            vv("a", [d("b", 2)]),
            vv("b", [d("c", 5)]),
        ], [
            vv("f", [d("g", 3)]),
        ])).toEqual([
            [
                ["a", [["b", 2]]],
                ["b", [["c", 5]]],
            ], [
                ["f", [["g", 3]]],
            ]
        ]);
    });
    it("dvp", () => {
        expect(dvp(d(), [])).toEqual([[], []]);
        expect(dvp(d("a", 3), "text")).toEqual([["a", 3], "text"]);
    });
    it("bbp", () => {
        expect(bbp(1, 2)).toEqual([1, 2]);
    });
    it("dcc", () => {
        expect(dcc([
            dvp(d("a", 4), "value1"),
            dvp(d("h", 5), "value2"),
        ], [
            d("b", 9),
        ])).toEqual([
            [
                [["a", 4], "value1"],
                [["h", 5], "value2"],
            ], [
                ["b", 9],
            ]
        ]);
    });
});
