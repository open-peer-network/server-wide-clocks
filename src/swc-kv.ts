import { DCC, DotValuePair, BVV } from './swc-types';
import * as swcVv from './swc-vv';
import * as swcNode from './swc-node';

// Returns the set of values held in the DCC.
export const values = ([values]: DCC): string[] => (
    values.map(([, v]) => v)
);

// Returns the causal context of a DCC, which is representable as a 
// Version Vector.
export const context = ([, dots]: DCC) => dots;

// Performs the synchronization of two DCCs; it discards versions (
// {dot,value} pairs) made obsolete by the other DCC, by preserving the
// versions that are present in both, together with the versions in either of
// them that are not covered by the relevant entry in the other's causal
// context; the causal context is obtained by a standard version vector merge
// function (performing the pointwise maximum).
export const sync = (
    [dvp1, dots1]: DCC,
    [dvp2, dots2]: DCC,
) => {
    // if two versions have the same dot, they must have the same value also.
    // merge the two DCC's.
    const merged: DotValuePair[] = Object.values([...dvp1, ...dvp2].reduce((acc, [dot, val]) => {
        acc[dot.join()] = [dot, val];
        return acc;
    }, {}));

    // filter the outdated versions
    const current = merged.filter(([[id, counter]]) => (
        counter > Math.min(swcVv.get(id, dots1), swcVv.get(id, dots2))
    ));
    // calculate versions that are in both DCC's
    const dvp1Dots = dvp1.map(([dot]) => dot);

    const filtered = dvp2.filter(([dot1]) => dvp1Dots.some((dot2) => (
        dot1.join() === dot2.join()
    )));
    // add these versions to the filtered list of versions
    const D = [...current, ...filtered];
    // return the new list of version and the merged VVs
    return [D, swcVv.join(dots1, dots2)];
};

// Adds the dots corresponding to each version in the DCC to the BVV; this
// is accomplished by using the standard fold higher-order function, passing
// the function swc_node:add/2 defined over BVV and dots, the BVV, and the list of
// dots in the DCC.
export const add = (bvv: BVV[], [versions]: DCC): BVV[] => {
    const dots = versions.map(([k]) => k);
    return dots.reduce((acc, item) => swcNode.add(acc, item), bvv);
};

/*
// This function is to be used at node I after dcc:discard/2, and adds a
// mapping, from the Dot (I, N) (which should be obtained by previously applying
// swc_node:event/2 to the BVV at node I) to the Value, to the DCC, and also advances
// the i component of the VV in the DCC to N.
-spec add(dcc(), {id(),counter()}, value()) -> dcc().
add({D,V}, Dot, Value) ->
    {orddict:store(Dot, Value, D), swc_vv:add(V,Dot)}.

// It discards versions in DCC {D,V} which are made obsolete by a causal
// context (a version vector) C, and also merges C into DCC causal context V.
-spec discard(dcc(), vv()) -> dcc().
discard({D,V}, C) ->
    FunFilter = fun ({Id,Counter}, _Val) -> Counter > swc_vv:get(Id,C) end,
    {orddict:filter(FunFilter, D), swc_vv:join(V,C)}.


// It discards all entries from the version vector V in the DCC that are
// covered by the corresponding base component of the BVV B; only entries with
// greater sequence numbers are kept. The idea is that DCCs are stored after
// being stripped of their causality information that is already present in the
// node clock BVV.
-spec strip(dcc(), bvv()) -> dcc().
strip({D,V}, B) ->
    FunFilter = 
        fun (Id,Counter) -> 
            {Base,_Dots} = swc_node:get(Id,B),
            Counter > Base
        end,
    {D, swc_vv:filter(FunFilter, V)}.


// Function fill adds back causality information to a stripped DCC, before
// any operation is performed.
-spec fill(dcc(), bvv()) -> dcc().
fill({D,VV}, BVV) ->
    FunFold = 
        fun(Id, Acc) -> 
            {Base,_D} = swc_node:get(Id,BVV),
            swc_vv:add(Acc,{Id,Base})
        end,
    {D, lists:foldl(FunFold, VV, swc_node:ids(BVV))}.


// Same as fill/2 but only adds entries that are elements of a list of Ids,
// instead of adding all entries in the BVV.
-spec fill(dcc(), bvv(), [id()]) -> dcc().
fill({D,VV}, BVV, Ids) ->
    % only consider ids that belong to both the list of ids received and the BVV
    Ids2 = sets:to_list(sets:intersection(
            sets:from_list(swc_node:ids(BVV)), 
            sets:from_list(Ids))),
    FunFold = 
        fun(Id, Acc) -> 
            {Base,_D} = swc_node:get(Id,BVV),
            swc_vv:add(Acc,{Id,Base})
        end,
    {D, lists:foldl(FunFold, VV, Ids2)}.
*/