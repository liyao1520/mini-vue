import { h, inject } from "../../lib/mini-vue.esm.js";
import { Bar } from "./Bar.js";

export const Foo = {
  setup() {
    const foo = inject("foo");
    const bar = inject("bar");
    return { foo, bar };
  },
  render() {
    return h("div", {}, [
      h("div", {}, this.foo),
      h("div", {}, this.bar),
      h(Bar),
    ]);
  },
};
