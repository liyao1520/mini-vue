import { reactive } from "./reactive";
import { hasChanged, isObject } from "../shared";
import { trackEffects, triggerEffects } from "./effect";

class RefImpl {
  private _value: any;
  private _rawValue: any;
  public __v_isRef = true;
  public dep;
  constructor(value) {
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set();
  }
  get value() {
    trackEffects(this.dep);
    return this._value;
  }
  set value(newValue) {
    if (!hasChanged(this._rawValue, newValue)) return;
    this._value = convert(newValue);
    this._rawValue = newValue;

    triggerEffects(this.dep);
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

export function ref(value) {
  return new RefImpl(value);
}

export function isRef(ref) {
  return isObject(ref) && !!ref.__v_isRef;
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs(objectWidthRefs) {
  return new Proxy(objectWidthRefs, {
    get(target, key, receiver) {
      return unRef(Reflect.get(target, key, receiver));
    },
    set(target, key, newValue, receiver) {
      // 如果原来是 ref 赋值一个非ref,则需要让他的.value设置该值
      const ref = Reflect.get(target, key, receiver);
      if (isRef(ref) && !isRef(newValue)) {
        return Reflect.set(ref, "value", newValue);
      }
      return Reflect.set(target, key, newValue, receiver);
    },
  });
}
