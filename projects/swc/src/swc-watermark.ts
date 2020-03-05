import { vv, d, vvm, VV, BVV, VVM, Dot, OrderedList } from './swc-types';
import { storeById } from './erlang-helpers';
// import { store } from './erlang-helpers';
import * as swcNode from './swc-node';
// import * as swcDkm from './swc-dotkeymatrix';
import * as swcVv from './swc-vv';

// const { isArray } = Array;

export const addPeer = (
	[bvvA, bvvB]: [OrderedList<VV>, OrderedList<VV>],
	newPeerId: string,
	itsPeers: string[],
): VVM => {
	const newEntry: VV[] = [newPeerId, ...itsPeers].reduce((acc, id) => (
		swcVv.add(acc, d(id, 0)).sort(([s1], [s2]) => Number(s1 > s2))
	), []);
	// const newEntry: Dot[] = itsPeers.reduce((acc, id) => (
	// 	swcVv.add(acc, d(id, 0))
	// ), []);
	return vvm(storeById(newPeerId, newEntry, bvvA), bvvB);
	// return vvm(store(vv(newPeerId, newEntry), bvvA), bvvB);
};

export const updatePeer = (
	[bvvA, bvvB]: VVM,
	entryId: string,
	nodeClock: BVV[],
): VVM => vvm(
	updatePeerAux(bvvA, entryId, nodeClock),
	updatePeerAux(bvvB, entryId, nodeClock),
);

const updatePeerAux = (
	vvA: VV[],
	entryId: string,
	nodeClock: BVV[],
): VV[] => (
	vvA.map(([id, dot]: VV) => {
		if (dot.some(([dotId]) => dotId === entryId)) {
			const [base] = swcNode.get(id, nodeClock);
			return vv(id, swcVv.add(dot, d(entryId, base)));
		} else {
			return vv(id, dot);
		}
	}).sort(([a], [b]) => Number(a > b))
);

export const replacePeer = (
	vvm1: VVM,
	oldId: string,
	newId: string,
): VVM => {
	const [vvL, vvR] = vvm1;
	const found = vvL.find(([id]: VV) => id === oldId);

	const filteredDots = (dots: Dot[]): string[] => (
		dots.map(([id]) => id).filter((id) => id !== oldId)
	);
	const newVvm = (dots: Dot[]) => (
		addPeer(vvm1, newId, filteredDots(dots))[0]
	);
	const vvL2 = found ? newVvm(found[1]) : vvL;

	const fn = (vvX: VV): VV => {
		const [id, dots] = vvX;
		if (dots.some(([idX]) => idX === oldId)) {
			return vv(id, swcVv.add(swcVv.deleteKey(dots, oldId), d(newId, 0)));
		} else {
			return vvX;
		}
	};
	return vvm(vvL2.map(fn), vvR.map(fn));
};

/*
// -spec retire_peer(vv_matrix(), Old::id(), New::id()) -> vv_matrix().
retire_peer({M,R}, Old, New) ->
case orddict.find(Old, M) of
	error ->
		replace_peer({M,R}, Old, New);
	{ok, OldEntry} ->
		// CurrentCounter = swcVv.get(Old, OldEntry),
		// OldEntry2 = swcVv.add(OldEntry, {Old, CurrentCounter+Jump}),
		R1 = orddict.store(Old, OldEntry, R),
		replace_peer({M,R1}, Old, New)
end.
*/

export const leftJoin = (
	[a1, a2]: VVM,
	[b1, b2]: VVM,
): VVM => {
	return vvm(leftJoinAux(a1, b1), leftJoinAux(a2, b2));
};

export const leftJoinAux = (
	vv1: VV[],
	vv2: VV[],
): VV[] => {
	const peers: string[] = vv1.map(([id]) => id);

	// filter entry peers from B that are not in A
	const vv2b = vv2.filter(([id]) => peers.includes(id));

	const merged: { [k: string]: Dot[] } = [...vv1, ...vv2b].reduce((acc, [id, vv0]: VV) => {
		acc[id] = acc[id] ? swcVv.leftJoin(acc[id], vv0) : vv0 as Dot[];
		return acc;
	}, {});

	return Object.entries(merged)
	.map(([id, dots]) => vv(id, dots))
	.sort(([a], [b]) => Number(a > b));
};

export const updateCell = (
	[vvA1, vvB1]: VVM,
	entryId: string,
	peerId: string,
	counter: number,
): VVM => {
	const newDot = d(peerId, counter);

	let match = false;
	const vvA2 = vvA1.map((vv0) => {
		if (vv0[0] === entryId) {
			match = true;
			return vv(vv0[0], swcVv.add(vv0[1], newDot));
		}
		return vv(vv0[0], vv0[1].map(([s, n]) => d(s, n)));
	});
	if (!match) {
		vvA2.push(vv(entryId, [newDot]));
	}

	return vvm(vvA2.sort(([a], [b]) => Number(a > b)), vvB1);
};

export const min = (
	[vvL, vvR]: VVM,
	id: string,
): number => (
	Math.max(minAux(vvL, id), minAux(vvR, id))
);

export const minAux = (
	vv1: VV[],
	id: string,
): number => {
	const vv2 = vv1.find(([id0]) => id0 === id);
	return vv2 ? swcVv.min(vv2[1]) : 0;
};

export const peers = ([vva]: VVM): string[] => vva.map(([id]) => id);

export const get = (
	[vva]: VVM,
	p1: string,
	p2: string,
): number => {
	const match = vva.find(([id]) => id === p1);
	return match ? swcVv.get(p2, match[1]) : 0;
};

export const resetCounters = ([a, b]: VVM): VVM => vvm(
	a.map(([id, dots]) => vv(id, swcVv.resetCounters(dots))),
	b.map(([id, dots]) => vv(id, swcVv.resetCounters(dots))),
);

export const deletePeer = ([vva, vvb]: VVM, id: string): VVM => vvm(
	vva.filter(([i]) => i !== id).map(([s, ds]) => vv(s, swcVv.deleteKey(ds, id))),
	vvb,
);

/*
export const pruneRetiredPeers = (
	[a, b]: VVM,
	dkm: DKM[],
	dontRemotePeers: string[],
): VVM => vvm(a, b.filter((peer) => (
	swcDkm.isKey(dkm, peer) ||
	dontRemotePeers.includes(peer)
)));
*/
