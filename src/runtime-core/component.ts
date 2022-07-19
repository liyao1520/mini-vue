import { isObject } from "../shared";

export function createComponentInstance(vnode: any) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
  };

  return component;
}

export function setupComponent(instance) {
  // initProps()
  // initSlots()
  setupStatefulComponent(instance);
}
function setupStatefulComponent(instance: any) {
  const Component = instance.type;
  // 代理对象,用于render函数this
  const { setupState } = instance;
  instance.proxy = new Proxy(
    {},
    {
      get(target, key) {
        if (key in setupState) return setupState[key];
      },
    }
  );
  const { setup } = Component;
  if (setup) {
    const setupResult = setup();

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
