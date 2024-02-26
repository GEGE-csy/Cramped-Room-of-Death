
import State from "../../Base/State";
import  StateMachine from "../../Base/StateMachine";
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAM_NAME_ENUM } from "../../Enums";
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine';

// 点击向左转时的4个状态 - 对应4组动画 - 向上时向左转，向左时向左转，向下时向左转，向右时向左转
const BASE_URL = 'texture/player/turnright'
export default class TurnRightSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}/top`))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}/bottom`))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}/left`))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}/right`))
  }
}