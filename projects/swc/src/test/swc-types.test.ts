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
	it("vv.merge", () => {
		/*
		L = [{"a", 1}, {"b", 2}].
		R = [{"a", 2}, {"c", 3}].
		M = orddict:merge(fun (_K,A,B) -> max(A, B) end, L, R).

		M == [{"a", 2}, {"b", 2}, {"c", 3}]. % true
		*/
		const vv1 = vv(d("a", 1), d("b", 2));
		const vv2 = vv(d("a", 2), d("c", 3));
		expect(
			vv1.merge(vv2, (a, b) => d(a[0], Math.max(a[1], b[1])))
		).toEqual(
			vv(d("a", 2), d("b", 2), d("c", 3))
		);

		// verify that input is unchanged
		expect(vv1).toEqual(vv(d("a", 1), d("b", 2)));
		expect(vv2).toEqual(vv(d("a", 2), d("c", 3)));
	});
	it("vv.store", () => {
		/*
		A = [{"a", 1}, {"c", 3}].
		C = orddict:store("b", 2, A).

		C == [{"a", 1}, {"b", 2}, {"c", 3}]. % true
		*/
		const vv1 = vv(d("a", 1), d("c", 3));
		expect(
			vv1.store(d("b", 2))
		).toEqual(
			vv(d("a", 1), d("b", 2), d("c", 3))
		);

		// verify that input is unchanged
		expect(vv1).toEqual(vv(d("a", 1), d("c", 3)));
	});
	it("vv.update", () => {});
	it("vv.fold", () => {});
	it("vv.filter", () => {});
	it("vv.erase", () => {});
	it("vv.foldl", () => {});
	it("vv.find", () => {
		// return OrderedList of tuples matching a given predicate
	});
	it("vv.fetch", () => {
		// return the specific tuple for given key or throw
	});
	it("vv.map", () => {
		// should return an OrderedList instead of Array
	});
});
