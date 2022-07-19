import { h } from "../../lib/mini-vue.esm.js";

export const Foo = {
  setup(props, { emit }) {
    // props readonly
    console.log(props);
    return {
      onClick() {
        emit("add-count", 1, 2, 3);
      },
    };
  },

  render() {
    const btn = h(
      "button",
      {
        onClick: this.onClick,
      },
      "+1"
    );
    return h("div", {}, [h("span", {}, "foo:" + this.count), btn]);
  },
};
