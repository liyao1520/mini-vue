import { readonlyHandlers, mutableHandlers } from "./baseHandles";

export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
  return createActiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createActiveObject(raw, readonlyHandlers);
}
//创建响应式对象,可以创建readonly和reactive两种类型的proxy
function createActiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}
export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}
