import {
	d,
	vv,
	evvp,
	ol,
	olt,
	dvp,
	bbp,
	vvm,
	dcc,
	DVP,
	EVVP,
} from "../swc-types";

describe("types", () => {
	it("d", () => {
		expect(d("a", 1)).toEqual(["a", 1]);
		expect(vv(d("a", 1), d("b", 2))).toEqual([["a", 1], ["b", 2]]);
	});
	it("vv", () => {
		expect(evvp("a", vv(d("a", 1)))).toEqual(["a", vv(["a", 1])]);
		expect(evvp("b", vv(d("a", 1), d("b", 2)))).toEqual(["b", vv(["a", 1], ["b", 2])]);
	});
	it("vvm", () => {
		expect(vvm(
			ol<EVVP>(evvp("a", vv())),
			ol<EVVP>(),
		)).toEqual([[["a", []]], []]);
		expect(vvm(
			ol<EVVP>(
				evvp("a", vv(d("b", 2))),
				evvp("b", vv(d("c", 5))),
			),
			ol<EVVP>(
				evvp("f", vv(d("g", 3))),
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
			olt<DVP>(
				dvp(d("a", 4), "value1"),
				dvp(d("h", 5), "value2"),
			),
			vv(
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
