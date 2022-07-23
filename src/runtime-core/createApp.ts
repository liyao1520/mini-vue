import { createVNode } from "./vnode";
export function createAppAPI(render) {
  return function createApp(component) {
    return {
      mount(rootContainer) {
        const vnode = createVNode(component);
        render(vnode, rootContainer);
      },
    };
  };
}
