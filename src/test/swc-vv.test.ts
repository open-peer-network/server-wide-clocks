import * as swc from '../swc-vv';
import { Dot } from '../swc-types';

describe('SWC VV', () => {
	it('min', () => {
		expect(swc.min([["a", 8], ["b", 3]])).toBe(3);
	});

	it('min key', () => {
		expect(swc.minKey([["a", 2]])).toEqual("a");
		expect(swc.minKey([["a", 2], ["b", 4], ["c", 4]])).toEqual("a");
		expect(swc.minKey([["a", 5], ["b", 4], ["c", 4]])).toEqual("b");
		expect(swc.minKey([["a", 4], ["b", 4], ["c", 4]])).toEqual("a");
		expect(swc.minKey([["a", 5], ["b", 14], ["c", 4]])).toEqual("c");
	});

	it('reset counters', () => {
		const e: Dot[] = [];
		const a0: Dot[] = [["a",2]];
		const a1: Dot[] = [["a",2], ["b",4], ["c",4]];
		expect(swc.resetCounters(e)).toEqual([]);
		expect(swc.resetCounters(a0)).toEqual([["a",0]]);
		expect(swc.resetCounters(a1)).toEqual([["a",0], ["b",0], ["c",0]]);
	});

	it('delete key', () => {
		const E: Dot[] = [];
		const A0: Dot[] = [["a",2]];
		const A1: Dot[] = [["a",2], ["b",4], ["c",4]];
		expect(swc.deleteKey(E, "a")).toEqual([]);
		expect(swc.deleteKey(A0, "a")).toEqual([]);
		expect(swc.deleteKey(A0, "b")).toEqual([["a",2]]);
		expect(swc.deleteKey(A1, "a")).toEqual([["b",4], ["c",4]]);
	});

	it('join', () => {
		const a0: Dot[] = [["a", 4]];
		const a1: Dot[] = [["a", 2], ["b", 4], ["c", 4]];
		const a2: Dot[] = [["a", 1], ["z", 10]];
		const a3: Dot[] = [["a", 1]];

		expect(swc.join(a0, a1)).toEqual([["a", 4], ["b", 4], ["c", 4]]);
		expect(swc.leftJoin(a0, a1)).toEqual(a0);
		expect(swc.leftJoin(a0, a2)).toEqual(a0);

		expect(swc.join(a3, a1)).toEqual([["a", 2], ["b", 4], ["c", 4]]);
		expect(swc.leftJoin(a3, a1)).toEqual([["a", 2]]);
	});
});
