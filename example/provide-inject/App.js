import { h, provide } from "../../lib/mini-vue.esm.js";
import { Foo } from "./Foo.js";

export const App = {
  setup() {
    provide("bar", "bar info");
    provide("foo", "foo info");
  },
  render() {
    return h(Foo);
  },
};
