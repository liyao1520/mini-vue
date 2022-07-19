import { isArray, isObject } from "../shared";
import { ShapeFlags } from "../shared/ShapeFlags";

export function initSlots(instance, children) {
  // slots
  const { vnode } = instance;
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(instance, children);
  }
}
function normalizeObjectSlots(instance, children) {
  const slots = {};
  if (children) {
    if (isObject(children)) {
      for (const key in children) {
        const value = children[key];
        // 把slots 传为数组形式
        // default:(slotProps)=>h('div',{},'foo'+slotProps.bar)
        // =>
        // default:(slotProps)=>[h('div',{},'foo'+slotProps.bar)]
        slots[key] = (props) => normalizeSlotValue(value(props));
      }
    }
  }
  instance.slots = slots;
}

function normalizeSlotValue(value) {
  return isArray(value) ? value : [value];
}
