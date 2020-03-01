import * as swc from '../swc-node';
import { BVV } from '../swc-types';


describe('SWC Node', () => {
	it('norm', () => {
		expect(swc.norm([5, 3])).toEqual([7, 0]);
		expect(swc.norm([5, 2])).toEqual([5, 2]);
		expect(swc.normBvv([["a", [0, 0]]])).toEqual([]);
		expect(swc.normBvv([["a", [5, 3]]])).toEqual([["a", [7, 0]]]);
	});

	it('seq', () => {
		expect(swc.seq(1, 5)).toEqual([1, 2, 3, 4, 5]);
	});

	it('values', () => {
		expect(swc.values([0, 0])).toEqual([]);
		expect(swc.values([5, 3])).toEqual([1, 2, 3, 4, 5, 6, 7]);
		expect(swc.values([2, 5])).toEqual([1, 2, 3, 5]);
	});

	it('missing dots', () => {
		const b1: BVV[] = [["a", [12, 0]], ["b", [7, 0]], ["c", [4, 0]], ["d", [5, 0]], ["e", [5, 0]], ["f", [7, 10]], ["g", [5, 10]], ["h", [5, 14]]];
		const b2: BVV[] = [["a", [5, 14]], ["b", [5, 14]], ["c", [5, 14]], ["d", [5, 14]], ["e", [15, 0]], ["f", [5, 14]], ["g", [7, 10]], ["h", [7, 10]]];
		expect(swc.missingDots(b1,b2,[])).toEqual([]);
		expect(swc.missingDots(b1,b2,["a","b","c","d","e","f","g","h"])).toEqual([["a", [6, 10, 11, 12]], ["b", [6]], ["f", [6, 11]], ["h", [8]]]);
		expect(swc.missingDots(b1,b2,["a","c","d","e","f","g","h"])).toEqual([["a", [6, 10, 11, 12]], ["f", [6, 11]], ["h", [8]]]);
		expect(swc.missingDots([["a", [2, 2]], ["b", [3, 0]]], [], ["a"])).toEqual([["a", [1, 2, 4]]]);
		expect(swc.missingDots([["a", [2, 2]], ["b", [3, 0]]], [], ["a","b"])).toEqual([["a", [1, 2, 4]], ["b", [1, 2, 3]]]);
		expect(swc.missingDots([], b1, ["a","b","c","d","e","f","g","h"])).toEqual([]);
	});

	it('subtract dots', () => {
		expect(swc.subtractDots([12, 0],[5, 14])).toEqual([6, 10, 11, 12]);
		expect(swc.subtractDots([7, 0],[5, 14])).toEqual([6]);
		expect(swc.subtractDots([4, 0],[5, 14])).toEqual([]);
		expect(swc.subtractDots([5, 0],[5, 14])).toEqual([]);
		expect(swc.subtractDots([5, 0],[15, 0])).toEqual([]);
		expect(swc.subtractDots([7, 10],[5, 14])).toEqual([6, 11]);
		expect(swc.subtractDots([5, 10],[7, 10])).toEqual([]);
		expect(swc.subtractDots([5, 14],[7, 10])).toEqual([8]);
	});

	it('add', () => {
		expect(swc.add([["a", [5, 3]]], ["b", 0])).toEqual([["a", [5, 3]], ["b", [0, 0]]]);
		expect(swc.add([["a", [5, 3]]], ["a", 1])).toEqual([["a", [7, 0]]]);
		expect(swc.add([["a", [5, 3]]], ["a", 8])).toEqual([["a", [8, 0]]]);
		expect(swc.add([["a", [5, 3]]], ["b", 8])).toEqual([["a", [5, 3]], ["b", [0, 128]]]);
	});

	it('addAux', () => {
		expect(swc.addAux([5, 3], 8)).toEqual([8, 0]);
		expect(swc.addAux([5, 3], 7)).toEqual([7, 0]);
		expect(swc.addAux([5, 3], 4)).toEqual([7, 0]);
		expect(swc.addAux([2, 5], 4)).toEqual([5, 0]);
		expect(swc.addAux([2, 5], 6)).toEqual([3, 6]);
		expect(swc.addAux([2, 4], 6)).toEqual([2, 12]);
	});

	it('merge', () => {
		expect(swc.merge([["a", [5, 3]]], [["a", [2, 4]]])).toEqual([["a", [7, 0]]]);
		expect(swc.merge([["a", [5, 3]]], [["b", [2, 4]]])).toEqual([["a", [7, 0]], ["b", [2, 4]]]);
		expect(swc.merge([["a", [5, 3]], ["c", [1, 2]]], [["b", [2, 4]], ["d", [5, 3]]])).toEqual([["a", [7, 0]], ["b", [2, 4]], ["c", [1, 2]], ["d", [7, 0]]]);
		expect(swc.merge([["a", [5, 3]], ["c", [1, 2]]], [["b", [2, 4]], ["c", [5, 3]]])).toEqual([["a", [7, 0]], ["b", [2, 4]], ["c", [7, 0]]]);
	});

	it('join', () => {
		expect(swc.join([["a", [5, 3]]], [["a", [2, 4]]])).toEqual([["a", [7, 0]]]);
		expect(swc.join([["a", [5, 3]]], [["b", [2, 4]]])).toEqual([["a", [7, 0]]]);
		expect(swc.join([["a", [5, 3]], ["c", [1, 2]]], [["b", [2, 4]], ["d", [5, 3]]])).toEqual([["a", [7, 0]], ["c", [1, 2]]]);
		expect(swc.join([["a", [5, 3]], ["c", [1, 2]]], [["b", [2, 4]], ["c", [5, 3]]])).toEqual([["a", [7, 0]], ["c", [7, 0]]]);
	});

	it('join aux', () => {
		expect(swc.joinAux([5, 3], [2, 4])).toEqual(swc.joinAux([2, 4], [5, 3]));
		expect(swc.joinAux([5, 3], [2, 4])).toEqual([5, 3]);
		expect(swc.joinAux([2, 2], [3, 0])).toEqual([3, 1]);
		expect(swc.joinAux([2, 2], [3, 1])).toEqual([3, 1]);
		expect(swc.joinAux([2, 2], [3, 2])).toEqual([3, 3]);
		expect(swc.joinAux([2, 2], [3, 4])).toEqual([3, 5]);
		expect(swc.joinAux([3, 2], [1, 4])).toEqual([3, 3]);
		expect(swc.joinAux([3, 2], [1, 16])).toEqual([3, 6]);
	});

	it('base', () => {
		expect(swc.base([["a", [5, 3]]])).toEqual([["a", [7, 0]]]);
		expect(swc.base([["a", [5, 2]]])).toEqual([["a", [5, 0]]]);
		expect(swc.base([["a", [5, 3]], ["b", [2, 4]], ["c", [1, 2]], ["d", [5, 2]]])).toEqual([["a", [7, 0]], ["b", [2, 0]], ["c", [1, 0]], ["d", [5, 0]]]);
	});

	it('event', () => {
		expect(swc.event([["a", [7, 0]]], "a")).toEqual([8, [["a", [8, 0]]]]);
		expect(swc.event([["a", [5, 3]]], "b")).toEqual([1, [["a", [5, 3]], ["b", [1, 0]]]]);
		expect(swc.event([["a", [5, 3]], ["b", [2, 0]], ["c", [1, 2]], ["d", [5, 3]]], "b")).toEqual([3, [["a", [5, 3]], ["b", [3, 0]], ["c", [1, 2]], ["d", [5, 3]]]]);
	});

	it('store entry', () => {
		expect(swc.storeEntry("a", [0, 0], [["a", [7, 0]]])).toEqual([["a", [7, 0]]]);
		expect(swc.storeEntry("b", [0, 0], [["a", [7, 0]]])).toEqual([["a", [7, 0]]]);
		expect(swc.storeEntry("a", [9, 0], [["a", [7, 0]]])).toEqual([["a", [9, 0]]]);
		expect(swc.storeEntry("a", [90, 0], [["a", [7, 1234]]])).toEqual([["a", [90, 0]]]);
		expect(swc.storeEntry("b", [9, 0], [["a", [7, 0]]])).toEqual([["a", [7, 0]], ["b", [9, 0]]]);
	});
});
