import { getCurrentInstance } from "./component";

export function provide(key, value) {
  const currentInstance = getCurrentInstance();
  //
  if (currentInstance) {
    let { provides } = currentInstance;
    const parentProvides = currentInstance.parent?.provides;

    if (parentProvides && provides === parentProvides) {
      // 原型链找吧
      provides = currentInstance.provides = Object.create(parentProvides);
    }

    provides[key] = value;
  }
}
export function inject(key, defaultValue) {
  const currentInstance = getCurrentInstance();
  if (currentInstance && currentInstance.parent) {
    const parentProvides = currentInstance.parent.provides;
    if (key in parentProvides) {
      return parentProvides[key];
    } else {
      return defaultValue;
    }
  } else {
    return defaultValue;
  }
}
