export const extend = Object.assign;

export function isObject(obj) {
  return typeof obj === "object" && obj != null;
}

export function hasChanged(value, newValue) {
  return !Object.is(value, newValue);
}
