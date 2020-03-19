import * as swcWatermark from "./swc-watermark";
import {
    ol,
    kme,
    dke,
    kmm,
    KM,
    DKE,
    DCC,
    VVM,
    KMM,
    KME,
    DKM,
    OLByPrim,
} from './swc-types';

// -spec add_key(key_matrix(), id(), id(), counter()) -> key_matrix().
export const addKey = (km1: KM, id: string, key: string, counter: number): KM => (
    km1.update4(
        id,
        kme(id, ol<DKE>(dke(counter, key))),
        (old) => kme(id, old.store(dke(counter, key))),
    )
);

export const addObjects = (arg1: KM, km1: any[]): KM => {
    if (km1.length < 1) return arg1;
    return _addObjects(arg1, km1);
};
const _addObjects = (arg1: KM, km1: [string, DCC][]): KM => {
    const [[key, [dots]], ...rest] = km1;
    return addObjects(
        dots.reduce((acc, [[id, n]]) => addKey(acc, id, key, n), arg1),
        rest,
    );
};

export const empty = (km1: KM) => size(km1) === 0;

const getSize = (km1: KM): number => (
    km1.reduce((count, [,kme1]) => count + kme1.length, 0)
);

export const size = (km1: KM, id?: string): number => {
    if (id === undefined) return getSize(km1);
    const found = km1.find(([idX]) => id === idX);
    return found ? found[1].length : 0;
};

const getCase = (a: ArrayLike<any>, b: ArrayLike<any>) => (
    `${+(a.length < 1)},${+(b.length < 1)}`
);
export const prune = (km0: KM, vvm0: VVM): KMM => (
    km0.reduce(([keepDic, removeDic], [peerId, kme1]) => {
        const min = swcWatermark.min(vvm0, peerId);
        const keep = kme1.filter(([counter]) => counter > min);
        const remove = kme1.filter(([counter]) => counter <= min);
        switch (getCase(keep, remove)) {
            case "1,1": return kmm(keepDic, removeDic);
            case "0,1": return kmm(keepDic.store(kme(peerId, keep)), removeDic);
            case "1,0": return kmm(keepDic, removeDic.store(kme(peerId, remove)));
            case "0,0": return kmm(keepDic.store(kme(peerId, keep)), removeDic.store(kme(peerId, remove)));
        }
    }, kmm(ol<KME>(), ol<KME>()))
);

export const getKeys = (
    D: KM,
    L: DKM[],
    A?: [string[], DKM[]],
): [string[], DKM[]] => {
    if (L.length < 1) return A;
    return _getKeys(D, L, A);
};
const _getKeys = (
    km1: KM,
    [[id, numbers], ...remaining]: DKM[],
    acc: [string[], DKM[]] = [[], []],
): [string[], DKM[]] => {
    const [foundKeys, missingKeys] = acc;
    const found = km1.find(([s]) => s === id);

    let Acc2: [string[], DKM[]];
    if (found) {
        const [FK, MK] = getKeysAux(found[1], numbers);
        if (MK.length < 1) {
            Acc2 = [[...FK, ...foundKeys], missingKeys];
        } else {
            Acc2 = [[...FK, ...foundKeys], [[id, MK], ...missingKeys]];
        }
    } else {
        Acc2 = [foundKeys, [[id, numbers], ...missingKeys]];
    }
    return getKeys(km1, remaining, Acc2);
};

const getKeysAux = (O: OLByPrim<DKE>, L: number[]): [string[], number[]] => (
    L.reduce(([FK, MK], N) => {
        const found = O.find(([n]) => n === N);
        return found ? [[found[1], ...FK], MK] : [FK, [N, ...MK]];
    }, [[], []] as [string[], number[]])
);
