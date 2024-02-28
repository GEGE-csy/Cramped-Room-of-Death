
import { _decorator, Component, director, Node } from 'cc';
import FadeManager from '../../Runtime/FadeManager';
import { SCENE_ENUM } from '../../Enums';
const { ccclass, property } = _decorator;
 
@ccclass('StartManager')
export class StartManager extends Component {
  onLoad() {
    director.preloadScene(SCENE_ENUM.Battle)
    FadeManager.Instance.fadeOut(1000)

    this.node.once(Node.EventType.TOUCH_START, this.handleStart, this)
  }
  async handleStart() {
    await FadeManager.Instance.fadeIn(300)
    director.loadScene(SCENE_ENUM.Battle)
  }
}
