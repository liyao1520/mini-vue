import { hasOwn } from "../shared";

const publicPropertiesMap = {
  $el: (i) => i.vnode.el,
  $slots: (i) => i.slots,
};

// 用于render 中的 this
export const publicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { setupState, props } = instance;

    if (key in setupState) return setupState[key];

    if (hasOwn(setupState, key)) {
      return setupState[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    } else if (hasOwn(publicPropertiesMap, key)) {
      const publicGetter = publicPropertiesMap[key];
      return publicGetter(instance);
    }
  },
};
