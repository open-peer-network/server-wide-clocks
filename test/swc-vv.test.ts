import * as swc from "../src/swc-vv";
import { d, vv } from "../src/swc-types";

describe("SWC VV", () => {
	it("add", () => {
		expect(swc.add(vv(), d("b", 2))).toEqual(vv(d("b", 2)));
		expect(swc.add(vv(d("a", 5), d("b", 1)), d("b", 2))).toEqual(vv(d("a", 5), d("b", 2)));
		expect(swc.add(vv(d("a", 5), d("b", 1)), d("a", 2))).toEqual(vv(d("a", 5), d("b", 1)));
	});

	it("min", () => {
		expect(swc.min(vv(d("a", 8), d("b", 3)))).toBe(3);
		expect(swc.min(vv(d("b", 3), d("a", 8)))).toBe(3);
	});

	it("min key", () => {
		expect(swc.minKey(vv(d("a", 2)))).toEqual("a");
		expect(swc.minKey(vv(d("a", 2), d("b", 4), d("c", 4)))).toEqual("a");
		expect(swc.minKey(vv(d("a", 5), d("b", 4), d("c", 4)))).toEqual("b");
		expect(swc.minKey(vv(d("a", 4), d("b", 4), d("c", 4)))).toEqual("a");
		expect(swc.minKey(vv(d("a", 5), d("b", 14), d("c", 4)))).toEqual("c");
	});

	it("reset counters", () => {
		const e = vv();
		const a0 = vv(d("a", 2));
		const a1 = vv(d("a", 2), d("b", 4), d("c", 4));
		expect(swc.resetCounters(e)).toEqual(vv());
		expect(swc.resetCounters(a0)).toEqual(vv(d("a", 0)));
		expect(swc.resetCounters(a1)).toEqual(vv(d("a", 0), d("b", 0), d("c", 0)));
	});

	it("delete key", () => {
		const E = vv();
		const A0 = vv(d("a", 2));
		const A1 = vv(d("a", 2), d("b", 4), d("c", 4));
		expect(swc.deleteKey(E, "a")).toEqual(vv());
		expect(swc.deleteKey(A0, "a")).toEqual(vv());
		expect(swc.deleteKey(A0, "b")).toEqual(vv(d("a", 2)));
		expect(swc.deleteKey(A1, "a")).toEqual(vv(d("b", 4), d("c", 4)));
	});

	it("join", () => {
		const a0 = vv(d("a", 4));
		const a1 = vv(d("a", 2), d("b", 4), d("c", 4));
		const a3 = vv(d("a", 1));
		expect(swc.join(a0, a1)).toEqual(vv(d("a", 4), d("b", 4), d("c", 4)));
		expect(swc.join(a3, a1)).toEqual(vv(d("a", 2), d("b", 4), d("c", 4)));
	});

	it("left join", () => {
		const a0 = vv(d("a", 4));
		const a1 = vv(d("a", 2), d("b", 4), d("c", 4));
		const a2 = vv(d("a", 1), d("z", 10));
		const a3 = vv(d("a", 1));
		expect(swc.leftJoin(a0, a1)).toEqual(a0);
		expect(swc.leftJoin(a0, a2)).toEqual(a0);
		expect(swc.leftJoin(a3, a1)).toEqual(vv(d("a", 2)));
	});
});
