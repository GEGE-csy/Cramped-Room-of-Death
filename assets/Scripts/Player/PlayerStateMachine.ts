
import { _decorator, AnimationClip, Animation, Component, Node, SpriteFrame } from 'cc';
import { FSM_PARAMS_TYPE_ENUM, PARAM_NAME_ENUM } from '../../Enums';
import State from '../../Base/State';
const { ccclass, property } = _decorator;

export interface IParamValue {
  type: FSM_PARAMS_TYPE_ENUM,
  value: boolean | number
}

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends Component {
  private _currentState: State = null
  // 参数列表
  params: Map<string, IParamValue> = new Map()
  // 状态机列表
  stateMachines: Map<string, State> = new Map()
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
      this.transition()
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
  async init() {
    this.animationComponent = this.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()
    // 等所有资源加载完才会退出init
    await Promise.all(this.waitingList)
  }
  initParams() {
    this.params.set(PARAM_NAME_ENUM.IDLE, {
      type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
      value: false
    })
    this.params.set(PARAM_NAME_ENUM.TURN_LEFT, {
      type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
      value: false
    })
    this.params.set(PARAM_NAME_ENUM.DIRECTION, {
      type: FSM_PARAMS_TYPE_ENUM.NUMBER,
      value: 0
    })
  }
  // 初始化状态机列表
  initStateMachines() {
    this.stateMachines.set(PARAM_NAME_ENUM.IDLE, new State(this, 'texture/player/idle/top', AnimationClip.WrapMode.Loop))
    this.stateMachines.set(PARAM_NAME_ENUM.TURN_LEFT, new State(this, 'texture/player/turnleft/top'))
  }
  initAnimationEvent() {
    // 监听动画完成，如果执行的是turn相关的动画，要恢复到idle状态
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      const whiteList = ['turn']
      if(whiteList.some(v => name.includes(v))) {
        this.setParams(PARAM_NAME_ENUM.IDLE, true)
      }
    })
  }
  // 两个状态之间的transition，改变参数的时候要执行，从而修改currentState
  transition() {
    switch(this.currentState) {
      case this.stateMachines.get(PARAM_NAME_ENUM.TURN_LEFT):
      case this.stateMachines.get(PARAM_NAME_ENUM.IDLE):
        // turn_left的trigger为true，则过渡到turn_left状态
        if(this.params.get(PARAM_NAME_ENUM.TURN_LEFT).value) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.TURN_LEFT)
        } else if(this.params.get(PARAM_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.IDLE)
        }
        break
      default:
        this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.IDLE)
    }
  }
}
