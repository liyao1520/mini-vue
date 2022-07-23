import { h } from "../../lib/mini-vue.esm.js";

export const App = {
  setup() {
    return { x: 50, y: 50 };
  },
  render() {
    return h("rect", {
      x: this.x,
      y: this.y,
    });
  },
};
