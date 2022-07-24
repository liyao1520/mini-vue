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

    patch(null, vnode, container, null, null);
  }
  // n1 老的 n2新的
  function patch(n1, n2, container, parentComponent, anchor) {
    const { shapeFlag, type } = n2;

    switch (type) {
      case Fragment:
        // Fragment 类型
        processFragment(n1, n2, container, parentComponent, anchor);
        break;
      case Text:
        processText(n1, n2, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          // 处理Element
          processElement(n1, n2, container, parentComponent, anchor);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          // 去处理组件
          processComponent(n1, n2, container, parentComponent, anchor);
        }
    }
  }

  function mountElement(vnode, container: any, parentComponent, anchor) {
    const { type: tag, props, children, shapeFlag } = vnode;
    const el = (vnode.el = hostCreateElement(tag as string));
    // string array
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      // 递归创建
      mountChildren(children, el, parentComponent, anchor);
    }

    //props
    if (isObject(props)) {
      for (const key in props) {
        const val = props[key];
        hostPatchProp(el, key, null, val);
      }
    }

    hostInsert(el, container, anchor);
  }

  function mountChildren(children, container, parentComponent, anchor) {
    for (const vnode of children) {
      patch(null, vnode, container, parentComponent, anchor);
    }
  }

  function mountComponent(vnode: any, container: any, parentComponent, anchor) {
    //
    const instance = createComponentInstance(vnode, parentComponent);

    setupComponent(instance);

    setupRenderEffect(instance, container, anchor);
  }

  function setupRenderEffect(instance: any, container: any, anchor) {
    effect(() => {
      if (!instance.isMounted) {
        console.log("init");
        const subTree = (instance.subTree = instance.render.call(
          instance.proxy
        ));
        const { vnode: initialVNode } = instance;
        patch(null, subTree, container, instance, anchor);
        // element -> mount
        initialVNode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log("update");
        const subTree = instance.render.call(instance.proxy);
        const prevSubTree = instance.subTree;
        instance.subTree = subTree;

        patch(prevSubTree, subTree, container, instance, anchor);
      }
    });
  }

  function processElement(n1, n2, container: any, parentComponent, anchor) {
    if (!n1) {
      mountElement(n2, container, parentComponent, anchor);
    } else {
      patchElement(n1, n2, container, parentComponent, anchor);
    }
  }

  function processComponent(
    n1,
    n2: any,
    container: any,
    parentComponent,
    anchor
  ) {
    if (!n1) {
      mountComponent(n2, container, parentComponent, anchor);
    } else {
    }
  }

  function processFragment(n1, n2, container, parentComponent, anchor) {
    if (!n1) {
      if (n2.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(n2.children, container, parentComponent, anchor);
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

  function patchElement(n1, n2, container, parentComponent, anchor) {
    console.log("patchElement", n1, n2);
    const oldProps = n1.props || EMPTY_OBJECT;
    const newProps = n2.props || EMPTY_OBJECT;
    const el = (n2.el = n1.el);

    patchChildren(n1, n2, el, parentComponent, anchor);
    patchProps(el, oldProps, newProps);
  }
  function patchChildren(
    n1: any,
    n2: any,
    container: any,
    parentComponent,
    parentAnchor
  ) {
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
        hostSetElementText(container, c2);
      }
    } else {
      // 新为array,旧为文本
      if (n1.shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // 清空文本,添加元素
        hostSetElementText(container, "");
        mountChildren(c2, container, parentComponent, parentAnchor);
      } else {
        // 新array 旧array
        console.log("patch children array -> array");

        patchKeyedChildren(c1, c2, container, parentComponent, parentAnchor);
      }
    }
  }
  function isSameVNodeType(n1, n2) {
    return n1.type === n2.type && n1.key === n2.key;
  }
  function patchKeyedChildren(
    c1: any,
    c2: any,
    container,
    parentComponent,
    anchor
  ) {
    let i = 0;
    let e1 = c1.length - 1;
    let e2 = c2.length - 1;

    // 双端对比
    // 1. 左侧的对比
    // (a b) c
    // (a b) d e
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, anchor);
      } else {
        break;
      }
      i++;
    }
    // 2. 右侧的对比
    // a (b c)
    // d e (b c)
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, anchor);
      } else {
        break;
      }
      e1--;
      e2--;
    }

    // 3. 新的比老的长
    //     创建新的
    // 左侧
    // (a b)
    // (a b) c
    // i = 2, e1 = 1, e2 = 2
    // (e1,e2]

    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < c2.length ? c2[nextPos].el : null;
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor);
          i++;
        }
      }
    } else if (i > e2) {
      // 旧的多
      while (i <= e1) {
        hostRemove(c1[i].el)
        i++;
      }
    } else {
      // 乱序 难点
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
