import { h } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  setup() {},
  render() {
    return h("div", {}, [
      h(
        Foo,
        {},
        {
          default: ({ count }) => h("span", {}, "defaultSlot count:" + count),
          header: () => h("span", {}, "headerSlotContent count:"),
          footer: () => h("span", {}, "footerSlotContent"),
        }
      ),
    ]);
  },
};
