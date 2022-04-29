import { track, trigger } from "./effect";

function createGetter(isReadonly = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver);
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}
function createSetter() {
  return function set(target, key, newValue, receiver) {
    const res = Reflect.set(target, key, newValue, receiver);
    trigger(target, key);
    return res;
  };
}
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
export const mutableHandlers = {
  get,
  set,
};
export const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    console.warn(` ${key} 不可变, 因为是 readonly`);
    return true;
  },
};
