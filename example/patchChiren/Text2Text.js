import { h, ref } from "../../lib/mini-vue.esm.js";
import { text_children1, text_children2 } from "./shared.js";
export default {
  setup() {
    const change = ref(false);
    window.change = change;
    return {
      change,
    };
  },
  render() {
    return this.change ? text_children2 : text_children1;
  },
};
