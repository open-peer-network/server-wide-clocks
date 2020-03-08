import * as swc from '../swc-node';
import {
	d,
	ol,
	bbp,
	bvv,
	BVV,
} from '../swc-types';


describe('SWC Node', () => {
	it('norm', () => {
		expect(swc.norm(bbp(5, 3))).toEqual(bbp(7, 0));
		expect(swc.norm(bbp(5, 2))).toEqual(bbp(5, 2));
		expect(swc.normBvv(ol<BVV>(bvv("a", bbp(0, 0))))).toEqual([]);
		expect(swc.normBvv(ol<BVV>(bvv("a", bbp(5, 3))))).toEqual(ol<BVV>(bvv("a", bbp(7, 0))));
	});

	it('seq', () => {
		expect(swc.seq(1, 5)).toEqual([1, 2, 3, 4, 5]);
	});

	it('values', () => {
		expect(swc.values(bbp(0, 0))).toEqual([]);
		expect(swc.values(bbp(5, 3))).toEqual([1, 2, 3, 4, 5, 6, 7]);
		expect(swc.values(bbp(2, 5))).toEqual([1, 2, 3, 5]);
	});

	it('missing dots', () => {
		const b1 = ol<BVV>(bvv("a", bbp(12, 0)), bvv("b", bbp(7, 0)), bvv("c", bbp(4, 0)), bvv("d", bbp(5, 0)), bvv("e", bbp(5, 0)), bvv("f", bbp(7, 10)), bvv("g", bbp(5, 10)), bvv("h", bbp(5, 14)));
		const b2 = ol<BVV>(bvv("a", bbp(5, 14)), bvv("b", bbp(5, 14)), bvv("c", bbp(5, 14)), bvv("d", bbp(5, 14)), bvv("e", bbp(15, 0)), bvv("f", bbp(5, 14)), bvv("g", bbp(7, 10)), bvv("h", bbp(7, 10)));
		expect(swc.missingDots(b1, b2,[])).toEqual([]);
		expect(swc.missingDots(b1, b2,["a","b","c","d","e","f","g","h"])).toEqual([["a", [6, 10, 11, 12]], ["b", [6]], bvv("f", bbp(6, 11)), ["h", [8]]]);
		expect(swc.missingDots(b1, b2,["a","c","d","e","f","g","h"])).toEqual([["a", [6, 10, 11, 12]], bvv("f", bbp(6, 11)), ["h", [8]]]);
		expect(swc.missingDots(ol<BVV>(bvv("a", bbp(2, 2)), bvv("b", bbp(3, 0))), ol<BVV>(), ["a"])).toEqual([["a", [1, 2, 4]]]);
		expect(swc.missingDots(ol<BVV>(bvv("a", bbp(2, 2)), bvv("b", bbp(3, 0))), ol<BVV>(), ["a","b"])).toEqual([["a", [1, 2, 4]], ["b", [1, 2, 3]]]);
		expect(swc.missingDots(ol<BVV>(), b1, ["a","b","c","d","e","f","g","h"])).toEqual([]);
	});

	it('subtract dots', () => {
		expect(swc.subtractDots(bbp(12, 0),bbp(5, 14))).toEqual([6, 10, 11, 12]);
		expect(swc.subtractDots(bbp(7, 0),bbp(5, 14))).toEqual([6]);
		expect(swc.subtractDots(bbp(4, 0),bbp(5, 14))).toEqual([]);
		expect(swc.subtractDots(bbp(5, 0),bbp(5, 14))).toEqual([]);
		expect(swc.subtractDots(bbp(5, 0),bbp(15, 0))).toEqual([]);
		expect(swc.subtractDots(bbp(7, 10),bbp(5, 14))).toEqual(bbp(6, 11));
		expect(swc.subtractDots(bbp(5, 10),bbp(7, 10))).toEqual([]);
		expect(swc.subtractDots(bbp(5, 14),bbp(7, 10))).toEqual([8]);
	});

	it('add', () => {
		expect(swc.add(ol<BVV>(bvv("a", bbp(5, 3))), d("b", 0))).toEqual(ol<BVV>(bvv("a", bbp(5, 3)), bvv("b", bbp(0, 0))));
		expect(swc.add(ol<BVV>(bvv("a", bbp(5, 3))), d("a", 1))).toEqual(ol<BVV>(bvv("a", bbp(7, 0))));
		expect(swc.add(ol<BVV>(bvv("a", bbp(5, 3))), d("a", 8))).toEqual(ol<BVV>(bvv("a", bbp(8, 0))));
		expect(swc.add(ol<BVV>(bvv("a", bbp(5, 3))), d("b", 8))).toEqual(ol<BVV>(bvv("a", bbp(5, 3)), bvv("b", bbp(0, 128))));
	});

	it('add aux', () => {
		expect(swc.addAux(bbp(5, 3), 8)).toEqual(bbp(8, 0));
		expect(swc.addAux(bbp(5, 3), 7)).toEqual(bbp(7, 0));
		expect(swc.addAux(bbp(5, 3), 4)).toEqual(bbp(7, 0));
		expect(swc.addAux(bbp(2, 5), 4)).toEqual(bbp(5, 0));
		expect(swc.addAux(bbp(2, 5), 6)).toEqual(bbp(3, 6));
		expect(swc.addAux(bbp(2, 4), 6)).toEqual(bbp(2, 12));
	});

	it('merge', () => {
		expect(swc.merge(ol<BVV>(bvv("a", bbp(5, 3))), ol<BVV>(bvv("a", bbp(2, 4))))).toEqual(ol<BVV>(bvv("a", bbp(7, 0))));
		expect(swc.merge(ol<BVV>(bvv("a", bbp(5, 3))), ol<BVV>(bvv("b", bbp(2, 4))))).toEqual(ol<BVV>(bvv("a", bbp(7, 0)), bvv("b", bbp(2, 4))));
		expect(swc.merge(ol<BVV>(bvv("a", bbp(5, 3)), bvv("c", bbp(1, 2))), ol<BVV>(bvv("b", bbp(2, 4)), bvv("d", bbp(5, 3))))).toEqual(ol<BVV>(bvv("a", bbp(7, 0)), bvv("b", bbp(2, 4)), bvv("c", bbp(1, 2)), bvv("d", bbp(7, 0))));
		expect(swc.merge(ol<BVV>(bvv("a", bbp(5, 3)), bvv("c", bbp(1, 2))), ol<BVV>(bvv("b", bbp(2, 4)), bvv("c", bbp(5, 3))))).toEqual(ol<BVV>(bvv("a", bbp(7, 0)), bvv("b", bbp(2, 4)), bvv("c", bbp(7, 0))));
	});

	it('join', () => {
		expect(swc.join(ol<BVV>(bvv("a", bbp(5, 3))), ol<BVV>(bvv("a", bbp(2, 4))))).toEqual(ol<BVV>(bvv("a", bbp(7, 0))));
		expect(swc.join(ol<BVV>(bvv("a", bbp(5, 3))), ol<BVV>(bvv("b", bbp(2, 4))))).toEqual(ol<BVV>(bvv("a", bbp(7, 0))));
		expect(swc.join(ol<BVV>(bvv("a", bbp(5, 3)), bvv("c", bbp(1, 2))), ol<BVV>(bvv("b", bbp(2, 4)), bvv("d", bbp(5, 3))))).toEqual(ol<BVV>(bvv("a", bbp(7, 0)), bvv("c", bbp(1, 2))));
		expect(swc.join(ol<BVV>(bvv("a", bbp(5, 3)), bvv("c", bbp(1, 2))), ol<BVV>(bvv("b", bbp(2, 4)), bvv("c", bbp(5, 3))))).toEqual(ol<BVV>(bvv("a", bbp(7, 0)), bvv("c", bbp(7, 0))));
	});

	it('join aux', () => {
		expect(swc.joinAux(bbp(5, 3), bbp(2, 4))).toEqual(swc.joinAux(bbp(2, 4), bbp(5, 3)));
		expect(swc.joinAux(bbp(5, 3), bbp(2, 4))).toEqual(bbp(5, 3));
		expect(swc.joinAux(bbp(2, 2), bbp(3, 0))).toEqual(bbp(3, 1));
		expect(swc.joinAux(bbp(2, 2), bbp(3, 1))).toEqual(bbp(3, 1));
		expect(swc.joinAux(bbp(2, 2), bbp(3, 2))).toEqual(bbp(3, 3));
		expect(swc.joinAux(bbp(2, 2), bbp(3, 4))).toEqual(bbp(3, 5));
		expect(swc.joinAux(bbp(3, 2), bbp(1, 4))).toEqual(bbp(3, 3));
		expect(swc.joinAux(bbp(3, 2), bbp(1, 16))).toEqual(bbp(3, 6));
	});

	it('base', () => {
		expect(swc.base(ol<BVV>(bvv("a", bbp(5, 3))))).toEqual(ol<BVV>(bvv("a", bbp(7, 0))));
		expect(swc.base(ol<BVV>(bvv("a", bbp(5, 2))))).toEqual(ol<BVV>(bvv("a", bbp(5, 0))));
		expect(swc.base(ol<BVV>(bvv("a", bbp(5, 3)), bvv("b", bbp(2, 4)), bvv("c", bbp(1, 2)), bvv("d", bbp(5, 2))))).toEqual(ol<BVV>(bvv("a", bbp(7, 0)), bvv("b", bbp(2, 0)), bvv("c", bbp(1, 0)), bvv("d", bbp(5, 0))));
	});

	it('event', () => {
		expect(swc.event(ol<BVV>(bvv("a", bbp(7, 0))), "a")).toEqual([8, ol<BVV>(bvv("a", bbp(8, 0)))]);
		expect(swc.event(ol<BVV>(bvv("a", bbp(5, 3))), "b")).toEqual([1, ol<BVV>(bvv("a", bbp(5, 3)), bvv("b", bbp(1, 0)))]);
		expect(swc.event(ol<BVV>(bvv("a", bbp(5, 3)), bvv("b", bbp(2, 0)), bvv("c", bbp(1, 2)), bvv("d", bbp(5, 3))), "b")).toEqual([3, ol<BVV>(bvv("a", bbp(5, 3)), bvv("b", bbp(3, 0)), bvv("c", bbp(1, 2)), bvv("d", bbp(5, 3)))]);
	});

	it('store entry', () => {
		expect(swc.storeEntry("a", bbp(0, 0), ol<BVV>(bvv("a", bbp(7, 0))))).toEqual(ol<BVV>(bvv("a", bbp(7, 0))));
		expect(swc.storeEntry("b", bbp(0, 0), ol<BVV>(bvv("a", bbp(7, 0))))).toEqual(ol<BVV>(bvv("a", bbp(7, 0))));
		expect(swc.storeEntry("a", bbp(9, 0), ol<BVV>(bvv("a", bbp(7, 0))))).toEqual(ol<BVV>(bvv("a", bbp(9, 0))));
		expect(swc.storeEntry("a", bbp(90, 0), ol<BVV>(bvv("a", bbp(7, 1234))))).toEqual(ol<BVV>(bvv("a", bbp(90, 0))));
		expect(swc.storeEntry("b", bbp(9, 0), ol<BVV>(bvv("a", bbp(7, 0))))).toEqual(ol<BVV>(bvv("a", bbp(7, 0)), bvv("b", bbp(9, 0))));
	});
});
