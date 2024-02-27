import { _decorator, AnimationClip } from 'cc';
import State from "../../Base/State";
import StateMachine from "../../Base/StateMachine";
import { DIRECTION_ENUM } from "../../Enums";
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine';

const BASE_URL = 'texture/smoke/idle'

const SPEED = 1 / 12
export default class IdleSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BASE_URL}/top`, AnimationClip.WrapMode.Normal, SPEED))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BASE_URL}/bottom`, AnimationClip.WrapMode.Normal, SPEED))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BASE_URL}/left`, AnimationClip.WrapMode.Normal, SPEED))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BASE_URL}/right`, AnimationClip.WrapMode.Normal, SPEED))
  }
}