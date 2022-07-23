import { h, ref } from "../../lib/mini-vue.esm.js";

export const Foo = {
  setup(props, { emit }) {
    // props readonly
    console.log(props);
    const count = ref(0);
    return {
      onClick() {
        count.value++;
      },
      count,
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
