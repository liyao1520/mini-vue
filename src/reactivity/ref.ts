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

export function ref(value) {
  return new RefImpl(value);
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

export function isRef(ref) {
  return isObject(ref) && ref.__v_isRef;
}
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref;
}
