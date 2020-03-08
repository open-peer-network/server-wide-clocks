import {
    d,
    vv,
    dvp,
    bbp,
    vvm,
    dcc,
    ol,
    Dot,
    VV,
    DVP,
} from "../swc-types";

describe("types", () => {
    it("d", () => {
        expect(d("a", 1)).toEqual(["a", 1]);
        expect(ol<Dot>(d("a", 1), d("b", 2))).toEqual([["a", 1], ["b", 2]]);
    });
    it("vv", () => {
        expect(vv("a", ol<Dot>(d("a", 1)))).toEqual(["a", [["a", 1]]]);
        expect(vv("b", ol<Dot>(d("b", 2)))).toEqual(["b", [["a", 1],["b",2]]]);
    });
    it("vvm", () => {
        expect(vvm(
            ol<VV>(vv("a", ol<Dot>())),
            ol<VV>(),
        )).toEqual([[["a", []]], []]);
        expect(vvm(
            ol<VV>(
                vv("a", ol<Dot>(d("b", 2))),
                vv("b", ol<Dot>(d("c", 5))),
            ),
            ol<VV>(
                vv("f", ol<Dot>(d("g", 3))),
            ),
        )).toEqual([
            [
                ["a", [["b", 2]]],
                ["b", [["c", 5]]],
            ], [
                ["f", [["g", 3]]],
            ]
        ]);
    });
    it("dvp", () => {
        expect(dvp(d("z", 1), [])).toEqual([["z", 1], []]);
        expect(dvp(d("a", 3), "text")).toEqual([["a", 3], "text"]);
    });
    it("bbp", () => {
        expect(bbp(1, 2)).toEqual([1, 2]);
    });
    it("dcc", () => {
        expect(dcc(
            ol<DVP>(
                dvp(d("a", 4), "value1"),
                dvp(d("h", 5), "value2"),
            ),
            ol<Dot>(
                d("b", 9),
            )
        )).toEqual([
            [
                [["a", 4], "value1"],
                [["h", 5], "value2"],
            ], [
                ["b", 9],
            ]
        ]);
    });
});
