import { Fragment } from "./../vnode";
import { isFunction } from "../../shared";
import { createVNode } from "../vnode";

export function renderSlot(slots, slotName, slotProps?) {
  const slot = slots[slotName];

  if (slotName) {
    return createVNode(Fragment, {}, slot(slotProps));
  } else {
    console.warn(`[renderSlot] ${slots[slotName]} is not function`);
  }
}
