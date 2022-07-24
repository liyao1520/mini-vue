import { createRenderer } from "../runtime-core";

function createElement(tag) {
  return document.createElement(tag);
}
function insert(child, parent, anchor) {
  parent.insertBefore(child, anchor || null);
}

function remove(child) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}

function setElementText(el, text) {
  el.textContent = text;
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
const renderer: any = createRenderer({
  createElement,
  insert,
  patchProp,
  remove,
  setElementText,
});

export function createApp(...args) {
  return renderer.createApp(...args);
}

function isOn(key: string) {
  return /^on[A-Z]/.test(key);
}

export * from "../runtime-core";
