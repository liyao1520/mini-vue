import { Fragment, Text } from "./vnode";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { isObject } from "../shared";
import { createAppAPI } from "./createApp";
import { effect } from "../reactivity/effect";

// 用 createRenderer 可以渲染到不同的平台
export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    insert: hostInsert,
    patchProp: hostPatchProp,
  } = options;

  function render(vnode, container) {
    //  patch
    patch(null, vnode, container, null);
  }

  function patch(n1, n2, container: any, parentComponent) {
    const { shapeFlag, type } = n2;

    switch (type) {
      case Fragment:
        // Fragment 类型
        processFragment(n1, n2, container, parentComponent);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 处理Element
          processElement(n1, n2, container, parentComponent);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // 去处理组件
          processComponent(n1, n2, container, parentComponent);
        }
    }
  }

  function mountElement(vnode, container: any, parentComponent) {
    const { type: tag, props, children, shapeFlag } = vnode;
    const el = (vnode.el = hostCreateElement(tag as string));
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
        hostPatchProp(el, key, val);
      }
    }

    hostInsert(el, container);
  }

  function mountChildren(children, container, parentComponent) {
    for (const vnode of children) {
      patch(null, vnode, container, parentComponent);
    }
  }

  function mountComponent(vnode: any, container: any, parentComponent) {
    //
    const instance = createComponentInstance(vnode, parentComponent);

    setupComponent(instance);

    setupRenderEffect(instance, container);
  }

  function setupRenderEffect(instance: any, container: any) {
    effect(() => {
      if (!instance.isMounted) {
        console.log("init");
        const subTree = (instance.subTree = instance.render.call(
          instance.proxy
        ));
        const { vnode: initialVNode } = instance;
        patch(null, subTree, container, instance);
        // element -> mount
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log("update");
        const subTree = instance.render.call(instance.proxy);
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;

        patch(prevSubTree, subTree, container, instance);
      }
    });
  }

  function processElement(n1, n2, container: any, parentComponent) {
    if (!n1) {
      mountElement(n2, container, parentComponent);
    } else {
      patchElement(n1, n2, container);
    }
  }

  function processComponent(n1, n2: any, container: any, parentComponent) {
    if (!n1) {
      mountComponent(n2, container, parentComponent);
    } else {
    }
  }

  function processFragment(n1, n2, container, parentComponent) {
    if (!n1) {
      if (n2.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(n2.children, container, parentComponent);
      }
    } else {
    }
  }
  function processText(n1, n2: any, container: any) {
    if (!n1) {
      const { children } = n2;
      // vnode.el 也要赋值
      const textNode = (n2.el = document.createTextNode(children));
      container.appendChild(textNode);
    }
  }

  function patchElement(n1, n2, container) {
    console.log("patchElement", n1, n2);
  }

  return {
    createApp: createAppAPI(render),
  };
}
