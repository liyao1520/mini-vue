import { h } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  render() {
    setTimeout(() => console.log(this.$el));
    return h("div", { class: "test", id: "test" }, [
      h("span", {}, "hi"),
      h("span", {}, this.msg),
      h(Foo, {
        count: 2,
        onAddCount(a, b, c) {
          console.log("onAdd", a, b, c);
        },
      }),
    ]);
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
