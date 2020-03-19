const { isArray } = Array;

export type prim = string | number | boolean;

type Tuple = [any, any];

export type POJO<T> = {
	[k: string]: T,
};

const toOrderedArray = <B>(ob: POJO<B>): B[] => (
	Object.keys(ob).sort().reduce((ac, key) => ([...ac, ob[key]]), [])
);

const setType = (thing: any, type: string) => {
	Object.defineProperty(thing, "tupleType", {
		value: type,
		enumerable: false,
	});
	return thing;
};

const methodMessage = "restricted method";
export class OrderedList<T extends Tuple> extends Array<T> {
	constructor(arr?: T[]) {
		super();
		if (arr && arr.length) {
			arr.sort((a, b) => isArray(a) && isArray(b)
				? Number(a.join() > b.join())
				: 0
			).reduce((acc, next) => {
				acc[acc.length] = next;
				return acc;
			}, this);
		}
	}
	slice(): any[] {
		throw new Error(methodMessage);
	}
	splice(): any[] {
		throw new Error(methodMessage);
	}
	concat(): any[] {
		throw new Error(methodMessage);
	}
	sort(): this {
		throw new Error(methodMessage);
	}
	shift(): T {
		throw new Error(methodMessage);
	}
	unshift(): number {
		throw new Error(methodMessage);
	}
	push(): number {
		throw new Error(methodMessage);
	}
	pop(): T {
		throw new Error(methodMessage);
	}
	map(_fn: (t: T, i: number, a?: any) => any): any {
		throw new Error(methodMessage);
	}
	filter(_fn: (t: T, i: number, a?: any) => any): any {
		throw new Error(methodMessage);
	}
}

export type PrimKeyTuple = [string | number, any] & {
	tupleType?: string,
};

export type TupleKeyTuple = [Tuple, any] & {
	tupleType?: string,
};

export class OLByTuple<T extends TupleKeyTuple> extends OrderedList<T> {
	constructor(arr?: T[]) {
		super();
		if (arr && arr.length) arr.reduce((acc, next) => {
			acc[acc.length] = next;
			return acc;
		}, this);
	}

	filter(fn: (t: T, i?: number) => boolean): OLByTuple<T> {
		return this.reduce((ac, t: T, i: number) => {
			if (fn(t, i)) ac[ac.length] = t;
			return ac;
		}, new OLByTuple<T>());
	}

	erase(t: Tuple): OLByTuple<T> {
		const str = t.join();
		return this.filter((t) => t[0].join() !== str);
	}

	fetch(key: Tuple): any {
		const found = this.find((t: T) => t[0].join() === key.join());
		if (found === undefined) {
			throw new Error("no such key");
		}
		return found[1];
	}

	merge(incomingList: OLByTuple<T>, mergeFn: (a: T, b: T) => T): OLByTuple<T> {
		const sourceMap: POJO<T> = this.reduce((ac, t: T) => ({
			[t.join()]: t,
			...ac,
		}), {} as POJO<T>);

		const mergedMap = incomingList.reduce((acc, tupleR: T) => {
			const [keyTuple, val] = tupleR;
			const id = keyTuple.join();
			if ([typeof id, typeof val].includes("undefined")) return acc;

			acc[id] = sourceMap.hasOwnProperty(id) ? mergeFn(acc[id], tupleR) : tupleR;

			return acc;
		}, sourceMap);

		return olt<T>(...toOrderedArray<T>(mergedMap));
	}

	update4(newKey: Tuple, defaultTuple: T, fn: (val: T[1]) => T): OLByTuple<T> {
		let done = false;
		const [newKeyL, newKeyR] = newKey;
	
		if (this.length < 1) {
			return new OLByTuple<T>([defaultTuple]);
		}
		return this.reduce((acc, curTuple, idx) => {
			const [curKeyL, curKeyR] = curTuple[0];

			if (!done) {
				if (curKeyL === newKeyL && curKeyR === newKeyR) {
					done = true;
					acc[acc.length] = fn(curTuple[1]);
					return acc;
				}
				if (curKeyL > newKeyL || curKeyL === newKeyL && curKeyR > newKeyR) {
					done = true;
					acc[acc.length] = defaultTuple;
					acc[acc.length] = curTuple;
					return acc;
				}
				if (idx === this.length - 1) {
					acc[acc.length] = curTuple;
					acc[acc.length] = defaultTuple;
					return acc;
				}
			}
			acc[acc.length] = curTuple;
			return acc;
		}, new OLByTuple<T>());
	}

