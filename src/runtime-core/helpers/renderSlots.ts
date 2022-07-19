import { isFunction } from "../../shared";
import { createVnode } from "../vnode";

export function renderSlot(slots, slotName, slotProps?) {
  const slot = slots[slotName];

  if (slotName) {
    return createVnode("div", {}, slot(slotProps));
  } else {
    console.warn(`[renderSlot] ${slots[slotName]} is not function`);
  }
}
