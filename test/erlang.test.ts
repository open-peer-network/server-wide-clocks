import {
	d,
	vv,
	dvp,
	olt,
	DVP,
} from "../src/swc-types";

describe("erlang equivalents", () => {
	it("orddict:merge/3", () => {
		/*
		L = [{"a", 1}, {"b", 2}].
		R = [{"a", 2}, {"c", 3}].
		M = orddict:merge(fun (_K,A,B) -> max(A, B) end, L, R).

		M == [{"a", 2}, {"b", 2}, {"c", 3}]. % true
		*/
		const vv1 = vv(d("a", 1), d("b", 2));
		const vv2 = vv(d("a", 2), d("c", 3));
		expect(
			vv1.merge(vv2, (a, b) => d(a[0], Math.max(a[1], b[1])))
		).toEqual(
			vv(d("a", 2), d("b", 2), d("c", 3))
		);

		// verify that input is unchanged
		expect(vv1).toEqual(vv(d("a", 1), d("b", 2)));
		expect(vv2).toEqual(vv(d("a", 2), d("c", 3)));
	});
	it("orddict:store/3", () => {
		/*
		A = [{"a", 1}, {"c", 3}].
		B = [{"a", 1}, {"b", 2}].
		R1 = orddict:store("b", 5, A).
		R2 = orddict:store("b", 5, B).

		R1 == [{"a", 1}, {"b", 5}, {"c", 3}]. % true
		R2 == [{"a", 1}, {"b", 5}]. % true
		*/
		const vv1 = vv(d("a", 1), d("c", 3));
		const vv2 = vv(d("a", 1), d("b", 2));
		expect(
			vv1.store(d("b", 5))
		).toEqual(
			vv(d("a", 1), d("b", 5), d("c", 3))
        );

		expect(
			vv2.store(d("b", 5))
		).toEqual(
			vv(d("a", 1), d("b", 5))
		);

		// verify that input is unchanged
		expect(vv1).toEqual(vv(d("a", 1), d("c", 3)));

		const dvp1 = olt<DVP>(
			dvp(d("a", 8), "first"),
			dvp(d("a", 13), "second"),
		);
		expect(
			dvp1.store(dvp(d("a", 11), "middle"))
		).toEqual(
			olt<DVP>(
				dvp(d("a", 8), "first"),
				dvp(d("a", 11), "middle"),
				dvp(d("a", 13), "second"),
			)
		)
		expect(
			dvp1.store(dvp(d("b", 1), "last"))
		).toEqual(
			olt<DVP>(
				dvp(d("a", 8), "first"),
				dvp(d("a", 13), "second"),
				dvp(d("b", 1), "last"),
			)
		)
	});
	it("orddict:update/4", () => {
		/*
		A = [{"a", 1}, {"b", 1}].
		B = [{"a", 1}, {"c", 3}].
		A2 = orddict:update("b", fun (V) -> V + 2 end, 2, A).
		B2 = orddict:update("b", fun (V) -> V + 2 end, 2, B).

		A2 == [{"a", 1}, {"b", 3}]. % true
		B2 == [{"a", 1}, {"b", 2}, {"c", 3}]. % true
		*/
		const a = vv(d("a", 1), d("b", 1));
		const b = vv(d("a", 1), d("c", 3));
		expect(
			a.update4("b", d("b", 2), (val) => d("b", val + 2))
		).toEqual(
			vv(d("a", 1), d("b", 3))
		);
		expect(
			b.update4("b", d("b", 2), (val) => d("b", val + 2))
		).toEqual(
			vv(d("a", 1), d("b", 2), d("c", 3))
		);

		// verify that input is unchanged
		expect(a).toEqual(vv(d("a", 1), d("b", 1)));
		expect(b).toEqual(vv(d("a", 1), d("c", 3)));
	});
	it("orddict:fold/3", () => {
		/*
		A = [{"a", 1}, {"b", 2}, {"c", 3}].
		B = orddict:fold(fun (K, V, Acc) -> Acc+V end, 0, A).
		B == 6. % true
		*/
		const a = vv(d("a", 1), d("b", 2), d("c", 3));
		expect(a.reduce((ac, t) => ac + t[1], 0)).toBe(6);

		// verify that input is unchanged
		expect(a).toEqual(vv(d("a", 1), d("b", 2), d("c", 3)));
	});
	it("orddict:filter/2", () => {
		/*
		A = [{"a", 1}, {"b", 2}, {"c", 3}].
		B = orddict:filter(fun (K,V) -> V rem 2 > 0 end, A1).
		B == [{"a", 1}, {"c", 3}]. % true
		*/
		const a = vv(d("a", 1), d("b", 2), d("c", 3));
		expect(a.filter((t) => t[1] % 2 > 0)).toEqual(vv(d("a", 1), d("c", 3)));

		// verify that input is unchanged
		expect(a).toEqual(vv(d("a", 1), d("b", 2), d("c", 3)));
	});
	it("orddict:erase/2", () => {
		/*
		A = [{"a", 1}, {"b", 2}, {"c", 3}].
        B = orddict:erase("b", A).
        B == [{"a", 1}, {"c", 3}]. % true
        */
        const a = vv(d("a", 1), d("b", 2), d("c", 3));
        expect(a.erase("b")).toEqual(vv(d("a", 1), d("c", 3)));

        // verify that input is unchanged
        expect(a).toEqual(vv(d("a", 1), d("b", 2), d("c", 3)));
	});
	it("orddict:fetch/2", () => {
		/*
		% return the specific tuple for given key or throw
		A = [{"a", 1}, {"b", 2}].
		R = orddict:fetch("b", A).
		R == 2. % true
		*/
		const a = vv(d("a", 1), d("b", 2));
		expect(a.fetch("b")).toBe(2);

		// verify that input is unchanged
		expect(a).toEqual(vv(d("a", 1), d("b", 2)));
	});
	it("orddict:map/2", () => {
		/*
		A = [{"a", 1}, {"b", 2}].
		B = orddict:map(fun (_,V) -> V+1 end, A).
		B == [{"a", 2}, {"b", 3}]. % true
		*/
		const a = vv(d("a", 1), d("b", 2));
		const b = a.map((t) => d(t[0], t[1] + 1));
		expect(b).toEqual(vv(d("a", 2), d("b", 3)));

		// verify that input is unchanged
		expect(a).toEqual(vv(d("a", 1), d("b", 2)));
	});
	it("orddict:fold/3", () => {
		// use reduce
	});
	it("lists:foldl", () => {
		// use reduce
	});
});
