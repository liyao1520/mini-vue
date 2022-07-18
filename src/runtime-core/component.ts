import { isObject } from "../shared";

export function createComponentInstance(vnode: any) {
  const component = { vnode, type: vnode.type };

  return component;
}

export function setupComponent(instance) {
  // initProps()
  // initSlots()
  setupStatefulComponent(instance);
}
function setupStatefulComponent(instance: any) {
  const Component = instance.type;

  const { setup } = Component;
  if (setup) {
    const setupResult = setup();

    handleSetupResult(instance, setupResult);
  }
}
function handleSetupResult(instance, setupResult: any) {
  // function object
  // TODO function
  if (isObject(typeof setupResult)) {
    instance.setupResult = setupResult;
  }
  finishComponentSetup(instance);
}
function finishComponentSetup(instance: any) {
  const Component = instance.type;

  instance.render = Component.render;
}
