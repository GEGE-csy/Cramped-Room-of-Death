
import { _decorator, Animation } from 'cc';
import { FSM_PARAMS_TYPE_ENUM, PARAM_NAME_ENUM, STATE_ENUM } from '../../Enums';
import  StateMachine, { getInitParamsNumber, getInitParamsTrigger } from '../../Base/StateMachine';
import IdleSubStateMachine from './IdleSubStateMachine';
import AttackSubStateMachine from './AttackSubStateMachine';
import { Manager } from '../../Base/Manager';
import DeathSubStateMachine from './DeathSubStateMachine';
const { ccclass, property } = _decorator;

export interface IParamValue {
  type: FSM_PARAMS_TYPE_ENUM,
  value: boolean | number
}

@ccclass('WoodenSkeletonStateMachine')
export class WoodenSkeletonStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.node.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    this.initAnimationEvent()
    // 等所有资源加载完才会退出init
    await Promise.all(this.waitingList)
  }
  initParams() {
    this.params.set(PARAM_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAM_NAME_ENUM.ATTACK, getInitParamsTrigger())
    this.params.set(PARAM_NAME_ENUM.DEATH, getInitParamsTrigger())
    this.params.set(PARAM_NAME_ENUM.DIRECTION, getInitParamsNumber())
  }
  // 初始化状态机列表
  initStateMachines() {
    this.stateMachines.set(PARAM_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachines.set(PARAM_NAME_ENUM.ATTACK, new AttackSubStateMachine(this))
    this.stateMachines.set(PARAM_NAME_ENUM.DEATH, new DeathSubStateMachine(this))
  }
  initAnimationEvent() {
    // 监听动画完成，如果执行的是turn相关的动画，要恢复到idle状态
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      const whiteList = ['attack']
      if(whiteList.some(v => name.includes(v))) {
        this.node.getComponent(Manager).state = STATE_ENUM.IDLE
      }
    })
  }
  // 两个状态之间的run，改变参数的时候要执行，从而修改currentState
  run() {
    switch(this.currentState) {
      case this.stateMachines.get(PARAM_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAM_NAME_ENUM.ATTACK):
      case this.stateMachines.get(PARAM_NAME_ENUM.DEATH):
        if(this.params.get(PARAM_NAME_ENUM.ATTACK).value) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.ATTACK)
        } else if(this.params.get(PARAM_NAME_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.DEATH)
        } else if(this.params.get(PARAM_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.IDLE)
        } else { // 触发set currentState
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.IDLE)
        break
    }
  }
}
