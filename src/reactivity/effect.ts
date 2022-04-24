class ReactiveEffect {
  private _fn: any;
  constructor(fn, public scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    // 执行的时候  activeEffect 为this
    activeEffect = this;
    return this._fn();
  }
}
let activeEffect: null | ReactiveEffect = null;
export function effect(fn, options: any = {}) {
  // fn
  const _effect = new ReactiveEffect(fn, options.scheduler);
  _effect.run();
  return _effect.run.bind(_effect);
}

const targetMap = new WeakMap();

export function track(target, key) {
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }

  // 添加依赖,有依赖再添加, user.age++; 会先进入get,再set
  deps.add(activeEffect);
}
export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  const deps = depsMap.get(key);

  for (const effect of deps) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
