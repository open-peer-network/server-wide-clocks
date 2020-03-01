/*
import * as SWCVV from './swc-vv';

const foldl = () => {};
const store = () => {};

const addPeer = ([M, R], newPeer, itsPeers) => {
    // CurrentPeers = orddict.fetch_keys(M)
    const fn = (id, acc) => SWCVV.add(acc, [id, 0]);
    const newEntry = foldl(fn, SWCVV.new(), [newPeer, ...itsPeers]);
    return [store(newPeer, newEntry, M), R];
};

-spec update_peer(vv_matrix(), id(), bvv()) -> vv_matrix().
update_peer({M,R}, EntryId, NodeClock) ->
{update_peer_aux(M, EntryId, NodeClock),
 update_peer_aux(R, EntryId, NodeClock)}.

update_peer_aux(M, EntryId, NodeClock) ->
orddict:map(fun (Id, OldVV) ->
                case SWCVV:is_key(OldVV, EntryId) of
                    false -> OldVV;
                    true  ->
                        {Base,_} = swc_node:get(Id, NodeClock),
                        SWCVV:add(OldVV, {EntryId, Base})
                end
            end,
            M).

-spec replace_peer(vv_matrix(), Old::id(), New::id()) -> vv_matrix().
replace_peer({M,R}, Old, New) ->
M3 = case orddict:is_key(Old, M) of
    true ->
        OldPeers0 = SWCVV:ids(orddict:fetch(Old,M)),
        OldPeers = lists:delete(Old, OldPeers0),
        {M2,R} = add_peer({M,R}, New, OldPeers),
        orddict:erase(Old, M2);
    false -> M
end,
Fun = fun(_K,V) ->
        case orddict:find(Old, V) of
            error -> V;
            {ok, _} ->
                V2 = SWCVV:delete_key(V, Old),
                SWCVV:add(V2, {New, 0})
        end
    end,
{orddict:map(Fun, M3), orddict:map(Fun, R)}.

-spec retire_peer(vv_matrix(), Old::id(), New::id()) -> vv_matrix().
retire_peer({M,R}, Old, New) ->
case orddict:find(Old, M) of
    error ->
        replace_peer({M,R}, Old, New);
    {ok, OldEntry} ->
        % CurrentCounter = SWCVV:get(Old, OldEntry),
        % OldEntry2 = SWCVV:add(OldEntry, {Old, CurrentCounter+Jump}),
        R1 = orddict:store(Old, OldEntry, R),
        replace_peer({M,R1}, Old, New)
end.


-spec left_join(vv_matrix(), vv_matrix()) -> vv_matrix().
left_join({MA,RA},{MB,RB}) ->
{left_join_aux(MA,MB), left_join_aux(RA,RB)}.

left_join_aux(A,B) ->
% filter entry peers from B that are not in A
PeersA = orddict:fetch_keys(A),
FunFilter = fun (Id,_) -> lists:member(Id, PeersA) end,
B2 = orddict:filter(FunFilter, B),
orddict:merge(fun (_,V1,V2) -> SWCVV:left_join(V1,V2) end, A, B2).

-spec update_cell(vv_matrix(), id(), id(), counter()) -> vv_matrix().
update_cell({M,R}, EntryId, PeerId, Counter) ->
Top = {PeerId, Counter},
{orddict:update(
    EntryId,
    fun (OldVV) -> SWCVV:add(OldVV, Top) end,
    SWCVV:add(SWCVV:new(), Top),
    M), R}.

-spec min(vv_matrix(), id()) -> counter().
min({M,R}, Id) ->
max(min_aux(M, Id), min_aux(R, Id)).

min_aux(M, Id) ->
case orddict:find(Id, M) of
    error -> 0;
    {ok, VV} -> SWCVV:min(VV)
end.

-spec peers(vv_matrix()) -> [id()].
peers({M,_}) ->
orddict:fetch_keys(M).

-spec get(vv_matrix(), id(), id()) -> counter().
get({M,_}, P1, P2) ->
case orddict:find(P1, M) of
    error -> 0;
    {ok, VV} -> SWCVV:get(P2, VV)
end.

-spec reset_counters(vv_matrix()) -> vv_matrix().
reset_counters({M,R}) ->
{orddict:map(fun (_Id,VV) -> SWCVV:reset_counters(VV) end, M),
orddict:map(fun (_Id,VV) -> SWCVV:reset_counters(VV) end, R)}.

-spec delete_peer(vv_matrix(), id()) -> vv_matrix().
delete_peer({M,R}, Id) ->
M2 = orddict:erase(Id, M),
{orddict:map(fun (_Id,VV) -> SWCVV:delete_key(VV, Id) end, M2), R}.

-spec prune_retired_peers(vv_matrix(), key_matrix(), [id()]) -> vv_matrix().
prune_retired_peers({M,R}, DKM, DontRemotePeers) ->
{M, orddict:filter(fun (Peer,_) ->
                           swc_dotkeymap:is_key(DKM, Peer) orelse
                           lists:member(Peer, DontRemotePeers)
                   end, R)}.
*/
