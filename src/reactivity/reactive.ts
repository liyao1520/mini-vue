import {
  readonlyHandlers,
  mutableHandlers,
  shallowReadonlyHandlers,
} from "./baseHandles";

export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

export function reactive(raw) {
  return createReactiveObject(raw, mutableHandlers);
}

export function readonly(raw) {
  return createReactiveObject(raw, readonlyHandlers);
}
export function shallowReadonly(raw) {
  return createReactiveObject(raw, shallowReadonlyHandlers);
}
//创建响应式对象,可以创建readonly和reactive两种类型的proxy
function createReactiveObject(raw, baseHandlers) {
  return new Proxy(raw, baseHandlers);
}

export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}
export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
