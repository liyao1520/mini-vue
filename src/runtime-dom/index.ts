import { createRenderer } from "../runtime-core";

export function createElement(tag) {
  return document.createElement(tag);
}
export function insert(el, parent) {
  parent.appendChild(el);
}
function isOn(key: string) {
  return /^on[A-Z]/.test(key);
}

export function patchProp(el, key, oldValue, newValue) {
  // 是否为事件
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.removeEventListener(event, oldValue);
    el.addEventListener(event, newValue);
  } else {
    // newValue 为 null 或者 undefined

    if (newValue == null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, newValue);
    }
  }
}
const renderer: any = createRenderer({ createElement, insert, patchProp });

export function createApp(...args) {
  return renderer.createApp(...args);
}

export * from "../runtime-core";
