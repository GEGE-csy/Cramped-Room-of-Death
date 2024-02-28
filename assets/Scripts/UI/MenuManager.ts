
import { _decorator, Component, Event } from 'cc';
import EventManager from '../../Runtime/EventManager';
import { EVENT_ENUM, CONTROLLER_ENUM } from '../../Enums';
const { ccclass, property } = _decorator;
 
@ccclass('MenuManager')
export class MenuManager extends Component {
  handleUndo() {
    console.log(111)
    EventManager.Instance.emit(EVENT_ENUM.REVOKE_STEP)
  }
  handleRestart() {
    console.log(111)
    EventManager.Instance.emit(EVENT_ENUM.RESTART_LEVEL)
  }
  handleOut() {
    console.log(111)
    EventManager.Instance.emit(EVENT_ENUM.OUT_BATTLE)
  }
}
