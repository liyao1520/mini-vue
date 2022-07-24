import { h } from "../../lib/mini-vue.esm.js";
import Array2Text from "./Array2Text.js";
import Text2Array from "./Text2Array.js";
import Text2Text from "./Text2Text.js";
export const App = {
  render() {
    // return h(Array2Text);
    return h( Text2Array);
    // return h(Text2Text);
  },
  setup() {
    return {
      msg: "mini-vue",
    };
  },
};
