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

export function patchProp(el, key, value) {
  // 是否为事件
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, value);
  } else {
    el.setAttribute(key, value);
  }
}
const renderer: any = createRenderer({ createElement, insert, patchProp });

export function createApp(...args) {
  return renderer.createApp(...args);
}

export * from "../runtime-core";
