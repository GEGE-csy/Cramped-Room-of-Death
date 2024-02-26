
import { _decorator, Animation } from 'cc';
import { FSM_PARAMS_TYPE_ENUM, PARAM_NAME_ENUM } from '../../Enums';
import  StateMachine, { getInitParamsNumber, getInitParamsTrigger } from '../../Base/StateMachine';
import IdleSubStateMachine from './IdleSubStateMachine';
import DeathSubStateMachine from './DeathSubStateMachine';
const { ccclass, property } = _decorator;

export interface IParamValue {
  type: FSM_PARAMS_TYPE_ENUM,
  value: boolean | number
}

@ccclass('IronSkeletonStateMachine')
export class IronSkeletonStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.node.addComponent(Animation)
    this.initParams()
    this.initStateMachines()
    // 等所有资源加载完才会退出init
    await Promise.all(this.waitingList)
  }
  initParams() {
    this.params.set(PARAM_NAME_ENUM.IDLE, getInitParamsTrigger())
    this.params.set(PARAM_NAME_ENUM.DEATH, getInitParamsTrigger())
    this.params.set(PARAM_NAME_ENUM.DIRECTION, getInitParamsNumber())
  }
  // 初始化状态机列表
  initStateMachines() {
    this.stateMachines.set(PARAM_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachines.set(PARAM_NAME_ENUM.DEATH, new DeathSubStateMachine(this))
  }
  // 两个状态之间的run，改变参数的时候要执行，从而修改currentState
  run() {
    switch(this.currentState) {
      case this.stateMachines.get(PARAM_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAM_NAME_ENUM.DEATH):
        if(this.params.get(PARAM_NAME_ENUM.DEATH).value) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.DEATH)
        } else if(this.params.get(PARAM_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.IDLE)
        } else { // 触发set currentState
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.IDLE)
    }
  }
}