	store(newTuple: T): OLByTuple<T> {
		let done = false;
		const tupleKey = newTuple[0];
		const [newKeyL, newKeyR] = tupleKey;

		if (this.length < 1) {
			return new OLByTuple<T>([newTuple]);
		}
		return this.reduce((acc, curTuple, idx) => {
			const [curKeyL, curKeyR] = curTuple[0];
	
			if (!done) {
				if (curKeyL === newKeyL && curKeyR === newKeyR) {
					done = true;
					acc[acc.length] = newTuple;
					return acc;
				}
				if (curKeyL > newKeyL || curKeyL === newKeyL && curKeyR > newKeyR) {
					done = true;
					acc[acc.length] = newTuple;
					acc[acc.length] = curTuple;
					return acc;
				}
				if (idx === this.length - 1) {
					acc[acc.length] = curTuple;
					acc[acc.length] = newTuple;
					return acc;
				}
			}
	
			acc[acc.length] = curTuple;
			return acc;
		}, new OLByTuple<T>());
	}

	toArray<U>(fn: (t?: T, i?: number) => U): U[] {
		const res: U[] = [];
		this.forEach((t: T, i) => { res[res.length] = fn(t, i); });
		return res;
	}

	map(fn: (t?: T, i?: number) => T): OLByTuple<T> {
		const res = new OLByTuple<T>();
		this.forEach((t: T, i) => { res[res.length] = fn(t, i); });
		return res;
	}
}

export class OLByPrim<T extends PrimKeyTuple> extends OrderedList<T> {
	constructor(arr?: T[]) {
		super();
		if (arr && arr.length) {
			[...arr].sort(([a], [b]) => Number(a > b)).reduce((acc, next) => {
				acc[acc.length] = next;
				return acc;
			}, this);
		}
	}

	filter(fn: (t: T, i?: number) => boolean): OLByPrim<T> {
		return this.reduce((ac, t: T, i: number) => {
			if (fn(t, i)) ac[ac.length] = t;
			return ac;
		}, new OLByPrim<T>());
	}

	erase(k: string): OLByPrim<T> {
		return this.filter((t) => t[0] !== k);
	}

	fetch(key: string): any {
		const found = this.find((t: T) => t[0] === key);
		if (found === undefined) {
			throw new Error("no such key");
		}
		return found[1];
	}

	merge(incomingList: OLByPrim<T>, mergeFn: (a: T, b: T) => T): OLByPrim<T> {
		const sourceMap: POJO<T> = this.reduce((ac, t: T) => ({
			[t[0]]: t,
			...ac,
		}), {} as POJO<T>);

		const mergedMap = incomingList.reduce((acc, tupleR: T) => {
			const [id, val] = tupleR;
			if ([typeof id, typeof val].includes("undefined")) return acc;

			acc[id] = sourceMap.hasOwnProperty(id) ? mergeFn(acc[id], tupleR) : tupleR;

			return acc;
		}, sourceMap);

		return ol<T>(...toOrderedArray<T>(mergedMap));
	}

	update4(newKey: string, defaultTuple: T, fn: (val: T[1]) => T): OLByPrim<T> {
		let done = false;
	
		if (this.length < 1) {
			return new OLByPrim<T>([defaultTuple]);
		}
		return this.reduce((acc, curTuple, idx) => {
			const curKey = curTuple[0];

			if (!done) {
				if (curKey === newKey) {
					done = true;
					acc[acc.length] = fn(curTuple[1]);
					return acc;
				}
				if (curKey > newKey) {
					done = true;
					acc[acc.length] = defaultTuple;
					acc[acc.length] = curTuple;
					return acc;
				}
				if (idx === this.length - 1) {
					acc[acc.length] = curTuple;
					acc[acc.length] = defaultTuple;
					return acc;
				}
			}
			acc[acc.length] = curTuple;
			return acc;
		}, new OLByPrim<T>());
	}

	store(newTuple: T): OLByPrim<T> {
		let done = false;
		const newKey = newTuple[0];

		if (this.length < 1) {
			return new OLByPrim<T>([newTuple]);
		}
		return this.reduce((acc, curTuple, idx) => {
			const curKey = curTuple[0];
	
			if (!done) {
				if (curKey === newKey) {
					done = true;
					acc[acc.length] = newTuple;
					return acc;
				}
				if (curKey > newKey) {
					done = true;
					acc[acc.length] = newTuple;
					acc[acc.length] = curTuple;
					return acc;
				}
				if (idx === this.length - 1) {
					if (curKey > newKey) {
						acc[acc.length] = newTuple;
						acc[acc.length] = curTuple;
					} else {
						acc[acc.length] = curTuple;
						acc[acc.length] = newTuple;
					}
					return acc;
				}
			}
	
			acc[acc.length] = curTuple;
			return acc;
		}, new OLByPrim<T>());
	}

