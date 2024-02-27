
import State from "../../Base/State";
import StateMachine from "../../Base/StateMachine";
import { PARAM_NAME_ENUM, SPIKES_COUNT_ENUM, SPIKES_COUNT_NUMBER_ENUM } from "../../Enums";
import SubStateMachine from "../../Base/SubStateMachine";


const BASE_URL = 'texture/spikes/spikesone'
export default class SpikeOneSubStateMachine extends SubStateMachine {
  constructor(fsm: StateMachine) {
    super(fsm)
    this.stateMachines.set(SPIKES_COUNT_ENUM.ZERO, new State(fsm, `${BASE_URL}/zero`))
    this.stateMachines.set(SPIKES_COUNT_ENUM.ONE, new State(fsm, `${BASE_URL}/one`))
    this.stateMachines.set(SPIKES_COUNT_ENUM.TWO, new State(fsm, `${BASE_URL}/two`))
  }

  run() {
    const value = this.fsm.getParams(PARAM_NAME_ENUM.SPIKES_CUR_COUNT)
    this.currentState = this.stateMachines.get(SPIKES_COUNT_NUMBER_ENUM[value as number])
  }
}
