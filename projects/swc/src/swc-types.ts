const { isArray } = Array;

export type prim = string | number | boolean;

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
export class OrderedList<T> extends Array<T> {
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
	filter(fn: (t: T, i: number, a: OrderedList<T>) => any): T[] {
		throw new Error(methodMessage);
	}
}

export type StringKeyTuple = [string, any] & {
	tupleType?: string,
};

type Tuple = [prim, prim];
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

	filter(fn:(t: T, i: number, a: OLByTuple<T>) => any): OLByTuple<T> {
		return new OLByTuple(Array.prototype.filter.call(this, fn));
	}

	delete(
		fn: (t: T) => boolean,
	): OLByTuple<T> {
		return Array.prototype.filter.call(this, fn);
	}

	update4(
		newKey: Tuple,
		defaultTuple: T,
		fn: (val?: any) => T,
	): OLByTuple<T> {
		let done = false;
		const keyText = `${newKey[0]},${newKey[1]}`;
	
		if (this.length < 1) {
			const l = new OLByTuple<T>();
			l[0] = defaultTuple;
			return l;
		}
		return this.reduce((acc, curTuple, idx) => {
			const curKey = `${curTuple[0]},${curTuple[1]}`;

			if (!done) {
				if (curKey === keyText) {
					done = true;
					acc[acc.length] = fn(curTuple[1]);
					return acc;
				}
				if (curKey > keyText) {
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

	store(
		newTuple: T,
	): OLByTuple<T> {
		let done = false;
		const tupleKey = newTuple[0];
		const keyText = `${tupleKey[0]},${tupleKey[1]}`;

		if (this.length < 1) {
			const l = new OLByTuple<T>();
			l[0] = newTuple;
			return l;
		}
		return this.reduce((acc, curTuple) => {
			const curKey = `${curTuple[0]},${curTuple[1]}`;
	
			if (!done) {
				if (curKey === keyText) {
					done = true;
					acc[acc.length] = newTuple;
					return acc;
				}
				if (curKey > keyText) {
					done = true;
					acc[acc.length] = newTuple;
					acc[acc.length] = curTuple;
					return acc;
				}
			}
	
			acc[acc.length] = curTuple;
			return acc;
		}, new OLByTuple<T>());
	}
}

export class OLByString<T extends StringKeyTuple> extends OrderedList<T> {
	constructor(arr?: T[]) {
		super();
		if (arr && arr.length) {
			[...arr].sort((a, b) => isArray(a) && isArray(b)
				? Number(a.join() > b.join())
				: 0
			).reduce((acc, next) => {
				acc[acc.length] = next;
				return acc;
			}, this);
		}
	}

	filter(fn:(t: T, i: number, a: OLByString<T>) => any): OLByString<T> {
		return new OLByString(Array.prototype.filter.call(this, fn));
	}

	delete(
		fn: (t: T) => boolean,
	): OLByString<T> {
		return this.reduce((acc, next) => {
			if (fn(next) === false) {
				acc[acc.length] = next;
			}
			return acc;
		}, new OLByString<T>())
	}

	merge<A extends T>(
		incomingList: OLByString<A>,
		mergeFn: (a: A, b: A) => A,
	): OLByString<A> {
		const sourceMap: POJO<A> = this.reduce((ac, t: A) => ({
			[t[0]]: t,
			...ac,
		}), {} as POJO<A>);

		const mergedMap = incomingList.reduce((acc, tupleR: A) => {
			const [id, val] = tupleR;
			if ([typeof id, typeof val].includes("undefined")) return acc;

			acc[id] = sourceMap.hasOwnProperty(id) ? mergeFn(acc[id], tupleR) : tupleR;

			return acc;
		}, sourceMap);

		return ol<A>(...toOrderedArray<A>(mergedMap));
	}

	update4(
		newKey: string,
		defaultTuple: T,
		fn: (val?: any) => T,
	): OLByString<T> {
		let done = false;
	
		if (this.length < 1) {
			const l = new OLByString<T>();
			l[0] = defaultTuple;
			return l;
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
		}, new OLByString<T>());
	}

	store(
		newTuple: T,
	): OLByString<T> {
		let done = false;
		const newKey = newTuple[0];

		if (this.length < 1) {
			const l = new OLByString<T>();
			l[0] = newTuple;
			return l;
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
					acc[acc.length] = curTuple;
					acc[acc.length] = newTuple;
					return acc;
				}
			}
	
			acc[acc.length] = curTuple;
			return acc;
		}, new OLByString<T>());
	}
}

export type Dot = [string, number] & {
	tupleType?: "Dot",
};
export const d = (
	a: string,
	b: number,
): Dot => {
	const ob = (a && typeof b === "number") ? [a, b] : [];
	return setType(ob, "Dot");
};

// VV = Version Vector
// EVVP = Entry/Version Vector Pair
export type VV = OLByString<Dot>;
export type EVVP = [string, OLByString<Dot>] & {
	tupleType?: "EVVP",
};
export const vv = (...dots: Dot[]): VV => (
	ol<Dot>(...dots)
);
export const evvp = (
	a: string,
	b: OLByString<Dot>,
): EVVP => {
	if (typeof a !== "string" || !isArray(b)) {
		throw new Error("invalid EVVP");
	}
	const ob = [a, b.delete((dot) => (
		!isArray(dot) ||
		dot.length !== 2 ||
		dot.tupleType !== "Dot" ||
		dot.propertyIsEnumerable("tupleType")
	))];
	return setType(ob, "EVVP");
};

// BVV = Bitmapped Version Vector (Node Logical Clock)
export type BVV = [string, BBP] & {
	tupleType?: "BVV",
};
export const bvv = (
	a: string,
	b: BBP,
): BVV => {
	const ob = [a, b];
	return setType(ob, "BVV");
};

// DVP = Dot/Value Pair
export type DVP = [Dot, prim] & {
	tupleType?: "DVP",
};
export const dvp = (
	dot: Dot,
	value: any,
): DVP => {
	const ob = [dot, value];
	return setType(ob, "DVP");
};

// BBP = Base/Bitmap Pair
export type BBP = [number, number] & {
	tupleType?: "BBP",
};
export const bbp = (
	base: number,
	bitmap: number,
): BBP => {
	const ob = [base, bitmap];
	return setType(ob, "BBP");
};

// VVM = Version Vector Matrix
export type VVM = [OLByString<EVVP>, OLByString<EVVP>] & {
	tupleType?: "VVM",
};
export const vvm = (
	vvs1: OLByString<EVVP>,
	vvs2: OLByString<EVVP>,
): VVM => {
	const ob = [vvs1, vvs2];
	return setType(ob, "VVM");
};

// DKM = Dotkey Matrix
export type DKM = [string, number[]] & {
	tupleType?: "DKM",
};
export const dkm = (
	a: string,
	b: number[],
): DKM => {
	const ob = [a, b];
	return setType(ob, "DKM");
};

// CC = Causal Context
// DCC = Dotted Causal Container
export type DCC = [OLByTuple<DVP>, OLByString<Dot>] & {
	tupleType?: "DCC",
};
export const dcc = (
	dvp1: OLByTuple<DVP>,
	dots: OLByString<Dot>,
): DCC => {
	const ob = [dvp1, dots];
	return setType(ob, "DCC");
};
export const ol = <T extends StringKeyTuple>(...list: T[]) => (
	new OLByString<T>(list)
);
export const olt = <T extends TupleKeyTuple>(...list: T[]) => (
	new OLByTuple<T>(list)
);
