import { h, renderSlot } from "../../lib/mini-vue.esm.js";

export const Foo = {
  setup() {},
  render() {
    return h("div", {}, [
      renderSlot(this.$slots, "header"),
      renderSlot(this.$slots, "default", { count: 1000 }),
      renderSlot(this.$slots, "footer"),
    ]);
  },
};
