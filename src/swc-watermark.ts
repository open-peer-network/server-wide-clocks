import {
  d,
  vv,
  ol,
  vvm,
  evvp,
  BVV,
  VVM,
  DKM,
  Dot,
  EVVP,
  OLByPrim,
} from './swc-types';
import * as swcNode from './swc-node';
import * as swcVv from './swc-vv';


export const getNew = () => vvm(ol<EVVP>(), ol<EVVP>());

export const addPeer = ([bvvA, bvvB]: VVM, peer: string, itsPeers: string[]): VVM => {
  const newDots = [peer, ...itsPeers].reduce((acc, id) => (
    swcVv.add(acc, d(id, 0))
  ), ol<Dot>());
  return vvm(bvvA.store(evvp(peer, newDots)), bvvB);
};

export const updatePeer = ([bvvA, bvvB]: VVM, entry: string, nodeClock: OLByPrim<BVV>): VVM => (
  vvm(
    updatePeerAux(bvvA, entry, nodeClock),
    updatePeerAux(bvvB, entry, nodeClock),
  )
);

const updatePeerAux = (vvA: OLByPrim<EVVP>, entry: string, nodeClock: OLByPrim<BVV>): OLByPrim<EVVP> => (
  vvA.map(([id, dots]: EVVP) => {
    if (dots.some(([dotId]) => dotId === entry)) {
      const [base] = swcNode.get(id, nodeClock);
      return evvp(id, swcVv.add(dots, d(entry, base)));
    } else {
      return evvp(id, dots);
    }
  })
);

export const replacePeer = (vvmA: VVM, oldId: string, newId: string): VVM => {
  const [vvL1, vvR1] = vvmA;
  const vvL2 = vvL1.some(([id]) => id === oldId) ? (() => {
    const oldPeerIds = (vvL1.fetch(oldId) as OLByPrim<Dot>).toArray(([id]) => id);
    const oldPeerIdsFiltered = oldPeerIds.filter((id) => id !== oldId);
    return addPeer(vvmA, newId, oldPeerIdsFiltered)[0].erase(oldId);
  })() : vvL1;

  const fn = ([id, dots]: EVVP) => {
    const match = dots.find(([idX]) => idX === oldId);
    if (match) {
      return evvp(id, swcVv.add(dots.erase(oldId), [newId, 0]));
    } else {
      return evvp(id, dots);
    }
  };

  return vvm(vvL2.map(fn), vvR1.map(fn));
};

export const retirePeer = ([vvL, vvR]: VVM, oldId: string, newId: string): VVM => {
  const found = vvL.find(([id]) => id === oldId);
  if (found) {
    return replacePeer(vvm(vvL, vvR.store(found)), oldId, newId);
  } else {
    return replacePeer(vvm(vvL, vvR), oldId, newId);
  }
};

export const leftJoin = ([a1, a2]: VVM, [b1, b2]: VVM): VVM => (
  vvm(leftJoinAux(a1, b1), leftJoinAux(a2, b2))
);

export const leftJoinAux = (vvA: OLByPrim<EVVP>, vvB: OLByPrim<EVVP>): OLByPrim<EVVP> => {
  // filter entry peers from B that are not in A
  const peers = vvA.toArray((id: EVVP) => id[0]);
  const vvB2 = vvB.filter((tuple) => peers.includes(tuple[0]));

  return vvB2.merge(vvA, (vvL, vvR) => (
    evvp(vvL[0], swcVv.leftJoin(vvR[1], vvL[1]))
  ));
};

export const updateCell = ([vvA1, vvB1]: VVM, entry: string, peer: string, count: number): VVM => {
  const newDot = d(peer, count);

  let match = false;
  const vvA2 = ol<EVVP>(...vvA1.map((vv0) => {
    if (vv0[0] === entry) {
      match = true;
      return evvp(vv0[0], swcVv.add(vv0[1], newDot));
    }
    return evvp(vv0[0], vv0[1]);
  }));

  if (!match) {
    vvA2[vvA2.length] = evvp(entry, vv(newDot));
  }

  return vvm(vvA2, vvB1);
};

export const min = ([vvL, vvR]: VVM, id: string): number => (
  Math.max(minAux(vvL, id), minAux(vvR, id))
);

export const minAux = (vv1: OLByPrim<EVVP>, id: string): number => {
  const vv2 = vv1.find(([id0]) => id0 === id);
  return vv2 ? swcVv.min(vv2[1]) : 0;
};

export const peers = ([vva]: VVM): string[] => vva.toArray(([id]) => id);

export const get = ([vva]: VVM, p1: string, p2: string): number => {
  const match = vva.find(([id]) => id === p1);
  return match ? swcVv.get(p2, match[1]) : 0;
};

export const resetCounters = ([a, b]: VVM): VVM => vvm(
  ol<EVVP>(...a.map(([id, dots]) => evvp(id, swcVv.resetCounters(dots)))),
  ol<EVVP>(...b.map(([id, dots]) => evvp(id, swcVv.resetCounters(dots)))),
);

export const deletePeer = ([vva, vvb]: VVM, id: string): VVM => (
  vvm(
    ol<EVVP>(
      ...vva
        .erase(id)
        .map(([s, ds]) => evvp(s, swcVv.deleteKey(ds, id)))
    ),
    vvb,
  )
);

export const pruneRetiredPeers = ([a, b]: VVM, dkm: OLByPrim<DKM>, dontRemotePeers: string[]): VVM => (
  vvm(a, b.filter(([peer]) => (
    dkm.some(([id]) => id === peer) || dontRemotePeers.includes(peer)
  )))
);
