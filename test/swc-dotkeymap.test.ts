import * as swcDkm from "../src/swc-dotkeymap";
import * as swcWatermark from "../src/swc-watermark";
import {
	d,
    km,
    ol,
    olt,
    kme,
    dke,
    dvp,
    dcc,
    kmm,
    dkm,
    Dot,
    DVP,
    DKE,
    KME,
} from "../src/swc-types";


describe("SWC Dot/Key Map", () => {
    it("add", () => {
        const K1 = swcDkm.addKey(km(), "a", "k1", 1);
        const K2 = swcDkm.addKey(K1, "a", "k2", 2);
        const K3 = swcDkm.addKey(K2, "b", "kb", 4);
        const K4 = swcDkm.addKey(K3, "b", "kb2", 2);
        const K5 = swcDkm.addKey(K4, "c", "kc", 20);
        expect(K1).toEqual(km(
            kme("a", ol<DKE>(dke(1, "k1")))
        ));
        expect(K2).toEqual(km(
            kme("a", ol<DKE>(dke(1, "k1"), dke(2, "k2")))
        ));
        expect(K3).toEqual(km(
            kme("a", ol<DKE>(dke(1, "k1"), dke(2, "k2"))),
            kme("b", ol<DKE>(dke(4, "kb")))
        ));
        expect(K4).toEqual(km(
            kme("a", ol<DKE>(dke(1, "k1"), dke(2, "k2"))),
            kme("b", ol<DKE>(dke(2, "kb2"), dke(4, "kb")))
        ));
        expect(K5).toEqual(km(
            kme("a", ol<DKE>(dke(1, "k1"), dke(2, "k2"))),
            kme("b", ol<DKE>(dke(2, "kb2"), dke(4, "kb"))),
            kme("c", ol<DKE>(dke(20, "kc")))
        ));
    });
    it("add objects", () => {
        const km1 = swcDkm.addKey(km(), "a", "k1", 1);
        const km2 = swcDkm.addKey(km1, "a", "k2", 2);
        const km3 = swcDkm.addKey(km2, "b", "kb", 4);
        const km4 = swcDkm.addKey(km3, "b", "kb2", 2);
        const km5 = swcDkm.addKey(km4, "c", "kc", 20);
        const cc1 = dcc(
            olt<DVP>(dvp(d("z", 8), "red"), dvp(d("z", 11), "purple"), dvp(d("b", 3), "green")),
            ol<Dot>(d("a", 11)),
        );
        const cc2 = dcc(
            olt<DVP>(dvp(d("b", 11), "purple")),
            ol<Dot>(d("a", 4), d("b", 20)),
        );
        const km6 = swcDkm.addObjects(km1, [["k100", cc1], ["k200", cc2]]);
        const km7 = swcDkm.addObjects(km1, [["k200", cc2], ["k100", cc1]]);
        const km8 = swcDkm.addObjects(km5, [["k200", cc2], ["k100", cc1]]);

        expect(km6).toEqual(km(
            kme("a", ol<DKE>(dke(1, "k1"))),
            kme("b", ol<DKE>(dke(3, "k100"), dke(11, "k200"))),
            kme("z", ol<DKE>(dke(8, "k100"), dke(11, "k100"))),
        ));
        expect(km6).toEqual(km7);
        expect(km8).toEqual(km(
            kme("a", ol<DKE>(dke(1, "k1"), dke(2, "k2"))),
            kme("b", ol<DKE>(dke(2, "kb2"), dke(3, "k100"), dke(4, "kb"), dke(11, "k200"))),
            kme("c", ol<DKE>(dke(20, "kc"))),
            kme("z", ol<DKE>(dke(8, "k100"), dke(11, "k100"))),
        ));
    });
    it("empty", () => {
        const K1 = swcDkm.addKey(km(), "a", "k1", 1);
        const K2 = swcDkm.addKey(K1, "a", "k2", 2);
        const K3 = swcDkm.addKey(K2, "b", "kb", 4);
        const K4 = swcDkm.addKey(K3, "b", "kb2", 2);
        expect(swcDkm.empty(km())).toBe(true);
        expect(swcDkm.empty(K1)).toBe(false);
        expect(swcDkm.empty(K2)).toBe(false);
        expect(swcDkm.empty(K3)).toBe(false);
        expect(swcDkm.empty(K4)).toBe(false);
    });
    it("size", () => {
        const K1 = swcDkm.addKey(km(), "a", "k1", 1);
        const K2 = swcDkm.addKey(K1, "a", "k2", 2);
        const K3 = swcDkm.addKey(K2, "b", "kb", 4);
        const K4 = swcDkm.addKey(K3, "b", "kb2", 2);
        const K5 = swcDkm.addKey(K4, "c", "kc", 20);
        expect(swcDkm.size(K1)).toBe(1);
        expect(swcDkm.size(K2)).toBe(2);
        expect(swcDkm.size(K3)).toBe(3);
        expect(swcDkm.size(K4)).toBe(4);
        expect(swcDkm.size(K5)).toBe(5);
        expect(swcDkm.size(K5, "a")).toBe(2);
        expect(swcDkm.size(K5, "b")).toBe(2);
        expect(swcDkm.size(K5, "c")).toBe(1);
        expect(swcDkm.size(K5, "d")).toBe(0);
    });
    it("prune", () => {
        const K1 = swcDkm.addKey(km(), "a", "k1", 1);
        const K2 = swcDkm.addKey(K1, "a", "k2", 2);
        const K3 = swcDkm.addKey(K2, "b", "kb", 4);
        const K4 = swcDkm.addKey(K3, "b", "kb2", 2);
        const K5 = swcDkm.addKey(K4, "c", "kc", 20);
        const M1 = swcWatermark.getNew();
        const M2 = swcWatermark.updateCell(M1, "a", "c", 1);
        const M3 = swcWatermark.updateCell(M2, "a", "a", 2);
        const M4 = swcWatermark.updateCell(M3, "a", "c", 2);
        const M5 = swcWatermark.updateCell(M4, "b", "x", 10);
        const M6 = swcWatermark.updateCell(M5, "z", "c", 190);
        const M7 = swcWatermark.updateCell(M6, "c", "c", 200);
        expect(swcDkm.prune(K5, M1)).toEqual(kmm(
            ol<KME>(
                kme("a", ol<DKE>(dke(1, "k1"), dke(2, "k2"))),
                kme("b", ol<DKE>(dke(2, "kb2"), dke(4, "kb"))),
                kme("c", ol<DKE>(dke(20, "kc"))),
            ),
            ol<KME>(),
        ));
        expect(swcDkm.prune(K5, M2)).toEqual(kmm(
            ol<KME>(
                kme("a", ol<DKE>(dke(2, "k2"))),
                kme("b", ol<DKE>(dke(2, "kb2"), dke(4, "kb"))),
                kme("c", ol<DKE>(dke(20, "kc"))),
            ),
            ol<KME>(
                kme("a", ol<DKE>(dke(1, "k1"))),
            ),
        ));
        expect(swcDkm.prune(K5, M3)).toEqual(kmm(
            ol<KME>(
                kme("a", ol<DKE>(dke(2, "k2"))),
                kme("b", ol<DKE>(dke(2, "kb2"), dke(4, "kb"))),
                kme("c", ol<DKE>(dke(20, "kc"))),
            ),
            ol<KME>(
                kme("a", ol<DKE>(dke(1, "k1"))),
            ),
        ));
        expect(swcDkm.prune(K5, M4)).toEqual(kmm(
            ol<KME>(
                kme("b", ol<DKE>(dke(2, "kb2"), dke(4, "kb"))),
                kme("c", ol<DKE>(dke(20, "kc")))
            ),
            ol<KME>(
                kme("a", ol<DKE>(dke(1, "k1"), dke(2, "k2"))),
            ),
        ));
        expect(swcDkm.prune(K5, M5)).toEqual(kmm(
            ol<KME>(
                kme("c", ol<DKE>(dke(20, "kc"))),
            ),
            ol<KME>(
                kme("a", ol<DKE>(dke(1, "k1"), dke(2, "k2"))),
                kme("b", ol<DKE>(dke(2, "kb2"), dke(4, "kb"))),
            ),
        ));
        expect(swcDkm.prune(K5, M6)).toEqual(kmm(
            ol<KME>(
                kme("c", ol<DKE>(dke(20, "kc"))),
            ),
            ol<KME>(
                kme("a", ol<DKE>(dke(1, "k1"), dke(2, "k2"))),
                kme("b", ol<DKE>(dke(2, "kb2"), dke(4, "kb"))),
            ),
        ));
        expect(swcDkm.prune(K5, M7)).toEqual(kmm(
            ol<KME>(),
            ol<KME>(
                kme("a", ol<DKE>(dke(1, "k1"), dke(2, "k2"))),
                kme("b", ol<DKE>(dke(2, "kb2"), dke(4, "kb"))),
                kme("c", ol<DKE>(dke(20, "kc"))),
            ),
        ));
    });
    it("get keys", () => {
        const K1 = swcDkm.addKey(km(), "a", "k1", 1);
        const K2 = swcDkm.addKey(K1, "a", "k2", 2);
        const K3 = swcDkm.addKey(K2, "b", "kb", 4);
        const K4 = swcDkm.addKey(K3, "b", "kb2", 2);
        const K5 = swcDkm.addKey(K4, "c", "kc", 20);
        expect(swcDkm.getKeys(K5, [
            dkm("a", [1]),
        ])).toEqual([
            ["k1"],
            [],
        ]);
        expect(swcDkm.getKeys(K5, [
            dkm("a", [2])
        ])).toEqual([
            ["k2"],
            []
        ]);
        expect(swcDkm.getKeys(K5, [
            dkm("a", [1, 2]),
        ])).toEqual([
            ["k2", "k1"],
            [],
        ]);
        expect(swcDkm.getKeys(K5, [
            dkm("a", [1, 2, 5, 6]),
        ])).toEqual([
            ["k2", "k1"],
            [
                dkm("a", [6, 5]),
            ],
        ]);
        expect(swcDkm.getKeys(K5, [
            dkm("a", [1, 2]),
            dkm("b", [4, 5, 11]),
        ])).toEqual([
            ["kb", "k2", "k1"],
            [
                dkm("b", [11, 5]),
            ],
        ]);
        expect(swcDkm.getKeys(K5, [
            dkm("a", [1, 2, 22]),
            dkm("b", [4, 5, 11]),
        ])).toEqual([
            ["kb", "k2", "k1"],
            [
                dkm("b", [11, 5]),
                dkm("a", [22]),
            ],
        ]);
        expect(swcDkm.getKeys(K1, [
            dkm("a", [2]),
            dkm("b", [4, 5]),
        ])).toEqual([
            [],
            [
                dkm("b", [4, 5]),
                dkm("a", [2]),
            ],
        ]);
    });
});
