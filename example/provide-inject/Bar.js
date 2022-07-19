import { h, inject } from "../../lib/mini-vue.esm.js";

export const Bar = {
  setup() {
    const bar = inject("bar");
    const foo = inject("foo");
    const baz = inject("baz", "baz");

    return {
      foo,
      bar,
      baz,
    };
  },
  render() {
    return h("div", {}, [
      h("div", {}, this.foo),
      h("div", {}, this.bar),
      h("div", {}, this.baz),
    ]);
  },
};
