// BVV = Bitmapped Version Vector = Node Logical Clock
// CC = Causal Context
// DCC = Dotted Causal Container

export type Dot = [string, number];
export type BaseBitmapPair = [number, number];
export type BVV = [string, BaseBitmapPair];
export type DotValuePair = [Dot, string];
export type DCC = [DotValuePair[], Dot[]];
