import { h } from "../../lib/mini-vue.esm.js";



export const App = {
  render() {
    setTimeout(() => console.log(this.$el));
    return h("div", { class: "test", id: "test" }, [
      h("span", {}, "hi"),
      h("span", {}, this.msg),
      h("span", null, "!"),
    ]);
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
