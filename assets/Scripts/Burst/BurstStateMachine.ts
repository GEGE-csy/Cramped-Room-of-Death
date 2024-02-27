
import { _decorator, Animation } from 'cc';
import { FSM_PARAMS_TYPE_ENUM, PARAM_NAME_ENUM } from '../../Enums';
import  StateMachine, { getInitParamsNumber, getInitParamsTrigger } from '../../Base/StateMachine';
import State from '../../Base/State';
const { ccclass, property } = _decorator;

export interface IParamValue {
  type: FSM_PARAMS_TYPE_ENUM,
  value: boolean | number
}
const BASE_URL = "texture/burst";

@ccclass('BurstStateMachine')
export class BurstStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.node.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
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
    // 地裂陷井没有方向，不需要子状态机
    this.stateMachines.set(PARAM_NAME_ENUM.IDLE, new State(this, `${BASE_URL}/idle`))
    this.stateMachines.set(PARAM_NAME_ENUM.ATTACK, new State(this, `${BASE_URL}/attack`))
    this.stateMachines.set(PARAM_NAME_ENUM.DEATH, new State(this, `${BASE_URL}/death`))
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
