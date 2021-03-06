import {
  d,
  ol,
  bbp,
  bvv,
  Dot,
  BVV,
  BBP,
  OLByPrim,
} from './swc-types';


// Returns the entry of a BVV associated with a given ID.
export const get = (
  bbpA: string,
  bvvA: OLByPrim<BVV>,
): BBP => {
  const match = bvvA.find(([id]) => id === bbpA);
  return match ? match[1] : bbp(0, 0);
};

// Normalizes an entry pair, by removing dots and adding them to the base
// if they are contiguous with the base.
export const norm = (
  [baseCounter, bitmap]: BBP
): BBP => (
  bitmap % 2 ? norm(bbp(baseCounter + 1, bitmap >> 1)) : bbp(baseCounter, bitmap)
);

// Normalizes all entries in the BVV, using norm.
export const normBvv = (
  bvvA: OLByPrim<BVV>,
): OLByPrim<BVV> => (
  // normalize all entries
  ol<BVV>(...bvvA.map(([key, bvvB]): BVV => bvv(key, norm(bvvB))))
    // remove `[0,0]` entries
    .filter(([, bvvC]) => bvvC.join(',') !== '0,0')
);

// Returns the dots in the first clock that are missing from the second
// clock, but only from entries in the list of ids received as argument.
export const missingDots = (
  nc1: OLByPrim<BVV>,
  nc2: OLByPrim<BVV>,
  ids: string[],
): [string, number[]][] => (
  nc1.reduce((acc, bvvX) => {
    const [id, vvA] = bvvX;
    if (ids.includes(id)) {
      const idx = nc2.findIndex((z) => id === z[0]);
      if (idx > -1) {
        const result = subtractDots(vvA, nc2[idx][1]);
        if (result.length === 0) return acc;
        return [...acc, [id, result]];
      } else {
        return [...acc, [id, values(vvA)]];
      }
    } else {
      return acc;
    }
  }, [])
);

export const subtractDots = ([count1, bitmap1]: BBP, [count2, bitmap2]: BBP): number[] => {
  const [n1, n2] = count1 > count2 ? [
    seq(count2 + 1, count1).concat(valuesAux(count1, bitmap1, [])),
    valuesAux(count2, bitmap2, []),
  ] : [
    valuesAux(count1, bitmap1, []),
    seq(count1 + 1, count2).concat(valuesAux(count2, bitmap2, [])),
  ];
  return n1.reduce((acc, el) => (
    n2.includes(el) ? acc : [...acc, el]
  ), []);
};

export const seq = (start: number = 0, end: number = 1) => {
  let i = start - 1;
  return end < 1 ? [] : (
    new Array(end - i).fill(0).map(() => ++i)
  );
};

// Returns the sequence numbers for the dots represented by an entry.
export const values = ([baseCounter, bitmap]: BBP) => (
  seq(1, baseCounter).concat(valuesAux(baseCounter, bitmap, []))
);

// Returns the sequence numbers for the dots represented by a bitmap.
// It's an auxiliary function used by values/1.
const valuesAux = (
  baseCounter: number,
  bitmap: number,
  context: number[],
): number[] => {
  if (bitmap === 0) {
    return context.slice().reverse();
  }
  const newCount = baseCounter + 1;
  return bitmap % 2
    ? valuesAux(newCount, bitmap >> 1, [newCount, ...context])
    : valuesAux(newCount, bitmap >> 1, context);
};

// Adds a dot (ID, Counter) to a BVV.
export const add = (clocks: OLByPrim<BVV>, [id, counter]: Dot): OLByPrim<BVV> => {
  const initial = addAux(bbp(0, 0), counter);
  return clocks.update4(id, bvv(id, initial), (bbp0) => (
    bvv(id, addAux(bbp0, counter))
  ));
};

// Adds a dot to a BVV entry, returning the normalized entry.
export const addAux = (
  [base, bitmap]: BBP,
  count: number,
): BBP => (
  (base < count)
    ? norm(bbp(base, bitmap | (1 << (count - base - 1))))
    : norm(bbp(base, bitmap))
);

// Merges all entries from the two BVVs.
export const merge = (bvv1: OLByPrim<BVV>, bvv2: OLByPrim<BVV>): OLByPrim<BVV> => (
  normBvv(
    bvv1.merge(bvv2, (a, b) => bvv(a[0], joinAux(a[1], b[1])))
  )
);

// Joins entries from BVV2 that are also IDs in BVV1, into BVV1.
export const join = (bvvList1: OLByPrim<BVV>, bvvList2: OLByPrim<BVV>): OLByPrim<BVV> => {
  // filter keys from bvvList2 that are not in bvvList1
  const bvvList1Keys = bvvList1.toArray(([id]) => id);
  // merge bvvList1 with filtered bvvList2b
  return merge(
    bvvList1,
    bvvList2.filter(([id]) => bvvList1Keys.includes(id)),
  );
};

// Returns a (normalized) entry that results from the union of dots from
// two other entries. Auxiliary function used by join/2.
export const joinAux = (
  [count1, bitmap1]: BBP,
  [count2, bitmap2]: BBP,
): BBP => (
  (count1 >= count2)
    ? bbp(count1, bitmap1 | (bitmap2 >> (count1 - count2)))
    : bbp(count2, bitmap2 | (bitmap1 >> (count2 - count1)))
);

// Takes and returns a BVV where in each entry, the bitmap is reset to zero.
export const base = (someBvv: OLByPrim<BVV>): OLByPrim<BVV> => (
  // normalize all entries
  // remove all non-contiguous counters w.r.t the base
  ol<BVV>(...normBvv(someBvv).map(([id, [counter]]) => bvv(id, bbp(counter, 0))))
);

// Takes a BVV at node Id and returns a pair with sequence number for a new
// event (dot) at node Id and the original BVV with the new dot added; this
// function makes use of the invariant that the node BVV for node Id knows all
// events generated at Id, i.e., the first component of the pair denotes the
// last event, and the second component, the bitmap, is always zero.
export const event = (
  bvv: OLByPrim<BVV>,
  id: string,
): [number, OLByPrim<BVV>] => {
  // find the next counter for id
  const match = bvv.find(([id0]) => id0 === id);
  // since nodes call event with their id, their entry always matches [N, 0]
  const count = match ? match[1][0] + 1 : 1;
  // return the new counter and the updated BVV
  return [count, add(bvv, d(id, count))];
};

// Stores an Id-Entry pair in a BVV; if the id already exists, the
// associated entry is replaced by the new one.
export const storeEntry = (
  id: string,
  [base]: BBP,
  bvvA: OLByPrim<BVV>,
): OLByPrim<BVV> => {
  if (base === 0) return bvvA;
  const match = bvvA.find(([id0]) => id0 === id);
  if (match) {
    const [, [base2]] = match;
    return base2 < base
      ? ol<BVV>(...bvvA.map((entry) => entry[0] === id ? bvv(id, bbp(base, 0)) : entry))
      : bvvA;
  }
  return bvvA.store(bvv(id, bbp(base, 0)));
};
