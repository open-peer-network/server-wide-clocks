import * as swc from '../swc-vv';
import { d, Dot } from '../swc-types';

describe('SWC VV', () => {
	it('min', () => {
		expect(swc.min([d("a", 8), d("b", 3)])).toBe(3);
		expect(swc.min([d("b", 3), d("a", 8)])).toBe(3);
	});

	it('min key', () => {
		expect(swc.minKey([d("a", 2)])).toEqual("a");
		expect(swc.minKey([d("a", 2), d("b", 4), d("c", 4)])).toEqual("a");
		expect(swc.minKey([d("a", 5), d("b", 4), d("c", 4)])).toEqual("b");
		expect(swc.minKey([d("a", 4), d("b", 4), d("c", 4)])).toEqual("a");
		expect(swc.minKey([d("a", 5), d("b", 14), d("c", 4)])).toEqual("c");
	});

	it('reset counters', () => {
		const e: Dot[] = [];
		const a0 = [d("a", 2)];
		const a1 = [d("a", 2), d("b", 4), d("c", 4)];
		expect(swc.resetCounters(e)).toEqual([]);
		expect(swc.resetCounters(a0)).toEqual([d("a", 0)]);
		expect(swc.resetCounters(a1)).toEqual([d("a", 0), d("b", 0), d("c", 0)]);
	});

	it('delete key', () => {
		const E: Dot[] = [];
		const A0 = [d("a", 2)];
		const A1 = [d("a", 2), d("b", 4), d("c", 4)];
		expect(swc.deleteKey(E, "a")).toEqual([]);
		expect(swc.deleteKey(A0, "a")).toEqual([]);
		expect(swc.deleteKey(A0, "b")).toEqual([d("a", 2)]);
		expect(swc.deleteKey(A1, "a")).toEqual([d("b", 4), d("c", 4)]);
	});

	it('join', () => {
		const a0 = [d("a", 4)];
		const a1 = [d("a", 2), d("b", 4), d("c", 4)];
		const a2 = [d("a", 1), d("z", 10)];
		const a3 = [d("a", 1)];

		expect(swc.join(a0, a1)).toEqual([d("a", 4), d("b", 4), d("c", 4)]);
		expect(swc.leftJoin(a0, a1)).toEqual(a0);
		expect(swc.leftJoin(a0, a2)).toEqual(a0);

		expect(swc.join(a3, a1)).toEqual([d("a", 2), d("b", 4), d("c", 4)]);
		expect(swc.leftJoin(a3, a1)).toEqual([d("a", 2)]);
	});
});
