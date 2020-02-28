import { v4 as uuid } from 'uuid';
import { config } from 'dotenv';
config();

const NODE_ID = process.env.NID || uuid();

type Generic = {
    [key: string]: string | number | boolean,
};
interface Storage {
    [key: string]: Generic;
}

// A dot is a globally unique identifier for every write in the
// entire distributed system
type Dot = [string, number];
type NodeClock = Dot[];

export const isValidDot = (dotStr: string) => (
    typeof dotStr === "string" && /^n:.+,c:.+/.test(dotStr)
);
export const dotString = ([nid, counter]: Dot) => (
    `n:${nid},c:${counter}`
);

// The NDC framework requires each node to maintain five data-structures:
export const nodeClock: NodeClock = [];
export const dotKeyMap: { [key: string]: string } = {};
export const watermark: NodeClock[] = [];
export const nonStrippedKeys: string[] = [];
export const storage: Storage = {};

const { stepNodeCounter, readNodeCounter } = (() => {
    let counter = 0;
    return {
        stepNodeCounter: (n?: number) => n ? ++counter : counter += n,
        readNodeCounter: () => counter,
    };
})();
export { stepNodeCounter, readNodeCounter };

const sortDots = (dots: Dot[]) => (
    dots.sort((l, r) => Number(l[1] > r[1]))
);
const dotsMatch = ([id1, c1]: Dot, [id2, c2]: Dot) => (
    id1 === id2 && c1 === c2
);

export const normalize = (base: number, dots: Dot[]) => {
    let newBase = base;
    const kept = dots.slice();
    sortDots(dots).forEach((dot) => {
        if (dot[1] <= newBase + 1) {
            kept.splice(kept.findIndex((dot2) => dotsMatch(dot, dot2)), 1);
        }
    });
    return [newBase + kept.length, kept];
};

export const getDot = (): Dot => ([
    NODE_ID,
    stepNodeCounter(),
]);
