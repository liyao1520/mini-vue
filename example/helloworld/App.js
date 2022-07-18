import { h } from "../../lib/mini-vue.esm.js";
export const App = {
  render() {
    return h("div", { class: "test", id: "test" }, [
      h("span", {}, "hi"),
      h("span", {}, "mini-vue"),
    ]);
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
