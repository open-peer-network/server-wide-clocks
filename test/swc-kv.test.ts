import {
  d,
  ol,
  vv,
  olt,
  dvp,
  dcc,
  bvv,
  bbp,
  Dot,
  DCC,
  BVV,
  DVP,
} from "../src/swc-types";
import * as swc from "../src/swc-kv";


const d1 = (): DCC => dcc(
  olt<DVP>(
    dvp(d("a", 8), "red"),
    dvp(d("b", 2), "green"),
  ),
  ol<Dot>(),
);
const d2 = (): DCC => dcc(
  olt<DVP>(),
  ol<Dot>(
    d("a", 4),
    d("b", 20),
  ),
);
const d3 = (): DCC => dcc(
  olt<DVP>(
    dvp(d("a", 1), "black"),
    dvp(d("a", 3), "red"),
    dvp(d("b", 1), "green"),
    dvp(d("b", 2), "green"),
  ),
  ol<Dot>(
    d("a", 4),
    d("b", 7),
  ),
);
const d4 = (): DCC => dcc(
  olt<DVP>(
    dvp(d("a", 2), "gray"),
    dvp(d("a", 3), "red"),
    dvp(d("a", 5), "red"),
    dvp(d("b", 2), "green"),
  ),
  ol<Dot>(
    d("a", 5),
    d("b", 5),
  ),
);
const d5 = (): DCC => dcc(
  olt<DVP>(
    dvp(d("a", 5), "gray"),
  ),
  ol<Dot>(
    d("a", 5),
    d("b", 5),
    d("c", 4),
  ),
);


