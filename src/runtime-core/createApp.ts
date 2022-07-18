import { render } from "./renderer";
import { createVnode } from "./vnode";
export function createApp(component) {
  return {
    mount(rootContainer) {
      const vnode = createVnode(component);
      render(vnode, rootContainer);
    },
  };
}

