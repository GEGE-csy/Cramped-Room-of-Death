
import { SubStateMachine } from './SubStateMachine';
import { DIRECTION_ORDER_ENUM, PARAM_NAME_ENUM } from '../Enums';

export default class DirectionSubStateMachine extends SubStateMachine {
  run() {
    // 拿到当前方向参数
    const value = this.fsm.getParams(PARAM_NAME_ENUM.DIRECTION)
    // 更新state，触发动画执行
    this.currentState = this.stateMachines.get(DIRECTION_ORDER_ENUM[value as number])
  }
}