describe('SWC KV', () => {
  it('values', () => {
    expect(swc.values(d1())).toEqual(["red", "green"]);
    expect(swc.values(d2())).toEqual([]);
  });

  it('context', () => {
    expect(swc.context(d1())).toEqual([]);
    expect(swc.context(d2())).toEqual([
      d("a", 4),
      d("b", 20),
    ]);
  });

  it('sync', () => {
    const D34 = [
      [
        dvp(d("a", 5), "red"),
        dvp(d("a", 3), "red"),
        dvp(d("b", 2), "green"),
      ],
      [
        d("a", 5),
        d("b", 7),
      ],
    ];
    expect(swc.sync(d3(), d3())).toEqual(d3());
    expect(swc.sync(d4(), d4())).toEqual(d4());
    expect(swc.sync(d3(), d4())).toEqual(D34);
  });

  it('add BVV', () => {
    expect(swc.addBVV(ol<BVV>(bvv("a", bbp(5, 3))), d1()))
      .toEqual([
        bvv("a", bbp(8, 0)),
        bvv("b", bbp(0, 2)),
      ]);
  });

  it('discard', () => {
    expect(swc.discard(d3(), ol<Dot>())).toEqual(d3());
    expect(swc.discard(d3(), ol<Dot>(
      d("a", 2),
      d("b", 15),
      d("c", 15),
    ))).toEqual([
      [
        dvp(d("a", 3), "red")
      ],
      [
        d("a", 4),
        d("b", 15),
        d("c", 15),
      ],
    ]);
    expect(swc.discard(d3(), ol<Dot>(
      d("a", 3),
      d("b", 15),
      d("c", 15),
    ))).toEqual([
      [],
      [
        d("a", 4),
        d("b", 15),
        d("c", 15),
      ],
    ]);
  });

  it('strip', () => {
    expect(swc.strip(d5(), ol<BVV>(
      bvv("a", bbp(4, 4)),
    ))).toEqual(d5());

    expect(swc.strip(d5(), ol<BVV>(
      bvv("a", bbp(5, 0)),
    ))).toEqual([
      [
        dvp(d("a", 5), "gray"),
      ],
      [
        d("b", 5),
        d("c", 4),
      ],
    ]);

    expect(swc.strip(d5(), ol<BVV>(
      bvv("a", bbp(15, 0)),
    ))).toEqual([
      [
        dvp(d("a", 5), "gray"),
      ],
      [
        d("b", 5),
        d("c", 4),
      ],
    ]);
    expect(swc.strip(d5(), ol<BVV>(
      bvv("a", bbp(15, 4)),
      bvv("b", bbp(1, 2)),
    ))).toEqual([
      [
        dvp(d("a", 5), "gray"),
      ],
      [
        d("b", 5),
        d("c", 4),
      ],
    ]);
    expect(swc.strip(d5(), ol<BVV>(
      bvv("b", bbp(15, 4)),
      bvv("c", bbp(1, 2)),
    ))).toEqual([
      [
        dvp(d("a", 5), "gray"),
      ],
      [
        d("a", 5),
        d("c", 4),
      ],
    ]);
    expect(swc.strip(d5(), ol<BVV>(
      bvv("a", bbp(15, 4)),
      bvv("b", bbp(15, 4)),
      bvv("c", bbp(5, 2)),
    ))).toEqual([
      [
        dvp(d("a", 5), "gray"),
      ],
      [],
    ]);
  });

  it('fill2', () => {
    expect(swc.fill2(d5(), ol<BVV>(bvv("a", bbp(4, 4))))).toEqual(d5());
    expect(swc.fill2(d5(), ol<BVV>(bvv("a", bbp(5, 0))))).toEqual(d5());
    expect(swc.fill2(d5(), ol<BVV>(bvv("a", bbp(6, 0))))).toEqual([
      [
        dvp(d("a", 5), "gray"),
      ],
      [
        d("a", 6),
        d("b", 5),
        d("c", 4),
      ]
    ]);
    expect(swc.fill2(d5(), ol<BVV>(
      bvv("a", bbp(15, 12)),
    ))).toEqual([
      [
        dvp(d("a", 5), "gray"),
      ],
      [
        d("a", 15),
        d("b", 5),
        d("c", 4),
      ]
    ]);
    expect(swc.fill2(d5(), ol<BVV>(
      bvv("b", bbp(15, 12)),
    ))).toEqual([
      [
        dvp(d("a", 5), "gray"),
      ],
      [
        d("a", 5),
        d("b", 15),
        d("c", 4),
      ]
    ]);
    expect(swc.fill2(d5(), ol<BVV>(
      bvv("d", bbp(15, 12)),
    ))).toEqual([
      [
        dvp(d("a", 5), "gray"),
      ],
      [
        d("a", 5),
        d("b", 5),
        d("c", 4),
        d("d", 15),
      ]
    ]);
    expect(swc.fill2(d5(), ol<BVV>(
      bvv("a", bbp(9, 6)),
      bvv("d", bbp(15, 12)),
    ))).toEqual([
      [
        dvp(d("a", 5), "gray"),
      ],
      [
        d("a", 9),
        d("b", 5),
        d("c", 4),
        d("d", 15),
      ]
    ]);
  });

  it('fill3', () => {
    expect(swc.fill3(d5(), ol<BVV>(
      bvv("a", bbp(9, 6)),
      bvv("d", bbp(15, 12)),
    ), ["a"])).toEqual([
      [
        dvp(d("a", 5), "gray"),
      ],
      [
        d("a", 9),
        d("b", 5),
        d("c", 4),
      ]
    ]);
    expect(swc.fill3(d5(), ol<BVV>(
      bvv("a", bbp(9, 6)),
      bvv("d", bbp(15, 12)),
    ), ["b", "a"])).toEqual([
      [
        dvp(d("a", 5), "gray")
      ],
      [
        d("a", 9),
        d("b", 5),
        d("c", 4),
      ]
    ]);
    expect(swc.fill3(d5(), ol<BVV>(
      bvv("a", bbp(9, 6)),
      bvv("d", bbp(15, 12)),
    ), ["d", "a"])).toEqual([
      [
        dvp(d("a", 5), "gray"),
      ],
      [
        d("a", 9),
        d("b", 5),
        d("c", 4),
        d("d", 15),
      ]
    ]);
    expect(swc.fill3(d5(), ol<BVV>(
      bvv("a", bbp(9, 6)),
      bvv("d", bbp(15, 12)),
    ), ["b"])).toEqual(d5());
    expect(swc.fill3(d5(), ol<BVV>(
      bvv("a", bbp(9, 6)),
      bvv("d", bbp(15, 12)),
    ), ["f"])).toEqual(d5());
  });

  it('add DCC', () => {
    expect(
      swc.addDCC(d1(), d("a", 11), "purple")
    ).toEqual(
      dcc(
        olt<DVP>(
          dvp(d("a", 8), "red"),
          dvp(d("a", 11), "purple"),
          dvp(d("b", 2), "green"),
        ),
        vv(
          d("a", 11),
        ),
      )
    );
    expect(swc.addDCC(d2(), d("b", 11), "purple")).toEqual(
      dcc(
        olt<DVP>(
          dvp(d("b", 11), "purple"),
        ),
        vv(
          d("a", 4),
          d("b", 20),
        ),
      )
    );
  });
});
