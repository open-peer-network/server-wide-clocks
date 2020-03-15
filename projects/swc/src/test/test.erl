-module(test).
-export([ vv_left_join/2
        , a/0
        , b/0
        , left_join_aux/0]).

a() ->
    [
        {"a", [
            {"b", 4},
            {"c", 10}
        ]},
        {"c", [
            {"c", 20}
        ]},
        {"z", [
            {"t1", 0},
            {"t2", 0},
            {"z", 0}
        ]}
    ].

b() ->
    [ {"z", [ {"a", 1}, {"b", 0}, {"z", 4} ]} ].

vv_left_join(A,B) ->
    PeersA = orddict:fetch_keys(A),
    FunFilter = fun (Id,_) -> lists:member(Id, PeersA) end,
    B2 = orddict:filter(FunFilter, B),
    orddict:merge(fun (_,C1,C2) -> max(C1,C2) end, A, B2).

left_join_aux() ->
    PeersA = orddict:fetch_keys(a()),
    FunFilter = fun (Id,_) -> lists:member(Id, PeersA) end,
    B2 = orddict:filter(FunFilter, b()),
    orddict:merge(fun (_,V1,V2) -> vv_left_join(V1,V2) end, a(), B2).
