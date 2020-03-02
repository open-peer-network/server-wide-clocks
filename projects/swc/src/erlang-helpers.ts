import { Dot, VV, DotValuePair } from "./swc-types";

export const storeById = (
    key: string,
    value: any,
    orddict: VV[],
): [string, any][] => {
	const copy = orddict.slice();
	const idx = copy.findIndex(([key0]) => key0 === key);
    copy[(idx > -1 ? idx : copy.length)] = [key, value];
    return copy.sort(([id1], [id2]) => Number(id1 > id2));
};

export const storeByDot = (
    dot: Dot,
    value: any,
    orddict: DotValuePair[],
): DotValuePair[] => {
    const key = dot.join();
	const copy = orddict.slice();
	const idx = copy.findIndex(([key0]) => key0.join() === key);
    copy[(idx > -1 ? idx : copy.length)] = [dot, value];
    return copy.sort(([[id1]], [[id2]]) => Number(id1 > id2));
};
