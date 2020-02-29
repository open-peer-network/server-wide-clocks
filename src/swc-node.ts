export type Dot = [string, number];
export type BaseBitmapPair = [number, number];
export type BVV = [string, BaseBitmapPair];

// Returns the entry of a BVV associated with a given ID.
export const get = (
	[nodeId, bitmap]: BaseBitmapPair,
	bvv: BVV[],
) => (
	bvv.find(([id]) => id === `${nodeId},${bitmap}`) || [0, 0]
);

// Normalizes an entry pair, by removing dots and adding them to the base
// if they are contiguous with the base.
export const norm = ([baseCounter, bitmap]: BaseBitmapPair): BaseBitmapPair => (
	bitmap % 2 ? norm([baseCounter + 1, bitmap >> 1]) : [baseCounter, bitmap]
);

// Normalizes all entries in the BVV, using norm.
export const normBvv = (bvv: BVV[]): BVV[] => (
	bvv
	// normalize all entries
	.map(([key, bvv]): BVV => ([key, norm(bvv)]))
	// remove `[0,0]` entries
	.filter(([, bvv]) => bvv.join(',') !== '0,0')
);

// Returns the dots in the first clock that are missing from the second
// clock, but only from entries in the list of ids received as argument.
export const missingDots = (
	nc1: BVV[],
	nc2: BVV[],
	ids: string[],
): BVV[] => {
	return nc1.length < 1 ? [] : nc1.reduce((acc, [id, bvv]) => {
		if (ids.includes(id)) {
			const idx = nc2.findIndex(([id0]) => id === id0);
			if (idx > -1) {
				const result = subtractDots(bvv, nc2[idx][1]);
				if (result.length === 0) return acc;
				return [[id, result], ...acc];
			} else {
				return [[id, values(bvv)], ...acc];
			}
		} else {
			return acc;
		}
	}, []);
};

export const subtractDots = (
	[count1, bitmap1]: BaseBitmapPair,
	[count2, bitmap2]: BaseBitmapPair,
) => {
	const [dots1, dots2] = count1 > count2 ? [
		seq(count2 + 1, count1).concat(valuesAux(count1, bitmap1, [])),
		valuesAux(count2, bitmap2, []),
	] : [
		valuesAux(count1, bitmap1, []),
		seq(count1 + 1, count2).concat(valuesAux(count2, bitmap2, [])),
	];
	return dots1.reduce((acc, el) => (
		dots2.includes(el) ? acc : [...acc, el]
	), []);
};

export const seq = (start: number = 0, end: number = 1) => {
	let i = start - 1;
	return end < 1 ? [] : (
		new Array(end - i).fill(0).map(() => ++i)
	);
};

// Returns the sequence numbers for the dots represented by an entry.
export const values = ([baseCounter, bitmap]: BaseBitmapPair) => (
	seq(1, baseCounter).concat(valuesAux(baseCounter, bitmap, []))
);

// Returns the sequence numbers for the dots represented by a bitmap.
// It's an auxiliary function used by values/1.
const valuesAux = (
	baseCounter: number,
	bitmap: number,
	context: number[],
): number[] => {
	if (bitmap === 0) return context.slice().reverse();
	const newCount = baseCounter + 1;
	if (bitmap % 2) {
		return valuesAux(newCount, bitmap >> 1, [newCount, ...context]);
	} else {
		return valuesAux(newCount, bitmap >> 1, context);
	}
};

// Adds a dot (ID, Counter) to a BVV.
export const add = (
	clocks: BVV[],
	[id, counter]: Dot,
) => {
	const initial = addAux([0, 0], counter);
	const fn = (entry: BaseBitmapPair) => addAux(entry, counter);

	const newClocks = clocks.slice();
	const idx = newClocks.findIndex(([id0]) => id0 === id);
	if (idx > -1) {
		newClocks[idx] = [id, fn(newClocks[idx][1])];
	} else {
		newClocks.unshift([id, initial]);
	}
	return newClocks;
};

// Adds a dot to a BVV entry, returning the normalized entry.
export const addAux = (
	[base, bitmap]: BaseBitmapPair,
	count: number,
) => (
	(base < count)
		? norm([base, bitmap | (1 << (count - base - 1))])
		: norm([base, bitmap])
);

// Merges all entries from the two BVVs.
export const merge = (bvvList1: BVV[], bvvList2: BVV[]) => (
	normBvv(Object.entries(([...bvvList1, ...bvvList2]).reduce((acc, [id, bvv]) => {
		acc[id] = acc[id] ? joinAux(acc[id], bvv) : bvv;
		return acc;
	}, {})))
);

// Joins entries from BVV2 that are also IDs in BVV1, into BVV1.
export const join = (bvvList1: BVV[], bvvList2: BVV[]) => {
	// filter keys from bvvList2 that are not in bvvList1
	const bvvList1Keys = bvvList1.map(([id]) => id);
	const bvvList2b = bvvList2.filter(([id]) => bvvList1Keys.includes(id));
	// merge bvvList1 with filtered bvvList2b
	return merge(bvvList1, bvvList2b);
};

// Returns a (normalized) entry that results from the union of dots from
// two other entries. Auxiliary function used by join/2.
export const joinAux = (
	[count1, bitmap1]: BaseBitmapPair,
	[count2, bitmap2]: BaseBitmapPair,
): BaseBitmapPair => (
	(count1 >= count2)
		? [count1, bitmap1 | (bitmap2 >> (count1 - count2))]
		: [count2, bitmap2 | (bitmap1 >> (count2 - count1))]
);

// Takes and returns a BVV where in each entry, the bitmap is reset to zero.
export const base = (bvv: BVV[]) => (
	// normalize all entries
	// remove all non-contiguous counters w.r.t the base
	normBvv(bvv).map(([baseCounter, [counter]]) => ([baseCounter, [counter, 0]]))
);

// Takes a BVV at node Id and returns a pair with sequence number for a new
// event (dot) at node Id and the original BVV with the new dot added; this
// function makes use of the invariant that the node BVV for node Id knows all
// events generated at Id, i.e., the first component of the pair denotes the
// last event, and the second component, the bitmap, is always zero.
export const event = (bvv: BVV[], id: string) => {
	// find the next counter for id
	const match = bvv.find(([id0]) => id0 === id);
	// since nodes call event with their id, their entry always matches [N, 0]
	const count = match ? match[1][0] + 1 : 1;
	// return the new counter and the updated BVV
	return [count, add(bvv, [id, count]).sort(([id1], [id2]) => Number(id1 > id2))];
};

// Stores an Id-Entry pair in a BVV; if the id already exists, the 
// associated entry is replaced by the new one.
export const storeEntry = (
	id: string,
	[base]: BaseBitmapPair,
	bvv: BVV[],
) => {
	if (base === 0) return bvv;
	const match = bvv.find(([id0]) => id0 === id);
	if (match) {
		const [,[base2]] = match;
		if (base2 >= base) {
			return bvv;
		}
		if (base2 < base) {
			return bvv.map((entry) => entry[0] === id ? [id, [base, 0]] : entry);
		}
	}
	return bvv.concat([[id, [base, 0]]]);
};
