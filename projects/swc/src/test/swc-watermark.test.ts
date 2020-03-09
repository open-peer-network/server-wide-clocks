import * as swc from '../swc-watermark';
import {
	bbp,
	bvv,
	vvm,
	vv,
	d,
	ol,
	VV,
	BVV,
	Dot,
} from '../swc-types';

describe('SWC Watermark', () => {
	const C1 = ol<BVV>(
		bvv("a", bbp(12, 0)),
		bvv("b", bbp(7, 0)),
		bvv("c", bbp(4, 0)),
		bvv("d", bbp(5, 0)),
		bvv("e", bbp(5, 0)),
		bvv("f", bbp(7, 10)),
		bvv("g", bbp(5, 10)),
		bvv("h", bbp(5, 14)),
	);
	const C2 = ol<BVV>(
		bvv("a", bbp(5, 14)),
		bvv("b", bbp(5, 14)),
		bvv("c", bbp(50, 14)),
		bvv("d", bbp(5, 14)),
		bvv("e", bbp(15, 0)),
		bvv("f", bbp(5, 14)),
		bvv("g", bbp(7, 10)),
		bvv("h", bbp(7, 10)),
	);
	const M = vvm(ol<VV>(), ol<VV>());
	const M1 = swc.updateCell(M, "a", "b", 4);
	const M2 = swc.updateCell(M1, "a", "c", 10);
	const M3 = swc.updateCell(M2, "c", "c", 2);
	const M4 = swc.updateCell(M3, "c", "c", 20);
	const M5 = swc.updateCell(M4, "c", "c", 15);
	const M6 = swc.updatePeer(M5, "c", C1);
	const M7 = swc.updatePeer(M5, "c", C2);
	const M8 = swc.updatePeer(M5, "a", C1);
	const M9 = swc.updatePeer(M5, "a", C2);
	const M10 = swc.updatePeer(M5, "b", C1);
	const M11 = swc.updatePeer(M5, "b", C2);
	const N = vvm(
		ol<VV>(
			vv("c", ol<Dot>(d("c", 4), d("d", 3), d("z", 0))),
			vv("d", ol<Dot>(d("c", 0), d("d", 1), d("e", 2))),
			vv("z", ol<Dot>(d("a", 0), d("c", 0), d("z", 0))),
		),
		ol<VV>(
			vv("b", ol<Dot>(d("a", 2), d("b", 2), d("c", 3))),
		),
	);

	it('update', () => {
		expect(M1).toEqual([
			[
				["a", ol<Dot>(d("b", 4))],
			],
			[
			],
		]);
		expect(M2).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 4), d("c", 10))),
			),
			ol<VV>(),
		));
		expect(M3).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 4), d("c", 10))),
				vv("c", ol<Dot>(d("c", 2))),
			),
			ol<VV>(),
		));
		expect(M4).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 4), d("c", 10))),
				vv("c", ol<Dot>(d("c", 20))),
			),
			ol<VV>(),
		));
		expect(M4).toEqual(M5);
		expect(M6).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 4), d("c", 12))),
				vv("c", ol<Dot>(d("c", 20))),
			),
			ol<VV>(),
		));
		expect(M7).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 4), d("c", 10))),
				vv("c", ol<Dot>(d("c", 50))),
			),
			ol<VV>(),
		));
		expect(M8).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 4), d("c", 10))),
				vv("c", ol<Dot>(d("c", 20))),
			),
			ol<VV>(),
		));
		expect(M9).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 4), d("c", 10))),
				vv("c", ol<Dot>(d("c", 20))),
			),
			ol<VV>(),
		));
		expect(M10).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 12), d("c", 10))),
				vv("c", ol<Dot>(d("c", 20))),
			),
			ol<VV>(),
		));
		expect(M11).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 5), d("c", 10))),
				vv("c", ol<Dot>(d("c", 20))),
			),
			ol<VV>(),
		));

		expect(swc.updatePeer(N, "a", C1)).toEqual(vvm(
			ol<VV>(
				vv("c", ol<Dot>(d("c", 4), d("d", 3), d("z", 0))),
				vv("d", ol<Dot>(d("c", 0), d("d", 1), d("e", 2))),
				vv("z", ol<Dot>(d("a", 0), d("c", 0), d("z", 0))),
			),
			ol<VV>(
				vv("b", ol<Dot>(d("a", 7), d("b", 2), d("c", 3))),
			)
		));
		expect(swc.updatePeer(N, "c", C2)).toEqual(vvm(
			ol<VV>(
				vv("c", ol<Dot>(d("c", 50), d("d", 3), d("z", 0))),
				vv("d", ol<Dot>(d("c", 5), d("d", 1), d("e", 2))),
				vv("z", ol<Dot>(d("a", 0), d("c", 0), d("z", 0))),
			),
			ol<VV>(
				vv("b", ol<Dot>(d("a", 2), d("b", 2), d("c", 5))),
			),
		));
	});

	it('left join', () => {
		const A = vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 4), d("c", 10))),
				vv("c", ol<Dot>(d("c", 20))),
				vv("z", ol<Dot>(d("t1", 0), d("t2", 0), d("z", 0))),
			),
			ol<VV>(),
		);
		const Z = vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 5), d("c", 8), d("z", 2))),
				vv("c", ol<Dot>(d("c", 20))),
				vv("z", ol<Dot>(d("t1", 0), d("t2", 0), d("z", 0))),
			),
			ol<VV>(),
		);
		const B = vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 2), d("c", 10))),
				vv("b", ol<Dot>()),
				vv("c", ol<Dot>(d("c", 22))),
			),
			ol<VV>(),
		);
		const C = vvm(
			ol<VV>(
				vv("z", ol<Dot>(d("a", 1), d("b", 0), d("z", 4))),
			),
			ol<VV>(),
		);
		expect(swc.leftJoin(A, B)).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 4), d("c", 10))),
				vv("c", ol<Dot>(d("c", 22))),
				vv("z", ol<Dot>(d("t1", 0), d("t2", 0), d("z", 0))),
			),
			ol<VV>(),
		));
		expect(swc.leftJoin(A, Z)).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 5), d("c", 10))),
				vv("c", ol<Dot>(d("c", 20))),
				vv("z", ol<Dot>(d("t1", 0), d("t2", 0), d("z", 0))),
			),
			ol<VV>(),
		));
		expect(swc.leftJoin(A, C)).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 4), d("c", 10))),
				vv("c", ol<Dot>(d("c", 20))),
				vv("z", ol<Dot>(d("t1", 0), d("t2", 0), d("z", 4))),
			),
			ol<VV>(),
		));
		expect(swc.leftJoin(B, A)).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 4), d("c", 10))),
				vv("b", ol<Dot>()),
				vv("c", ol<Dot>(d("c", 22))),
			),
			ol<VV>(),
		));
		expect(swc.leftJoin(B, C)).toEqual(B);
		expect(swc.leftJoin(C, A)).toEqual(C);
		expect(swc.leftJoin(C, B)).toEqual(C);
	});

	it('add peer', () => {
		expect(swc.addPeer(swc.addPeer(M, "z", ["b", "a"]), "l", ["z", "y"]))
		.toEqual(swc.addPeer(swc.addPeer(M, "l", ["y", "z"]), "z", ["a", "b"]));

		expect(swc.addPeer(M, "z", ["a", "b"])).toEqual(vvm(
			ol<VV>(
				vv("z", ol<Dot>(d("a", 0), d("b", 0), d("z", 0)))
			),
			ol<VV>(),
		));

		expect(swc.addPeer(M4, "z", ["t2", "t1"])).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 4), d("c", 10))),
				vv("c", ol<Dot>(d("c", 20))),
				vv("z", ol<Dot>(d("t1", 0), d("t2", 0), d("z", 0))),
			),
			ol<VV>(),
		));
	});

	it('min', () => {
		expect(swc.min(M, "a")).toEqual(0);
		expect(swc.min(M1, "a")).toEqual(4);
		expect(swc.min(M1, "b")).toEqual(0);
		expect(swc.min(M4, "a")).toEqual(4);
		expect(swc.min(M4, "c")).toEqual(20);
		expect(swc.min(M4, "b")).toEqual(0);
	});

	it('peers', () => {
		expect(swc.peers(M)).toEqual([]);
		expect(swc.peers(M1)).toEqual(["a"]);
		expect(swc.peers(M5)).toEqual(["a", "c"]);
	});

	it('get', () => {
		expect(swc.get(M, "a", "a")).toEqual(0);
		expect(swc.get(M1, "a", "a")).toEqual(0);
		expect(swc.get(M1, "b", "a")).toEqual(0);
		expect(swc.get(M4, "c", "c")).toEqual(20);
		expect(swc.get(M4, "a", "c")).toEqual(10);
	});

	it('reset counters', () => {
		expect(swc.resetCounters(M)).toEqual(M);
		expect(swc.resetCounters(M1)).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 0))),
			),
			ol<VV>(),
		));
		expect(swc.resetCounters(M2)).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 0), d("c", 0))),
			),
			ol<VV>(),
		));
		expect(swc.resetCounters(M3)).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 0), d("c", 0))),
				vv("c", ol<Dot>(d("c", 0))),
			),
			ol<VV>(),
		));
		expect(swc.resetCounters(M4)).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 0), d("c", 0))),
				vv("c", ol<Dot>(d("c", 0))),
			),
			ol<VV>(),
		));
	});

	it('delete peer', () => {
		expect(swc.deletePeer(M1, "a")).toEqual(vvm(
			ol<VV>(),
			ol<VV>(),
		));
		expect(swc.deletePeer(M1, "b")).toEqual(vvm(
			ol<VV>(vv("a", ol<Dot>())),
			ol<VV>(),
		));
		expect(swc.deletePeer(M1, "c")).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 4))),
			),
			ol<VV>(),
		));
		expect(swc.deletePeer(M4, "a")).toEqual(vvm(
			ol<VV>(
				vv("c", ol<Dot>(d("c", 20))),
			),
			ol<VV>(),
		));
		expect(swc.deletePeer(M4, "c")).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("b", 4))),
			),
			ol<VV>(),
		));
	});

	it('replace peer', () => {
		const A = swc.addPeer(vvm(ol<VV>(), ol<VV>()), "a", ["b", "c"]);
		const B = swc.addPeer(A, "b", ["a", "c"]);
		const C = swc.addPeer(B, "c", ["a", "b"]);
		const Z = vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("a", 9), d("c", 2), d("z", 3))),
				vv("c", ol<Dot>(d("a", 1), d("c", 4), d("z", 3))),
				vv("z", ol<Dot>(d("a", 0), d("c", 1), d("z", 2))),
			),
			ol<VV>(),
		);
		const W = vvm(
			ol<VV>(
				vv("b", ol<Dot>(d("a", 9), d("b", 2), d("c", 3))),
				vv("c", ol<Dot>(d("b", 1), d("c", 4), d("d", 3))),
				vv("d", ol<Dot>(d("c", 0), d("d", 1), d("e", 2))),
			),
			ol<VV>(),
		);

		expect(swc.replacePeer(C, "b", "z")).toEqual(vvm(
			ol<VV>(
				vv("a", ol<Dot>(d("a", 0), d("c", 0), d("z", 0))),
				vv("c", ol<Dot>(d("a", 0), d("c", 0), d("z", 0))),
				vv("z", ol<Dot>(d("a", 0), d("c", 0), d("z", 0))),
			),
			ol<VV>(),
		));
		// [
		//     [
		//         ["a", [["a", 0], ["b", 0], ["c", 0]]],
		//         ["b", [["a", 0], ["b", 0], ["c", 0]]],
		//         ["c", [["a", 0], ["b", 0], ["c", 0]]],
		//     ],
		//     []
		// ]
		expect(swc.replacePeer(Z, "a", "b")).toEqual(vvm(
			ol<VV>(
				vv("b", ol<Dot>(d("b", 0), d("c", 0), d("z", 0))),
				vv("c", ol<Dot>(d("b", 0), d("c", 4), d("z", 3))),
				vv("z", ol<Dot>(d("b", 0), d("c", 1), d("z", 2))),
			),
			ol<VV>(),
		));
		expect(swc.replacePeer(W, "b", "z")).toEqual(vvm(
			ol<VV>(
				vv("c", ol<Dot>(d("c", 4), d("d", 3), d("z", 0))),
				vv("d", ol<Dot>(d("c", 0), d("d", 1), d("e", 2))),
				vv("z", ol<Dot>(d("a", 0), d("c", 0), d("z", 0))),
			),
			ol<VV>(),
		));
		expect(swc.replacePeer(W, "a", "z")).toEqual(vvm(
			ol<VV>(
				vv("b", ol<Dot>(d("b", 2), d("c", 3), d("z", 0))),
				vv("c", ol<Dot>(d("b", 1), d("c", 4), d("d", 3))),
				vv("d", ol<Dot>(d("c", 0), d("d", 1), d("e", 2))),
			),
			ol<VV>(),
		));
	});
