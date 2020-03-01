import { Dot } from './swc-types';

// Returns all the keys (ids) from a VV.
export const vvIds = (vv: Dot[]) => (
	vv.map(([id]) => id)
);

export const isKey = (vv: Dot[], id: string) => (
	vv.some(([id0]) => id0 === id)
);

// Returns the counter associated with an id K. If the key is not present
// in the VV, it returns 0.
export const get = (id: string, vv: Dot[]) => (
	vv.find(([id0]) => id0 === id) || 0
);

// Merges or joins two VVs, taking the maximum counter if an entry is
// present in both VVs.
export const join = (a: Dot[], b: Dot[]): Dot[] => (
	Object.entries([...a, ...b].reduce((acc, [id, num]) => {
		acc[id] = Math.max(num, acc[id] || 0);
		return acc;
	}, {}))
);

// Left joins two VVs, taking the maximum counter if an entry is
// present in both VVs, and also taking the entry in A and not in B.
export const leftJoin = (a: Dot[], b: Dot[]) => {
	const ids = vvIds(a);
	return join(a, b.filter(([id]) => ids.includes(id)));
};

// Adds an entry {Id, Counter} to the VV, performing the maximum between
// both counters, if the entry already exists.
export const add = (vv: Dot[], [id, counter]): Dot[] => {
	const idx = vv.findIndex(([id0]) => id0 === id);
	if (idx > -1) {
		const vv2 = vv.slice();
		vv2[idx] = [id, Math.max(counter, vv2[idx][1])];
		return vv2;
	} else {
		return [...vv, [id, counter]];
	}
};

// Returns the minimum counter of all entries.
export const min = (vv: Dot[]): number => (
	vv.reduce((acc, [,num]) => Math.min(acc, num), Infinity)
);

// Returns the key with the minimum counter associated.
export const minKey = (vv: Dot[]) => {
	const [head, ...rest] = vv;
	const [minKey] = rest.reduce(([key2, val2], [key1, val1]) => (
		val1 < val2 ? [key1, val1] : [key2, val2]
	), head) || head;
	return minKey;
};

// Returns the VV with the same entries, but with counters at zero.
export const resetCounters = (vv: Dot[]) => vv.map(([str]) => ([str, 0]));

// Returns the VV without the entry with a given key.
export const deleteKey = (vv: Dot[], id: string): Dot[] => {
	const idx = vv.findIndex(([id0]) => id0 === id);
	return idx > -1 ? [...vv.slice(0, idx), ...vv.slice(idx + 1)] : vv;
};
