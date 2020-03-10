import {
	d,
	olt,
	dvp,
	dcc,
	Dot,
	VV,
	DCC,
	DVP,
	BVV,
	prim,
	OLByTuple,
	OLByString,
} from './swc-types';
import * as swcVv from './swc-vv';
import * as swcNode from './swc-node';

// Returns the set of values held in the DCC.
export const values = ([values]: DCC): prim[] => (
	values.map(([, v]) => v)
);

// Returns the causal context of a DCC, which is representable as a 
// Version Vector.
export const context = ([, dots]: DCC): VV => dots;

// Performs the synchronization of two DCCs; it discards versions (
// {dot,value} pairs) made obsolete by the other DCC, by preserving the
// versions that are present in both, together with the versions in either of
// them that are not covered by the relevant entry in the other's causal
// context; the causal context is obtained by a standard version vector merge
// function (performing the pointwise maximum).
export const sync = (
	[dvp1, dots1]: DCC,
	[dvp2, dots2]: DCC,
): DCC => {
	// if two versions have the same dot, they must have the same value also.
	// merge the two DCC's.
	const merged = Object.values([...dvp1, ...dvp2].reduce((acc, [dot, val]) => {
		acc[dot.join()] = dvp(dot, val);
		return acc;
	}, {} as { [k: string]: any })) as OLByTuple<DVP>;

	// filter the outdated versions
	const current = merged.delete(([[id, counter]]) => (
		counter > Math.min(swcVv.get(id, dots1), swcVv.get(id, dots2))
	));
	// calculate versions that are in both DCC's
	const dvp1Dots = dvp1.map(([dot]) => dot);

	const filtered = dvp2.delete(([dot1]) => dvp1Dots.some((dot2) => (
		dot1.join() === dot2.join()
	)));
	// add these versions to the filtered list of versions
	const dvps = olt(...current, ...filtered);
	// return the new list of version and the merged VVs
	return dcc(dvps, swcVv.join(dots1, dots2));
};

// Adds the dots corresponding to each version in the DCC to the BVV; this
// is accomplished by using the standard fold higher-order function, passing
// the function swc_node:add/2 defined over BVV and dots, the BVV, and the list of
// dots in the DCC.
export const addBVV = (
	someBvv: OLByString<BVV>,
	[versions]: DCC,
): OLByString<BVV> => {
	const dots = versions.map(([k]) => k);
	return dots.reduce((acc, item) => swcNode.add(acc, item), someBvv);
};

// This function is to be used at node I after dcc:discard/2, and adds a
// mapping, from the Dot (I, N) (which should be obtained by previously applying
// swc_node:event/2 to the BVV at node I) to the Value, to the DCC, and also advances
// the i component of the VV in the DCC to N.
export const addDCC = (
	[someDvp, dccDot]: DCC,
	dot: Dot,
	value: string,
): DCC => dcc(
	someDvp.store(dvp(dot, value)),
	swcVv.add(dccDot, dot),
);

// It discards versions in DCC {D,V} which are made obsolete by a causal
// context (a version vector) C, and also merges C into DCC causal context V.
export const discard = (
	[dvps, ccDots]: DCC,
	dot: VV,
): DCC => dcc(
	dvps.delete(([[id, count]]) => count > swcVv.get(id, dot)),
	swcVv.join(ccDots, dot),
);

// It discards all entries from the version vector V in the DCC that are
// covered by the corresponding base component of the BVV B; only entries with
// greater sequence numbers are kept. The idea is that DCCs are stored after
// being stripped of their causality information that is already present in the
// node clock BVV.
export const strip = (
	[someDvp, dots]: DCC,
	someBvv: OLByString<BVV>,
): DCC => dcc(
	someDvp,
	dots.delete(([id, n]: Dot) => n > swcNode.get(id, someBvv)[0]),
);

// Function fill/2 adds back causality information to a stripped DCC, before
// any operation is performed.
export const fill2 = (
	[someDvp, dots]: DCC,
	someBvv: OLByString<BVV>,
): DCC => dcc(
	someDvp,
	someBvv.reduce((acc, [id]: BVV) => {
		const [base] = swcNode.get(id, someBvv);
		return swcVv.add(acc, d(id, base));
	}, dots),
);

// Same as fill/2 but only adds entries that are elements of a list of Ids,
// instead of adding all entries in the BVV.
export const fill3 = (
	[someDvp, dots]: DCC,
	someBvv: OLByString<BVV>,
	ids: string[],
): DCC => {
	// only consider ids that belong to both the list of ids received and the BVV
	const cross = someBvv
	.map(([id]) => id)
	.filter((id) => ids.includes(id))
	.concat(ids.filter((id0) => someBvv.some(([id1]) => id1 === id0)));
	return dcc(
		someDvp,
		cross.reduce((acc, id) => {
			const [base] = swcNode.get(id, someBvv);
			return swcVv.add(acc, d(id, base));
		}, dots),
	);
};
