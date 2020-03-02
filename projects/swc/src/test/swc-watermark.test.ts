import * as swc from '../swc-watermark';
import { BVV, VVM, VV } from '../swc-types';

describe('SWC Watermark', () => {
    it('update', () => {
        const C1: BVV[] = [
            ["a", [12,0]], ["b", [7,0]], ["c", [4,0]], ["d", [5,0]], ["e", [5,0]], ["f", [7,10]], ["g", [5,10]], ["h", [5,14]],
        ];
        const C2: BVV[] = [
            ["a", [5,14]], ["b", [5,14]], ["c", [50,14]], ["d", [5,14]], ["e", [15,0]], ["f", [5,14]], ["g", [7,10]], ["h", [7,10]],
        ];
        const M = [[], []] as VVM;
        const M1 = swc.updateCell(M, "a", "b", 4);
        expect(M1).toEqual([[["a", [["b", 4]]]], []]);
        const M2 = swc.updateCell(M1, "a", "c", 10);
        expect(M2).toEqual([[["a", [["b", 4], ["c", 10]]]], []]);
        const M3 = swc.updateCell(M2, "c", "c", 2);
        expect(M3).toEqual([[["a", [["b",4], ["c",10]]], ["c", [["c",2]]]], []]);
        const M4 = swc.updateCell(M3, "c", "c", 20);
        expect(M4).toEqual([[["a", [["b",4], ["c",10]]], ["c", [["c",20]]]], []]);
        const M5 = swc.updateCell(M4, "c", "c", 15);
        expect(M4).toEqual(M5);
        const M6 = swc.updatePeer(M5, "c", C1);
        expect(M6).toEqual([[["a", [["b",4], ["c",12]]], ["c", [["c",20]]]], []]);
        const M7 = swc.updatePeer(M5, "c", C2);
        expect(M7).toEqual([[["a", [["b",4], ["c",10]]], ["c", [["c",50]]]], []]);
        const M8 = swc.updatePeer(M5, "a", C1);
        expect(M8).toEqual([[["a", [["b",4], ["c",10]]], ["c", [["c",20]]]], []]);
        const M9 = swc.updatePeer(M5, "a", C2);
        expect(M9).toEqual([[["a", [["b",4], ["c",10]]], ["c", [["c",20]]]], []]);
        const M10 = swc.updatePeer(M5, "b", C1);
        expect(M10).toEqual([[["a", [["b",12], ["c",10]]], ["c", [["c",20]]]], []]);
        const M11 = swc.updatePeer(M5, "b", C2);
        expect(M11).toEqual([[["a", [["b",5], ["c",10]]], ["c", [["c",20]]]], []]);

        const N: VVM = [
            [
                ["c", [["c",4],["d",3],["z",0]]] as VV,
                ["d", [["c",0],["d",1],["e",2]]] as VV,
                ["z", [["a",0],["c",0],["z",0]]] as VV,
            ],
            [
                ["b",[["a",2],["b",2],["c",3]]] as VV,
            ],
        ];
        expect(swc.updatePeer(N, "a", C1)).toEqual([
            [
                ["c", [["c",4],["d",3],["z",0]]] as VV,
                ["d", [["c",0],["d",1],["e",2]]] as VV,
                ["z", [["a",0],["c",0],["z",0]]] as VV,
            ],
            [
                ["b", [["a",7],["b",2],["c",3]]] as VV,
            ],
        ] as VVM);
        expect(swc.updatePeer(N, "c", C2)).toEqual([
            [
                ["c",[["c",50],["d",3],["z",0]]] as VV,
                ["d",[["c",5],["d",1],["e",2]]] as VV,
                ["z",[["a",0],["c",0],["z",0]]] as VV,
            ],
            [
                ["b",[["a",2],["b",2],["c",5]]] as VV,
            ]
        ] as VVM);
    });
/*
left_join_test() ->
    A = {[{"a",[{"b",4}, {"c",10}]}, {"c",[{"c",20}]}, {"z",[{"t1",0},{"t2",0},{"z",0}]}], []},
    Z = {[{"a",[{"b",5}, {"c",8}, {"z",2}]}, {"c",[{"c",20}]}, {"z",[{"t1",0},{"t2",0},{"z",0}]}], []},
    B = {[{"a",[{"b",2}, {"c",10}]}, {"b",[]}, {"c",[{"c",22}]}], []},
    C = {[{"z",[{"a",1}, {"b",0}, {"z",4}]}], []},
    expect( left_join(A,B), {[{"a",[{"b",4},{"c",10}]}, {"c",[{"c",22}]}, {"z",[{"t1",0},{"t2",0},{"z",0}]}], []}),
    expect( left_join(A,Z), {[{"a",[{"b",5},{"c",10}]}, {"c",[{"c",20}]}, {"z",[{"t1",0},{"t2",0},{"z",0}]}], []}),
    expect( left_join(A,C), {[{"a",[{"b",4},{"c",10}]}, {"c",[{"c",20}]}, {"z",[{"t1",0},{"t2",0},{"z",4}]}], []}),
    expect( left_join(B,A), {[{"a",[{"b",4},{"c",10}]}, {"b",[]}, {"c",[{"c",22}]}], []}),
    expect( left_join(B,C), B),
    expect( left_join(C,A), C),
    expect( left_join(C,B), C).
*/
    // it.skip('add peer', () => {
    //     const M: VVM = [[], []];
    //     // const M1 = swc.updateCell(M, "a", "b", 4);
    //     // const M2 = swc.updateCell(M1, "a", "c", 10);
    //     // const M3 = swc.updateCell(M2, "c", "c", 2);
    //     // const M4 = swc.updateCell(M3, "c", "c", 20);
    //     const expected = swc.addPeer(swc.addPeer(M, "z", ["b", "a"]), "l", ["z", "y"]);
    //     const actual = swc.addPeer(swc.addPeer(M, "l", ["y", "z"]), "z", ["a", "b"]);
    //     console.log(JSON.stringify(expected, null, '\t'));
    //     console.log(JSON.stringify(actual, null, '\t'));
    //     expect(expected).toEqual(actual);
    //     expect(swc.addPeer(M, "z",["a","b"])).toEqual([[["z", [["a",0], ["b",0], ["z",0]]]], []]);
    //     // expect(swc.addPeer(M4, "z",["t2","t1"]), {[{"a",[{"b",4}, {"c",10}]}, {"c",[{"c",20}]}, {"z",[{"t1",0},{"t2",0},{"z",0}]}], []}).
    // });
/*
min_test() ->
    M = new(),
    M1 = swc.updateCell(M, "a", "b",4),
    M2 = swc.updateCell(M1, "a", "c",10),
    M3 = swc.updateCell(M2, "c", "c",2),
    M4 = swc.updateCell(M3, "c", "c",20),
    expect( min(M, "a"), 0),
    expect( min(M1, "a"), 4),
    expect( min(M1, "b"), 0),
    expect( min(M4, "a"), 4),
    expect( min(M4, "c"), 20),
    expect( min(M4, "b"), 0).

peers_test() ->
    M = new(),
    M1 = swc.updateCell(M, "a", "b",4),
    M2 = swc.updateCell(M1, "a", "c",10),
    M3 = swc.updateCell(M2, "c", "c",2),
    M4 = swc.updateCell(M3, "c", "c",20),
    M5 = swc.updateCell(M4, "c", "c",15),
    expect( peers(M), []),
    expect( peers(M1), ["a"]),
    expect( peers(M5), ["a", "c"]).


get_test() ->
    M = new(),
    M1 = swc.updateCell(M, "a", "b",4),
    M2 = swc.updateCell(M1, "a", "c",10),
    M3 = swc.updateCell(M2, "c", "c",2),
    M4 = swc.updateCell(M3, "c", "c",20),
    expect( get(M, "a", "a"), 0),
    expect( get(M1, "a", "a"), 0),
    expect( get(M1, "b", "a"), 0),
    expect( get(M4, "c", "c"), 20),
    expect( get(M4, "a", "c"), 10).

reset_counters_test() ->
    M = new(),
    M1 = swc.updateCell(M, "a", "b",4),
    M2 = swc.updateCell(M1, "a", "c",10),
    M3 = swc.updateCell(M2, "c", "c",2),
    M4 = swc.updateCell(M3, "c", "c",20),
    expect( reset_counters(M), M),
    expect( reset_counters(M1), {[{"a",[{"b",0}]}], []}),
    expect( reset_counters(M2), {[{"a",[{"b",0}, {"c",0}]}], []}),
    expect( reset_counters(M3), {[{"a",[{"b",0}, {"c",0}]}, {"c",[{"c",0}]}], []}),
    expect( reset_counters(M4), {[{"a",[{"b",0}, {"c",0}]}, {"c",[{"c",0}]}], []}).

delete_peer_test() ->
    M = new(),
    M1 = swc.updateCell(M, "a", "b",4),
    M2 = swc.updateCell(M1, "a", "c",10),
    M3 = swc.updateCell(M2, "c", "c",2),
    M4 = swc.updateCell(M3, "c", "c",20),
    expect( delete_peer(M1, "a"), {[], []}),
    expect( delete_peer(M1, "b"), {[{"a",[]}], []}),
    expect( delete_peer(M1, "c"), {[{"a",[{"b",4}]}], []}),
    expect( delete_peer(M4, "a"), {[{"c",[{"c",20}]}], []}),
    expect( delete_peer(M4, "c"), {[{"a",[{"b",4}]}], []}).

replace_peer_test() ->
    A = add_peer(new(), "a", ["b","c"]),
    B = add_peer(A,     "b", ["a","c"]),
    C = add_peer(B,     "c", ["a","b"]),
    Z = {[{"a",[{"a",9},{"c",2},{"z",3}]}, {"c",[{"a",1},{"c",4},{"z",3}]}, {"z", [{"a",0},{"c",1},{"z",2}]}], []},
    W = {[{"b",[{"a",9},{"b",2},{"c",3}]}, {"c",[{"b",1},{"c",4},{"d",3}]}, {"d", [{"c",0},{"d",1},{"e",2}]}], []},
    expect( replace_peer(C,"b","z"), {[{"a",[{"a",0},{"c",0},{"z",0}]}, {"c",[{"a",0},{"c",0},{"z",0}]}, {"z", [{"a",0},{"c",0},{"z",0}]}], []}),
    expect( replace_peer(Z,"a","b"), {[{"b",[{"b",0},{"c",0},{"z",0}]}, {"c",[{"b",0},{"c",4},{"z",3}]}, {"z", [{"b",0},{"c",1},{"z",2}]}], []}),
    expect( replace_peer(W,"b","z"), {[{"c",[{"c",4},{"d",3},{"z",0}]}, {"d",[{"c",0},{"d",1},{"e",2}]}, {"z", [{"a",0},{"c",0},{"z",0}]}], []}),
    expect( replace_peer(W,"a","z"), {[{"b",[{"b",2},{"c",3},{"z",0}]}, {"c",[{"b",1},{"c",4},{"d",3}]}, {"d", [{"c",0},{"d",1},{"e",2}]}], []}).

retire_peer_test() ->
    A = add_peer(new(), "a", ["b","c"]),
    B = add_peer(A,     "b", ["a","c"]),
    C = add_peer(B,     "c", ["a","b"]),
    Z = {[{"a",[{"a",9},{"c",2},{"z",3}]}, {"c",[{"a",1},{"c",4},{"z",3}]}, {"z", [{"a",0},{"c",1},{"z",2}]}], []},
    W = {[{"b",[{"a",9},{"b",2},{"c",3}]}, {"c",[{"b",1},{"c",4},{"d",3}]}, {"d", [{"c",0},{"d",1},{"e",2}]}], []},
    expect( retire_peer(C,"b","z"),
                  {[{"a",[{"a",0},{"c",0},{"z",0}]}, {"c",[{"a",0},{"c",0},{"z",0}]}, {"z", [{"a",0},{"c",0},{"z",0}]}], [{"b",[{"a",0},{"c",0},{"z",0}]}]}),
    expect( retire_peer(Z,"a","b"),
                  {[{"b",[{"b",0},{"c",0},{"z",0}]}, {"c",[{"b",0},{"c",4},{"z",3}]}, {"z", [{"b",0},{"c",1},{"z",2}]}], [{"a",[{"b",0},{"c",2},{"z",3}]}]}),
    expect( retire_peer(W,"b","z"),
                  {[{"c",[{"c",4},{"d",3},{"z",0}]}, {"d",[{"c",0},{"d",1},{"e",2}]}, {"z", [{"a",0},{"c",0},{"z",0}]}], [{"b",[{"a",9},{"c",3},{"z",0}]}]}),
    expect( retire_peer(W,"a","z"),
                  {[{"b",[{"b",2},{"c",3},{"z",0}]}, {"c",[{"b",1},{"c",4},{"d",3}]}, {"d", [{"c",0},{"d",1},{"e",2}]}], []}).

prune_retired_peers_test() ->
    D1 = [{"a",[1,2,22]}, {"b",[4,5,11]}],
    D2 = [{"a",[1,2,22]}, {"z",[4,5,11]}],
    A = {[{"a",[{"a",0},{"c",0},{"z",0}]}, {"c",[{"a",0},{"c",0},{"z",0}]}, {"z", [{"a",0},{"c",0},{"z",0}]}], [{"b",[{"a",0},{"b",0},{"c",0}]}]},
    A2 = {[{"a",[{"a",0},{"c",0},{"z",0}]}, {"c",[{"a",0},{"c",0},{"z",0}]}, {"z", [{"a",0},{"c",0},{"z",0}]}], []},
    expect( prune_retired_peers(A, D1, []), A),
    expect( prune_retired_peers(A, D1, ["a", "b","c","z"]), A),
    expect( prune_retired_peers(A, D2, []), A2),
    expect( prune_retired_peers(A, D2, ["b"]), A),
    expect( prune_retired_peers(A, [], []), A2).
*/
});
