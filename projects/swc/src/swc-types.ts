const { isArray } = Array;

export type prim = string | number | boolean;

const setType = (thing: any, type: string) => {
    Object.defineProperty(thing, "tupleType", {
        value: type,
        enumerable: false,
    });
    return thing;
};

const OrderedListPrototype = new Array();
OrderedListPrototype.slice = undefined;
OrderedListPrototype.splice = undefined;
OrderedListPrototype.concat = undefined;
OrderedListPrototype.sort = undefined;
OrderedListPrototype.shift = undefined;
OrderedListPrototype.unshift = undefined;
OrderedListPrototype.push = undefined;
OrderedListPrototype.pop = undefined;
OrderedListPrototype.filter = undefined;

export class OLTuple<T> extends Array<T> {
    constructor(arr?: T[]) {
        super();
        Object.setPrototypeOf(this, OrderedListPrototype);
        if (arr && arr.length) arr.reduce((acc, next) => {
            acc[acc.length] = next;
            return acc;
        }, this);
    }
}

export type StringKeyTuple = [string, any] & {
    tupleType?: string,
};

type Tuple = [prim, prim];
export type TupleKeyTuple = [Tuple, any] & {
    tupleType?: string,
};

export class OLByTuple<TupleKeyTuple> extends OLTuple<TupleKeyTuple> {

    delete(
        fn: (t: TupleKeyTuple) => boolean,
    ): OLByTuple<TupleKeyTuple> {
        return Array.prototype.filter.call(this, fn);
    }

    update(
        newKey: Tuple,
        defaultTuple: TupleKeyTuple,
        fn: (val?: any) => TupleKeyTuple,
    ): OLByTuple<TupleKeyTuple> {
        let done = false;
        const keyText = `${newKey[0]},${newKey[1]}`;
    
        if (this.length < 1) {
            const l = new OLByTuple<TupleKeyTuple>();
            l[l.length] = defaultTuple;
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
        }, new OLByTuple<TupleKeyTuple>());
    }

    store(
        newTuple: TupleKeyTuple,
    ): OLByTuple<TupleKeyTuple> {
        let done = false;
        const tupleKey = newTuple[0];
        const keyText = `${tupleKey[0]},${tupleKey[1]}`;

        if (this.length < 1) {
            const l = new OLByTuple<TupleKeyTuple>();
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
        }, new OLByTuple<TupleKeyTuple>());
    }
}

export class OLByString<StringKeyTuple> extends OLTuple<StringKeyTuple> {

    constructor(arr?: StringKeyTuple[]) {
        super();
        if (arr && arr.length) arr.reduce((acc, next) => {
            acc[acc.length] = next;
            return acc;
        }, this);
    }

    delete(
        fn: (t: StringKeyTuple) => boolean,
    ): OLByString<StringKeyTuple> {
        return Array.prototype.filter.call(this, fn);
    }

    merge(
        b: OLByString<StringKeyTuple>,
        fn: (
            a: StringKeyTuple,
            b: StringKeyTuple,
        ) => StringKeyTuple,
    ): OLByString<StringKeyTuple> {
        const list: { [k: string]: any } = [...this, ...b]
        .reduce((acc, tuple) => {
            const [id, num] = [tuple[0], tuple[1]];
            acc[id] = fn(acc[id] || 0, num);
            return acc;
        }, {});

        return new OLByString<StringKeyTuple>(
            ...Object.entries(list)
        );
    }

    store(
        newTuple: StringKeyTuple,
    ): OLByString<StringKeyTuple> {
        let done = false;
        const newKey = newTuple[0];

        if (this.length < 1) {
            const l = new OLByString<StringKeyTuple>();
            l[0] = newTuple;
            return l;
        }
        return this.reduce((acc, curTuple) => {
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
            }
    
            acc[acc.length] = curTuple;
            return acc;
        }, new OLByString<StringKeyTuple>());
    }

    update(
        newKey: string,
        defaultTuple: StringKeyTuple,
        fn: (val?: any) => StringKeyTuple,
    ): OLByString<StringKeyTuple> {
        let done = false;
    
        if (this.length < 1) {
            const l = new OLByString<StringKeyTuple>();
            l[l.length] = defaultTuple;
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
        }, new OLByString<StringKeyTuple>());
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

// VVM = Version Vector Matrix
export type VV = [string, OLByString<Dot>] & {
    tupleType?: "VV",
};
export const vv = (
    a: string,
    b: OLByString<Dot>,
): VV => {
    if (typeof a !== "string" || !isArray(b)) {
        throw new Error("invalid VV");
    }
    const ob = [a, b.filter((dot) => (
        isArray(dot) &&
        dot.length === 2 &&
        dot.tupleType === "Dot" &&
        !dot.propertyIsEnumerable("tupleType")
    ))];
    return setType(ob, "VV");
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
export type VVM = [OLByString<VV>, OLByString<VV>] & {
    tupleType?: "VVM",
};
export const vvm = (
    vvs1: OLByString<VV>,
    vvs2: OLByString<VV>,
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
export const ol = <T>(...list: T[]) => (
    new OLByString<T>(list)
);
export const olt = <T>(...list: T[]) => (
    new OLByTuple<T>(list)
);
