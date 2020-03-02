import { Dot, BVV, VV, VVM } from './swc-types';
import { storeById } from './erlang-helpers';
import * as cloneDeep from 'lodash.clonedeep';
import * as swcNode from './swc-node';
import * as swcVv from './swc-vv';


export const addPeer = (
	[bvvA, bvvB]: VVM,
	newPeerId: string,
	itsPeers: string[],
): VVM => {
	const newEntry = [newPeerId, ...itsPeers]
	.reduce((acc, id) => swcVv.add(acc, [id, 0] as Dot), []);
	return [storeById(newPeerId, newEntry, bvvA), bvvB];
};

export const updatePeer = (
	[bvvA, bvvB]: VVM,
	entryId: string,
	nodeClock: BVV[],
): VVM => ([
	updatePeerAux(bvvA, entryId, nodeClock),
	updatePeerAux(bvvB, entryId, nodeClock),
]);

const updatePeerAux = (
	vv: VV[],
	entryId: string,
	nodeClock: BVV[],
): VV[] => (
	vv.map(([id, oldVV]) => {
		if (oldVV.some(([dotId]) => dotId === entryId)) {
			const [base] = swcNode.get(id, nodeClock);
			return [id, swcVv.add(oldVV, [entryId, base])];
		} else {
			return [id, oldVV];
		}
	})
);
/*
-spec replace_peer(vv_matrix(), Old::id(), New::id()) -> vv_matrix().
replace_peer({M,R}, Old, New) ->
M3 = case orddict:is_key(Old, M) of
	true ->
		OldPeers0 = swcVv:ids(orddict:fetch(Old,M)),
		OldPeers = lists:delete(Old, OldPeers0),
		{M2,R} = add_peer({M,R}, New, OldPeers),
		orddict:erase(Old, M2);
	false -> M
end,
Fun = fun(_K,V) ->
		case orddict:find(Old, V) of
			error -> V;
			{ok, _} ->
				V2 = swcVv:delete_key(V, Old),
				swcVv:add(V2, {New, 0})
		end
	end,
{orddict:map(Fun, M3), orddict:map(Fun, R)}.

-spec retire_peer(vv_matrix(), Old::id(), New::id()) -> vv_matrix().
retire_peer({M,R}, Old, New) ->
case orddict:find(Old, M) of
	error ->
		replace_peer({M,R}, Old, New);
	{ok, OldEntry} ->
		// CurrentCounter = swcVv:get(Old, OldEntry),
		// OldEntry2 = swcVv:add(OldEntry, {Old, CurrentCounter+Jump}),
		R1 = orddict:store(Old, OldEntry, R),
		replace_peer({M,R1}, Old, New)
end.


-spec left_join(vv_matrix(), vv_matrix()) -> vv_matrix().
left_join({MA,RA},{MB,RB}) ->
	{left_join_aux(MA,MB), left_join_aux(RA,RB)}.

left_join_aux(A,B) ->
	// filter entry peers from B that are not in A
	PeersA = orddict:fetch_keys(A),
	FunFilter = fun (Id,_) -> lists:member(Id, PeersA) end,
	B2 = orddict:filter(FunFilter, B),
	orddict:merge(fun (_,V1,V2) -> swcVv:left_join(V1,V2) end, A, B2).
*/
// -spec update_cell(vv_matrix(), id(), id(), counter()) -> vv_matrix().
export const updateCell = (
	[bvvA, bvvB]: VVM,
	entryId: string,
	peerId: string,
	counter: number,
): VVM => {
	const topDot: Dot = [peerId, counter];
	const bvvC = cloneDeep(bvvA);
	const idx = bvvC.findIndex(([id]) => id === entryId);
	if (idx > -1) {
		const dots = bvvC[idx][1];
		bvvC[idx][1] = swcVv.add(dots, topDot);
		return [
			bvvC,
			bvvB,
		];
	} else {
		bvvC.push([entryId, swcVv.add([], topDot)]);
		return [
			bvvC.sort(([id1], [id2]) => Number(id1 > id2)),
			bvvB,
		];
	}
};
/*
-spec min(vv_matrix(), id()) -> counter().
min({M,R}, Id) ->
max(min_aux(M, Id), min_aux(R, Id)).

min_aux(M, Id) ->
case orddict:find(Id, M) of
	error -> 0;
	{ok, VV} -> swcVv:min(VV)
end.

-spec peers(vv_matrix()) -> [id()].
peers({M,_}) ->
orddict:fetch_keys(M).

-spec get(vv_matrix(), id(), id()) -> counter().
get({M,_}, P1, P2) ->
case orddict:find(P1, M) of
	error -> 0;
	{ok, VV} -> swcVv:get(P2, VV)
end.

-spec reset_counters(vv_matrix()) -> vv_matrix().
reset_counters({M,R}) ->
{orddict:map(fun (_Id,VV) -> swcVv:reset_counters(VV) end, M),
orddict:map(fun (_Id,VV) -> swcVv:reset_counters(VV) end, R)}.

-spec delete_peer(vv_matrix(), id()) -> vv_matrix().
delete_peer({M,R}, Id) ->
M2 = orddict:erase(Id, M),
{orddict:map(fun (_Id,VV) -> swcVv:delete_key(VV, Id) end, M2), R}.

-spec prune_retired_peers(vv_matrix(), key_matrix(), [id()]) -> vv_matrix().
prune_retired_peers({M,R}, DKM, DontRemotePeers) ->
{M, orddict:filter(fun (Peer,_) ->
						   swc_dotkeymap:is_key(DKM, Peer) orelse
						   lists:member(Peer, DontRemotePeers)
				   end, R)}.
*/
