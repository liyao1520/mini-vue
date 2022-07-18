import { ReactiveEffect } from "./effect";

class CompoutedImpl {
  private _effect: ReactiveEffect;
  private _dirty: boolean = true;
  private _value: any;
  constructor(fn) {
    this._effect = new ReactiveEffect(fn, () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    });
  }
  get value() {
    // 脏数据,说明变化
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
      return this._value;
    } else {
      return this._value;
    }
  }
  set value(newValue) {
    console.warn(`computed 是只读的,不能设置为 ${newValue}`);
  }
}
export function computed(getter) {
  return new CompoutedImpl(getter);
}
