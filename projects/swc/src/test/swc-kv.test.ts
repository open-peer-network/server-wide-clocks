import { DCC } from '../swc-types';
import * as swc from '../swc-kv';

const d1 = (): DCC => ([
    [[["a", 8], "red"], [["b", 2], "green"]],
    [],
]);
const d2 = (): DCC => ([
    [],
    [["a", 4], ["b", 20]],
]);
const d3 = (): DCC => ([
    [[["a", 1], "black"], [["a", 3], "red"], [["b", 1], "green"], [["b", 2], "green"]],
    [["a", 4], ["b", 7]],
]);
const d4 = (): DCC => ([
    [[["a", 2], "gray"],  [["a", 3], "red"], [["a", 5], "red"], [["b", 2], "green"]],
    [["a", 5], ["b", 5]],
]);
const d5 = (): DCC => ([
    [[["a",5], "gray"]],
    [["a", 5], ["b", 5], ["c", 4]],
]);


describe('SWC KV', () => {
    it('values', () => {
        expect(swc.values(d1())).toEqual(["red", "green"]);
        expect(swc.values(d2())).toEqual([]);
    });

    it('context', () => {
        expect(swc.context(d1())).toEqual([]);
        expect(swc.context(d2())).toEqual([["a", 4], ["b", 20]]);
    });

    it('sync', () => {
        const D34 = [
            [[["a", 5], "red"], [["a", 3], "red"], [["b", 2], "green"]],
            [["a", 5], ["b", 7]],
        ];
        expect(swc.sync(d3(), d3())).toEqual(d3());
        expect(swc.sync(d4(), d4())).toEqual(d4());
        expect(swc.sync(d3(), d4())).toEqual(D34);
    });

    it('add BVV', () => {
        expect(swc.addBVV([["a", [5, 3]]], d1())).toEqual([["a", [8, 0]], ["b", [0, 2]]]);
    });

    it('discard', () => {
        expect(swc.discard(d3(), [])).toEqual(d3());
        expect(swc.discard(d3(), [["a", 2], ["b", 15], ["c", 15]])).toEqual([
            [[["a", 3], "red"]],
            [["a", 4], ["b", 15], ["c", 15]],
        ]);
        expect(swc.discard(d3(), [["a", 3], ["b", 15], ["c", 15]])).toEqual([
            [],
            [["a", 4], ["b", 15], ["c", 15]],
        ]);
    });

    it('strip', () => {
        expect(swc.strip(d5(), [ ["a", [4, 4]] ])).toEqual(d5());
        expect(swc.strip(d5(), [ ["a", [5, 0]] ])).toEqual([
            [[["a", 5], "gray"]],
            [["b", 5], ["c", 4]],
        ]);
        expect(swc.strip(d5(), [ ["a",[15,0]] ])).toEqual([
            [[["a", 5], "gray"]],
            [["b", 5], ["c", 4]],
        ]);
        expect(swc.strip(d5(), [ ["a", [15, 4]], ["b", [1, 2]] ])).toEqual([
            [[["a", 5], "gray"]],
            [["b", 5], ["c", 4]],
        ]);
        expect(swc.strip(d5(), [ ["b",[15, 4]], ["c", [1, 2]] ])).toEqual([
            [[["a", 5], "gray"]],
            [["a", 5], ["c", 4]],
        ]);
        expect(swc.strip(d5(), [ ["a", [15, 4]], ["b", [15, 4]], ["c", [5, 2]] ])).toEqual([
            [[["a", 5], "gray"]],
            [],
        ]);
    });

    it('fill2', () => {
        expect(swc.fill2(d5(), [["a",[4,4]]])).toEqual(d5());
        expect(swc.fill2(d5(), [["a",[5,0]]])).toEqual(d5());
        expect(swc.fill2(d5(), [["a",[6,0]]])).toEqual([ [[["a",5], "gray"]] , [["a",6], ["b",5], ["c",4]]]);
        expect(swc.fill2(d5(), [["a",[15,12]]])).toEqual([ [[["a",5], "gray"]] , [["a",15], ["b",5], ["c",4]]]);
        expect(swc.fill2(d5(), [["b",[15,12]]])).toEqual([ [[["a",5], "gray"]] , [["a",5], ["b",15], ["c",4]]]);
        expect(swc.fill2(d5(), [["d",[15,12]]])).toEqual([ [[["a",5], "gray"]] , [["a",5], ["b",5], ["c",4], ["d",15]]]);
        expect(swc.fill2(d5(), [["a",[9,6]],["d",[15,12]]])).toEqual([ [[["a",5],"gray"]], [["a",9], ["b",5], ["c",4], ["d",15]]]);
    });

    it('fill3', () => {
        expect(swc.fill3(d5(), [["a",[9,6]],["d",[15,12]]], ["a"])).toEqual([ [[["a",5],"gray"]], [["a",9], ["b",5], ["c",4]]]);
        expect(swc.fill3(d5(), [["a",[9,6]],["d",[15,12]]], ["b","a"])).toEqual([ [[["a",5],"gray"]], [["a",9], ["b",5], ["c",4]]]);
        expect(swc.fill3(d5(), [["a",[9,6]],["d",[15,12]]], ["d","a"])).toEqual([ [[["a",5],"gray"]], [["a",9], ["b",5], ["c",4], ["d",15]]]);
        expect(swc.fill3(d5(), [["a",[9,6]],["d",[15,12]]], ["b"])).toEqual(d5());
        expect(swc.fill3(d5(), [["a",[9,6]],["d",[15,12]]], ["f"])).toEqual(d5());
    });

    it('add DCC', () => {
        expect(swc.addDCC(d1(), ["a", 11], "purple")).toEqual([
            [[["a", 8], "red"], [["a", 11], "purple"], [["b", 2], "green"]],
            [["a", 11]],
        ]);
        expect(swc.addDCC(d2(), ["b", 11], "purple")).toEqual([
            [[["b", 11], "purple"]],
            [["a", 4], ["b", 20]],
        ]);
    });
});
