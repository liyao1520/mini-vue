export const extend = Object.assign;
export function hasOwn(target: unknown, key: string) {
  return Object.prototype.hasOwnProperty.call(target, key);
}
export function isObject(obj) {
  return typeof obj === "object" && obj != null;
}
export function isArray(arr) {
  return Array.isArray(arr);
}
export function isString(str: unknown) {
  return typeof str === "string";
}
export function isFunction(fn: unknown) {
  return typeof fn === "function";
}
export function hasChanged(value, newValue) {
  return !Object.is(value, newValue);
}
