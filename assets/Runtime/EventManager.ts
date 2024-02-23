import Singleton from "../Base/Singleton"

interface IItem {
  handler: Function
  ctx: unknown // this上下文
}

// 数据中心
export default class EventManager extends Singleton {
  static get Instance() {
    // 重写父类的GetInstance，为了获取类型
    return super.GetInstance<EventManager>()
  }
  // 事件名称1:[方法，方法，方法] 事件名称2:[方法，方法，方法]
  private eventMap: Map<string, IItem[]> = new Map()

  on(eventName: string, handler: Function, ctx?: unknown) {
    if(this.eventMap.has(eventName)) {
      this.eventMap.get(eventName).push({ handler, ctx })
    } else {
      this.eventMap.set(eventName, [{ handler, ctx }])
    }
  }

  off(eventName: string, handler: Function) {
    if(this.eventMap.has(eventName)) {
      const index = this.eventMap.get(eventName).findIndex(item => item.handler === handler)
      if(index !== -1) {
        this.eventMap.get(eventName).splice(index, 1)
      }
    } 
  }

  emit(eventName: string, ...params: unknown[]) {
    if(this.eventMap.has(eventName)) {
      this.eventMap.get(eventName).forEach(({ handler, ctx }) => {
        ctx ? handler.apply(ctx, params) : handler(...params)   
      })
    }
  }

  clear() {
    this.eventMap.clear()
  }
}
