import {
	d,
	Dot,
	VV,
} from './swc-types';

export const isKey = (vv: VV, id: string): boolean => (
	vv.some(([id0]) => id0 === id)
);

// Returns the counter associated with an id K. If the key is not present
// in the VV, it returns 0.
export const get = (id: string, vv: VV): number => {
	const dot = vv.find(([id0]) => id0 === id);
	return dot ? dot[1] : 0;
};

// Merges or joins two VVs, taking the maximum counter if an entry is
// present in both VVs.
export const join = (a: VV, b: VV): VV => (
	a.merge(b, (a: Dot, b: Dot) => (
		d(a[0], Math.max(a[1], b[1]))
	))
);

// Left joins two VVs, taking the maximum counter if an entry is
// present in both VVs, and also taking the entry in A and not in B.
export const leftJoin = (a: VV, b: VV): VV => {
	const peers = a.toArray((id: Dot) => id[0]);
	const b2 = b.filter(([id]) => peers.includes(id));

	return b2.merge(a, (d1, d2) => (
		d(d1[0], Math.max(d1[1], d2[1]))
	));
};

// Adds an entry {Id, Counter} to the VV, performing the maximum between
// both counters, if the entry already exists.
export const add = (dots: VV, [id, counter]: Dot): VV => (
	dots.update4(id, d(id, counter), (oldVal: number): Dot => (
		d(id, Math.max(counter, oldVal))
	))
);

// Returns the minimum counter of all entries.
export const min = (dots: VV): number => (
	dots.reduce((acc, [,num]) => Math.min(acc, num), Infinity)
);

// Returns the key with the minimum counter associated.
export const minKey = (dots: VV): string => {
	const [head, ...rest] = dots;
	const [minKey] = rest.reduce(([key2, val2], [key1, val1]) => (
		val1 < val2 ? d(key1, val1) : d(key2, val2)
	), head) || head;
	return minKey;
};

// Returns the VV with the same entries, but with counters at zero.
export const resetCounters = (dots: VV): VV => (
	dots.map(([str]) => d(str, 0))
);

// Returns the VV without the entry with a given key.
export const deleteKey = (dots: VV, id: string): VV => (
	dots.erase(id)
);
