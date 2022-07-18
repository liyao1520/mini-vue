import { isArray, isObject, isString } from "../shared";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  //  patch
  patch(vnode, container);
}
function patch(vnode: any, container: any) {
  const type = vnode.type;
  // 去处理组件
  if (isString(type)) {
    processElement(vnode, container);
  } else if (isObject(type)) {
    processComponent(vnode, container);
  }
}

function processElement(vnode: any, container: any) {
  mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
  const { type: tag, props, children } = vnode;
  const el = document.createElement(tag);
  // string array
  if (isString(children)) {
    el.textContent = children;
  } else if (isArray(children)) {
    // 递归创建
    mountChildren(children, el);
  }

  //props
  for (const key in props) {
    const val = props[key];

    el.setAttribute(key, val);
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
  const subTree = instance.render();

  patch(subTree, container);
  // vnode tree
}
