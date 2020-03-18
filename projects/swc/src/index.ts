import { d, ol, Dot, OLByPrim } from "./swc-types";

const g = ol<Dot>(d("a", 1), d("b", 2));

console.log(OLByPrim);
console.log(g);
console.log(g.store(d("c", 3)));
