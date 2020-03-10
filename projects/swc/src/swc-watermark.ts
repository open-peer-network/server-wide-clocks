import {
	d,
	vv,
	ol,
	vvm,
	evvp,
	BVV,
	VVM,
	Dot,
	EVVP,
	OLByString,
} from './swc-types';
import * as swcNode from './swc-node';
// import * as swcDkm from './swc-dotkeymatrix';
import * as swcVv from './swc-vv';


export const addPeer = (
	[bvvA, bvvB]: [OLByString<EVVP>, OLByString<EVVP>],
	newPeerId: string,
	itsPeers: string[],
): VVM => {
	const newDots = ol<Dot>(...[newPeerId, ...itsPeers].reduce((acc, id) => (
		swcVv.add(acc, d(id, 0))
	), ol<Dot>()));
	// const newDots = ol<Dot>(...[newPeerId, ...itsPeers].map((id) => d(id, 0)));

	return vvm(bvvA.store(evvp(newPeerId, newDots)), bvvB);
};

export const updatePeer = (
	[bvvA, bvvB]: VVM,
	entryId: string,
	nodeClock: OLByString<BVV>,
): VVM => vvm(
	updatePeerAux(bvvA, entryId, nodeClock),
	updatePeerAux(bvvB, entryId, nodeClock),
);

const updatePeerAux = (
	vvA: OLByString<EVVP>,
	entryId: string,
	nodeClock: OLByString<BVV>,
): OLByString<EVVP> => new OLByString<EVVP>(vvA.map(([id, dots]: EVVP) => {
	if (dots.some(([dotId]) => dotId === entryId)) {
		const [base] = swcNode.get(id, nodeClock);
		return evvp(id, swcVv.add(dots, d(entryId, base)));
	} else {
		return evvp(id, dots);
	}
}));

export const replacePeer = (
	vvm1: VVM,
	oldId: string,
	newId: string,
): VVM => {
	const [vvL, vvR] = vvm1;
	const found = vvL.find(([id]: EVVP) => id === oldId);

	const filteredDots = (dots: OLByString<Dot>): string[] => (
		dots.map(([id]) => id).filter((id) => id !== oldId)
	);
	const newVvm = (dots: OLByString<Dot>) => (
		addPeer(vvm1, newId, filteredDots(dots))[0]
	);
	const vvL2 = found ? newVvm(found[1]) : vvL;

	const fn = (vvX: EVVP): EVVP => {
		const [id, dots] = vvX;
		if (dots.some(([idX]) => idX === oldId)) {
			return evvp(id, swcVv.add(swcVv.deleteKey(dots, oldId), d(newId, 0)));
		} else {
			return vvX;
		}
	};
	return vvm(
		ol<EVVP>(...vvL2.map(fn)),
		ol<EVVP>(...vvR.map(fn)),
	);
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
): VVM => (
	vvm(leftJoinAux(a1, b1), leftJoinAux(a2, b2))
);

export const leftJoinAux = (
	vv1: OLByString<EVVP>,
	vv2: OLByString<EVVP>,
): OLByString<EVVP> => {
	// filter entry peers from B that are not in A
	const peers: string[] = Array.prototype.map.call(vv1, (id: EVVP) => id[0]);
	const vv2b = vv2.delete(([id]) => peers.includes(id));

	return vv2b.merge(vv1, (vvA, vvB) => {
		console.log(vvA[1], vvB[1]);
		const leftJoin = swcVv.leftJoin(vvA[1], vvB[1]);
		console.log(leftJoin);
		return evvp(vvA[0], leftJoin);
	});
};

export const updateCell = (
	[vvA1, vvB1]: VVM,
	entryId: string,
	peerId: string,
	counter: number,
): VVM => {
	const newDot = d(peerId, counter);

	let match = false;
	const vvA2 = ol<EVVP>(...vvA1.map((vv0) => {
		if (vv0[0] === entryId) {
			match = true;
			return evvp(vv0[0], swcVv.add(vv0[1], newDot));
		}
		return evvp(vv0[0], vv0[1]);
	}));
	if (!match) {
		vvA2[vvA2.length] = evvp(entryId, vv(newDot));
	}

	return vvm(vvA2, vvB1);
};

export const min = (
	[vvL, vvR]: VVM,
	id: string,
): number => (
	Math.max(minAux(vvL, id), minAux(vvR, id))
);

export const minAux = (
	vv1: OLByString<EVVP>,
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
	ol<EVVP>(...a.map(([id, dots]) => evvp(id, swcVv.resetCounters(dots)))),
	ol<EVVP>(...b.map(([id, dots]) => evvp(id, swcVv.resetCounters(dots)))),
);

export const deletePeer = ([vva, vvb]: VVM, id: string): VVM => vvm(
	ol<EVVP>(...vva
		.delete(([i]) => i === id)
		.map(([s, ds]) => evvp(s, swcVv.deleteKey(ds, id)))
	),
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
