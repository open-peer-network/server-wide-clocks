type prim = string | number | boolean;

const { isArray } = Array;

type Tuple = [prim, prim];
export type StringTuple = [string, any];
export type TupleTuple = [Tuple, any[]][];


export class TupleBasedDictionary<TupleTuple> extends Array<TupleTuple> {
    constructor(source?: TupleTuple[]) {
        super();
        Object.setPrototypeOf(this, Object.create(TupleBasedDictionary.prototype));

        if (source.length) {
            source.forEach((entry) => {
                if (
                    isArray(entry) &&
                    entry.length === 2 &&
                    isArray(entry[0]) &&
                    entry[0].length === 2
                ) {
                    this.push(entry);
                }
            });
            this.order();
        }
    }
    order() {
        this.sort((l, r) => {
            const keyL = l[0].join();
            const keyR = r[0].join();
            return Number(keyL > keyR);
        });
        return this;
    }
    copy() {
        return new TupleBasedDictionary(this.slice());
    }
    store(key: Tuple, value: any) {
        //
    }
}

export class StringBasedDictionary<StringTuple> extends Array<StringTuple> {
    constructor(source?: StringTuple[]) {
        super();
        Object.setPrototypeOf(this, Object.create(StringBasedDictionary.prototype));

        if (source && source.length) {
            source.forEach((entry) => {
                if (
                    isArray(entry) &&
                    entry.length === 2 &&
                    typeof entry[0] === "string"
                ) {
                    this.push(entry);
                }
            });
            this.order();
        }
    }
    order() {
        this.sort((l, r) => {
            return Number(l[0] > r[0]);
        });
        return this;
    }
    copy() {
        return new StringBasedDictionary(this.slice());
    }
    store() {
        //
    }
}
