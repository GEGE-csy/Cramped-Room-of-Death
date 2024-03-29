
import State from './State';
import StateMachine from './StateMachine';

export default abstract class SubStateMachine {
  private _currentState: State = null
  // 状态机列表
  stateMachines: Map<string, State> = new Map()

  constructor(public fsm: StateMachine) {}

  get currentState() {
    return this._currentState
  }

  set currentState(newState) {
    this._currentState = newState
    // currentState被修改时应该要执行动画了
    this._currentState.run()
  }

  abstract run(): void
}
