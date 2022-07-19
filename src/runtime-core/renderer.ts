import { isArray, isObject, isString } from "../shared";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  //  patch
  patch(vnode, container);
}
function patch(vnode, container: any) {
  const { type, shapeFlag } = vnode;
  // 去处理组件
  if (shapeFlag & ShapeFlags.ELEMENT) {
    processElement(vnode, container);
  } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
    processComponent(vnode, container);
  }
}

function processElement(vnode, container: any) {
  mountElement(vnode, container);
}

function mountElement(vnode, container: any) {
  const { type: tag, props, children, shapeFlag } = vnode;
  const el = (vnode.el = document.createElement(tag as string));
  // string array
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // 递归创建
    mountChildren(children, el);
  }

  //props
  if (isObject(props)) {
    for (const key in props) {
      const val = props[key];
      el.setAttribute(key, val);
    }
  }
  container.appendChild(el);
}

function mountChildren(children, container) {
  for (const vnode of children) {
    patch(vnode, container);
  }
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function mountComponent(vnode: any, container: any) {
  //
  const instance = createComponentInstance(vnode);

  setupComponent(instance);

  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render.call(instance.proxy);
  const { vnode } = instance;
  patch(subTree, container);

  // element -> mount

  vnode.el = subTree.el;
}