import { h } from "../../lib/mini-vue.esm.js";

export const Foo = {
  setup(props) {
    // props readonly
    console.log(props);
  },
  render() {
    return h("div", {}, "foo:" + this.count);
  },
};
