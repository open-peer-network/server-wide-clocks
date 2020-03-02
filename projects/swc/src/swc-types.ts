// BVV = Bitmapped Version Vector = Node Logical Clock
// VVM = Version Vector Matrix
// CC = Causal Context
// DCC = Dotted Causal Container

export type Dot = [string, number];
export type BaseBitmapPair = [number, number];
export type BVV = [string, BaseBitmapPair];
export type VV = [string, Dot[]];
export type VVM = [VV[], VV[]];
export type DotValuePair = [Dot, string];
export type DCC = [DotValuePair[], Dot[]];
