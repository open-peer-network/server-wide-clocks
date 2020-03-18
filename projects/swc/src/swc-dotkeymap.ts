import {
    ol,
    kme,
    dke,
    KM,
    DKE,
    DCC,
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
    return addObjectsKM(arg1, km1);
};
export const addObjectsKM = (arg1: KM, km1: [string, DCC][]): KM => {
    const [[key, [dots]], ...rest] = km1;
    return addObjects(
        dots.reduce((acc, [[id, n]]) => addKey(acc, id, key, n), arg1),
        rest,
    );
};
/*
// -spec size(key_matrix()) -> non_neg_integer().
size(D) ->
    orddict:fold(fun (_K,V,Acc) -> Acc + orddict:size(V) end, 0, D).

// -spec size(key_matrix(), id()) -> non_neg_integer().
size(D, Id) ->
    case orddict:find(Id, D) of
        error -> 0;
        {ok, V} -> orddict:size(V)
    end.

// -spec prune(key_matrix(), vv_matrix()) -> {key_matrix(), RemovedKeys :: [{id(), [{counter(),id()}]}]}.
prune(D, M) ->
    orddict:fold(
        fun (Peer, V, {KeepDic, RemoveDic}) ->
            Min = swc_watermark:min(M, Peer),
            Keep   = orddict:filter(fun (Counter,_) -> Counter  > Min end, V),
            Remove = orddict:filter(fun (Counter,_) -> Counter =< Min end, V),
            case {orddict:is_empty(Keep), orddict:is_empty(Remove)} of
                {true ,true}  -> {KeepDic,                               RemoveDic};
                {false,true}  -> {orddict:store(Peer, Keep, KeepDic),    RemoveDic};
                {true ,false} -> {KeepDic,                               orddict:store(Peer, Remove, RemoveDic)};
                {false,false} -> {orddict:store(Peer, Keep, KeepDic),    orddict:store(Peer, Remove, RemoveDic)}
            end
        end,
        {orddict:new(), orddict:new()}, D).


// -spec get_keys(key_matrix(), [{id(),[counter()]}]) -> {FoundKeys::[id()], MissingKeys::[{id(), [counter()]}]}.
get_keys(D, L) -> get_keys(D, L, {[],[]}).

get_keys(_, [], Acc) -> Acc;
get_keys(D, [{Id, Dots}|T], {FoundKeys, MissingKeys}) ->
    Acc2 = case orddict:find(Id, D) of
        error ->
            {FoundKeys, [{Id,Dots}|MissingKeys]};
        {ok, DotKey} ->
            case get_keys_aux(DotKey, Dots) of
                {FK, []} -> {FK ++ FoundKeys, MissingKeys};
                {FK, MK} -> {FK ++ FoundKeys, [{Id,MK}|MissingKeys]}
            end
    end,
    get_keys(D, T, Acc2).

// -spec get_keys_aux(orddict:orddict(), [counter()]) -> {Found::[id()], NotFound::[counter()]}.
get_keys_aux(O, L) ->
    lists:foldl(
        fun (Dot, {FK, MK}) ->
            case orddict:find(Dot, O) of
                error       -> {FK, [Dot|MK]};
                {ok, Key}   -> {[Key|FK], MK}
            end
        end, {[],[]}, L).
*/
