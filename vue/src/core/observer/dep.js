/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
export default class Dep {
  static target: ?Watcher        // 当前是谁在进行依赖的收集
  id: number
  subs: Array<Watcher>           // 观察者集合
  
  constructor() {
    this.id = uid++              // Dep实例的id，为了方便去重
    this.subs = []               // 存储收集器中需要通知的Watcher
  }
  
  /* 添加一个观察者对象 */
  addSub(sub: Watcher) {
    this.subs.push(sub)
  }
  
  /* 移除一个观察者对象 */
  removeSub(sub: Watcher) {
    remove(this.subs, sub)
  }
  
  /* 依赖收集，当存在Dep.target的时候把自己添加观察者的依赖中 */
  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }
  
  /* 通知所有订阅者 */
  notify() {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
/* 当前，依赖收集完需要将Dep.target设为null，防止后面重复添加依赖，造成代码死循环 */
Dep.target = null
const targetStack = []                             // watcher栈

/* 将watcher观察者实例设置给Dep.target，用以依赖收集。同时将该实例存入target栈中 */
export function pushTarget(_target: ?Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

/* 将观察者实例从target栈中取出并设置给Dep.target */
export function popTarget() {
  Dep.target = targetStack.pop()
}