	toArray<U extends prim>(fn: (t?: T, i?: number) => U): U[] {
		const res: U[] = [];
		this.forEach((t: T, i) => { res[res.length] = fn(t, i); });
		return res;
	}

	map(fn: (t?: T, i?: number) => T): OLByPrim<T> {
		const res = new OLByPrim<T>();
		this.forEach((t: T, i) => { res[res.length] = fn(t, i); });
		return res;
	}
}

export type Dot = [string, number] & {
	tupleType?: "Dot",
};
export const d = (a: string, b: number): Dot => (
	setType((a && typeof b === "number") ? [a, b] : [], "Dot")
);

// VV = Version Vector
// EVVP = Entry/Version Vector Pair
export type VV = OLByPrim<Dot>;
export type EVVP = [string, OLByPrim<Dot>] & {
	tupleType?: "EVVP",
};
export const vv = (...dots: Dot[]): VV => (
	ol<Dot>(...dots)
);
export const evvp = (a: string, b: OLByPrim<Dot>): EVVP => {
	if (typeof a !== "string" || !isArray(b)) {
		throw new Error("invalid EVVP");
	}
	const ob = [a, b.filter((dot: Dot) => (
		isArray(dot) &&
		dot.length === 2 &&
		dot.tupleType === "Dot" &&
		!dot.propertyIsEnumerable("tupleType")
	))];
	return setType(ob, "EVVP");
};

// BVV = Bitmapped Version Vector (Node Logical Clock)
export type BVV = [string, BBP] & {
	tupleType?: "BVV",
};
export const bvv = (a: string, b: BBP): BVV => (
	setType([a, b], "BVV")
);

// DVP = Dot/Value Pair
export type DVP = [Dot, string] & {
	tupleType?: "DVP",
};
export const dvp = (dot: Dot, value: any): DVP => (
	setType([dot, value], "DVP")
);

// BBP = Base/Bitmap Pair
export type BBP = [number, number] & {
	tupleType?: "BBP",
};
export const bbp = (base: number, bitmap: number): BBP => (
	setType([base, bitmap], "BBP")
);

// VVM = Version Vector Matrix
export type VVM = [OLByPrim<EVVP>, OLByPrim<EVVP>] & {
	tupleType?: "VVM",
};
export const vvm = (vvs1: OLByPrim<EVVP>, vvs2: OLByPrim<EVVP>): VVM => (
	setType([vvs1, vvs2], "VVM")
);

// DKM = Dot/Key Matrix
export type DKM = [string, number[]] & {
	tupleType?: "DKM",
};
export const dkm = (a: string, b: number[]): DKM => (
	setType([a, b], "DKM")
);

// DKE = Dot/Key Entry
export type DKE = [number, string] & {
	tupleType?: "DKE" // DotKey Entry
};
export const dke = (n: number, s: string): DKE => (
	setType([n, s], "DKE")
);

// KME = Key Matrix Entry
export type KME = [string, OLByPrim<DKE>] & {
	tupleType?: "KME",
};
export const kme = (s: string, list: OLByPrim<DKE>): KME => (
	setType([s, list], "KME")
);

// KM = Key Matrix: { string, { number, string }[] }[]
export type KM = OLByPrim<KME>;
export const km = (...list: KME[]): OLByPrim<KME> => (
	new OLByPrim<KME>(list)
);

export type KMM = [OLByPrim<KME>, OLByPrim<KME>] & {
	tupleType?: "KMM",
};
export const kmm = (a: OLByPrim<KME>, b: OLByPrim<KME>): KMM => (
	setType([a, b], "KMM")
);

// CC = Causal Context
// DCC = Dotted Causal Container
export type DCC = [OLByTuple<DVP>, OLByPrim<Dot>] & {
	tupleType?: "DCC",
};
export const dcc = (dvp1: OLByTuple<DVP>, dots: OLByPrim<Dot>): DCC => (
	setType([dvp1, dots], "DCC")
);
export const ol = <T extends PrimKeyTuple>(...list: T[]) => (
	new OLByPrim<T>(list)
);
export const olt = <T extends TupleKeyTuple>(...list: T[]) => (
	new OLByTuple<T>(list)
);
