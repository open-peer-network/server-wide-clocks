import { vv, dvp, Dot, VV, DVP, OrderedList } from "./swc-types";

// type prim = string | boolean | number;

export const storeById = (
    key: string,
    value: any,
    list: VV[],
): VV[] => {
	const copy: VV[] = list.slice();
	const idx = copy.findIndex(([key0]) => key0 === key);
    copy[(idx > -1 ? idx : copy.length)] = vv(key, value);
    return copy.sort(([id1], [id2]) => Number(id1 > id2));
};

export const storeByDot = (
    dot: Dot,
    value: any,
    orddict: DVP[],
): DVP[] => {
    const key = dot.join();
	const copy = orddict.slice();
	const idx = copy.findIndex(([key0]) => key0.join() === key);
    copy[(idx > -1 ? idx : copy.length)] = dvp(dot, value);
    return copy.sort(([[id1]], [[id2]]) => Number(id1 > id2));
};

export const store = (
    newTuple: [string, any],
    list: OrderedList<[string, any]>,
): OrderedList<[string, any]> => {
    let done = false;
    const [newKey] = newTuple;

    return list.reduce((acc, curTuple) => {
        const [curKey] = curTuple;

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
    }, new OrderedList());
};

export const update = (
    newKey: string,
    defaultValue: Dot | [string, any],
    fn: (val: any) => Dot | [string, any],
    list: OrderedList<Dot | [string, any]>,
): OrderedList<Dot | [string, any]> => {
    let done = false;

    return list.reduce((acc, curTuple) => {
        const [curKey] = curTuple;

        if (!done) {
            if (curKey === newKey) {
                done = true;
                acc[acc.length] = fn(curTuple);
                return acc;
            }
            if (curKey > newKey) {
                done = true;
                acc[acc.length] = defaultValue;
                acc[acc.length] = curTuple;
                return acc;
            }
        }

        acc[acc.length] = curTuple;
        return acc;
    }, new OrderedList());
};
