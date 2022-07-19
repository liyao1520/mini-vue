import { Fragment, Text } from "./vnode";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { isObject } from "../shared";

export function render(vnode, container) {
  //  patch
  patch(vnode, container, null);
}
function patch(vnode, container: any, parentComponent) {
  const { shapeFlag, type } = vnode;

  switch (type) {
    case Fragment:
      // Fragment 类型
      processFragment(vnode, container, parentComponent);
      break;
    case Text:
      processText(vnode, container);
      break;
    default:
      if (shapeFlag & ShapeFlags.ELEMENT) {
        // 处理Element
        processElement(vnode, container, parentComponent);
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        // 去处理组件
        processComponent(vnode, container, parentComponent);
      }
  }
}

function processElement(vnode, container: any, parentComponent) {
  mountElement(vnode, container, parentComponent);
}

function mountElement(vnode, container: any, parentComponent) {
  const { type: tag, props, children, shapeFlag } = vnode;
  const el = (vnode.el = document.createElement(tag as string));
  // string array
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // 递归创建
    mountChildren(children, el, parentComponent);
  }

  //props
  if (isObject(props)) {
    for (const key in props) {
      const val = props[key];
      // 是否为事件
      if (isOn(key)) {
        const event = key.slice(2).toLowerCase();
        el.addEventListener(event, val);
      } else {
        el.setAttribute(key, val);
      }
    }
  }
  container.appendChild(el);
}

function mountChildren(children, container, parentComponent) {
  for (const vnode of children) {
    patch(vnode, container, parentComponent);
  }
}

function processComponent(vnode: any, container: any, parentComponent) {
  mountComponent(vnode, container, parentComponent);
}

function mountComponent(vnode: any, container: any, parentComponent) {
  //
  const instance = createComponentInstance(vnode, parentComponent);

  setupComponent(instance);

  setupRenderEffect(instance, container);
}

function setupRenderEffect(instance: any, container: any) {
  const subTree = instance.render.call(instance.proxy);
  const { vnode } = instance;
  patch(subTree, container, instance);

  // element -> mount

  vnode.el = subTree.el;
}
function isOn(key: string) {
  return /^on[A-Z]/.test(key);
}
function processFragment(vnode, container, parentComponent) {
  if (vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode.children, container, parentComponent);
  }
}
function processText(vnode: any, container: any) {
  const { children } = vnode;
  // vnode.el 也要赋值
  const textNode = (vnode.el = document.createTextNode(children));
  container.appendChild(textNode);
}
