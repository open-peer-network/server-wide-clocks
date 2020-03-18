// import { vv, dvp, Dot, VV, DVP, OLByPrim, OLByTuple } from "./swc-types";

// // type prim = string | boolean | number;

// export const storeById = (
//     key: string,
//     value: any,
//     list: VV[],
// ): VV[] => {
// 	const copy: VV[] = list.slice();
// 	const idx = copy.findIndex(([key0]) => key0 === key);
//     copy[(idx > -1 ? idx : copy.length)] = vv(key, value);
//     return copy.sort(([id1], [id2]) => Number(id1 > id2));
// };

// export const storeByDot = (
//     dot: Dot,
//     value: any,
//     list: OLByTuple<DVP>,
// ): OLByTuple<DVP> => {
//     return list.update(dot, dvp(dot, value), (dx) => dvp(dot, value))
// 	// const copy = orddict.slice();
// 	// const idx = list.findIndex(([key0]) => key0.join() === key);
//     // list[(idx > -1 ? idx : list.length)] = dvp(dot, value);
//     // return list; // .sort(([[id1]], [[id2]]) => Number(id1 > id2));
// };
