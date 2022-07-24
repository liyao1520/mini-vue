import { Fragment, Text } from "./vnode";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { EMPTY_OBJECT, isObject } from "../shared";
import { createAppAPI } from "./createApp";
import { effect } from "../reactivity/effect";

// 用 createRenderer 可以渲染到不同的平台
export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    insert: hostInsert,
    patchProp: hostPatchProp,
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;

  function render(vnode, container) {
    //  patch
    patch(null, vnode, container, null);
  }
  // n1 老的 n2新的
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
        hostPatchProp(el, key, null, val);
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
      patchElement(n1, n2, container, parentComponent);
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

  function patchElement(n1, n2, container, parentComponent) {
    console.log("patchElement", n1, n2);
    const oldProps = n1.props || EMPTY_OBJECT;
    const newProps = n2.props || EMPTY_OBJECT;
    const el = (n2.el = n1.el);
    patchChildren(n1, n2, container, parentComponent);
    patchProps(el, oldProps, newProps);
  }
  function patchChildren(n1: any, n2: any, container: any, parentComponent) {
    const c1 = n1.children;
    const c2 = n2.children;
    // 新的为文本
    if (n2.shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 老的是array,新的为text
      if (n1.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 1. 把老的 children 清空
        unmountChildren(n1.children);
      }
      // 2. 设置新的text
      if (c1 !== c2) {
        hostSetElementText(n1.el, c2);
      }
    } else {
      // 新为array
      if (n2.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 清空文本,添加元素
        hostSetElementText(n1.el, "");
        mountChildren(c2, n1.el, parentComponent);
      }
    }
  }
  function unmountChildren(children) {
    for (const vnode of children) {
      const el = vnode.el;
      // remove
      hostRemove(el);
    }
  }

  function patchProps(el: any, oldProps: any, newProps: any) {
    // props 可能是组件外部变量写死的,可以不用遍历 (优化点)
    if (oldProps !== newProps) {
      for (const key in newProps) {
        const oldProp = oldProps[key];
        const newProp = newProps[key];
        //1. 值改变 -> 修改
        //2. 新增 foo -> 新增
        if (oldProp !== EMPTY_OBJECT) {
          if (oldProp !== newProp) {
            //3. null | undefined -> 删除 (在 runtime-dom 实现)
            hostPatchProp(el, key, oldProp, newProp);
          }
        }
      }

      //4. bar 属性 在新的里面没了 -> 删除
      for (const key in oldProps) {
        if (!(key in newProps)) {
          hostPatchProp(el, key, oldProps, null);
        }
      }
    }
  }

  return {
    createApp: createAppAPI(render),
  };
}
