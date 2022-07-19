import { shallowReadonly } from "../reactivity/reactive";
import { isObject } from "../shared";
import { initProps } from "./componentProps";
import { publicInstanceProxyHandlers } from "./componentPublicInstance";
export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
  };

  return component;
}

export function setupComponent(instance) {
  initProps(instance, instance.vnode.props);
  // initSlots()
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
    const setupResult = setup(shallowReadonly(instance.props));

    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance, setupResult: any) {
  // function object

  if (isObject(setupResult)) {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}
function finishComponentSetup(instance: any) {
  const Component = instance.type;

  instance.render = Component.render;
}
