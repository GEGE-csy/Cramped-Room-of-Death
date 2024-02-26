
import { _decorator, Animation } from 'cc';
import { FSM_PARAMS_TYPE_ENUM, PARAM_NAME_ENUM, STATE_ENUM } from '../../Enums';
import { StateMachine } from '../../Base/StateMachine';
import { Manager } from '../../Base/Manager';
import IdleSubStateMachine from './IdleSubStateMachine';
import TurnLeftSubStateMachine from './TurnLeftSubStateMachine';
import TurnRightSubStateMachine from './TurnRightSubStateMachine';
import BlockFrontSubStateMachine from './BlockFrontSubStateMachine';
import BlockTurnLeftSubStateMachine from './BlockTurnLeftSubStateMachine';
import BlockTurnRightSubStateMachine from './BlockTurnRightSubStateMachine';
import BlockBackSubStateMachine from './BlockBackSubStateMachine';
import BlockLeftSubStateMachine from './BlockLeftSubStateMachine';
import BlockRightSubStateMachine from './BlockRightSubStateMachine';
const { ccclass, property } = _decorator;

export interface IParamValue {
  type: FSM_PARAMS_TYPE_ENUM,
  value: boolean | number
}

@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {
  async init() {
    this.animationComponent = this.node.addComponent(Animation)
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
    this.params.set(PARAM_NAME_ENUM.TURN_RIGHT, {
      type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
      value: false
    })
    this.params.set(PARAM_NAME_ENUM.BLOCK_FRONT, {
      type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
      value: false
    })
    this.params.set(PARAM_NAME_ENUM.BLOCK_BACK, {
      type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
      value: false
    })
    this.params.set(PARAM_NAME_ENUM.BLOCK_LEFT, {
      type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
      value: false
    })
    this.params.set(PARAM_NAME_ENUM.BLOCK_RIGHT, {
      type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
      value: false
    })
    this.params.set(PARAM_NAME_ENUM.BLOCK_TURN_LEFT, {
      type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
      value: false
    })
    this.params.set(PARAM_NAME_ENUM.BLOCK_TURN_RIGHT, {
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
    this.stateMachines.set(PARAM_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    this.stateMachines.set(PARAM_NAME_ENUM.TURN_LEFT, new TurnLeftSubStateMachine(this))
    this.stateMachines.set(PARAM_NAME_ENUM.TURN_RIGHT, new TurnRightSubStateMachine(this))
    this.stateMachines.set(PARAM_NAME_ENUM.BLOCK_FRONT, new BlockFrontSubStateMachine(this))
    this.stateMachines.set(PARAM_NAME_ENUM.BLOCK_BACK, new BlockBackSubStateMachine(this))
    this.stateMachines.set(PARAM_NAME_ENUM.BLOCK_LEFT, new BlockLeftSubStateMachine(this))
    this.stateMachines.set(PARAM_NAME_ENUM.BLOCK_RIGHT, new BlockRightSubStateMachine(this))
    this.stateMachines.set(PARAM_NAME_ENUM.BLOCK_TURN_LEFT, new BlockTurnLeftSubStateMachine(this))
    this.stateMachines.set(PARAM_NAME_ENUM.BLOCK_TURN_RIGHT, new BlockTurnRightSubStateMachine(this))
  }
  initAnimationEvent() {
    // 监听动画完成，如果执行的是turn相关的动画，要恢复到idle状态
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      console.log('name', name)
      const whiteList = ['block', 'turn']
      if(whiteList.some(v => name.includes(v))) {
        this.node.getComponent(Manager).state = STATE_ENUM.IDLE
      }
    })
  }
  // 两个状态之间的run，改变参数的时候要执行，从而修改currentState
  run() {
    switch(this.currentState) {
      case this.stateMachines.get(PARAM_NAME_ENUM.TURN_LEFT):
      case this.stateMachines.get(PARAM_NAME_ENUM.TURN_RIGHT):
      case this.stateMachines.get(PARAM_NAME_ENUM.BLOCK_FRONT):
      case this.stateMachines.get(PARAM_NAME_ENUM.BLOCK_BACK):
      case this.stateMachines.get(PARAM_NAME_ENUM.BLOCK_LEFT):
      case this.stateMachines.get(PARAM_NAME_ENUM.BLOCK_RIGHT):
      case this.stateMachines.get(PARAM_NAME_ENUM.BLOCK_TURN_LEFT):
      case this.stateMachines.get(PARAM_NAME_ENUM.BLOCK_TURN_RIGHT):
      case this.stateMachines.get(PARAM_NAME_ENUM.IDLE):
        // blockfront的trigger为true，则过渡到blockfront状态
        if(this.params.get(PARAM_NAME_ENUM.BLOCK_FRONT).value) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.BLOCK_FRONT)
        } else if(this.params.get(PARAM_NAME_ENUM.BLOCK_BACK).value) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.BLOCK_BACK)
        } else if(this.params.get(PARAM_NAME_ENUM.BLOCK_LEFT).value) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.BLOCK_LEFT)
        } else if(this.params.get(PARAM_NAME_ENUM.BLOCK_RIGHT).value) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.BLOCK_RIGHT)
        } else if(this.params.get(PARAM_NAME_ENUM.BLOCK_TURN_LEFT).value) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.BLOCK_TURN_LEFT)
        } else if(this.params.get(PARAM_NAME_ENUM.BLOCK_TURN_RIGHT).value) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.BLOCK_TURN_RIGHT)
        } else if(this.params.get(PARAM_NAME_ENUM.TURN_LEFT).value) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.TURN_LEFT)
        } else if(this.params.get(PARAM_NAME_ENUM.TURN_RIGHT).value) {
          this.currentState = this.stateMachines.get(PARAM_NAME_ENUM.TURN_RIGHT)
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
