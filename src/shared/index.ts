export const extend = Object.assign;

export function isObject(obj) {
  return typeof obj === "object" && obj != null;
}
export function isArray(arr) {
  return Array.isArray(arr);
}
export function isString(str) {
  return typeof str === "string";
}

export function hasChanged(value, newValue) {
  return !Object.is(value, newValue);
}
