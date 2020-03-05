const { isArray } = Array;

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
export class OrderedList<T> extends Array<T> {
    constructor() {
        super();
        Object.setPrototypeOf(this, OrderedListPrototype);
    }
}

export type prim = string | number | boolean;

export type Dot = ([string, number] | []) & { tupleType?: "Dot" };
export const d = (a?: string, b?: number): Dot => {
    const ob = (a && typeof b === "number") ? [a, b] : [];
    return setType(ob, "Dot");
};

// VVM = Version Vector Matrix
export type VV = [string, Dot[]] & { tupleType?: "VV" };
export const vv = (a: string, b: Dot[]): VV => {
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
export type BVV = [string, BBP] & { tupleType?: "BVV" };
export const bvv = (a: string, b: BBP): BVV => {
    const ob = [a, b];
    return setType(ob, "BVV");
};

// DVP = Dot/Value Pair
export type DVP = [Dot, string | number | boolean] & { tupleType?: "DVP" };
export const dvp = (dot: Dot, value: any): DVP => {
    const ob = [dot, value];
    return setType(ob, "DVP");
};

// BBP = Base/Bitmap Pair
export type BBP = [number, number] & { tupleType?: "BBP" };
export const bbp = (base: number, bitmap: number): BBP => {
    const ob = [base, bitmap];
    return setType(ob, "BBP");
};

// VVM = Version Vector Matrix
export type VVM = [OrderedList<VV>, OrderedList<VV>] & { tupleType?: "VVM" };
export const vvm = (vvs1: OrderedList<VV>, vvs2: OrderedList<VV>): VVM => {
    const ob = [vvs1, vvs2];
    return setType(ob, "VVM");
};

// DKM = Dotkey Matrix
export type DKM = [string, number[]] & { tupleType?: "DKM" };
export const dkm = (a: string, b: number[]): DKM => {
    const ob = [a, b];
    return setType(ob, "DKM");
};

// CC = Causal Context
// DCC = Dotted Causal Container
export type DCC = [DVP[], Dot[]] & { tupleType?: "DCC" };
export const dcc = (dvp1: DVP[], dots: Dot[]): DCC => {
    const ob = [dvp1, dots];
    return setType(ob, "DCC");
};
