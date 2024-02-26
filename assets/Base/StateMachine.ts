
import { _decorator, Animation, Component, SpriteFrame } from 'cc';
import { FSM_PARAMS_TYPE_ENUM } from '../Enums';
import State from './State';
import SubStateMachine from './SubStateMachine';
const { ccclass, property } = _decorator;

export interface IParamValue {
  type: FSM_PARAMS_TYPE_ENUM,
  value: boolean | number
}
export const getInitParamsTrigger = () => {
  return {
    type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
    value: false,
  }
}

export const getInitParamsNumber = () => {
  return {
    type: FSM_PARAMS_TYPE_ENUM.NUMBER,
    value: 0,
  }
}
@ccclass('StateMachine')
export default abstract class StateMachine extends Component {
  private _currentState: State | SubStateMachine = null
  // 参数列表
  params: Map<string, IParamValue> = new Map()
  // 状态机列表
  stateMachines: Map<string, State | SubStateMachine> = new Map()
  animationComponent: Animation
  // 加载资源的promise列表
  waitingList: Promise<SpriteFrame[]>[] = []

  getParams(paramsName: string) {
    if(this.params.has(paramsName)) {
      return this.params.get(paramsName).value
    }
  }
  setParams(paramsName: string, value: boolean | number) {
    if(this.params.has(paramsName)) {
      this.params.get(paramsName).value = value
      // 参数改变了，执行run()改变状态
      this.run()
      // 触发器完成一次条件判断后应设置为未触发状态
      this.resetTrigger()
    }
  }
  get currentState() {
    return this._currentState
  }

  set currentState(newState) {
    this._currentState = newState
    // currentState被修改时应该要执行动画了
    this._currentState.run()
  }

  resetTrigger() {
    for(const [_, paramValue] of this.params) {
      if(paramValue.type === FSM_PARAMS_TYPE_ENUM.TRIGGER) {
        paramValue.value = false
      }
    }
  }
  abstract init(): void
  abstract run(): void
}
