import { isArray, isString } from "../shared";
import { getShapeFlag, ShapeFlags } from "../shared/ShapeFlags";

export interface VNode {
  type: string | ((...args: unknown[]) => any);
  props?: object | null;
  children?: VNode[] | string;
  shapeFlag: ShapeFlags;
  el: null | HTMLElement;
}

export function createVnode(type, props?, children?) {
  const vnode = {
    type,
    props,
    children,
    shapeFlag: getShapeFlag(type),
    el: null,
  };

  if (isString(children)) {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN;
  } else if (isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN;
  }
  return vnode;
}