/*
	it('retire peer', () => {
		const A = swc.addPeer(vvm(
			ol<VV>(], []), "a", ["b","c"]);
		const B = swc.addPeer(A,     "b", ["a","c"]);
		const C = swc.addPeer(B,     "c", ["a","b"]);
		const Z = vvm(
			ol<VV>(
			vv("a", ol<Dot>(d("a", 9), d("c", 2), d("z", 3))),
			vv("c", ol<Dot>(d("a", 1), d("c", 4), d("z", 3))),
			vv("z", ol<Dot>(d("a", 0), d("c", 1), d("z", 2))),
		],
		[]);
		const W = vvm(
			ol<VV>(
			vv("b", ol<Dot>(d("a", 9), d("b", 2), d("c", 3))),
			vv("c", ol<Dot>(d("b", 1), d("c", 4), d("d", 3))),
			vv("d", ol<Dot>(d("c", 0), d("d", 1), d("e", 2))),
		),
		ol<VV>(),
	);
		expect(swc.retirePeer(C, "b", "z")).toEqual(vvm(
			ol<VV>(
			vv("a", ol<Dot>(d("a", 0), d("c", 0), d("z", 0))),
			vv("c", ol<Dot>(d("a", 0), d("c", 0), d("z", 0))),
			vv("z", ol<Dot>(d("a", 0), d("c", 0), d("z", 0))),
		],
		[
			vv("b", ol<Dot>(d("a", 0), d("c", 0), d("z", 0))),
		]));
		expect(swc.retirePeer(Z, "a", "b")).toEqual(vvm(
			ol<VV>(
			vv("b", ol<Dot>(d("b", 0), d("c", 0), d("z", 0))),
			vv("c", ol<Dot>(d("b", 0), d("c", 4), d("z", 3))),
			vv("z", ol<Dot>(d("b", 0), d("c", 1), d("z", 2))),
		],
		[
			vv("a", ol<Dot>(d("b", 0), d("c", 2), d("z", 3))),
		]));
		expect(swc.retirePeer(W, "b", "z")).toEqual(vvm(
			ol<VV>(
			vv("c", ol<Dot>(d("c", 4), d("d", 3), d("z", 0))),
			vv("d", ol<Dot>(d("c", 0), d("d", 1), d("e", 2))),
			vv("z", ol<Dot>(d("a", 0), d("c", 0), d("z", 0))),
		],
		[
			vv("b", ol<Dot>(d("a", 9), d("c", 3), d("z", 0))),
		]));
		expect(swc.retirePeer(W, "a", "z")).toEqual(vvm(
			ol<VV>(
			vv("b", ol<Dot>(d("b", 2), d("c", 3), d("z", 0))),
			vv("c", ol<Dot>(d("b", 1), d("c", 4), d("d", 3))),
			vv("d", ol<Dot>(d("c", 0), d("d", 1), d("e", 2))),
		),
		ol<VV>(),
	));
	});

	it('prune retired peers', () => {
		const D1 = [dkm("a", [1,2,22]), dkm("b", [4,5,11])];
		const D2 = [dkm("a", [1,2,22]), dkm("z", [4,5,11])];
		const A = vvm(
			ol<VV>(
			vv("a", ol<Dot>(d("a", 0), d("c", 0), d("z", 0))),
			vv("c", ol<Dot>(d("a", 0), d("c", 0), d("z", 0))),
			vv("z", ol<Dot>(d("a", 0), d("c", 0), d("z", 0))),
		],
		[
			vv("b", ol<Dot>(d("a", 0), d("b", 0), d("c", 0))),
		]);
		const A2 = vvm(
			ol<VV>(
			vv("a", ol<Dot>(d("a", 0), d("c", 0), d("z", 0))),
			vv("c", ol<Dot>(d("a", 0), d("c", 0), d("z", 0))),
			vv("z", ol<Dot>(d("a", 0), d("c", 0), d("z", 0))),
		),
		ol<VV>(),
	);
		expect(swc.pruneRetiredPeers(A, D1, [])).toEqual(A);
		expect(swc.pruneRetiredPeers(A, D1, ["a", "b", "c", "z"])).toEqual(A);
		expect(swc.pruneRetiredPeers(A, D2, [])).toEqual(A2);
		expect(swc.pruneRetiredPeers(A, D2, ["b"])).toEqual(A);
		expect(swc.pruneRetiredPeers(A, [], [])).toEqual(A2);
	});
*/
});
