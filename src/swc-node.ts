export type Bvv = [number, number];
export type Dot = [string, number];
export type NodeClock = [string, Bvv];
export type NodeClocks = NodeClock[];

// Returns the entry of a BVV associated with a given ID.
export const get = (
	[nodeId, bitmap]: Bvv,
	bvv: NodeClocks,
) => (
	bvv.find(([id]) => id === `${nodeId},${bitmap}`) || [0, 0]
);

// Normalizes an entry pair, by removing dots and adding them to the base
// if they are contiguous with the base.
export const norm = ([baseCounter, bitmap]: Bvv): Bvv => (
	bitmap % 2 ? norm([baseCounter + 1, bitmap >> 1]) : [baseCounter, bitmap]
);

// Normalizes all entries in the BVV, using norm.
export const normBvv = (bvv: NodeClocks): NodeClocks => (
	bvv
	// normalize all entries
	.map(([key, bvv]): [string, Bvv] => ([key, norm(bvv)]))
	// remove `[0,0]` entries
	.filter(([, bvv]) => bvv.join(',') !== '0,0')
);

// Returns the dots in the first clock that are missing from the second
// clock, but only from entries in the list of ids received as argument.
export const missingDots = (
	nc1: NodeClocks,
	nc2: NodeClocks,
	ids: string[],
): NodeClocks => {
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
	[count1, bitmap1]: Bvv,
	[count2, bitmap2]: Bvv,
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
export const values = ([baseCounter, bitmap]: Bvv) => (
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
	clocks: NodeClocks,
	[id, counter]: Dot,
) => {
	const initial = addAux([0, 0], counter);
	const fn = (entry: Bvv) => addAux(entry, counter);

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
	[base, bitmap]: Bvv,
	count: number,
) => {
	if (base < count) {
		const newBitmap = bitmap | (1 << (count - base - 1));
		return norm([base, newBitmap]);
	} else {
		return norm([base, bitmap]);
	}
};
