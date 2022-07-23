import { proxyRefs } from "../reactivity";
import { shallowReadonly } from "../reactivity/reactive";
import { isObject } from "../shared";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { publicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";
export function createComponentInstance(vnode: any, parent) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    emit: () => {},
    provides: parent ? parent.provides : {},
    parent: parent,
    isMounted: false,
    subTree: {},
  };

  component.emit = emit.bind(null, component) as any;

  return component;
}

export function setupComponent(instance) {
  initProps(instance, instance.vnode.props);
  initSlots(instance, instance.vnode.children);
  setupStatefulComponent(instance);
}
function setupStatefulComponent(instance: any) {
  const Component = instance.type;

  // 代理对象,用于render函数this
  instance.proxy = new Proxy(
    {
      _: instance,
    },
    publicInstanceProxyHandlers
  );
  const { setup } = Component;
  if (setup) {
    // 设置当前实例
    setCurrentInstance(instance);
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
    // setup执行完毕,清空实例
    setCurrentInstance(null);
    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance, setupResult: any) {
  // function object

  if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  }
  finishComponentSetup(instance);
}
function finishComponentSetup(instance: any) {
  const Component = instance.type;

  instance.render = Component.render;
}

let currentInstance: any = null;

export function getCurrentInstance() {
  return currentInstance;
}

function setCurrentInstance(instance) {
  currentInstance = instance;
}
