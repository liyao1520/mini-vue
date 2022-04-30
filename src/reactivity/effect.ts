import { extend } from "../shared/index";

let activeEffect: undefined | ReactiveEffect = undefined;
let shouldTrack = false;

class ReactiveEffect {
  private _fn: any;
  deps: any[] = [];
  active = true;
  onStop?: () => void;
  constructor(fn, public scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler;
  }
  run() {
    // 如果已调过 stop ,不再搜集
    if (!this.active) {
      return this._fn();
    }

    //开启收集开关,执行完后关闭
    shouldTrack = true;
    // 执行的时候  activeEffect 为this
    activeEffect = this;
    const res = this._fn();
    shouldTrack = false;
    return res;
  }
  stop() {
    // 性能优化多次调用执行一次
    if (this.active) {
      cleanupEffect(this);
      //如果option 传onStop了再stop的时候调用一下
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

//
function cleanupEffect(effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
}
//应该被收集
function isTracking() {
  return activeEffect !== undefined && shouldTrack;
}

export function effect(fn, options: any = {}) {
  // fn
  const _effect = new ReactiveEffect(fn, options.scheduler);

  //把options的参数都传给effect
  extend(_effect, options);

  _effect.run();
  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect; //runner的effect,用于stop(runner)
  return runner;
}

const targetMap = new WeakMap();

export function track(target, key) {
  // 如果不在收集中的状态,直接不走下面流程
  if (!isTracking()) return;

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  if (!shouldTrack) return;
  if (!activeEffect) return;

  if (dep.has(activeEffect)) return;

  dep.add(activeEffect);
  // effect 也要搜集dep,用于调用stop时,从所有dep中删除effect
  activeEffect.deps.push(dep);
}

export function trigger(target, key) {
  const depsMap = targetMap.get(target);
  const deps = depsMap.get(key);

  for (const effect of deps) {
    //如果有 scheduler 先执行 scheduler
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}

export function stop(runner) {
  const effect = runner.effect;
  effect.stop();
}
