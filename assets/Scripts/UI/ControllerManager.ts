
import { _decorator, Component, Event } from 'cc';
import EventManager from '../../Runtime/EventManager';
import { EVENT_ENUM, CONTROLLER_ENUM } from '../../Enums';
const { ccclass, property } = _decorator;
 
@ccclass('ControllerManager')
export class ControllerManager extends Component {
  handleCtrl(e: Event, type: CONTROLLER_ENUM) {
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_CONTROL, type)
  }
}
