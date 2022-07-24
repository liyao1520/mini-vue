import { h, ref } from "../../lib/mini-vue.esm.js";
import { text_children1, array_children } from "./shared.js";
export default {
  setup() {
    const change = ref(false);
    window.change = change;
    return {
      change,
    };
  },
  render() {
    return this.change ? array_children : text_children1;
  },
};
