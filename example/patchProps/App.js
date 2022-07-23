import { h, ref } from "../../lib/mini-vue.esm.js";

export const App = {
  render() {
    return h(
      "button",
      {
        id: this.id,
        class: this.className,
        onClick: this.onClick,
      },
      "change id"
    );
  },
  setup() {
    // chang
    const id = ref("foo");
    // add/remove
    const className = ref();

    return {
      id,
      className,
      onClick() {
        id.value = id.value === "foo" ? "newFoo" : "foo";
        className.value = className.value ? undefined : "bar";
      },
    };
  },
};
