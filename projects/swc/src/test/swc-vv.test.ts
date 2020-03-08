import * as swc from '../swc-vv';
import { d, Dot, ol } from '../swc-types';

describe('SWC VV', () => {
	it.only('add', () => {
		expect(swc.add(ol<Dot>(), d("b", 2))).toEqual(ol<Dot>(d("b", 2)));
		expect(swc.add(ol<Dot>(d("a", 5), d("b", 1)), d("b", 2))).toEqual(ol<Dot>(d("a", 5), d("b", 2)));
		expect(swc.add(ol<Dot>(d("a", 5), d("b", 1)), d("a", 2))).toEqual(ol<Dot>(d("a", 5), d("b", 1)));
	});

	it('min', () => {
		expect(swc.min(ol<Dot>(d("a", 8), d("b", 3)))).toBe(3);
		expect(swc.min(ol<Dot>(d("b", 3), d("a", 8)))).toBe(3);
	});

	it('min key', () => {
		expect(swc.minKey(ol<Dot>(d("a", 2)))).toEqual("a");
		expect(swc.minKey(ol<Dot>(d("a", 2), d("b", 4), d("c", 4)))).toEqual("a");
		expect(swc.minKey(ol<Dot>(d("a", 5), d("b", 4), d("c", 4)))).toEqual("b");
		expect(swc.minKey(ol<Dot>(d("a", 4), d("b", 4), d("c", 4)))).toEqual("a");
		expect(swc.minKey(ol<Dot>(d("a", 5), d("b", 14), d("c", 4)))).toEqual("c");
	});

	it('reset counters', () => {
		const e = ol<Dot>();
		const a0 = ol<Dot>(d("a", 2));
		const a1 = ol<Dot>(d("a", 2), d("b", 4), d("c", 4));
		expect(swc.resetCounters(e)).toEqual(ol<Dot>());
		expect(swc.resetCounters(a0)).toEqual(ol<Dot>(d("a", 0)));
		expect(swc.resetCounters(a1)).toEqual(ol<Dot>(d("a", 0), d("b", 0), d("c", 0)));
	});

	it('delete key', () => {
		const E = ol<Dot>();
		const A0 = ol<Dot>(d("a", 2));
		const A1 = ol<Dot>(d("a", 2), d("b", 4), d("c", 4));
		expect(swc.deleteKey(E, "a")).toEqual(ol<Dot>());
		expect(swc.deleteKey(A0, "a")).toEqual(ol<Dot>());
		expect(swc.deleteKey(A0, "b")).toEqual(ol<Dot>(d("a", 2)));
		expect(swc.deleteKey(A1, "a")).toEqual(ol<Dot>(d("b", 4), d("c", 4)));
	});

	it('join', () => {
		const a0 = ol<Dot>(d("a", 4));
		const a1 = ol<Dot>(d("a", 2), d("b", 4), d("c", 4));
		const a2 = ol<Dot>(d("a", 1), d("z", 10));
		const a3 = ol<Dot>(d("a", 1));

		expect(swc.join(a0, a1)).toEqual(ol<Dot>(d("a", 4), d("b", 4), d("c", 4)));
		expect(swc.leftJoin(a0, a1)).toEqual(a0);
		expect(swc.leftJoin(a0, a2)).toEqual(a0);

		expect(swc.join(a3, a1)).toEqual(ol<Dot>(d("a", 2), d("b", 4), d("c", 4)));
		expect(swc.leftJoin(a3, a1)).toEqual(ol<Dot>(d("a", 2)));
	});
});
