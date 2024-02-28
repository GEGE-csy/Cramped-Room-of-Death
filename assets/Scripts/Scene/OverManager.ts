
import { _decorator, Component, director, Node } from 'cc';
import { EVENT_ENUM, SCENE_ENUM } from '../../Enums';
import EventManager from '../../Runtime/EventManager';
const { ccclass, property } = _decorator;
 
@ccclass('OverManager')
export class OverManager extends Component {
  onLoad() {
    director.preloadScene(SCENE_ENUM.GAME_OVER)
  }
  handleRestart() {
    director.loadScene(SCENE_ENUM.Battle)
    EventManager.Instance.emit(EVENT_ENUM.RESTART_LEVEL)
  }
  handleOut() {
    console.log(12)
    director.loadScene(SCENE_ENUM.Start)
    EventManager.Instance.emit(EVENT_ENUM.OUT_BATTLE)
  }
}
